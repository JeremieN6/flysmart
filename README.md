# FlySmart - Flight Timing Advisor

Application full-stack pour analyser les prix des vols et trouver le meilleur moment pour réserver.

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Créez un fichier `.env.local` à partir de `.env.example` :

```bash
cp .env.example .env.local
```

Configurez vos clés API dans `.env.local` :

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:5173

# API Keys
FLIGHTSKY_API_KEY=your_flightsky_rapidapi_key
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
FLIGHT_API_KEY=your_flight_api_key
```

### 3. Développement

**Lancer frontend et backend ensemble** :
```bash
npm run dev
```

**Ou séparément** :
```bash
# Terminal 1 - Backend (port 5000)
npm run server:dev

# Terminal 2 - Frontend (port 5173)
npm run client:dev
```

### 4. Production

**Build** :
```bash
npm run build
```

**Démarrer en production** :
```bash
NODE_ENV=production npm start
```

Le serveur servira automatiquement les fichiers statiques du dossier `dist/`.

## 📁 Structure du projet

```
flysmart/
├── package.json              # Dépendances unifiées
├── server.js                 # Serveur Express
├── vite.config.js           # Configuration Vite
├── tailwind.config.js       # Configuration Tailwind
├── index.html               # Point d'entrée HTML
├── src/                     # Code source Vue.js
│   ├── App.vue
│   ├── main.js
│   ├── router.js
│   ├── components/
│   ├── pages/
│   └── services/
├── controllers/             # Controllers API
├── routes/                  # Routes Express
├── services-backend/        # Services backend
├── scripts/                 # Scripts utilitaires
└── dist/                    # Build production (généré)
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### Recherche de prix
```
GET /api/flights/prices?from=CDG&to=JFK&startDate=2025-12-01&endDate=2025-12-15&currency=EUR

Paramètres :
- from (required): Code IATA aéroport de départ (3 lettres)
- to (required): Code IATA aéroport d'arrivée (3 lettres)
- startDate (required): Date de début (YYYY-MM-DD)
- endDate (required): Date de fin (YYYY-MM-DD)
- currency (optional): Devise (EUR, USD, etc.)
- cabin (optional): Classe (Economy, Business, First)
```

### Recherche d'aéroports
```
GET /api/airports/search?query=paris

Paramètres :
- query (required): Nom de ville, aéroport ou code IATA
```

## 📦 Scripts disponibles

- `npm run dev` - Lance frontend + backend ensemble
- `npm run server:dev` - Backend seul avec nodemon
- `npm run server` - Backend en production
- `npm run client:dev` - Frontend seul avec Vite
- `npm run client:build` - Build du frontend
- `npm run build` - Alias pour build
- `npm start` - Démarrage production

## 🌐 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées de déploiement sur Hostinger ou autres hébergeurs.

## 🔒 Sécurité

- Les clés API sont stockées côté serveur uniquement
- CORS configuré avec origines spécifiques
- Validation des entrées sur tous les paramètres
- Pas de données sensibles dans le dépôt

## 📝 Fonctionnalités

- **Intégration FlightSky** : Données de prix en temps réel
- **Fallback intelligent** : Génération de données de secours
- **Cache** : Cache de 30 minutes pour optimiser les performances
- **Gestion d'erreurs** : Dégradation gracieuse avec messages explicites
- **Vue.js 3** : Interface moderne et réactive
- **Tailwind CSS** : Design responsive
