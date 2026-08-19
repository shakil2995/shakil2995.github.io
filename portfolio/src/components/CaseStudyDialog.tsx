import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '../data/portfolio'
import { ArrowUpRight, CloseIcon, ExternalLink } from './ui/icons'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

/**
 * Long-form breakdown for signature work. A card blurb can say *what* was
 * built; this is where the engineering reasoning behind it lives.
 */
export default function CaseStudyDialog({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!project) return

    restoreFocusRef.current = document.activeElement as HTMLElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Focus trap: keep Tab cycling inside the dialog while it's open.
      if (e.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes || nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    // Move focus into the dialog so a keyboard user isn't left behind it.
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    })

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      restoreFocusRef.current?.focus()
    }
  }, [project, onClose])

  const study = project?.caseStudy

  // Portalled to <body>: rendered in place it would sit inside <main>'s
  // `z-10` stacking context, where the fixed navbar (z-50) would paint over it
  // no matter how high the dialog's own z-index went.
  return createPortal(
    <AnimatePresence>
      {project && study && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-menu max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl sm:max-h-[88vh] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[rgba(7,9,20,0.96)] px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <span className="glass-pill inline-flex rounded-full px-3 py-0.5 font-[var(--font-mono)] text-[11px] font-bold tracking-widest text-cyan-300">
                  CASE STUDY
                </span>
                <h2
                  id="case-study-title"
                  className="mt-2 truncate text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  {project.title}
                </h2>
                <p className="mt-1 text-xs text-[color:var(--color-faint)] sm:text-sm">
                  {study.role} · {study.timeframe}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="glass-button grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>

            <div className="space-y-8 px-6 py-7 sm:px-8">
              {/* Problem */}
              <section>
                <h3 className="font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest text-fuchsia-300">
                  The problem
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-200">{study.problem}</p>
              </section>

              {/* Approach */}
              <section>
                <h3 className="font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Approach
                </h3>
                <ol className="mt-4 space-y-5">
                  {study.approach.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 font-[var(--font-mono)] text-xs font-bold text-cyan-300 ring-1 ring-white/10">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-white">{step.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Outcome */}
              <section>
                <h3 className="font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest text-emerald-300">
                  Outcome
                </h3>
                <ul className="mt-3 space-y-2">
                  {study.outcome.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Stack */}
              <section>
                <h3 className="font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest text-violet-300">
                  Stack
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <li
                      key={t}
                      className="glass-pill rounded-md px-2.5 py-1 font-[var(--font-mono)] text-[11px] font-semibold text-slate-200"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#05060c] transition-transform hover:-translate-y-0.5"
                >
                  <ExternalLink width={15} height={15} />
                  Visit {project.title}
                  <ArrowUpRight width={14} height={14} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
