import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'FlySmart — Intégrez l\'analyse de prix pour agences, CE et créateurs voyage',
    template: '%s | FlySmart',
  },
  description:
    'FlySmart aide les agences de voyage, comités d\'entreprise et créateurs de contenu à offrir à leurs clients le meilleur timing d\'achat. Widget intégrable en 5 minutes. +1% commission.',
  keywords: [
    'agence de voyage',
    'comité entreprise',
    'blogueur voyage',
    'widget prix vols',
    'timing achat billet avion',
    'solution voyage professionnels',
  ],
  openGraph: {
    title: 'FlySmart — Le timing d\'achat optimal pour vos clients',
    description:
      'Intégrez FlySmart en 5 minutes. Différenciez-vous, économisez sur les déplacements, monétisez votre audience.',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FlySmart — Le timing d\'achat optimal pour vos clients',
    description:
      'Intégrez FlySmart en 5 minutes. Différenciez-vous, économisez sur les déplacements, monétisez votre audience.',
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
