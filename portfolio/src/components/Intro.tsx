import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/portfolio'

const EASE_PART = [0.76, 0, 0.24, 1] as const
const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_WAX = [0.35, 0, 0.25, 1] as const

const WAX_DURATION = 1.35
const PART_AT = 1.35
const PART_DURATION = 0.55

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
      {/* Top Curtain */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#05060c]"
        exit={{ y: '-100%' }}
        transition={{ duration: PART_DURATION, ease: EASE_PART, delay: PART_AT }}
      />
      {/* Bottom Curtain */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#05060c]"
        exit={{ y: '100%' }}
        transition={{ duration: PART_DURATION, ease: EASE_PART, delay: PART_AT }}
      />

      {/* Central Content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-7"
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: 'easeIn', delay: PART_AT - 0.1 }}
      >
        {/* Waxing Moon: New Moon -> Full Moon */}
        <motion.div
          className="relative h-20 w-20"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {/* Full Moon Radiant Bloom (glows as moon becomes full) */}
          <motion.div
            className="absolute -inset-8 rounded-full bg-cyan-400/25 blur-2xl"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.25, 0.9], scale: [0.6, 0.95, 1.25] }}
            transition={{ duration: WAX_DURATION, ease: EASE_WAX }}
          />

          {/* New Moon Outer Faint Silhouette Rim */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/25 bg-[#090d1c] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]" />

          {/* Glowing Illuminated Full Moon Disc */}
          <div className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-br from-cyan-200 via-cyan-400 to-violet-600 shadow-[0_0_40px_rgba(34,211,238,0.5),inset_-4px_-4px_16px_rgba(15,23,42,0.4)]">
            {/* Waxing Shadow: Starts at 0% (New Moon) -> Slides off to -105% (Full Moon) */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, #05060c 62%, rgba(5,6,12,0.9) 70%, transparent 82%)',
              }}
              initial={{ x: '0%' }}
              animate={{ x: '-105%' }}
              transition={{ duration: WAX_DURATION, ease: EASE_WAX, delay: 0.05 }}
            />
          </div>

          {/* Subtle Outer Ring on Full Illumination */}
          <motion.div
            className="absolute -inset-1 rounded-full border border-cyan-300/40"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0, 0, 0.9], scale: [0.95, 1, 1.05] }}
            transition={{ duration: WAX_DURATION, ease: EASE_OUT }}
          />
        </motion.div>

        {/* Revealed Name Typography */}
        <div className="flex overflow-hidden">
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.42em] text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]"
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08 + i * 0.03, duration: 0.4, ease: EASE_OUT }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </div>

        {/* Illuminated Neon Energy Line */}
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
          <motion.div
            className="h-full w-full origin-left bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: WAX_DURATION, ease: [0.22, 1, 0.36, 1], delay: 0 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
