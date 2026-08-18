import { Reveal } from './Reveal'

type Props = {
  index: string
  title: string
  kicker?: string
}

export function SectionHeading({ index, title, kicker }: Props) {
  return (
    <Reveal>
      <div className="mb-10 sm:mb-14">
        <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-[var(--font-mono)] text-xs font-bold tracking-widest text-cyan-300 shadow-md">
          {index} //
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {kicker && (
          <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-slate-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)] sm:text-lg">
            {kicker}
          </p>
        )}
      </div>
    </Reveal>
  )
}
