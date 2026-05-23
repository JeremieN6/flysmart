import type { Metadata } from 'next'
import LandingClient from './LandingClient'

export const metadata: Metadata = {
  title: 'FlySmart — Sachez exactement quand acheter vos billets d\'avion',
  description: 'FlySmart analyse les courbes de prix de 12 semaines pour vous dire le meilleur moment d\'acheter. API B2B pour blogueurs, agences et CE.',
  openGraph: {
    title: 'FlySmart — Le bon prix au bon moment',
    description: 'Analysez le timing optimal d\'achat de vos vols. Widget intégrable + API B2B.',
    url: 'https://flysmart.app',
    siteName: 'FlySmart',
    type: 'website',
  },
}

export default function HomePage() {
  return <LandingClient />
}
