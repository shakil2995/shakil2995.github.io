import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { socials } from '../data/portfolio'
import { CloseIcon, MenuIcon, WhatsAppIcon } from './ui/icons'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
] as const

const IDS = SECTIONS.map((s) => s.id)

export default function Navbar() {
  const active = useScrollSpy(IDS)
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <a href="#home" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 font-[var(--font-display)] text-sm font-bold text-white shadow-[var(--shadow-glow)]">
            S
          </span>
          <span className="font-[var(--font-display)] text-[15px] font-semibold tracking-tight text-[color:var(--color-ink)]">
            shakil<span className="gradient-text">.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${active === s.id
                    ? 'text-[color:var(--color-ink)]'
                    : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
                  }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/5 ring-1 ring-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-400 transition-all duration-300 hover:scale-105 hover:bg-emerald-500/20 sm:inline-flex"
          >
            <WhatsAppIcon width={15} height={15} />
            <span>Chat</span>
          </a>

          <a
            href="#contact"
            className="hidden rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#05060c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(139,92,246,0.7)] sm:block"
          >
            Let&apos;s talk
          </a>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl text-[color:var(--color-ink)] ring-1 ring-white/10 md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-[rgba(10,13,26,0.95)] p-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${active === s.id
                        ? 'gradient-text bg-white/5 font-bold'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Action Buttons (WhatsApp Chat + Let's Talk) */}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 py-2.5 text-sm font-semibold text-emerald-300 shadow-md transition-all active:scale-95"
              >
                <WhatsAppIcon width={17} height={17} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-2.5 text-sm font-bold text-[#05060c] shadow-md transition-all active:scale-95"
              >
                Let&apos;s talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
