/* ─────────────────────────────────────────────────────────────
   Auth B2B + rate-limiting in-memory (100 req/h/clé)
───────────────────────────────────────────────────────────── */

interface RateBucket {
  count:      number
  resetAt:    number
}

const buckets = new Map<string, RateBucket>()
const RATE_LIMIT  = 100
const WINDOW_MS   = 60 * 60 * 1_000 // 1 heure

function validKeys(): string[] {
  const raw = process.env.B2B_API_KEYS ?? 'flysmart-trailix-test-key'
  return raw.split(',').map((k) => k.trim()).filter(Boolean)
}

export type AuthResult =
  | { ok: true;  key: string }
  | { ok: false; status: number; error: string }

/**
 * Vérifie la clé API et le rate-limit.
 * À appeler dans les API routes B2B.
 */
export function checkApiKey(headers: Headers): AuthResult {
  const key = headers.get('x-api-key') ?? headers.get('X-API-Key')
  if (!key) {
    return { ok: false, status: 401, error: 'Header X-API-Key manquant' }
  }
  if (!validKeys().includes(key)) {
    return { ok: false, status: 401, error: 'Clé API invalide' }
  }

  const now = Date.now()
  let bucket = buckets.get(key)
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS }
    buckets.set(key, bucket)
  }

  if (bucket.count >= RATE_LIMIT) {
    return { ok: false, status: 429, error: 'Rate limit dépassé (100 req/h)' }
  }

  bucket.count++
  return { ok: true, key }
}
