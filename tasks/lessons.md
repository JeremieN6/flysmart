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

### 2026-08-11 Quota API FlightSky decouvert apres coup
**Probleme** : 10 routes configurees en collecte quotidienne, sans avoir verifie le volume d'appels autorise par le plan RapidAPI.
**Cause racine** : Les en-tetes de reponse (`x-ratelimit-requests-limit` / `remaining`) donnent le quota reel, mais rien ne les lisait avant d'activer les routes ; le plan s'est revele limite a 100 requetes/mois, alors que 10 routes x 1 appel/jour en consomment 300.
**Solution** : Reduction a 3 routes actives (10 x 30 = 300 > 100 ; 3 x 30 = 90 <= 100). Le collecteur logue desormais le quota restant et alerte quand il reste moins de 3 jours de marge.
**Regle** : Avant d'activer ou d'etendre une source API a quota, lire ses en-tetes de rate-limit sur un appel reel et calculer le budget mensuel AVANT de configurer les routes/frequences, jamais apres.

### 2026-08-11 Cle Redis Upstash en lecture seule (`default_ro`)
**Probleme** : BullMQ echouait avec `NOPERM ... 'info'` puis `NOPERM ... 'eval'` en tentant de se connecter a Redis.
**Cause racine** : La cle `REDIS_URL` fournie pointait sur l'utilisateur Upstash `default_ro` (lecture seule). BullMQ repose entierement sur des scripts Lua (`EVAL`) pour son fonctionnement ; sans droit d'ecriture/scripting, aucune option de configuration ne peut contourner ca.
**Solution** : Remplacer la cle par celle de l'utilisateur `default` (lecture-ecriture) dans Upstash.
**Regle** : Sur un echec `NOPERM` avec Redis manage (Upstash ou equivalent), verifier en priorite le username dans l'URL de connexion (`new URL(REDIS_URL).username`) avant de chercher une option cote client.

### 2026-08-11 Upstash exige TLS explicite (`rediss://`)
**Probleme** : Une `REDIS_URL` en `redis://` (sans TLS) ouvrait bien un socket vers Upstash, puis la connexion se fermait immediatement avec un message generique `Connection is closed`, sans indication de la cause.
**Cause racine** : Upstash n'accepte que TLS ; le schema `redis://` (port 6379 en clair) est silencieusement rejete apres l'ouverture du socket.
**Solution** : Utiliser `rediss://` dans `.env.local`. Ajoute en filet de securite : `lib/queue.ts` detecte un hote `*.upstash.io` en `redis://` et corrige automatiquement le schema en loggant un avertissement.
**Regle** : Pour tout host Upstash, verifier le schema `rediss://` en priorite avant tout autre diagnostic si une connexion Redis s'ouvre puis se ferme sans erreur explicite.

### 2026-08-12 Node `--env-file` plante si le fichier est absent
**Probleme** : Le worker BullMQ crashait en boucle sur le VPS (15 redemarrages pm2 quasi instantanes), sans lien avec la version de Node (deja en 22.22, largement suffisante).
**Cause racine** : Le script utilisait `node --env-file=.env.local ...`. Ce flag echoue en dur (`ENOENT`) si le fichier cible n'existe pas au moment du lancement, au lieu de continuer sans lui.
**Solution** : Remplacer par `--env-file-if-exists=.env --env-file-if-exists=.env.local` dans tous les scripts d'exploitation.
**Regle** : Ne jamais utiliser `--env-file` (strict) pour un script destine a tourner sur plusieurs environnements ; toujours `--env-file-if-exists`, meme quand le fichier est cense etre present partout.

### 2026-08-12 Transaction Prisma incompatible avec le cold start Neon
**Probleme** : Le premier releve quotidien de prix echouait systematiquement sur les trois routes avec `Transaction API error: Unable to start a transaction in the given time`, puis reussissait au retry automatique 60s plus tard.
**Cause racine** : Les six ecritures par route etaient groupees dans un `prisma.$transaction(...)`. Le compute Neon serverless se met en veille apres inactivite (la nuit) ; son reveil depasse le `maxWait` de 2s que Prisma applique a l'OUVERTURE d'une transaction (une requete simple n'a pas cette contrainte).
**Solution** : Retirer le `$transaction` et executer les upserts en boucle sequentielle, avec gestion d'erreur individuelle par ligne.
**Regle** : Sur Neon serverless (ou toute base a cold start), ne jamais grouper des ecritures independantes et idempotentes (upsert) dans une transaction Prisma si le premier appel du jour peut tomber sur une base endormie. Reserver `$transaction` aux ecritures qui exigent reellement l'atomicite.
