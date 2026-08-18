import { motion } from 'framer-motion'
import { skills } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'
import { TechIcon } from './ui/icons'

const DOT: Record<string, string> = {
  cyan: 'bg-cyan-400',
  violet: 'bg-violet-400',
  magenta: 'bg-fuchsia-400',
}

const TEXT: Record<string, string> = {
  cyan: 'text-cyan-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/5',
  violet: 'text-violet-300 group-hover:border-violet-400/30 group-hover:bg-violet-400/5',
  magenta: 'text-fuchsia-300 group-hover:border-fuchsia-400/30 group-hover:bg-fuchsia-400/5',
}

const GLOW_ACCENT: Record<string, string> = {
  cyan: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-400/30',
  violet: 'hover:shadow-[0_0_20px_rgba(167,139,250,0.15)] hover:border-violet-400/30',
  magenta: 'hover:shadow-[0_0_20px_rgba(232,121,249,0.15)] hover:border-fuchsia-400/30',
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-24 sm:py-32">
      <div className="glow-blob left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 bg-violet-600/15" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          title="Skills & stack"
          kicker="The proven frameworks, languages, and tools I reach for daily across web, mobile, and backend."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: gi * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <div className={`glass lift glow group h-full rounded-2xl p-5 transition-all duration-300 ${GLOW_ACCENT[group.accent]}`}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${DOT[group.accent]}`} />
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-[var(--font-mono)] text-[12px] transition-all hover:scale-105 hover:border-white/30 hover:text-[color:var(--color-ink)] ${TEXT[group.accent]}`}
                    >
                      <TechIcon iconKey={item.iconKey} className="opacity-80 transition-opacity group-hover:opacity-100" />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
