import { motion } from 'framer-motion'
import { projects, type Project } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'
import { ArrowUpRight, ExternalLink, GitHubIcon, LockIcon } from './ui/icons'

const BAR: Record<Project['accent'], string> = {
  cyan: 'from-cyan-400 to-sky-500',
  violet: 'from-violet-400 to-indigo-500',
  magenta: 'from-violet-400 to-indigo-500',
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div className="glass lift glow group flex h-full flex-col rounded-2xl p-6">
        <div className={`mb-5 h-1 w-12 rounded-full bg-gradient-to-r ${BAR[project.accent]}`} />

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl transition-colors group-hover:text-[color:var(--color-ink)]">
            {project.title}
          </h3>
          <span className="font-[var(--font-mono)] text-xs text-[color:var(--color-faint)]">
            {project.year}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted)]">
          {project.blurb}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <li
              key={t}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-[var(--font-mono)] text-[11px] text-[color:var(--color-muted)]"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-4 pt-6">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-ink)] transition-colors hover:text-cyan-300"
            >
              <GitHubIcon width={17} height={17} /> Code
              <ArrowUpRight width={14} height={14} className="opacity-60" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-ink)] transition-colors hover:text-violet-300"
            >
              <ExternalLink width={16} height={16} /> Visit
              <ArrowUpRight width={14} height={14} className="opacity-60" />
            </a>
          )}
          {!project.repo && !project.live && project.label && (
            <span className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-faint)]">
              <LockIcon width={15} height={15} />
              {project.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="03"
        title="Featured work"
        kicker="A selection of things I've designed, built, and shipped."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
