import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs — FlySmart',
  description: 'Choisissez le plan FlySmart adapté à vos besoins : Blogueur, Agence, CE. Accès à l\'API de prédiction de prix de vols.',
  alternates: { canonical: 'https://flysmart.app/tarifs' },
}

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return children
}
