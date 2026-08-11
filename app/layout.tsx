import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  // Ancien positionnement (agences, CE, blogueurs, widget integrable,
  // "+1% commission") entierement retire : il ne correspondait plus ni a
  // la landing ni a l ICP PME.
  title: {
    default: 'FlySmart — Le bon moment pour acheter vos billets d\'avion pro',
    template: '%s | FlySmart',
  },
  description:
    'FlySmart indique aux PME quand acheter leurs billets d\'avion professionnels : recommandation claire, fenêtre de timing lisible et partage pour validation manager.',
  keywords: [
    'déplacement professionnel',
    'timing achat billet avion',
    'voyage d\'affaires PME',
    'office manager',
    'réservation vol entreprise',
  ],
  openGraph: {
    title: 'FlySmart — Sachez quand acheter, sans être expert du voyage',
    description:
      'La recommandation d\'achat pour les PME qui gèrent leurs déplacements sans agence dédiée.',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FlySmart — Sachez quand acheter, sans être expert du voyage',
    description:
      'La recommandation d\'achat pour les PME qui gèrent leurs déplacements sans agence dédiée.',
  },
  verification: {
    google: 'dS4lDtb3GkUFSthFb5DQkzfwTUYCP_dKFWE5m1s7V8E',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        {/* Phospho analytics beacon */}
        <script
          src="https://phospho-nanocorp-prod--nanocorp-api-fastapi-app.modal.run/beacon/snippet.js?s=flysmart"
          defer
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  )
}
