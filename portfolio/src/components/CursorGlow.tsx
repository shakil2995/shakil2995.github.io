import { useEffect, useRef } from 'react'
import { usePointerFine } from '../hooks/usePointerFine'

const SIZE = 220
const HALF = SIZE / 2

/** A soft light that eases toward the cursor and gently lifts whatever it
 *  passes over. Desktop + motion-allowed only. */
export default function CursorGlow() {
  const fine = usePointerFine()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine) return
    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const loop = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      if (ref.current) ref.current.style.transform = `translate(${x - HALF}px, ${y - HALF}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [fine])

  if (!fine) return null
  return <div ref={ref} aria-hidden className="cursor-glow" style={{ width: SIZE, height: SIZE }} />
}
