import { AnimatePresence, motion } from 'framer-motion'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export default function MeteorCountdown({ count }: { count: number | null }) {
  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative grid place-items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                className="font-[var(--font-display)] text-8xl font-black text-amber-300 drop-shadow-[0_0_45px_rgba(245,158,11,0.85),0_0_14px_rgba(245,158,11,1)] sm:text-9xl"
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
