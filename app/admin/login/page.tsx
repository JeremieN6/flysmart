import { LoginForm } from './LoginForm'

type LoginPageProps = {
  searchParams: Promise<{ from?: string }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const from = params.from && params.from.startsWith('/admin') ? params.from : '/admin/demo-requests'

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: 'var(--midnight)', color: 'var(--cream)' }}>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-3xl border p-8 shadow-2xl" style={{ borderColor: 'rgba(186,199,226,0.12)', background: 'rgba(17, 27, 53, 0.72)' }}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--steel)' }}>
            Admin FlySmart
          </p>
          <h1 className="mt-4 font-display text-4xl">Connexion</h1>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--steel-light)' }}>
            Connectez-vous pour consulter les demandes de demo.
          </p>
          <LoginForm from={from} />
        </div>
      </div>
    </main>
  )
}