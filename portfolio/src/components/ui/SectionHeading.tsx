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
        <span className="font-[var(--font-mono)] text-xs tracking-widest text-[color:var(--color-faint)]">
          {index} —
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
        {kicker && (
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">{kicker}</p>
        )}
      </div>
    </Reveal>
  )
}
