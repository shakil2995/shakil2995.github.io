import { useState } from 'react'
import { motion } from 'framer-motion'
import { socials } from '../data/portfolio'
import { ArrowUpRight, CheckIcon, CopyIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './ui/icons'

const QUICK_TOPICS = [
  {
    label: '🚀 Start a project',
    message: 'Hi Shakil! I have an idea for a project and would love to collaborate.',
  },
  {
    label: '💼 Engineering role',
    message: 'Hi Shakil! I saw your portfolio and would like to discuss an engineering opportunity.',
  },
  {
    label: '👋 Say hello',
    message: 'Hi Shakil! Loved your work and just wanted to say hello.',
  },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(socials.phoneInternational)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `tel:${socials.phoneInternational}`
    }
  }

  const getWhatsAppLink = (message: string) =>
    `https://wa.me/${socials.whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="glow-blob left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 bg-emerald-600/12" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl p-7 text-center shadow-2xl sm:p-12"
        >
          <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open for new projects &amp; roles
          </span>

          <h2 className="mt-7 text-4xl font-bold leading-[1.08] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
            Have an idea?
            <br />
            Let&apos;s <span className="gradient-text">make it real.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] sm:text-lg">
            Whether you&apos;re launching a new product, hiring for a key engineering role, or just want to chat — my inbox and WhatsApp are always open.
          </p>

          {/* Interactive Phone / WhatsApp number — click to copy */}
          <button
            type="button"
            onClick={copyPhone}
            className="glass-pill mx-auto mt-9 flex items-center gap-3 rounded-xl px-4 py-3 font-[var(--font-mono)] text-sm text-white shadow-md transition-all hover:scale-105"
            aria-label="Copy WhatsApp phone number"
          >
            <PhoneIcon width={16} height={16} className="text-emerald-400" />
            <span>{socials.phoneDisplay}</span>
            <span
              aria-live="polite"
              className={`inline-flex items-center gap-1 text-xs transition-colors ${copied ? 'text-emerald-400 font-medium' : 'text-slate-300'
                }`}
            >
              {copied ? (
                <>
                  <CheckIcon width={14} height={14} /> Copied!
                </>
              ) : (
                <>
                  <CopyIcon width={14} height={14} /> Copy
                </>
              )}
            </span>
          </button>

          {/* Quick WhatsApp Topic Starters */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="w-full text-xs font-medium uppercase tracking-wider text-slate-300">
              Quick WhatsApp Starters
            </span>
            {QUICK_TOPICS.map((topic) => (
              <a
                key={topic.label}
                href={getWhatsAppLink(topic.message)}
                target="_blank"
                rel="noreferrer"
                className="glass-pill inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-all hover:scale-105 hover:border-emerald-400/40 hover:text-white"
              >
                {topic.label}
                <ArrowUpRight width={12} height={12} className="opacity-70" />
              </a>
            ))}
          </div>

          {/* Main Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${socials.email}`}
              className="glass glow inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan-300"
            >
              <MailIcon width={18} height={18} className="text-cyan-300" />
              Email me
            </a>

            <a
              href={socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-[#05060c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(16,185,129,0.7)]"
            >
              <WhatsAppIcon width={18} height={18} />
              Chat on WhatsApp
              <ArrowUpRight
                width={16}
                height={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href={`tel:${socials.phoneInternational}`}
              className="glass glow inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <PhoneIcon width={18} height={18} className="text-emerald-400" />
              Direct Call
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

            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="glass glow inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:text-sky-400"
              >
                <LinkedInIcon width={18} height={18} />
                LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
