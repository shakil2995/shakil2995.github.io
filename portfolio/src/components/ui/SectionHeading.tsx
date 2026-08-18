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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-[var(--font-mono)] text-xs font-semibold tracking-widest text-cyan-300 shadow-sm">
          {index} //
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
        {kicker && (
          <p className="mt-3 max-w-xl text-base text-slate-300 leading-relaxed sm:text-lg">{kicker}</p>
        )}
      </div>
    </Reveal>
  )
}
