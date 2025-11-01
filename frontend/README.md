# Flight Timing Advisor - Frontend

Application Vue 3 pour analyser les prix des vols et trouver le meilleur moment d'achat.

## Stack

- Vue 3 (Composition API)
- Vite 6
- Tailwind CSS v4
- Flowbite Vue 0.2.2
- ApexCharts (vue3-apexcharts)
- Vue Router
- Axios

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Build

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## Preview

```bash
npm run preview
```

## Structure

```
src/
├── components/
│   ├── Landing/          # Composants de la landing page
│   │   ├── LP_Header.vue
│   │   ├── LP_Hero.vue
│   │   ├── LP_Testimonials.vue
│   │   ├── LP_FAQ.vue
│   │   ├── Newsletter.vue
│   │   └── LP_Footer.vue
│   └── Calculateur/      # Composants du calculateur
│       ├── SearchForm.vue
│       ├── PriceChart.vue
│       └── AdviceMessage.vue
├── pages/
│   ├── LandingPage.vue
│   └── CalculateurPage.vue
├── composables/
│   └── usePricingAnalysis.js
├── router.js
├── main.js
└── style.css
```

## Configuration

Le proxy Vite redirige automatiquement `/api` vers `http://localhost:5000` (backend).

## Flowbite Vue

Les composants Flowbite Vue sont importés de manière nominative :

```js
import { FwbButton, FwbInput, FwbCard } from 'flowbite-vue'
```

Pas de plugin global nécessaire.

## Tailwind CSS v4

Tailwind v4 utilise le plugin Vite `@tailwindcss/vite` et l'import CSS :

```css
@import "tailwindcss";
```

## ApexCharts

Les graphiques utilisent `vue3-apexcharts` enregistré globalement :

```js
import VueApexCharts from 'vue3-apexcharts'
app.use(VueApexCharts)
```

Usage dans les composants :

```vue
<apexchart
  type="line"
  :options="chartOptions"
  :series="chartSeries">
</apexchart>
```
