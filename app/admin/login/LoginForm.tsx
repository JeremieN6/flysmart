'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LoginFormProps = {
  from: string
}

export function LoginForm({ from }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Connexion impossible.')
      }

      router.push(from)
      router.refresh()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Connexion impossible.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--steel)' }}>
          Identifiant
        </label>
        <input
          type="text"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.18)', outline: 'none' }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--steel)' }}>
          Mot de passe
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.18)', outline: 'none' }}
        />
      </div>
      {error ? (
        <p className="text-sm" style={{ color: 'var(--red-alert)' }}>
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl py-3 font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
      >
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}