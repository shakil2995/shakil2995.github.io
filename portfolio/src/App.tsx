import { lazy, Suspense } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import CommandPalette from './components/CommandPalette'
import SceneBoundary from './components/SceneBoundary'
import { useIsMobile, usePrefersReducedMotion } from './hooks/useMediaQuery'

const CelestialMoonScene = lazy(() => import('./components/three/CelestialMoonScene'))

/** Shown instead of the 3D scene under reduced motion, or if WebGL fails. */
const StaticStarfield = () => <div className="static-starfield" aria-hidden />

export default function App() {
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

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
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
          <SceneBoundary fallback={<StaticStarfield />}>
            <Suspense fallback={null}>
              <CelestialMoonScene isMobile={isMobile} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      <CursorGlow />
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </MotionConfig>
  )
}
