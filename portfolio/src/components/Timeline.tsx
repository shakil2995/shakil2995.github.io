import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { timeline } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'

const ACCENT_STYLES: Record<string, { dot: string; border: string; glow: string; badge: string }> = {
  cyan: {
    dot: 'bg-cyan-400 shadow-[0_0_14px_2px_rgba(34,211,238,0.7)] ring-cyan-500/30',
    border: 'hover:border-cyan-400/40',
    glow: 'hover:shadow-[0_16px_36px_-10px_rgba(34,211,238,0.25)]',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  },
  violet: {
    dot: 'bg-violet-400 shadow-[0_0_14px_2px_rgba(168,85,247,0.7)] ring-violet-500/30',
    border: 'hover:border-violet-400/40',
    glow: 'hover:shadow-[0_16px_36px_-10px_rgba(168,85,247,0.25)]',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
  },
  magenta: {
    dot: 'bg-pink-400 shadow-[0_0_14px_2px_rgba(244,114,182,0.7)] ring-pink-500/30',
    border: 'hover:border-pink-400/40',
    glow: 'hover:shadow-[0_16px_36px_-10px_rgba(244,114,182,0.25)]',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/25',
  },
}

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 65%'],
  })

  return (
    <section id="journey" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="04"
        title="My journey"
        kicker="From first commit to full-time fullstack."
      />

      <div ref={ref} className="relative ml-2 max-w-3xl sm:ml-4">
        {/* Track rail background */}
        <div className="absolute left-[9px] top-6 h-[calc(100%-3rem)] w-[2px] bg-white/10" />

        {/* Animated illuminated glowing rail */}
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-[9px] top-6 h-[calc(100%-3rem)] w-[2px] origin-top bg-gradient-to-b from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        />

        <div className="space-y-6 sm:space-y-8">
          {timeline.map((e, i) => {
            const styles = ACCENT_STYLES[e.accent] || ACCENT_STYLES.cyan

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20, y: 12 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-8 sm:pl-12"
              >
                {/* Timeline Pulsing Node */}
                <div className="absolute left-0 top-6 -translate-x-1/2">
                  <span
                    className={`block h-5 w-5 rounded-full ring-4 ring-[#080b16] ${styles.dot}`}
                  />
                </div>

                {/* Sleek Subtle Frosted Glass Card */}
                <div
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(11,15,28,0.58)] p-5 backdrop-blur-md transition-all duration-300 sm:p-6 ${styles.border} ${styles.glow} hover:-translate-y-0.5 hover:bg-[rgba(16,22,42,0.72)]`}
                >
                  {/* Subtle top inner gradient highlight */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Header Row: Date Badge & Place */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-0.5 font-mono text-xs font-semibold tracking-wider ${styles.badge}`}
                    >
                      {e.when}
                    </span>

                    {e.place && (
                      <span className="text-xs font-semibold tracking-wide text-cyan-300/90 sm:text-sm">
                        {e.place}
                      </span>
                    )}
                  </div>

                  {/* Role / Milestone Title */}
                  <h3 className="mt-2.5 text-lg font-bold tracking-tight text-white sm:text-xl">
                    {e.title}
                  </h3>

                  {/* Detail Description (High contrast readability over frosted backdrop) */}
                  <p className="mt-2 text-sm leading-relaxed text-[#c4cee0] sm:text-base">
                    {e.detail}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
