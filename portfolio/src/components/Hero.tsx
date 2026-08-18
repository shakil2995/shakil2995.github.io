import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, socials } from '../data/portfolio'
import { ArrowDown, ArrowUpRight, DocumentIcon, GitHubIcon, LinkedInIcon } from './ui/icons'

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2400)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="inline-flex h-[1.4em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text font-[var(--font-mono)] font-semibold"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const HIGHLIGHTS = [
  { icon: '⭐', label: 'Zinodesk', sub: 'AI SaaS Founder' },
  { icon: '🏆', label: 'ATI EMR', sub: 'Offline Sync Architect' },
  { icon: '📱', label: '50+ Apps', sub: 'Shipped to Prod' },
  { icon: '📍', label: 'Remote', sub: 'Available Worldwide' },
]

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden py-24 sm:py-32">
      {/* Soft, calm ambient background lighting */}
      <div className="glow-blob left-1/2 top-1/4 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 bg-violet-600/10" />
      <div className="glow-blob left-[15%] bottom-[20%] h-80 w-80 bg-cyan-500/8" />
      <div className="glow-blob right-[15%] top-[30%] h-80 w-80 bg-fuchsia-600/8" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,transparent,transparent_75%,var(--color-bg))]" />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* Status badge */}
          <div className="mb-6">
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[color:var(--color-ink)] shadow-md bg-[rgba(9,12,24,0.88)] border border-white/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new opportunities
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I&apos;m <span className="gradient-text">{profile.firstName}</span>.
          </h1>

          {/* Dynamic Role Subtitle (Without > symbol) */}
          <p className="mt-4 text-xl font-medium text-[color:var(--color-ink)] sm:text-2xl lg:text-3xl">
            <RotatingRole />
          </p>
          {/* Concise Value Statement */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#d1d5db] sm:text-lg lg:text-xl">
            {profile.tagline}
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-[#05060c] shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(139,92,246,0.6)]"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#contact"
              className="glass-button glow inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Get in touch</span>
            </a>

            {socials.resumeUrl && (
              <a
                href={socials.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="glass-button glow inline-flex items-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <DocumentIcon />
                <span>Resume</span>
              </a>
            )}

            <div className="flex items-center gap-2">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="glass-button glow grid h-12 w-12 place-items-center rounded-xl text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-300"
              >
                <GitHubIcon />
              </a>
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="glass-button glow grid h-12 w-12 place-items-center rounded-xl text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:text-sky-400"
                >
                  <LinkedInIcon width={18} height={18} />
                </a>
              )}
            </div>
          </div>

          {/* Clean High-Contrast Highlights Bar */}
          <div className="mt-14 grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-2.5 rounded-xl border border-white/14 bg-[rgba(10,14,28,0.65)] p-3 text-left shadow-sm backdrop-blur-md transition-all hover:border-white/30 hover:bg-[rgba(16,22,42,0.78)]"
              >
                <span className="text-lg">{h.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{h.label}</div>
                  <div className="text-[11px] font-medium text-slate-300 truncate">{h.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[color:var(--color-faint)] transition-colors hover:text-[color:var(--color-ink)]"
      >
        <ArrowDown className="animate-cue" />
      </a>
    </section>
  )
}
