'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { searchAirports, type Airport } from '@/lib/airports'

interface AirportAutocompleteProps {
  id: string
  placeholder?: string
  label?: string
  icon?: string
  value: string
  onChange: (value: string, airport?: Airport) => void
  required?: boolean
}

export default function AirportAutocomplete({
  id,
  placeholder = 'Paris, CDG',
  label,
  icon = '✈',
  value,
  onChange,
  required = false,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<Airport[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listboxId = `${id}-listbox`

  // Sync external value reset
  useEffect(() => { setQuery(value) }, [value])

  const search = useCallback((q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    const found = searchAirports(q)
    setResults(found)
    setOpen(found.length > 0)
    setActiveIndex(-1)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    search(q)
    onChange(q)
  }

  const select = (airport: Airport) => {
    const display = `${airport.iata} — ${airport.name} (${airport.country})`
    setQuery(display)
    setResults([])
    setOpen(false)
    setActiveIndex(-1)
    onChange(display, airport)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      select(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.closest('[data-autocomplete]')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-2" data-autocomplete>
      {label && (
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-widest text-left" style={{ color: 'var(--steel)' }}>
          {label}
        </label>
      )}
      <div className="relative w-full">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'var(--steel)' }}>
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          required={required}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          className="w-full rounded-xl pl-9 pr-4 py-3.5 text-sm"
          style={{
            background: 'rgba(8, 12, 24, 0.6)',
            border: '1px solid rgba(107, 127, 168, 0.15)',
            color: 'var(--cream)',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(232,163,48,0.4)'; if (query.length >= 2 && results.length > 0) setOpen(true) }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(107, 127, 168, 0.15)' }}
        />
        {/* Dropdown */}
        {open && results.length > 0 && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl overflow-y-auto"
            style={{
              maxHeight: '240px',
              background: 'rgba(13, 20, 38, 0.98)',
              border: '1px solid rgba(107,127,168,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {results.map((airport, i) => (
              <li
                key={airport.iata}
                id={`${listboxId}-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors duration-100"
                style={{
                  background: i === activeIndex ? 'rgba(232,163,48,0.1)' : 'transparent',
                  color: 'var(--cream)',
                  borderBottom: i < results.length - 1 ? '1px solid rgba(107,127,168,0.08)' : 'none',
                }}
                onMouseDown={(e) => { e.preventDefault(); select(airport) }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span
                  className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(232,163,48,0.15)', color: 'var(--amber)', minWidth: '36px', textAlign: 'center' }}
                >
                  {airport.iata}
                </span>
                <span className="flex-1 min-w-0 truncate">
                  {airport.name} <span style={{ color: 'var(--steel)' }}>· {airport.city}, {airport.country}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
