import type { Metadata } from 'next'
import LandingClient from './LandingClient'

// Cette metadata ecrase celle de layout.tsx : elle portait encore
// "API B2B pour blogueurs, agences et CE" et "Widget integrable".
export const metadata: Metadata = {
  title: 'FlySmart — Sachez exactement quand acheter vos billets d\'avion',
  description:
    'FlySmart indique aux PME quand acheter leurs billets d\'avion professionnels : recommandation claire, fenêtre de timing lisible et partage pour validation manager.',
  openGraph: {
    title: 'FlySmart — Le bon prix au bon moment',
    description:
      'La recommandation d\'achat pour les PME qui gèrent leurs déplacements sans agence dédiée.',
    url: 'https://flysmart.app',
    siteName: 'FlySmart',
    type: 'website',
  },
}

export default function HomePage() {
  return <LandingClient />
}
