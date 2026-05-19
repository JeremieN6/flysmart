import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--midnight)' }}>
      <div className="text-center max-w-md" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(232,163,48,0.3)', borderRadius: '16px', padding: '48px 40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>
          Paiement confirmé !
        </h1>
        <p className="mb-6" style={{ color: 'var(--steel-light)' }}>
          Bienvenue dans FlySmart. Vous allez recevoir vos identifiants API par e-mail d'ici quelques minutes.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium"
          style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
