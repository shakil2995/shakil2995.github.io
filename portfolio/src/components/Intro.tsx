import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/portfolio'

const EASE_PART = [0.76, 0, 0.24, 1] as const
const EASE_OUT = [0.22, 1, 0.36, 1] as const

const HOLD = 0.95
const PART_AT = 1.05
const PART_DURATION = 0.7

export default function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(onDone, (PART_AT + PART_DURATION) * 1000)
    return () => clearTimeout(t)
  }, [onDone])

  const letters = Array.from(profile.name)

  return (
    <motion.div aria-hidden className="fixed inset-0 z-[90]">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#05060c]"
        exit={{ y: '-100%' }}
        transition={{ duration: PART_DURATION, ease: EASE_PART, delay: PART_AT }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#05060c]"
        exit={{ y: '100%' }}
        transition={{ duration: PART_DURATION, ease: EASE_PART, delay: PART_AT }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeIn', delay: HOLD - 0.22 }}
      >
        <motion.div
          className="relative h-20 w-20"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          <div className="absolute -inset-6 rounded-full bg-slate-300/10 blur-xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_0_60px_-10px_rgba(148,163,184,0.7),inset_-8px_-8px_24px_rgba(15,23,42,0.35)]" />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #05060c 58%, rgba(5,6,12,0.85) 66%, transparent 73%)',
            }}
            initial={{ x: '-85%' }}
            animate={{ x: '0%' }}
            transition={{ duration: HOLD + 0.4, ease: [0.45, 0, 0.55, 1] }}
          />
        </motion.div>

        <div className="flex overflow-hidden">
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.4em] text-slate-200"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12 + i * 0.03, duration: 0.4, ease: EASE_OUT }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </div>

        <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full w-full origin-left bg-gradient-to-r from-cyan-400 to-violet-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: HOLD, ease: 'easeInOut', delay: 0.08 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
