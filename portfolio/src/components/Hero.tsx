import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, socials } from '../data/portfolio'
import { ArrowDown, ArrowUpRight, DocumentIcon, GitHubIcon, LinkedInIcon } from './ui/icons'
import HeroConsole from './HeroConsole'

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
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden py-28 sm:py-32">
      {/* Subtle ambient lighting backdrop */}
      <div className="glow-blob left-[-5%] top-[20%] h-[28rem] w-[28rem] bg-cyan-500/12" />
      <div className="glow-blob right-[-5%] bottom-[15%] h-[32rem] w-[32rem] bg-violet-600/14" />
      <div className="glow-blob left-[40%] top-[10%] h-80 w-80 bg-fuchsia-600/8" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,transparent,transparent_75%,var(--color-bg))]" />

      {/* Foreground Hero Content Grid */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          
          {/* Left Column: Intro & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Status badge */}
            <div className="mb-6 inline-block">
              <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-ink)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for new opportunities
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-6xl xl:text-7xl">
              Hi, I&apos;m <span className="gradient-text">{profile.firstName}</span>.
            </h1>

            <p className="mt-4 text-xl font-medium text-[color:var(--color-ink)] sm:text-2xl">
              <span className="font-[var(--font-mono)] text-cyan-400">&gt;&nbsp;</span>
              <RotatingRole />
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c0c8db] sm:text-lg">
              {profile.tagline}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#05060c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)]"
              >
                Explore Projects
                <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#contact"
                className="glass-button glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Get in touch
              </a>

              {socials.resumeUrl && (
                <a
                  href={socials.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-button glow inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[color:var(--color-muted)] transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-300"
                  aria-label="View and Download Resume"
                >
                  <DocumentIcon width={16} height={16} className="text-cyan-400" />
                  <span>Resume</span>
                </a>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="glass-button glow grid h-11 w-11 place-items-center rounded-xl text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-300"
                >
                  <GitHubIcon />
                </a>
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="glass-button glow grid h-11 w-11 place-items-center rounded-xl text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:text-sky-400"
                  >
                    <LinkedInIcon width={18} height={18} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Live Product & Code Console */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <HeroConsole />
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[color:var(--color-faint)] transition-colors hover:text-[color:var(--color-ink)]"
      >
        <ArrowDown className="animate-cue" />
      </a>
    </section>
  )
}
