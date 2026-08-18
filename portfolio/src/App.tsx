import { lazy, Suspense } from 'react'
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
import { useIsMobile, usePrefersReducedMotion } from './hooks/useMediaQuery'

const CelestialMoonScene = lazy(() => import('./components/three/CelestialMoonScene'))

export default function App() {
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  return (
    <>
      {/* 3D Celestial Moon Guide — moves smoothly from component to component with scroll */}
      {!reduced && (
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
          <Suspense fallback={null}>
            <CelestialMoonScene isMobile={isMobile} />
          </Suspense>
        </div>
      )}

      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
