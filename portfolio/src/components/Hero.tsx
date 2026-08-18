import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, socials } from '../data/portfolio'
import { ArrowDown, ArrowUpRight, GitHubIcon } from './ui/icons'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery'

// Code-split the Three.js scene so the ~1MB 3D bundle loads after first paint.
const HeroScene = lazy(() => import('./three/HeroScene'))

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
          className="gradient-text font-[var(--font-mono)] font-medium"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      {/* 3D backdrop (or a calm static gradient when motion is reduced) */}
      <div className="absolute inset-0 z-0">
        {reduced ? (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_40%,rgba(124,58,237,0.28),transparent_60%)]" />
        ) : (
          <Suspense fallback={null}>
            <HeroScene isMobile={isMobile} />
          </Suspense>
        )}
      </div>

      {/* Ambient glow + grid + bottom fade */}
      <div className="glow-blob left-[8%] top-[20%] h-72 w-72 bg-cyan-500/20" />
      <div className="glow-blob right-[6%] bottom-[16%] h-80 w-80 bg-violet-500/18" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,transparent,transparent_70%,var(--color-bg))]" />

      {/* Foreground */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[color:var(--color-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </span>

          <h1 className="mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl">
            Hi, I&apos;m <span className="gradient-text">{profile.firstName}</span>.
          </h1>

          <p className="mt-4 text-xl text-[color:var(--color-ink)] sm:text-2xl">
            <span className="text-[color:var(--color-faint)]">&gt;&nbsp;</span>
            <RotatingRole />
          </p>

          <p className="mt-5 max-w-xl text-base text-[color:var(--color-muted)] sm:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#05060c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)]"
            >
              View my work
              <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="glass glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Get in touch
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="glass glow grid h-11 w-11 place-items-center rounded-xl text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <GitHubIcon />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[color:var(--color-faint)]"
      >
        <ArrowDown className="animate-cue" />
      </a>
    </section>
  )
}
