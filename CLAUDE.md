# CLAUDE.md -- Memoire Projet

> Ce fichier est lu automatiquement par l'IA au debut de chaque conversation.
> Mets-le a jour a la fin de chaque session de travail.

---

## Objectif Final
<!-- A completer -->

---

## Stack Technique
<!-- A completer -->

---

## Etat Actuel du Projet
**Phase** : Landing + flux demo admin
**Derniere session** : 2026-07-14
**Progression globale** : 15%

### Ce qui est fait :
- [x] Configuration MCP memoire
- [x] Formulaire demo connecte a une route API reelle
- [x] Stockage Neon/Postgres des demandes demo
- [x] Page admin protegee pour consulter les demandes
- [x] Connexion admin applicative avec cookie de session

### Prochaines etapes :
- [ ] Ajouter des migrations SQL explicites si le schema admin doit evoluer
- [ ] Ajouter gestion de roles / recuperation de mot de passe si necessaire

---

## Blocages et Points d Attention
- Le stockage des demandes demo repose maintenant sur `DATABASE_URL` et cree la table `demo_requests` a la premiere utilisation si elle n'existe pas.
- La protection admin ne passe plus par le middleware Next, mais par un layout serveur sur la route admin protegee, ce qui evite les problemes d'environnement observes dans le runtime middleware.

---

## Decisions Prises
| Date | Decision | Raison |
|------|----------|--------|
| 2026-07-14 | Utiliser Neon/Postgres via `DATABASE_URL` pour les demandes demo | Compatible serverless et deja disponible dans l'environnement |
| 2026-07-14 | Utiliser une session admin par cookie signe pour `/admin` | Eviter Basic Auth navigateur et fournir une vraie page de connexion |

---

## Notes de Session
> Ajouter ici un resume a la fin de chaque session de travail.

- 2026-07-14 : remplacement du message de succes du formulaire demo par un toast, ajout de la route `POST /api/demo-requests`, persistance Neon/Postgres, page admin `/admin/demo-requests`, remplacement du Basic Auth par une page `/admin/login` avec cookie de session signe, puis deplacement du controle d'acces hors middleware vers la route serveur admin, validations `npx tsc --noEmit`, `npm run build` et POST runtime 200 sur `/api/demo-requests`.

---

## Lecons Apprises
> Voir tasks/lessons.md pour le detail des corrections et patterns a eviter.
