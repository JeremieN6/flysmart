# FlySmart - Next.js Flight Timing Advisor

Application Next.js (App Router) pour analyser le meilleur moment d'achat de vols.

## Architecture

Le projet est maintenant **homogene en Next.js**:

- Frontend: pages `app/`
- API serveur: routes `app/api/*`
- Services metier/API externes: `services-backend/` et `lib/`

Le code Express legacy a ete retire.

## Demarrage

### Developpement

```bash
npm install
npm run dev
```

Application: `http://localhost:3000`

### Production locale

```bash
npm install
npm run build
npm start
```

## Variables d'environnement

Configurer `.env.local` (exemple minimal):

```env
NODE_ENV=development
PORT=3000

AMADEUS_API_KEY=...
AMADEUS_API_SECRET_KEY=...
FLIGHTSKY_API_KEY=...
FLIGHTSKY_API_HOST=flights-sky.p.rapidapi.com
GOOGLE_FLIGHTS_API_KEY=...
GOOGLE_FLIGHTS_API_HOST=flights-sky.p.rapidapi.com
```

## Endpoints principaux

- `GET /api/price-trends`
- `GET /api/flight-prices`
- `POST /api/analyze`
- `GET /api/flights/prices`
- `GET /api/airports/search`
- `GET /api/google/price-calendar`

## Transparence des donnees (reel vs fallback)

Les endpoints d'analyse exposent un signal discret:

- Header `X-FlySmart-Data-Source`: source utilisee (`amadeus`, `model`, `flightsky`, `fallback`)
- Header `X-FlySmart-Fallback`: `true` ou `false`
- Champ JSON `meta`:

```json
{
  "meta": {
    "dataSource": "flightsky",
    "isFallback": false
  }
}
```

Cela permet d'afficher un indicateur discret cote UI sans perturber le parcours.

## Etat du projet

- Architecture active: Next.js only
- Dossier `backend/`: conserve tel quel (pas utilise par le runtime actuel)
- Dossier `src-vue/`: legacy, non utilise par le runtime Next.js
