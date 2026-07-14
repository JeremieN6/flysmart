import { listDemoRequests } from '@/lib/demo-requests-db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const structureTypeLabels: Record<string, string> = {
  agence: 'Agence de voyage',
  ce: "Comite d'entreprise",
  influenceur: 'Blogueur / Influenceur voyage',
  autre: 'Autre',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function DemoRequestsAdminPage() {
  const requests = await listDemoRequests()

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: 'var(--midnight)', color: 'var(--cream)' }}>
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--steel)' }}>
            Admin
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl md:text-5xl">Demandes de demo</h1>
              <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--steel-light)' }}>
                {requests.length} demande{requests.length > 1 ? 's' : ''} recue{requests.length > 1 ? 's' : ''}
              </p>
            </div>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-xl border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ borderColor: 'rgba(186,199,226,0.2)', color: 'var(--steel-light)' }}
              >
                Se deconnecter
              </button>
            </form>
          </div>
        </header>

        {requests.length === 0 ? (
          <section className="rounded-3xl border px-6 py-10 text-center" style={{ borderColor: 'rgba(186,199,226,0.12)', background: 'rgba(17, 27, 53, 0.65)' }}>
            <h2 className="text-xl font-semibold">Aucune demande pour l'instant</h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--steel-light)' }}>
              Les nouvelles soumissions du formulaire apparaitront ici automatiquement.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl border" style={{ borderColor: 'rgba(186,199,226,0.12)', background: 'rgba(17, 27, 53, 0.65)' }}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: 'rgba(186,199,226,0.12)' }}>
                <thead style={{ background: 'rgba(8, 12, 24, 0.55)' }}>
                  <tr className="text-left text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--steel)' }}>
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Contact</th>
                    <th className="px-4 py-4 font-medium">Structure</th>
                    <th className="px-4 py-4 font-medium">Site</th>
                    <th className="px-4 py-4 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(186,199,226,0.08)' }}>
                  {requests.map((request) => (
                    <tr key={request.id} className="align-top">
                      <td className="px-4 py-4 text-sm whitespace-nowrap" style={{ color: 'var(--steel-light)' }}>
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">{request.nom}</p>
                        <a href={`mailto:${request.email}`} className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--amber)' }}>
                          {request.email}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <p className="font-medium">{request.entreprise}</p>
                        <p className="mt-1" style={{ color: 'var(--steel-light)' }}>
                          {structureTypeLabels[request.structureType] ?? request.structureType}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {request.site ? (
                          <a href={request.site} target="_blank" rel="noreferrer" className="break-all transition-opacity hover:opacity-80" style={{ color: 'var(--amber)' }}>
                            {request.site}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--steel-light)' }}>Non renseigne</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm leading-6" style={{ color: 'var(--steel-light)' }}>
                        {request.message || 'Aucun message'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}