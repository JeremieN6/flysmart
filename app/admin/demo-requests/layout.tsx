import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth'

type AdminDemoRequestsLayoutProps = {
  children: ReactNode
}

export default async function AdminDemoRequestsLayout({ children }: AdminDemoRequestsLayoutProps) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const isAuthenticated = sessionToken ? await verifyAdminSessionToken(sessionToken) : false

  if (!isAuthenticated) {
    redirect('/admin/login?from=%2Fadmin%2Fdemo-requests')
  }

  return children
}