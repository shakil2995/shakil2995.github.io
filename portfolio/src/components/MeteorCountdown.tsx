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

          {count > 0 ? (
            <>
              <motion.p
                className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/90 drop-shadow-[0_0_18px_rgba(245,158,11,0.45)] sm:text-sm"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                Meteor storm incoming
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
                    {count}
                  </motion.span>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.9),rgba(165,243,252,0.3)_38%,transparent_75%)]"
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
              <div className="absolute left-[calc(50%-5rem)] top-[calc(42%-5rem)] h-40 w-40">
                <motion.div
                  className="h-full w-full rounded-full border-2 border-cyan-200/70"
                  initial={{ scale: 0.15, opacity: 0.9 }}
                  animate={{ scale: 14, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
