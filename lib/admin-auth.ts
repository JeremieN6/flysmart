const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7

export const ADMIN_SESSION_COOKIE = 'flysmart_admin_session'

type AdminConfig = {
  username: string
  password: string
  secret: string
}

function readAdminConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!username || !password || !secret) {
    return null
  }

  return { username, password, secret }
}

function getAdminConfig() {
  const config = readAdminConfig()

  if (!config) {
    throw new Error('Admin authentication environment variables are missing.')
  }

  return config
}

function encodeBase64Url(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return atob(padded)
}

async function signValue(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  const bytes = Array.from(new Uint8Array(signature), (byte) => String.fromCharCode(byte)).join('')
  return encodeBase64Url(bytes)
}

export function isValidAdminCredentials(username: string, password: string) {
  const config = readAdminConfig()
  if (!config) {
    return false
  }
  return username === config.username && password === config.password
}

export async function createAdminSessionToken() {
  const { username, secret } = getAdminConfig()
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const payload = `${username}:${expiresAt}`
  const signature = await signValue(payload, secret)

  return `${encodeBase64Url(payload)}.${signature}`
}

export async function verifyAdminSessionToken(token: string) {
  const config = readAdminConfig()

  if (!config) {
    return false
  }

  const { username, secret } = config
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return false
  }

  let payload = ''

  try {
    payload = decodeBase64Url(encodedPayload)
  } catch {
    return false
  }

  const [tokenUsername, rawExpiresAt] = payload.split(':')
  const expiresAt = Number(rawExpiresAt)

  if (tokenUsername !== username || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false
  }

  const expectedSignature = await signValue(payload, secret)
  return signature === expectedSignature
}

export function getAdminSessionMaxAge() {
  return Math.floor(SESSION_DURATION_MS / 1000)
}

export function hasAdminConfig() {
  return readAdminConfig() !== null
}