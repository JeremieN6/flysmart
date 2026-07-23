# Lessons Learned

> Ce fichier est mis a jour apres CHAQUE correction faite par l utilisateur.
> But : ne plus refaire les memes erreurs. Relu au debut de chaque session.

---

## Format

### [DATE] Titre du probleme
**Probleme** : Description de ce qui a mal tourne.
**Cause racine** : Pourquoi c est arrive.
**Solution** : Ce qui a ete fait pour corriger.
**Regle** : La regle a suivre desormais pour eviter ce cas.

---

## Lecons

<!-- Les entrees seront ajoutees ici au fil du temps -->

### 2026-07-23 Deploy npm ci et lockfile
**Probleme** : Le workflow de deploiement Next cassait pendant l'installation des dependances.
**Cause racine** : `npm ci` exige un `package-lock.json` committé et synchronise; ici le repo de deploy ne fournissait pas un lockfile stable dans `HEAD`.
**Solution** : Remplacer `npm ci` par `npm install` dans le workflow de deploiement.
**Regle** : Si le lockfile n'est pas versionne de facon fiable, ne pas utiliser `npm ci` en deploiement; sinon committer le lockfile et garder `npm ci`.
