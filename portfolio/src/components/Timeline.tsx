import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { timeline } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'

const DOT: Record<string, string> = {
  cyan: 'bg-cyan-400 shadow-[0_0_16px_2px_rgba(34,211,238,0.6)]',
  violet: 'bg-violet-400 shadow-[0_0_16px_2px_rgba(139,92,246,0.6)]',
  magenta: 'bg-indigo-400 shadow-[0_0_16px_2px_rgba(129,140,248,0.6)]',
}

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 60%'],
  })

  return (
    <section id="journey" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="04"
        title="My journey"
        kicker="From first commit to full-time fullstack."
      />

      <div ref={ref} className="relative ml-2 max-w-3xl">
        {/* Track + animated fill */}
        <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/10" />
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-cyan-400 via-violet-500 to-fuchsia-500"
        />

        <ul className="space-y-10">
          {timeline.map((e, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-10"
            >
              <span
                className={`absolute left-0 top-1.5 h-4 w-4 rounded-full ring-4 ring-[color:var(--color-bg)] ${DOT[e.accent]}`}
              />
              <span className="font-[var(--font-mono)] text-xs tracking-widest text-[color:var(--color-faint)]">
                {e.when}
              </span>
              <h3 className="mt-1 text-xl">
                {e.title}
                {e.place && (
                  <span className="gradient-text text-base font-medium"> · {e.place}</span>
                )}
              </h3>
              <p className="mt-2 text-[color:var(--color-muted)]">{e.detail}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
