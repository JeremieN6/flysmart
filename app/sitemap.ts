import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

function getAllStaticPageRoutes(): string[] {
  const appDir = path.join(process.cwd(), 'app')
  const pageFiles = new Set(['page.tsx', 'page.ts', 'page.jsx', 'page.js'])
  const routes = new Set<string>()

  const walk = (currentDir: string) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        if (entry.name.startsWith('_')) continue
        walk(fullPath)
        continue
      }

      if (!entry.isFile() || !pageFiles.has(entry.name)) continue

      const dirFromApp = path.relative(appDir, path.dirname(fullPath))
      const rawSegments = dirFromApp === '' ? [] : dirFromApp.split(path.sep)

      // Ignore private and dynamic segments. Remove route groups from URL path.
      const hasDynamicSegment = rawSegments.some((segment) => segment.includes('[') || segment.startsWith('@'))
      if (hasDynamicSegment) continue

      const segments = rawSegments
        .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
        .filter((segment) => segment !== 'api' && segment !== 'admin')

      if (rawSegments.includes('api') || rawSegments.includes('admin')) continue

      const route = segments.length === 0 ? '/' : `/${segments.join('/')}`
      routes.add(route)
    }
  }

  walk(appDir)
  return Array.from(routes).sort()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  return getAllStaticPageRoutes().map((route) => ({
    url: `${siteUrl}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))
}
