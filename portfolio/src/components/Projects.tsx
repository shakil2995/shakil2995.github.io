import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projectCategories, projects, type Project, type ProjectCategory } from '../data/portfolio'
import { SectionHeading } from './ui/SectionHeading'
import { ArrowUpRight, ExternalLink, GitHubIcon, LockIcon, PlayStoreIcon } from './ui/icons'

const BAR: Record<Project['accent'], string> = {
  cyan: 'from-cyan-400 to-sky-500',
  violet: 'from-violet-400 to-indigo-500',
  magenta: 'from-fuchsia-400 to-pink-500',
}

const BADGE_STYLE = (badge?: string) => {
  if (!badge) return 'bg-white/5 text-[color:var(--color-muted)] border-white/10'
  if (badge.includes('Star')) return 'bg-amber-400/10 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
  if (badge.includes('Signature')) return 'bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/30 shadow-[0_0_12px_rgba(232,121,249,0.15)]'
  if (badge.includes('Founder')) return 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30'
  return 'bg-violet-400/10 text-violet-300 border-violet-400/30'
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ delay: (index % 3) * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div className="group flex h-full flex-col rounded-2xl border border-white/14 bg-[rgba(10,14,28,0.65)] p-5 sm:p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-[rgba(16,22,42,0.78)]">

        {/* Card Header: Accent bar & Badge */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${BAR[project.accent]}`} />
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${BADGE_STYLE(project.badge)}`}>
            {project.badge || project.categoryLabel}
          </span>
        </div>

        {/* Project Screenshot / Visual Container (Properly fitted, not edge-to-edge) */}
        {project.image && (
          <div className="relative mb-4 w-full overflow-hidden rounded-xl border border-white/15 bg-[#090b14] aspect-[16/9]">
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090b14]/60 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-200">
            {project.title}
          </h3>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">
          {project.blurb}
        </p>

        {/* Feature Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-xs font-medium text-slate-200">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tech tags */}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <li
              key={t}
              className="rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-[var(--font-mono)] text-[11px] font-semibold text-slate-200"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* Action Links */}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              <ExternalLink width={14} height={14} /> Visit Site
              <ArrowUpRight width={12} height={12} className="opacity-70" />
            </a>
          )}
          {project.playStore && (
            <a
              href={project.playStore}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <PlayStoreIcon width={14} height={14} /> Google Play
              <ArrowUpRight width={12} height={12} className="opacity-70" />
            </a>
          )}
          {project.repo && !project.live && !project.playStore && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white transition-colors hover:text-cyan-300"
            >
              <GitHubIcon width={15} height={15} /> Source
              <ArrowUpRight width={12} height={12} className="opacity-70" />
            </a>
          )}
          {!project.repo && !project.live && !project.playStore && project.label && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <LockIcon width={13} height={13} />
              {project.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all')

  const filtered = activeCategory === 'all'
    ? projects.filter((p) => !p.hideOnAll).slice(0, 6)
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="work" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="03"
        title="Featured work"
        kicker="Products I've founded, enterprise systems I've architected, and mobile apps I've shipped."
      />

      {/* Animated Category Filter Chips */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        {projectCategories.map((cat) => {
          const isSelected = activeCategory === cat.id
          const count = cat.id === 'all'
            ? projects.filter((p) => !p.hideOnAll).length
            : projects.filter((p) => p.category === cat.id).length

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`relative rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all sm:text-sm ${isSelected
                  ? 'text-[#05060c]'
                  : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
                }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_4px_20px_-4px_rgba(34,211,238,0.5)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              {!isSelected && (
                <span className="glass absolute inset-0 -z-10 rounded-xl ring-1 ring-white/10" />
              )}
              <span className="flex items-center gap-2">
                {cat.label}
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected
                      ? 'bg-black/20 text-black font-bold'
                      : 'bg-white/10 text-[color:var(--color-faint)]'
                    }`}
                >
                  {count}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
