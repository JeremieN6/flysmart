import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analyser un vol — FlySmart',
  description: 'Analysez le meilleur moment pour acheter votre billet d\'avion. Courbe de prix 12 semaines, fenêtre optimale, économies estimées.',
  alternates: { canonical: 'https://flysmart.app/analyse' },
}

export default function AnalyseLayout({ children }: { children: React.ReactNode }) {
  return children
}
