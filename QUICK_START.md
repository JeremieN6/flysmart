# FlySmart - Quick Start

## Developpement

### Windows
Double-cliquez `start-dev.bat`

### PowerShell / Linux / macOS
```bash
npm install
npm run dev
```

Ouvrir: `http://localhost:3000`

## Production locale

### Windows
Double-cliquez `start-production.bat`

### PowerShell / Linux / macOS
```bash
npm install
npm run build
npm start
```

## Verifications rapides

```bash
curl http://localhost:3000/api/airports/search?query=paris
curl "http://localhost:3000/api/flights/prices?from=CDG&to=JFK&startDate=2026-08-01&endDate=2026-08-15&currency=EUR"
```

## Source des donnees

Pour distinguer donnees reelles et fallback:

- Header `X-FlySmart-Data-Source`
- Header `X-FlySmart-Fallback`
- Champ JSON `meta`
