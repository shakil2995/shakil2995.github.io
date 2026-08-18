import { profile, socials } from '../data/portfolio'
import { GitHubIcon, PhoneIcon, WhatsAppIcon } from './ui/icons'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <p className="text-sm text-[color:var(--color-faint)]">
          © {year} {profile.name}. Built with React, Three.js &amp; Tailwind.
        </p>
        <div className="flex items-center gap-3">
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--color-muted)] ring-1 ring-white/10 transition-colors hover:text-[color:var(--color-ink)]"
          >
            <GitHubIcon width={17} height={17} />
          </a>
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--color-muted)] ring-1 ring-white/10 transition-colors hover:text-emerald-400"
          >
            <WhatsAppIcon width={17} height={17} />
          </a>
          <a
            href={`tel:${socials.phoneInternational}`}
            aria-label="Direct Phone Call"
            className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--color-muted)] ring-1 ring-white/10 transition-colors hover:text-emerald-400"
          >
            <PhoneIcon width={17} height={17} />
          </a>
          <a href="#home" className="ml-1 text-sm text-[color:var(--color-faint)] hover:text-[color:var(--color-ink)]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
