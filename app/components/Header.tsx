'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  ctaHref?: string
  ctaLabel?: string
}

const NAV_LINKS = [
  { href: '/#segments',    label: 'Solutions' },
  { href: '/#widget-demo', label: 'Démo' },
  { href: '/tarifs',       label: 'Tarifs' },
  { href: '/analyse',      label: 'Analyser' },
]

const MOBILE_LINKS = [
  { href: '/',              emoji: '🏠', label: 'Accueil' },
  { href: '/analyse',       emoji: '🔍', label: 'Analyser un vol' },
  { href: '/widget-demo',   emoji: '📊', label: 'Démo' },
  { href: '/tarifs',        emoji: '💼', label: 'Tarifs' },
  { href: '/#contact-demo', emoji: '📞', label: 'Demander une démo' },
]

export default function Header({
  ctaHref = '#contact-demo',
  ctaLabel = 'Demander une démo →',
}: HeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Fermeture ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Verrouillage scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  return (
    <nav
      className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6"
      aria-label="Navigation principale"
    >
      {/* Logo */}
      <div className="fade-up">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-wide"
          style={{ color: 'var(--amber)', textDecoration: 'none' }}
        >
          Fly<span style={{ color: 'var(--cream)' }}>Smart</span>
        </Link>
      </div>

      {/* Desktop nav */}
      <div
        className="fade-up delay-100 hidden md:flex items-center gap-6 text-sm"
        style={{ color: 'var(--steel-light)' }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:opacity-80 transition-opacity duration-200"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'linear-gradient(135deg, #E8A330 0%, #C4842A 100%)',
            color: '#080C18',
          }}
        >
          {ctaLabel}
        </Link>
      </div>

      {/* Burger button */}
      <button
        type="button"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
        style={{
          color: 'var(--cream)',
          background: 'transparent',
          border: '1px solid rgba(107,127,168,0.2)',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className="md:hidden fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          background: 'rgba(8, 12, 24, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) close() }}
      >
        {/* Slide panel */}
        <div
          className="absolute top-0 right-0 h-full w-4/5 max-w-xs flex flex-col transition-transform duration-300"
          style={{
            background: 'var(--navy-mid)',
            borderLeft: '1px solid rgba(107,127,168,0.15)',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            boxShadow: '-20px 0 60px rgba(8,12,24,0.7)',
          }}
        >
          {/* Header panel */}
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: '1px solid rgba(107,127,168,0.1)' }}
          >
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-wide"
              style={{ color: 'var(--amber)', textDecoration: 'none' }}
              onClick={close}
            >
              Fly<span style={{ color: 'var(--cream)' }}>Smart</span>
            </Link>
            <button
              type="button"
              aria-label="Fermer le menu"
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ color: 'var(--steel-light)', border: '1px solid rgba(107,127,168,0.2)' }}
              onClick={close}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col flex-1 px-4 py-6 gap-1 overflow-y-auto">
            {MOBILE_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-200"
                  style={{
                    minHeight: '52px',
                    color: active ? 'var(--amber)' : 'var(--cream)',
                    background: active ? 'rgba(232,163,48,0.1)' : 'transparent',
                    border: active ? '1px solid rgba(232,163,48,0.2)' : '1px solid transparent',
                    fontSize: '1rem',
                  }}
                >
                  <span className="text-lg">{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="px-4 py-6" style={{ borderTop: '1px solid rgba(107,127,168,0.1)' }}>
            <Link
              href={ctaHref}
              onClick={close}
              className="flex items-center justify-center w-full py-3.5 rounded-xl font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, #E8A330 0%, #C4842A 100%)',
                color: '#080C18',
                minHeight: '52px',
              }}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
