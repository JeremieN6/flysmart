# 🚀 FlySmart - Démarrage Ultra-Rapide

## ⚡ Pour développer localement

### Windows
Double-cliquez sur : `start-dev.bat`

### Mac/Linux ou PowerShell
```bash
npm install
npm run dev
```

Ouvrez : http://localhost:5173

---

## 📦 Pour tester en production locale

### Windows
Double-cliquez sur : `start-production.bat`

### Mac/Linux ou PowerShell
```bash
npm install
npm run build
npm start
```

Ouvrez : http://localhost:5000

---

## 🌐 Pour déployer sur Hostinger

### Méthode simple (3 commandes)
```bash
npm install --production
npm run build
npm start
```

### Avec variables d'environnement
```bash
NODE_ENV=production npm start
```

Voir [HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md) pour le guide complet.

---

## 🔑 Configuration requise

1. Créez un fichier `.env.local` :
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:5173

FLIGHTSKY_API_KEY=votre_cle_ici
AMADEUS_API_KEY=votre_cle_ici
AMADEUS_API_SECRET=votre_secret_ici
```

2. Obtenez vos clés API :
   - FlightSky : https://rapidapi.com/flightlabs/api/flights-sky
   - Amadeus : https://developers.amadeus.com/

---

## 📂 Structure simplifiée

```
flysmart/
├── src/              → Code Vue.js (frontend)
├── server.js         → Serveur Express (backend)
├── controllers/      → Logique API
├── routes/           → Routes API
└── dist/             → Build production (après npm run build)
```

---

## 🆘 Besoin d'aide ?

- 📖 [README.md](./README.md) - Documentation complète
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement
- 🏢 [HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md) - Spécifique Hostinger

---

## ✅ Vérification rapide

Testez que tout fonctionne :

1. **Health check** : http://localhost:5000/health
2. **Frontend** : http://localhost:5173 (dev) ou http://localhost:5000 (prod)
3. **API** : http://localhost:5000/api/airports/search?query=paris

Si ça marche → vous êtes prêt ! 🎉
