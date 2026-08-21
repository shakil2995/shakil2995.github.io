import { AnimatePresence, motion } from 'framer-motion'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export default function MeteorCountdown({ count }: { count: number | null }) {
  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[85] flex flex-col items-center justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(245,158,11,0.10)_100%)]" />

          <motion.p
            className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/90 drop-shadow-[0_0_18px_rgba(245,158,11,0.45)] sm:text-sm"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            ☄ Meteor storm incoming
          </motion.p>

          <div className="relative grid h-28 w-28 place-items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                className="font-[var(--font-display)] text-7xl font-bold text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.65)]"
                initial={{ scale: 1.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                {count > 0 ? count : '☄'}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
