import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'

/** Floating button that appears past the first screen; ring shows scroll progress. */
export default function BackToTop() {
  const [show, setShow] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  const R = 20
  const C = 2 * Math.PI * R
  const dashoffset = useTransform(progress, (p) => C * (1 - p))

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="glass fixed bottom-6 left-6 z-40 grid h-12 w-12 place-items-center rounded-full text-[color:var(--color-ink)] shadow-lg"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <motion.circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="url(#btt-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              style={{ strokeDashoffset: dashoffset }}
            />
            <defs>
              <linearGradient id="btt-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
