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
                width={profile.avatarWidth}
                height={profile.avatarHeight}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-2xl object-cover object-[center_20%] shadow-2xl"
              />
            </div>
            <div className="glass-pill absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl px-4 py-2 text-sm shadow-xl">
              <span className="gradient-text font-bold">{profile.role}</span>
              <span className="font-medium text-slate-200"> @ {profile.company}</span>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <div className="glass-card mb-6 rounded-2xl p-5 shadow-xl sm:p-7">
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-base leading-relaxed sm:text-lg ${i === 0 ? 'mb-4 font-medium text-white' : 'mb-3 text-slate-200 last:mb-0'
                  }`}
              >
                {p}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                  <div className="glass-card h-full rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.09]">
                    <div className="font-[var(--font-display)] text-2xl font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-3xl">
                      <Counter target={value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-xs font-semibold tracking-wide text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{s.label}</div>
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
