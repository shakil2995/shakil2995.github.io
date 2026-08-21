import { useRef, type ReactNode } from 'react'
import { usePointerFine } from '../../hooks/usePointerFine'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

const MAX_TILT = 4.5

export default function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const frame = useRef(0)
  const enabled = fine && !reduced

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!enabled || !el) return
    const r = el.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    el.style.setProperty('--mx', `${px}px`)
    el.style.setProperty('--my', `${py}px`)

    const rx = ((py / r.height) - 0.5) * -2 * MAX_TILT
    const ry = ((px / r.width) - 0.5) * 2 * MAX_TILT
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(frame.current)
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`spotlight-card ${className}`}>
      {children}
    </div>
  )
}
