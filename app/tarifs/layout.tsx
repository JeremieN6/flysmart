import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs — FlySmart',
  description: 'Choisissez le plan FlySmart adapte aux deplacements professionnels en PME : Starter, Pro ou Enterprise sur devis.',
  alternates: { canonical: 'https://flysmart.app/tarifs' },
}

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return children
}
