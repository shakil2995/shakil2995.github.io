import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, socials } from '../data/portfolio'
import { ArrowDown, ArrowUpRight, DocumentIcon, GitHubIcon, LinkedInIcon } from './ui/icons'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative inline-flex min-h-[2.4rem] items-center justify-center overflow-hidden px-1 py-1 align-middle sm:min-h-[2.8rem]">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="gradient-text font-[var(--font-display)] text-xl font-semibold leading-normal drop-shadow-[0_0_20px_rgba(56,189,248,0.25)] sm:text-2xl lg:text-3xl"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function Rise({
  delay,
  children,
  className = '',
}: {
  delay: number
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function KineticWord({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <span className="inline-block overflow-hidden pb-2 -mb-2 align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '115%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.7, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/**
 * Soft, calm ambient background lighting for the hero.
 *
 * Rendered by <App> rather than inside <Hero> on purpose. The hero lives inside
 * `<main className="relative z-10">`, which is its own stacking context sitting
 * above the fixed z-0 3D canvas — so any blob declared in here would paint a
 * haze *over* the moon no matter how low its z-index went. These are meant to
 * be clouds behind the moon, so they have to escape <main> entirely.
 *
 * `absolute top-0 h-screen` (no positioned ancestor) resolves against the
 * initial containing block: a viewport-sized box pinned to the document origin.
 * That reproduces the old behaviour exactly — the blobs cover the first screen
 * and scroll away with it.
 */
/**
 * Soft ambient background lighting for the hero — the original round glow
 * sprites, three of them: a big one centre, a small one left, and a small one
 * parked exactly behind the moon's resting spot so the moon conceals it at
 * the top of the page and scrolling away reveals it.
 *
 * Rendered by <App> rather than inside <Hero> on purpose. The hero lives inside
 * `<main className="relative z-10">`, which is its own stacking context sitting
 * above the fixed z-0 3D canvas — so any blob declared in here would paint a
 * haze *over* the moon no matter how low its z-index went. These are meant to
 * be clouds behind the moon, so they have to escape <main> entirely.
 */
export function HeroAmbience() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-screen overflow-hidden"
    >
      {/* Big centre cloud */}
      <div className="glow-blob left-[calc(50%-6.5rem)] top-[calc(55%-6.5rem)] h-52 w-52 bg-violet-600/10 md:left-[calc(50%-13rem)] md:top-[calc(52%-13rem)] md:h-[26rem] md:w-[26rem]" />
      {/* Small left cloud */}
      <div className="glow-blob -left-6 top-[68%] h-32 w-32 bg-cyan-500/8 md:left-[5%] md:top-[60%] md:h-44 md:w-44" />
      {/* Concealed behind the moon until scroll carries the moon away */}
      <div className="glow-blob left-[calc(74%-3.5rem)] top-[calc(21%-3.5rem)] h-28 w-28 bg-fuchsia-500/[0.09] md:left-[calc(81%-7rem)] md:top-[calc(38%-7rem)] md:h-56 md:w-56" />
    </div>
  )
}

export default function Hero({ entranceDelay = 0 }: { entranceDelay?: number }) {
  const d = entranceDelay

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden py-24 sm:py-32">
      {/* Foreground Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
        <div className="flex flex-col items-center">
          {/* Status badge */}
          <Rise delay={d} className="mb-6">
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Available for new opportunities</span>
            </span>
          </Rise>

          {/* Kinetic headline — words rise out of a mask while the name shimmers */}
          <h1
            aria-label={`Hi, I'm ${profile.firstName}.`}
            className="font-[var(--font-display)] text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-8xl"
          >
            <span aria-hidden className="flex flex-wrap items-baseline justify-center gap-x-[0.22em]">
              <KineticWord delay={d + 0.08}>Hi,</KineticWord>
              <KineticWord delay={d + 0.17}>I&apos;m</KineticWord>
              <KineticWord delay={d + 0.26}>
                <span className="shimmer-text">{profile.firstName}.</span>
              </KineticWord>
            </span>
          </h1>

          {/* Dynamic rotating subtitle (Title Case with no cutoff) */}
          <Rise delay={d + 0.45} className="mt-4 flex items-center justify-center">
            <RotatingRole />
          </Rise>

          {/* Tagline */}
          <Rise delay={d + 0.55}>
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-slate-300 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-lg lg:text-xl">
              {profile.tagline}
            </p>
          </Rise>

          {/* Action CTAs */}
          <Rise delay={d + 0.68} className="mt-9 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3">
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
          </Rise>
        </div>
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
