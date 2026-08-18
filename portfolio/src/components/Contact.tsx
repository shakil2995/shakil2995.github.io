import { useState } from 'react'
import { motion } from 'framer-motion'
import { socials } from '../data/portfolio'
import { ArrowUpRight, CheckIcon, CopyIcon, GitHubIcon, MailIcon } from './ui/icons'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socials.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${socials.email}`
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="glow-blob left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 bg-violet-600/20" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[color:var(--color-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for new projects
          </span>

          <h2 className="mt-7 text-4xl font-bold leading-[1.05] sm:text-6xl">
            Have an idea?
            <br />
            Let&apos;s <span className="gradient-text">make it real.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[color:var(--color-muted)] sm:text-lg">
            A product to launch, a role to fill, or just something you want to talk
            through — drop me a line and I&apos;ll get back to you.
          </p>

          {/* Interactive email — click to copy */}
          <button
            type="button"
            onClick={copyEmail}
            className="glass lift glow mx-auto mt-9 flex items-center gap-3 rounded-xl px-4 py-3 font-[var(--font-mono)] text-sm text-[color:var(--color-ink)]"
            aria-label="Copy email address"
          >
            <MailIcon width={16} height={16} className="text-[color:var(--color-faint)]" />
            {socials.email}
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                copied ? 'text-emerald-400' : 'text-[color:var(--color-faint)]'
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon width={14} height={14} /> Copied
                </>
              ) : (
                <>
                  <CopyIcon width={14} height={14} /> Copy
                </>
              )}
            </span>
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${socials.email}`}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-[#05060c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(139,92,246,0.7)]"
            >
              <MailIcon width={18} height={18} />
              Say hello
              <ArrowUpRight
                width={16}
                height={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="glass glow inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <GitHubIcon width={18} height={18} />
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
