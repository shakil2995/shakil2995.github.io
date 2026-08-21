import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { socials } from '../data/portfolio'
import {
  ArrowUpRight,
  DocumentIcon,
  GitHubIcon,
  LinkedInIcon,
  PhoneIcon,
  WhatsAppIcon,
} from './ui/icons'

type Command = {
  id: string
  label: string
  hint: string
  icon?: ReactNode
  run: () => void
}

const SECTION_COMMANDS: Array<{ id: string; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills & stack' },
  { id: 'work', label: 'Featured work' },
  { id: 'journey', label: 'My journey' },
  { id: 'contact', label: 'Contact' },
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * ⌘K / Ctrl+K quick navigation. Keyboard-first, and every action it exposes is
 * reachable elsewhere in the page — this is an accelerator, never the only path.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const commands = useMemo<Command[]>(() => {
    const jumps: Command[] = SECTION_COMMANDS.map((s) => ({
      id: `go-${s.id}`,
      label: `Go to ${s.label}`,
      hint: 'Section',
      run: () => scrollToSection(s.id),
    }))

    const actions: Command[] = [
      {
        id: 'whatsapp',
        label: 'Chat on WhatsApp',
        hint: 'Contact',
        icon: <WhatsAppIcon width={15} height={15} />,
        run: () => openExternal(socials.whatsapp),
      },
      {
        id: 'email',
        label: `Email ${socials.email}`,
        hint: 'Contact',
        run: () => {
          window.location.href = `mailto:${socials.email}`
        },
      },
      {
        id: 'call',
        label: `Call ${socials.phoneDisplay}`,
        hint: 'Contact',
        icon: <PhoneIcon width={15} height={15} />,
        run: () => {
          window.location.href = `tel:${socials.phoneInternational}`
        },
      },
      {
        id: 'resume',
        label: 'Open résumé',
        hint: 'Link',
        icon: <DocumentIcon width={15} height={15} />,
        run: () => openExternal(socials.resumeUrl),
      },
      {
        id: 'github',
        label: 'Open GitHub profile',
        hint: 'Link',
        icon: <GitHubIcon width={15} height={15} />,
        run: () => openExternal(socials.github),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn profile',
        hint: 'Link',
        icon: <LinkedInIcon width={15} height={15} />,
        run: () => openExternal(socials.linkedin),
      },
      {
        id: 'copy-phone',
        label: 'Copy phone number',
        hint: 'Action',
        run: () => {
          void navigator.clipboard?.writeText(socials.phoneInternational)
        },
      },
      {
        id: 'meteor-storm',
        label: 'Summon a meteor shower',
        hint: '✨ Press M',
        run: () => {
          window.dispatchEvent(new CustomEvent('shakil:meteor-summon'))
        },
      },
    ]

    return [...jumps, ...actions]
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
    )
  }, [commands, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setCursor(0)
    restoreFocusRef.current?.focus()
  }, [])

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => {
          if (!v) restoreFocusRef.current = document.activeElement as HTMLElement
          return !v
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    setCursor(0)
  }, [query])

  // Keep the highlighted row in view while arrowing through a filtered list.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[cursor] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor, open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (results.length ? (c + 1) % results.length : 0))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = results[cursor]
      if (cmd) {
        close()
        cmd.run()
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass-menu w-full max-w-lg overflow-hidden rounded-2xl"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span aria-hidden className="text-[color:var(--color-faint)]">
                <ArrowUpRight width={16} height={16} />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, or type to search…"
                aria-label="Search commands"
                aria-controls="command-palette-list"
                aria-activedescendant={results[cursor] ? `cmd-${results[cursor].id}` : undefined}
                className="w-full bg-transparent text-sm text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-faint)]"
              />
              <kbd className="glass-chip rounded-md px-1.5 py-0.5 font-[var(--font-mono)] text-[10px] text-[color:var(--color-faint)]">
                ESC
              </kbd>
            </div>

            <ul
              ref={listRef}
              id="command-palette-list"
              role="listbox"
              aria-label="Commands"
              className="max-h-[52vh] overflow-y-auto p-2"
            >
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  onMouseEnter={() => setCursor(i)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    close()
                    c.run()
                  }}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    i === cursor
                      ? 'bg-white/10 text-[color:var(--color-ink)]'
                      : 'text-[color:var(--color-muted)]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {c.icon && <span className="shrink-0 opacity-80">{c.icon}</span>}
                    <span className="truncate">{c.label}</span>
                  </span>
                  <span className="shrink-0 font-[var(--font-mono)] text-[10px] uppercase tracking-wider text-[color:var(--color-faint)]">
                    {c.hint}
                  </span>
                </li>
              ))}

              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-[color:var(--color-faint)]">
                  No matches for “{query}”
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
