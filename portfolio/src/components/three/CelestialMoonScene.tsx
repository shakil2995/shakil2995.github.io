import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

/** Section-based Dynamic Color Themes for Smart Atmospheric Shifting */
interface SectionTheme {
  p: number
  primary: THREE.Color   // Dominant rim & halo light
  secondary: THREE.Color // Ambient depth tint
  emissive: THREE.Color  // Subtle inner core glow
}

const SECTION_THEMES: SectionTheme[] = [
  // 0.00: Hero — Electric Cyan & Starlight Ice (AI & Fullstack)
  { p: 0.00, primary: new THREE.Color('#38bdf8'), secondary: new THREE.Color('#818cf8'), emissive: new THREE.Color('#0c192e') },
  // 0.20: About — Royal Violet & Indigo (Founder Story & Milestones)
  { p: 0.20, primary: new THREE.Color('#a855f7'), secondary: new THREE.Color('#6366f1'), emissive: new THREE.Color('#1e1035') },
  // 0.45: Skills — Neon Teal & Mint Green (Performance & Tech Matrix)
  { p: 0.45, primary: new THREE.Color('#2dd4bf'), secondary: new THREE.Color('#06b6d4'), emissive: new THREE.Color('#062420') },
  // 0.68: Projects — Radiant Magenta & Electric Violet (Zinodesk & ATI EMR)
  { p: 0.68, primary: new THREE.Color('#ec4899'), secondary: new THREE.Color('#a855f7'), emissive: new THREE.Color('#290c2b') },
  // 0.85: Timeline — Cyber Amber & Warm Gold (7+ Years Track Record)
  { p: 0.85, primary: new THREE.Color('#f59e0b'), secondary: new THREE.Color('#fb923c'), emissive: new THREE.Color('#261706') },
  // 1.00: Contact — Electric Cyan & Ultra Violet Beacon (Uplink & Reach Out)
  { p: 1.00, primary: new THREE.Color('#06b6d4'), secondary: new THREE.Color('#c084fc'), emissive: new THREE.Color('#0d182b') },
]

/** Interpolate between two theme colors based on scroll progress */
function getInterpolatedTheme(progress: number, curPrim: THREE.Color, curSec: THREE.Color, curEmis: THREE.Color) {
  for (let i = 0; i < SECTION_THEMES.length - 1; i++) {
    const a = SECTION_THEMES[i]
    const b = SECTION_THEMES[i + 1]
    if (progress >= a.p && progress <= b.p) {
      const t = (progress - a.p) / (b.p - a.p)
      const ease = 0.5 - Math.cos(t * Math.PI) * 0.5
      curPrim.copy(a.primary).lerp(b.primary, ease)
      curSec.copy(a.secondary).lerp(b.secondary, ease)
      curEmis.copy(a.emissive).lerp(b.emissive, ease)
      return
    }
  }
  const last = SECTION_THEMES[SECTION_THEMES.length - 1]
  curPrim.copy(last.primary)
  curSec.copy(last.secondary)
  curEmis.copy(last.emissive)
}

/** Generates clean, aesthetic pearlescent lunar texture with soft glowing maria */
function createSmartAestheticMoonTexture(): THREE.CanvasTexture {
  const width = 2048
  const height = 1024

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Pearlescent silver-white gradient base
  const baseGrad = ctx.createLinearGradient(0, 0, width, height)
  baseGrad.addColorStop(0, '#ffffff')
  baseGrad.addColorStop(0.3, '#f8fafc')
  baseGrad.addColorStop(0.65, '#e2e8f0')
  baseGrad.addColorStop(1, '#94a3b8')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  let seed = 99
  function rand() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  // Soft lunar maria basins (semi-transparent for dynamic light transmission)
  for (let i = 0; i < 12; i++) {
    const cx = (rand() * 0.8 + 0.1) * width
    const cy = (rand() * 0.7 + 0.15) * height
    const r = 100 + rand() * 200

    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    rg.addColorStop(0, 'rgba(71, 85, 105, 0.28)')
    rg.addColorStop(0.6, 'rgba(100, 116, 139, 0.14)')
    rg.addColorStop(1, 'transparent')

    ctx.fillStyle = rg
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Stylized crater rings with soft highlights
  for (let i = 0; i < 45; i++) {
    const cx = rand() * width
    const cy = (rand() * 0.8 + 0.1) * height
    const r = 12 + rand() * 38

    const craterGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    craterGrad.addColorStop(0, 'rgba(30, 41, 59, 0.35)')
    craterGrad.addColorStop(0.7, 'rgba(71, 85, 105, 0.18)')
    craterGrad.addColorStop(1, 'transparent')

    ctx.fillStyle = craterGrad
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()

    // Luminous crater edge highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = Math.max(r * 0.08, 1.4)
    ctx.beginPath()
    ctx.arc(cx - r * 0.12, cy - r * 0.12, r * 0.94, Math.PI * 0.65, Math.PI * 1.85)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 16
  return texture
}

/** Swirling Orbital Star Particles that dynamically shift colors with the theme */
function DynamicOrbitStars({ count, primaryColor, secondaryColor }: { count: number; primaryColor: THREE.Color; secondaryColor: THREE.Color }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.15
      const radius = 1.35 + Math.random() * 0.95
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * (radius * 0.45) + (Math.random() - 0.5) * 0.35
      const z = Math.sin(angle) * (radius * 0.85)

      positions.set([x, y, z], i * 3)
      colors.set([1, 1, 1], i * 3)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { geometry: g }
  }, [count])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.22
      pointsRef.current.rotation.x += delta * 0.08

      // Update particle colors based on current theme
      const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute
      const tmp = new THREE.Color()
      for (let i = 0; i < count; i++) {
        const mix = (Math.sin(state.clock.elapsedTime * 2 + i * 0.1) + 1) * 0.5
        tmp.copy(primaryColor).lerp(secondaryColor, mix)
        colAttr.setXYZ(i, tmp.r, tmp.g, tmp.b)
      }
      colAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** The Smart Dynamic 3D Celestial Moon Guide */
function SmartCelestialMoon({
  isMobile,
  primaryColor,
  secondaryColor,
  emissiveColor,
}: {
  isMobile: boolean
  primaryColor: THREE.Color
  secondaryColor: THREE.Color
  emissiveColor: THREE.Color
}) {
  const groupRef = useRef<THREE.Group>(null)
  const moonMeshRef = useRef<THREE.Mesh>(null)
  const scrollProgressRef = useRef(0)

  const moonTexture = useMemo(() => createSmartAestheticMoonTexture(), [])

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        scrollProgressRef.current = Math.min(Math.max(window.scrollY / totalScroll, 0), 1)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic Section-Aware Sizing & Positioning based on content density and empty negative space
  const waypoints = useMemo(() => {
    if (isMobile) {
      return [
        { p: 0.0, x: 0.92, y: 1.6, z: -1.0, s: 0.95 },  // Hero: Corner sky accent
        { p: 0.2, x: -0.92, y: 0.65, z: -0.9, s: 0.75 }, // About: Compact margin
        { p: 0.45, x: 0.92, y: 0.35, z: -0.9, s: 0.7 },  // Skills: Compact margin
        { p: 0.68, x: -0.92, y: 0.05, z: -0.9, s: 0.8 },  // Projects: Medium margin
        { p: 0.85, x: 0.92, y: -0.1, z: -0.9, s: 0.75 }, // Timeline: Compact margin
        { p: 1.0, x: 0.0, y: 1.65, z: -0.9, s: 1.1 },   // Contact: Beacon overhead
      ]
    }
    return [
      { p: 0.0, x: 2.32, y: 0.15, z: 0.0, s: 1.55 },   // Hero: Perfectly balanced celestial presence
      { p: 0.2, x: -2.35, y: 0.35, z: 0.2, s: 1.25 }, // About: Compact margin, full room for stats
      { p: 0.45, x: 2.4, y: 0.2, z: 0.1, s: 1.2 },    // Skills: Tucked in right margin
      { p: 0.68, x: -2.35, y: -0.1, z: 0.3, s: 1.35 }, // Projects: Alongside project cards
      { p: 0.85, x: 2.35, y: 0.05, z: 0.2, s: 1.25 },  // Timeline: Balances timeline tree
      { p: 1.0, x: 0.0, y: 1.45, z: -0.2, s: 1.65 },   // Contact: Crown above contact portal
    ]
  }, [isMobile])

  const getTargetTransform = (progress: number) => {
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i]
      const b = waypoints[i + 1]
      if (progress >= a.p && progress <= b.p) {
        const t = (progress - a.p) / (b.p - a.p)
        const ease = 0.5 - Math.cos(t * Math.PI) * 0.5
        return {
          x: a.x + (b.x - a.x) * ease,
          y: a.y + (b.y - a.y) * ease,
          z: a.z + (b.z - a.z) * ease,
          s: a.s + (b.s - a.s) * ease,
        }
      }
    }
    return waypoints[waypoints.length - 1]
  }

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current
    const target = getTargetTransform(progress)

    // Update dynamic theme colors smoothly
    getInterpolatedTheme(progress, primaryColor, secondaryColor, emissiveColor)

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        target.x + state.pointer.x * 0.12,
        4,
        delta
      )
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        target.y + state.pointer.y * 0.12,
        4,
        delta
      )
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        target.z,
        4,
        delta
      )

      const curScale = THREE.MathUtils.damp(groupRef.current.scale.x, target.s, 4, delta)
      groupRef.current.scale.set(curScale, curScale, curScale)
    }

    if (moonMeshRef.current) {
      moonMeshRef.current.rotation.y += delta * 0.05 + progress * 0.015
      moonMeshRef.current.rotation.x = 0.08

      // Update material emissive color dynamically
      const mat = moonMeshRef.current.material as THREE.MeshStandardMaterial
      if (mat) {
        mat.emissive.lerp(emissiveColor, delta * 3)
      }
    }
  })

  return (
    <group ref={groupRef} position={[waypoints[0].x, waypoints[0].y, waypoints[0].z]}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.4}>
        {/* The 3D Aesthetic Moon Sphere */}
        <mesh ref={moonMeshRef}>
          <sphereGeometry args={[1, 36, 36]} />
          <meshStandardMaterial
            map={moonTexture}
            bumpMap={moonTexture}
            bumpScale={0.035}
            roughness={0.44}
            metalness={0.06}
            emissive="#0a162b"
            emissiveIntensity={isMobile ? 0.42 : 0.33}
          />
        </mesh>

        {/* Dynamic Color Shifting Star Dust */}
        <DynamicOrbitStars count={isMobile ? 20 : 35} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Float>
    </group>
  )
}

function DynamicSceneLighting({
  primaryColor,
  isMobile,
}: {
  primaryColor: THREE.Color
  isMobile: boolean
}) {
  const fillLightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((_, delta) => {
    if (fillLightRef.current) {
      fillLightRef.current.color.lerp(primaryColor, delta * 3)
    }
  })

  return (
    <>
      <ambientLight intensity={isMobile ? 0.86 : 0.73} color="#e0e7ff" />
      <directionalLight position={[5, 4, 4]} intensity={isMobile ? 3.3 : 2.8} color="#ffffff" />
      <directionalLight ref={fillLightRef} position={[-4, -3, 2]} intensity={isMobile ? 1.32 : 1.1} color="#38bdf8" />
    </>
  )
}

export default function CelestialMoonScene({ isMobile }: { isMobile: boolean }) {
  const primaryColor = useMemo(() => new THREE.Color('#38bdf8'), [])
  const secondaryColor = useMemo(() => new THREE.Color('#818cf8'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#0c192e'), [])

  return (
    <Canvas
      dpr={[1, isMobile ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 5.5], fov: isMobile ? 54 : 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <DynamicSceneLighting primaryColor={primaryColor} isMobile={isMobile} />

      {/* Background Starfield */}
      <Stars
        radius={75}
        depth={45}
        count={isMobile ? 350 : 750}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      <SmartCelestialMoon
        isMobile={isMobile}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        emissiveColor={emissiveColor}
      />
    </Canvas>
  )
}
