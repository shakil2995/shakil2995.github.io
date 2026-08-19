/**
 * One shared scroll-progress source for the whole app.
 *
 * Reading `document.documentElement.scrollHeight` inside a scroll handler forces
 * a synchronous layout on every event. Previously two separate listeners did
 * exactly that, so each scroll event cost two forced reflows. Here the page
 * height is measured once and re-measured only on resize / DOM mutation, the
 * scroll listener does nothing but store `window.scrollY`, and the division
 * happens on read.
 *
 * Consumers read `getScrollProgress()` inside their own animation frame — no
 * React state, so scrolling never triggers a render.
 */

let scrollY = 0
let maxScroll = 1
let listeners = 0
let resizeObserver: ResizeObserver | null = null

function measure() {
  maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
}

function onScroll() {
  scrollY = window.scrollY
}

function start() {
  measure()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  // Section heights change as fonts load and images decode; keep the
  // denominator honest without polling.
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(document.documentElement)
}

function stop() {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
  resizeObserver?.disconnect()
  resizeObserver = null
}

/** Subscribe to the shared listeners. Returns an unsubscribe function. */
export function subscribeScroll(): () => void {
  if (listeners === 0) start()
  listeners++
  let released = false
  return () => {
    if (released) return
    released = true
    listeners--
    if (listeners === 0) stop()
  }
}

/** Current scroll position as 0..1. Cheap — no layout read. */
export function getScrollProgress(): number {
  const p = scrollY / maxScroll
  return p < 0 ? 0 : p > 1 ? 1 : p
}
