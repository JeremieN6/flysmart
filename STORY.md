# STORY.md -- Memoire Narrative Business

> Ce fichier raconte le POURQUOI du projet : objectif, pivots, decisions
> business et ce que le terrain a appris. Il sert de matiere premiere aux
> articles de blog sassif.fr. Il ne contient pas de detail d'implementation
> -- ca, c'est le role de CLAUDE.md.
>
> A mettre a jour apres toute session impliquant une decision business, un
> pivot, un changement de statut ou un apprentissage terrain significatif.

---

## Objectif produit

FlySmart aide les PME francaises sans agence de voyage dediee a savoir
QUAND acheter leurs billets d'avion professionnels, plutot que de les
aider a trouver OU les acheter. La cible n'est pas un voyageur ni un
service achats structure : c'est l'office manager ou le coordinateur
logistique d'une PME de 50 a 400 salaries, qui gere les deplacements a
la main, en plus du reste de son travail, sans expertise voyage.

La promesse tient en une phrase : savoir si c'est le bon moment
d'acheter, sans etre expert du voyage.

---

## Statut actuel

La landing page a ete entierement retravaillee (structure, contenu,
honnetete des chiffres affiches) et presente desormais le produit dans
un ordre qui montre la valeur avant le prix. Le vrai moteur de donnees,
lui, en est a son tout premier jour de collecte reelle (12/08/2026) :
FlySmart promet une recommandation basee sur l'historique des prix, mais
cet historique n'existe pas encore -- aucune API du marche ne le fournit,
il doit etre construit jour apres jour. Les demonstrations produit sur
la landing sont donc, pour l'instant, assumees comme des maquettes
("valeurs d'illustration"), en attendant que la collecte produise assez
de profondeur pour les remplacer par des chiffres reels.

Premier jalon concret attendu : le 18/08/2026, quand les premiers
departs suivis passeront de J+15 a J+7, donnant la toute premiere mesure
d'un meme vol observe a deux moments d'achat differents.

---

## Historique des pivots

### 2026-08-11 -- Du widget B2B au SaaS direct PME
**Contexte** : le positionnement d'origine visait les agences de voyage,
comites d'entreprise et blogueurs voyage, via un widget integrable
remunere a la commission ("+1% commission"). Ce positionnement vivait
encore dans les metadonnees du site (title, description, keywords) et
dans plusieurs textes de la landing (mention de script a integrer, de
personnalisation aux couleurs du client, de compatibilite CMS).
**Decision** : abandon complet de ce positionnement au profit d'un SaaS
vendu directement aux PME qui gerent leurs propres deplacements.
**Resultat** : toute trace du widget/agences/CE/blogueurs retiree du
layout, de la page d'accueil, de la navigation, du footer et des textes
de demonstration. Le produit se presente maintenant comme un outil de
decision pour l'equipe qui reserve, pas comme une brique a integrer sur
le site d'un tiers.

### 2026-08-11 -- Du court-courrier au long-courrier
**Contexte** : la premiere liste de routes suivies couvrait dix
destinations, principalement du court et moyen-courrier au depart de
Paris (Marseille, Nice, Toulouse, Bordeaux, Barcelone, Milan, Amsterdam,
Londres, Francfort, New York). Une premiere mesure reelle a montre des
ecarts de prix impressionnants en pourcentage (+40 a +47%) mais
derisoires en valeur absolue : 17 a 27 euros d'ecart.
**Decision** : concentrer les trois routes actives (contrainte par le
quota de l'API de prix, voir plus bas) sur du long-courrier
(Paris-New York, Paris-Dubai, Paris-Montreal), sur l'hypothese que
l'ecart en euros y est bien plus significatif.
**Resultat** : premiere mesure long-courrier confirmant l'hypothese --
jusqu'a 289 euros d'ecart sur New York contre 46 euros sur Dubai (route
la plus plate mesuree). C'est l'euro economise qui justifie un
abonnement, pas le pourcentage affiche.

### 2026-08-11 -- Construire l'historique plutot que le supposer
**Contexte** : le produit promettait une "fourchette historique" et un
volume de "tarifs observes" -- des donnees qui n'ont jamais existe,
puisqu'aucune API de vol testee (Amadeus, FlightSky) n'expose
d'historique de prix reel.
**Decision** : mettre en place une collecte quotidienne automatisee
(un releve par route et par horizon d'achat, chaque jour) plutot que de
chercher une source externe qui n'existe pas.
**Resultat** : pipeline de collecte en production depuis le 12/08/2026.
L'historique du produit est desormais un actif construit en interne, pas
achete. Consequence directe : toute donnee affichee sur la landing qui
n'est pas encore mesuree a du etre retiree ou explicitement marquee
comme illustration, plutot qu'estimee.

---

## Ce que la cible attend / a appris

- **L'euro compte plus que le pourcentage.** Un "+47%" sur un aller-retour
  a 40 euros ne convainc personne de payer un abonnement ; un ecart de
  200 a 300 euros sur un vol long-courrier, si.
- **La cible n'a pas de solution aujourd'hui, elle a une habitude.**
  Les personnes interrogees ne comparent pas mal : elles n'ont simplement
  pas le temps de bien comparer, et ne savent pas si le prix va encore
  bouger. Le probleme n'est pas l'acces a l'information, c'est le
  jugement sur le bon moment.
- **La validation interne est un point de friction reel**, pas un detail
  de process : "le temps que tout le monde valide, le prix a deja
  change" revient comme une plainte recurrente, independamment de la
  taille de la PME.
- **Un chiffre affiche sans source ne convainc pas, il expose.** Les
  premieres versions de la landing affichaient des statistiques
  generiques (economies moyennes, nombre de routes couvertes, note de
  satisfaction) sans origine verifiable. Elles ont ete retirees plutot
  que remplacees par une autre estimation.

---

## Garde-fous de contenu

Ce fichier peut etre lu par n'importe quel agent ou session future, pas
seulement celle qui redige un article de blog. Il ne doit jamais
contenir :
- de detail exploitable d'un incident de securite (cle exposee,
  vulnerabilite, faille de permission) ;
- de mecanique interne precise donnant une feuille de route a un
  concurrent (algorithme de scoring, seuils de decision exacts) ;
- de chiffre financier precis non explicitement source ailleurs dans le
  projet (revenu, marge, cout d'acquisition) ;
- de ton condescendant envers la cible client.

---

## Dernière mise à jour

2026-08-27 -- Ajout de la section "Garde-fous de contenu" (defense en
profondeur : ces regles existaient deja au niveau du prompt de
generation d'article, elles sont desormais aussi portees par le fichier
source lui-meme). Contenu narratif inchange depuis le 2026-08-12.
