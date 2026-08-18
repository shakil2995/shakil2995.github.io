import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { about, profile, stats } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

/** Counts up to `target` once scrolled into view. */
function Counter({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

export default function About() {
  const years = new Date().getFullYear() - profile.startYear

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading index="01" title="About me" />

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="glass animate-float-slow overflow-hidden rounded-3xl p-2">
              <img
                src={profile.avatar}
                alt={`${profile.name}, ${profile.role}`}
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <div className="glass absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl px-4 py-2 text-sm">
              <span className="gradient-text font-semibold">{profile.role}</span>
              <span className="text-[color:var(--color-faint)]"> @ {profile.company}</span>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-4 text-base text-[color:var(--color-muted)] sm:text-lg">{p}</p>
            </Reveal>
          ))}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => {
              const value = s.key === 'years' ? years : (s.value ?? 0)
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="h-full"
                >
                  <div className="glass lift glow h-full rounded-2xl p-4 text-center">
                    <div className="font-[var(--font-display)] text-2xl font-bold text-[color:var(--color-ink)] sm:text-3xl">
                      <Counter target={value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-xs text-[color:var(--color-faint)]">{s.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
