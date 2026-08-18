import { usePrefersReducedMotion, useMediaQuery } from './useMediaQuery'

/**
 * True only on devices with a precise pointer (mouse/trackpad) where the user
 * hasn't asked to reduce motion — gate cursor effects on this.
 */
export function usePointerFine(): boolean {
  const fine = useMediaQuery('(pointer: fine)')
  const reduced = usePrefersReducedMotion()
  return fine && !reduced
}
