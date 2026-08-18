import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, socials } from '../data/portfolio'
import { ArrowDown, ArrowUpRight, DocumentIcon, GitHubIcon, LinkedInIcon } from './ui/icons'

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="relative inline-flex h-[1.35em] items-center justify-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text font-[var(--font-display)] text-2xl font-bold tracking-tight text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.3)] sm:text-3xl lg:text-4xl"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

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
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Available for new opportunities</span>
            </span>
          </div>

          {/* Premium Headline */}
          <h1 className="font-[var(--font-display)] text-5xl font-extrabold tracking-[-0.035em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-7xl lg:text-8xl">
            <span className="font-light text-slate-100">Hi, I&apos;m </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
              {profile.firstName}
            </span>
            <span className="text-cyan-400">.</span>
          </h1>

          {/* Dynamic rotating subtitle */}
          <div className="mt-4 flex items-center justify-center">
            <RotatingRole />
          </div>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-slate-300 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-lg lg:text-xl">
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
