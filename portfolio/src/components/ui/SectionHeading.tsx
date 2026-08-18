import { Reveal } from './Reveal'

type Props = {
  index: string
  title: string
  kicker?: string
}

export function SectionHeading({ index, title, kicker }: Props) {
  return (
    <Reveal>
      <div className="mb-10 inline-block max-w-2xl rounded-2xl border border-white/20 bg-[rgba(9,12,24,0.88)] p-4 shadow-xl backdrop-blur-md sm:mb-14 sm:p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-[var(--font-mono)] text-xs font-bold tracking-widest text-cyan-300 shadow-sm">
          {index} //
        </span>
        <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {kicker && (
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-base">
            {kicker}
          </p>
        )}
      </div>
    </Reveal>
  )
}
