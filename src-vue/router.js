import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading des pages pour optimiser le bundle
// Seule la Landing Page est chargée immédiatement
import LandingPage from './pages/LandingPage.vue'
<<<<<<< HEAD:frontend/src/router.js
import CalculateurPage from './pages/CalculateurPage.vue'
import GoogleCalendarPage from './pages/GoogleCalendarPage.vue'
import FonctionnalitePage from './pages/FonctionnalitePage.vue'
import BlogPage from './pages/BlogPage.vue'
import BlogContentPage from './pages/BlogContentPage.vue'
import PolitiqueConfidentialitePage from './pages/PolitiqueConfidentialitePage.vue'
import Success from './pages/stripe/Success.vue'
import Cancel from './pages/stripe/Cancel.vue'
=======

// Les autres pages sont chargées uniquement quand l'utilisateur y accède
const CalculateurPage = () => import('./pages/CalculateurPage.vue')
const FonctionnalitePage = () => import('./pages/FonctionnalitePage.vue')
const BlogPage = () => import('./pages/BlogPage.vue')
const BlogContentPage = () => import('./pages/BlogContentPage.vue')
const PolitiqueConfidentialitePage = () => import('./pages/PolitiqueConfidentialitePage.vue')
const Success = () => import('./pages/stripe/Success.vue')
const Cancel = () => import('./pages/stripe/Cancel.vue')
>>>>>>> 7e49ca20bbdf1688b14c60191c0dc0c33f5d45f7:src/router.js

const routes = [
  {
    path: '/',
    component: LandingPage,
    meta: {
      title: 'FlySmart | Meilleur moment pour acheter votre billet',
      description: 'Découvrez le meilleur moment pour acheter votre billet d\'avion et économisez sur vos voyages.'
    }
  },
  {
    path: '/calculateur',
    component: CalculateurPage,
    meta: {
      title: 'FlySmart | Analysez les prix',
      description: 'Analysez les prix des vols et trouvez la fenêtre d\'achat optimale pour votre voyage.'
    }
  },
  {
    path: '/calculateur-google',
    component: GoogleCalendarPage,
    meta: {
      title: 'FlySmart | Calendrier Google Flights',
      description: 'Consultez le calendrier de prix aller-retour fourni par l\'API Google Flights via RapidAPI.'
    }
  },
    { path: '/fonctionnalites', component: FonctionnalitePage,
    meta: {
      title: 'FlySmart | Fonctionnalités',
      description: 'Découvrez les fonctionnalités de FlySmart : calcul et analyse des prix des billets d\'avion en fonction de votre destination et de votre point de départ.'
    }
   },
   { path: '/blog', component: BlogPage,
    meta: {
      title: 'FlySmart | Blog',
      description: 'Conseils et articles autour du moment pour acheter votre billet d\'avion et économisez sur vos voyages, et d\'autres astuces voyages.'
    }
   },
   { path: '/blog/:slug', name: 'BlogContent', component: BlogContentPage,
    meta: {
      title: 'FlySmart | Article',
      description: 'Lecture d’un article du blog FlySmart : informations et conseils en tout genre.'
    }
   },
   { path: '/politique-de-confidentialite', component: PolitiqueConfidentialitePage,
    meta: {
      title: 'FlySmart | Politique de confidentialité',
      description: 'En savoir plus sur la collecte, l’utilisation et la protection de vos données sur FlySmart.'
    }
   },
   { path: '/success', component: Success,
    meta: {
      title: 'FlySmart | Paiement réussi',
      description: 'Merci pour votre soutien ! Votre paiement a été confirmé et votre accès est activé.'
    }
   },
   { path: '/cancel', component: Cancel,
    meta: {
      title: 'FlySmart | Paiement annulé',
      description: 'Le paiement a été annulé. Vous pouvez réessayer à tout moment depuis la page de souscription.'
    }
   },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
