import { useEffect, useRef } from 'react'
import { usePointerFine } from '../hooks/usePointerFine'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

const TRAIL_POINTS = 14

export default function MeteorCursor() {
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!fine || reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const pts: Array<{ x: number; y: number }> = []
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let hx = mx
    let hy = my
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const loop = () => {
      hx += (mx - hx) * 0.55
      hy += (my - hy) * 0.55
      pts.unshift({ x: hx, y: hy })
      if (pts.length > TRAIL_POINTS) pts.pop()

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'

      for (let i = pts.length - 1; i > 0; i--) {
        const t = 1 - i / pts.length
        const p = pts[i]
        const q = pts[i - 1]
        if (Math.abs(p.x - q.x) + Math.abs(p.y - q.y) < 0.3) continue

        let r: number, g: number, b: number
        if (t < 0.6) {
          const u = t / 0.6
          r = 139 + (103 - 139) * u
          g = 92 + (232 - 92) * u
          b = 246 + (249 - 246) * u
        } else {
          const u = (t - 0.6) / 0.4
          r = 103 + (255 - 103) * u
          g = 232 + (255 - 232) * u
          b = 249 + (255 - 249) * u
        }
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${(t * t * 0.8).toFixed(3)})`
        ctx.lineWidth = 0.5 + t * t * 3.2
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }

      const head = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9)
      head.addColorStop(0, 'rgba(255,255,255,0.95)')
      head.addColorStop(0.35, 'rgba(165,243,252,0.55)')
      head.addColorStop(1, 'rgba(103,232,249,0)')
      ctx.fillStyle = head
      ctx.beginPath()
      ctx.arc(hx, hy, 9, 0, Math.PI * 2)
      ctx.fill()

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null
  return <canvas ref={canvasRef} aria-hidden className="meteor-canvas" />
}
