import { motion } from 'framer-motion'
import { skills } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'

const DOT: Record<string, string> = {
  cyan: 'bg-cyan-400',
  violet: 'bg-violet-400',
  magenta: 'bg-indigo-400',
}
const TEXT: Record<string, string> = {
  cyan: 'text-cyan-300',
  violet: 'text-violet-300',
  magenta: 'text-indigo-300',
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-24 sm:py-32">
      <div className="glow-blob left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 bg-violet-600/15" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          title="Skills & stack"
          kicker="The tools I reach for across the frontend, mobile, and backend."
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
              <div className="glass lift glow h-full rounded-2xl p-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${DOT[group.accent]}`} />
                  <h3 className="text-lg">{group.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className={`rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-[var(--font-mono)] text-[13px] transition-colors hover:border-white/20 hover:text-[color:var(--color-ink)] ${TEXT[group.accent]}`}
                    >
                      {item}
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
