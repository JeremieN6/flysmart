# CLAUDE.md -- Memoire Projet

> Ce fichier est lu automatiquement par l'IA au debut de chaque conversation.
> Mets-le a jour a la fin de chaque session de travail.

---

## Objectif Final
FlySmart indique aux PME sans agence de voyage dediee le meilleur moment
pour acheter un billet d'avion professionnel : recommandation d'achat
claire (acheter maintenant / attendre), fenetre de timing lisible, partage
en un clic pour validation manager, alerte sur budget cible.

Cible (ICP) : office manager ou coordinateur logistique dans une PME de
50 a 400 salaries en France, qui reserve les deplacements a la main entre
comparateurs, sans expertise voyage.

Ancien positionnement abandonne (a ne pas reintroduire) : widget
integrable pour agences de voyage / comites d'entreprise / blogueurs
voyage, avec commission. Retire de la landing, du layout et des metas
le 2026-08-12.

---

## Stack Technique
- Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS 4
- Base de donnees : Neon/Postgres. Acces via Prisma 7.9.1 +
  `@prisma/adapter-neon` (migre depuis SQL brut le 2026-08-12, sans
  perte de donnees, via introspection `prisma db pull`)
- Prisma 7 : `url` n'est plus accepte dans `schema.prisma`, la connexion
  vit dans `prisma.config.ts`. Un driver adapter est obligatoire.
- File d'attente : BullMQ 6 + ioredis, sur Redis Upstash. Upstash exige
  `rediss://` (TLS) et restreint les commandes `INFO`/certaines ACL selon
  la cle utilisee -- voir Lecons Apprises.
- Source de prix : FlightSky (RapidAPI), endpoint `price-calendar`.
  Aucun historique disponible (rejette les dates passees). Quota strict
  du plan actuel : 100 requetes/mois.
- Amadeus integre dans le code (`lib/amadeus.ts`) mais injoignable depuis
  l'environnement de dev (DNS bloque) -- non utilise en pratique.
- Deploiement : VPS + PM2. Deux process distincts : `flysmart` (app Next)
  et `flysmart-worker` (worker BullMQ, execute la collecte quotidienne de
  prix). Deploiement via `.github/workflows/deploy-next.yml`
  (`git reset --hard`, `npm install`, `npm run build`, reload pm2 des
  deux process).
- Scripts d'exploitation (`scripts/*.ts`) executes directement en
  `--experimental-strip-types` (exige Node >= 22.6), sans etape de build.

---

## Etat Actuel du Projet
**Phase** : Landing retravaillee + pipeline de collecte de prix demarre
**Derniere session** : 2026-08-12
**Progression globale** : 40%

### Ce qui est fait :
- [x] Formulaire de demo -> route API -> stockage Neon, admin protege
- [x] Landing decoupee en composants unitaires (`app/components/landing/`)
- [x] Page `/tarifs` alignee sur la landing (grille tarifaire partagee
      via `PricingPlans.tsx`)
- [x] Reorganisation complete de l'ordre des sections de la landing
      (hero -> demo graphe de prix -> ICP -> douleurs -> demo flux de
      validation -> verbatims -> tarifs -> FAQ -> CTA final -> formulaire
      demo -> stats -> footer), ajout du CTA final qui manquait
- [x] Nettoyage des restes de l'ancien positionnement (widget, agences,
      CE, blogueurs) dans meta, nav, footer, textes de la landing
- [x] Migration de l'acces DB SQL brut -> Prisma 7 + adapter Neon
- [x] Table `price_snapshots` (Prisma) : historique longitudinal des prix
- [x] Pipeline de collecte quotidienne : BullMQ + Upstash Redis + worker
      PM2 dedie, planifie a 06:00 Europe/Paris
- [x] Script `validate-price-delta.ts` : mesure de l'ecart de prix reel
      entre un achat a J-60 et J-15 (methode transversale, pas encore
      longitudinale)

### Prochaines etapes :
- [ ] Premiere mesure longitudinale reelle attendue vers le 2026-08-18
      (les departs releves le 11/08 a J+15 seront alors a J+7)
- [ ] Decider d'un plan API FlightSky payant ou non (quota actuel :
      100 requetes/mois, epuise en ~9 jours a 3 routes/jour)
- [ ] Si le plan est releve : elargir la liste de routes suivies
      (`config/tracked-routes.ts`), selection par amplitude de prix
      mesuree plutot qu'au hasard
- [ ] Arbitrer le recoupement entre la section "douleurs" et les
      verbatims (signale en fin de refonte landing, non tranche)
- [ ] Remplacer le "+17,5% transversal" du bandeau de stats par le
      chiffre longitudinal des que disponible

### Ecarte pour l instant :
- Amadeus comme source de prix : credentials configures mais API
  injoignable depuis l'environnement de dev. Ne pas re-basculer dessus
  sans revalider la connectivite en production.
- Elargissement automatique des routes suivies : n'a de sens qu'a partir
  d'une trentaine de routes actives, donc seulement si le plan API est
  releve. Pas construit tant que la liste tient sur 3 routes manuelles.

---

## Blocages et Points d Attention
- Quota FlightSky tres serre (100 requetes/mois). Toute route active
  consomme ~30 appels/mois. Le budget mensuel tient dans
  `config/tracked-routes.ts` (`monthlyCallBudget()`) -- verifier avant
  d'activer une route de plus.
- Aucune API de vol commerciale n'expose d'historique de prix profond :
  c'est un actif que FlySmart doit construire lui-meme via la collecte
  quotidienne, pas quelque chose qu'on peut acheter a une source externe.
- Ne jamais grouper des ecritures Prisma dans une `$transaction` sur
  Neon serverless si la base peut etre en cold start : le `maxWait` de
  2s de Prisma est trop court pour le reveil du compute. Voir Lecons
  Apprises.
- Upstash exige `rediss://` et restreint `INFO`/`EVAL` selon les droits
  de la cle API utilisee. Toujours verifier que la cle est en
  lecture-ecriture (`default`, pas `default_ro`) avant de diagnostiquer
  un bug BullMQ.
- Les scripts `--env-file=.env.local` plantent en dur si le fichier est
  absent sur l'environnement cible (VPS). Utiliser
  `--env-file-if-exists` pour tout nouveau script d'exploitation.

---

## Decisions Prises
| Date | Decision | Raison |
|------|----------|--------|
| 2026-07-14 | Neon/Postgres via `DATABASE_URL` pour les demandes demo | Compatible serverless et deja disponible dans l'environnement |
| 2026-07-14 | Session admin par cookie signe pour `/admin` | Eviter Basic Auth navigateur et fournir une vraie page de connexion |
| 2026-08-11 | Decouper la landing en un composant par section (`app/components/landing/`) | Le fichier monolithique rendait toute retouche risquee et rendait impossible le partage de contenu (grille tarifaire) avec `/tarifs` |
| 2026-08-11 | Passer de l'acces SQL brut a Prisma 7 + `@prisma/adapter-neon` | BullMQ et le pipeline de collecte demandaient une couche d'acces plus structuree ; migration par introspection pour ne rien perdre |
| 2026-08-11 | Passer de 10 routes court/moyen-courrier a 3 routes long-courrier | Le quota FlightSky (100/mois) ne permet que 3 routes quotidiennes ; l'ecart de prix mesure sur le court-courrier est fort en % mais derisoire en euros (17-27 EUR), donc peu vendeur |
| 2026-08-12 | Retirer la transaction Prisma qui groupait les ecritures de `price_snapshots` | `Unable to start a transaction in the given time` au premier reveil quotidien de la base ; chaque snapshot est un fait independant, l'atomicite n'apportait rien |
| 2026-08-12 | Worker BullMQ en process PM2 distinct de l'app Next (`flysmart-worker`) plutot que demarre dans le serveur Next | Un reload du site ne doit pas interrompre une collecte en cours, et les logs des deux doivent rester separables |

---

## Notes de Session
> Ajouter ici un resume a la fin de chaque session de travail.

- 2026-07-14 : formulaire demo -> toast, route `POST /api/demo-requests`,
  persistance Neon/Postgres, page admin `/admin/demo-requests`, Basic
  Auth remplace par `/admin/login` + cookie de session signe.
- 2026-08-01 : ajout des composants de landing (problemes, stats,
  stepper, temoignages, apercu widget, grille tarifaire).
- 2026-08-11 : decoupage complet de la landing en composants unitaires ;
  fix de `/tarifs` (contenu identique a la landing, footer ajoute, coquille
  corrigee, CTA "Parler a l'equipe" -> section demo) ; script
  `validate-price-delta.ts` (mesure reelle : Amadeus injoignable,
  FlightSky sans historique, delta +17,5% hors vacances sur n=8 tres
  disperse) ; nettoyage des chiffres non sources sur la landing
  (bandeau de stats, routes populaires, mentions d'illustration
  harmonisees) ; refonte de la section temoignages (verbatims anonymes
  a la place des faux temoignages) ; mise en place du pipeline de
  collecte quotidienne (table `price_snapshots`, script de collecte,
  export CSV) ; migration vers Prisma 7 + BullMQ + Redis Upstash suite a
  la decision explicite de l'utilisateur (Prisma+BullMQ demandes malgre
  l'absence initiale de Redis) ; decouverte du quota FlightSky de
  100 requetes/mois, reduction a 3 routes long-courrier.
- 2026-08-12 : mise en production de la collecte automatique (worker PM2
  + planification BullMQ), debug du crash du worker sur le VPS
  (`--env-file` plantait sur fichier absent, corrige en
  `--env-file-if-exists`), debug de la connexion Redis Upstash
  (`redis://` -> `rediss://` obligatoire, cle `default_ro` en lecture
  seule remplacee), fix de la transaction Prisma incompatible avec le
  cold start Neon ; reorganisation complete de l'ordre des sections de
  la landing (demo du graphe de prix remontee juste apres le hero,
  pricing descendu apres les demonstrations produit, ajout d'un CTA
  final) et nettoyage de coherence (mentions d'illustration harmonisees
  via `IllustrationNote.tsx`, ancres de nav/footer alignees sur le
  nouvel ordre, derniers restes de l'ancien positionnement widget
  retires du layout et de la page d'accueil).

---

## Lecons Apprises
> Voir tasks/lessons.md pour le detail des corrections et patterns a eviter.

## Regle de memoire narrative
Apres toute session impliquant une decision business, un pivot, un
changement de statut, ou un apprentissage terrain significatif (pas les
changements purement techniques), mettre a jour /STORY.md en
consequence, en plus des notes de session habituelles.

**Limite connue** : le hook Stop qui rappelle de mettre a jour la
memoire projet ne detecte que les commits de CODE. Une session purement
business (decision, retour terrain, pivot discute sans toucher au code)
ne declenche aucun rappel automatique. Reflexe a garder : en fin de
toute conversation business sans changement de code, demander
explicitement la mise a jour de STORY.md.
