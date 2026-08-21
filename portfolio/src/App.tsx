import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import MeteorCursor from './components/MeteorCursor'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import CommandPalette from './components/CommandPalette'
import SceneBoundary from './components/SceneBoundary'
import Intro from './components/Intro'
import MeteorCountdown from './components/MeteorCountdown'
import { useIsMobile, usePrefersReducedMotion } from './hooks/useMediaQuery'

const CelestialMoonScene = lazy(() => import('./components/three/CelestialMoonScene'))

/** Shown instead of the 3D scene under reduced motion, or if WebGL fails. */
const StaticStarfield = () => <div className="static-starfield" aria-hidden />

function useMeteorHotkey(onSummon: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'm' && e.key !== 'M') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      onSummon()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSummon])
}

export default function App() {
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const [introDone, setIntroDone] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const dismissIntro = useCallback(() => setIntroDone(true), [])

  const summonStorm = useCallback(() => {
    setCountdown((c) => (c === null ? 3 : c))
  }, [])

  useMeteorHotkey(summonStorm)

  useEffect(() => {
    const onSummon = () => summonStorm()
    window.addEventListener('shakil:meteor-summon', onSummon)
    return () => window.removeEventListener('shakil:meteor-summon', onSummon)
  }, [summonStorm])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      window.dispatchEvent(new CustomEvent('shakil:meteor-storm'))
      setCountdown(null)
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  return (
    /* `reducedMotion="user"` makes every framer animation in the tree respect
       the OS setting — previously only the 3D layer did. */
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* 3D Celestial Moon Guide — moves smoothly from component to component with scroll */}
      {reduced ? (
        <StaticStarfield />
      ) : (
        <div className="fixed inset-0 z-0 w-full h-full">
          <SceneBoundary fallback={<StaticStarfield />}>
            <Suspense fallback={null}>
              <CelestialMoonScene isMobile={isMobile} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      <CursorGlow />
      <MeteorCursor />
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero entranceDelay={!reduced && !introDone ? 1.05 : 0} />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <MeteorCountdown count={reduced ? null : countdown} />

      <AnimatePresence>
        {!reduced && !introDone && (
          <Intro key="intro" onDone={dismissIntro} />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
