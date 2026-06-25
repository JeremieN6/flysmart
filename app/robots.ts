import type { MetadataRoute } from 'next'

function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
