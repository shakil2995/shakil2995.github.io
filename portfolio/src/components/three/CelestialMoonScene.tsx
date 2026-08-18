import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Generates an aesthetic, stylized celestial lunar texture
 * designed specifically for a futuristic, dark-mode portfolio.
 * Silky pearlescent tones, glowing lunar maria, and neon crater rims.
 */
function createAestheticMoonTexture(): THREE.CanvasTexture {
  const width = 2048
  const height = 1024

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // 1. Base Pearlescent Cosmic Gradient (Silky Silver-White to Deep Indigo-Violet)
  const baseGrad = ctx.createLinearGradient(0, 0, width, height)
  baseGrad.addColorStop(0, '#ffffff')
  baseGrad.addColorStop(0.25, '#f1f5f9')
  baseGrad.addColorStop(0.55, '#cbd5e1')
  baseGrad.addColorStop(0.8, '#94a3b8')
  baseGrad.addColorStop(1, '#64748b')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Seeded helper for deterministic aesthetic layout
  let seed = 123
  function rand() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  // 2. Soft, Stylized Luminous Maria Basins (Cosmic Blue/Violet tints)
  for (let i = 0; i < 10; i++) {
    const cx = (rand() * 0.8 + 0.1) * width
    const cy = (rand() * 0.7 + 0.15) * height
    const r = 120 + rand() * 220

    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    rg.addColorStop(0, 'rgba(99, 102, 241, 0.22)')   // Soft Indigo
    rg.addColorStop(0.5, 'rgba(56, 189, 248, 0.14)') // Electric Cyan
    rg.addColorStop(1, 'transparent')

    ctx.fillStyle = rg
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 3. Stylized Elegant Craters (Spherical-mapped, soft glass-like depth + glowing neon rims)
  interface AestheticCrater {
    u: number
    v: number
    r: number
    depth: number
    accent: string
  }

  const craters: AestheticCrater[] = []

  // Main featured craters
  for (let i = 0; i < 38; i++) {
    craters.push({
      u: rand(),
      v: rand() * 0.8 + 0.1,
      r: 16 + rand() * 45,
      depth: 0.18 + rand() * 0.25,
      accent: rand() > 0.5 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(168, 85, 247, 0.4)',
    })
  }

  // Smaller micro-craters
  for (let i = 0; i < 90; i++) {
    craters.push({
      u: rand(),
      v: rand() * 0.9 + 0.05,
      r: 6 + rand() * 14,
      depth: 0.12 + rand() * 0.18,
      accent: 'rgba(255, 255, 255, 0.35)',
    })
  }

  craters.forEach((cr) => {
    const cx = cr.u * width
    const cy = cr.v * height

    // Soft inner depression gradient
    const craterGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr.r)
    craterGrad.addColorStop(0, `rgba(30, 41, 59, ${cr.depth * 1.2})`)
    craterGrad.addColorStop(0.7, `rgba(51, 65, 85, ${cr.depth * 0.6})`)
    craterGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.1)')
    craterGrad.addColorStop(1, 'transparent')

    ctx.fillStyle = craterGrad
    ctx.beginPath()
    ctx.arc(cx, cy, cr.r, 0, Math.PI * 2)
    ctx.fill()

    // Glowing crescent rim highlight (simulating aesthetic top-right light catch)
    ctx.strokeStyle = cr.accent
    ctx.lineWidth = Math.max(cr.r * 0.08, 1.2)
    ctx.beginPath()
    ctx.arc(cx - cr.r * 0.1, cy - cr.r * 0.1, cr.r * 0.96, Math.PI * 0.7, Math.PI * 1.8)
    ctx.stroke()
  })

  // 4. Subtle Luminous Ethereal Shimmer Wave
  const waveGrad = ctx.createLinearGradient(0, 0, width, height)
  waveGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)')
  waveGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)')
  waveGrad.addColorStop(1, 'rgba(236, 72, 153, 0.05)')
  ctx.fillStyle = waveGrad
  ctx.fillRect(0, 0, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 16
  return texture
}

/** Ethereal orbital star particles surrounding the moon */
function AestheticStarDust({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const cyan = new THREE.Color('#38bdf8')
    const violet = new THREE.Color('#c084fc')
    const white = new THREE.Color('#ffffff')
    const tmp = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.15
      const radius = 1.35 + Math.random() * 0.95
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * (radius * 0.45) + (Math.random() - 0.5) * 0.35
      const z = Math.sin(angle) * (radius * 0.85)

      positions.set([x, y, z], i * 3)

      const rand = Math.random()
      if (rand < 0.45) tmp.copy(cyan)
      else if (rand < 0.8) tmp.copy(violet)
      else tmp.copy(white)

      colors.set([tmp.r, tmp.g, tmp.b], i * 3)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { geometry: g }
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.22
      pointsRef.current.rotation.x += delta * 0.08
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.034}
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

/** The Aesthetic Stylized 3D Moon */
function StylizedMoon({ isMobile }: { isMobile: boolean }) {
  const moonMeshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const scrollProgressRef = useRef(0)

  const moonTexture = useMemo(() => createAestheticMoonTexture(), [])

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

  // Position waypoints across the sections
  const waypoints = useMemo(() => {
    if (isMobile) {
      return [
        { p: 0.0, x: 0.92, y: 1.65, z: -1.0, s: 0.62 },  // Corner sky placement in Hero
        { p: 0.2, x: -0.92, y: 0.65, z: -0.9, s: 0.58 },
        { p: 0.45, x: 0.92, y: 0.35, z: -0.9, s: 0.58 },
        { p: 0.68, x: -0.92, y: 0.05, z: -0.9, s: 0.62 },
        { p: 0.85, x: 0.92, y: -0.1, z: -0.9, s: 0.58 },
        { p: 1.0, x: 0.0, y: 1.65, z: -0.9, s: 0.72 },
      ]
    }
    return [
      { p: 0.0, x: 2.35, y: 0.15, z: 0.0, s: 1.3 },
      { p: 0.2, x: -2.35, y: 0.35, z: 0.2, s: 1.12 },
      { p: 0.45, x: 2.4, y: 0.2, z: 0.1, s: 1.08 },
      { p: 0.68, x: -2.35, y: -0.1, z: 0.3, s: 1.18 },
      { p: 0.85, x: 2.35, y: 0.05, z: 0.2, s: 1.08 },
      { p: 1.0, x: 0.0, y: 1.45, z: -0.2, s: 1.35 },
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
    const last = waypoints[waypoints.length - 1]
    return { x: last.x, y: last.y, z: last.z, s: last.s }
  }

  useFrame((state, delta) => {
    const target = getTargetTransform(scrollProgressRef.current)

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        target.x + state.pointer.x * 0.15,
        4,
        delta
      )
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        target.y + state.pointer.y * 0.15,
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
      // Gentle cinematic axial rotation
      moonMeshRef.current.rotation.y += delta * 0.05 + scrollProgressRef.current * 0.015
      moonMeshRef.current.rotation.x = 0.08
    }
  })

  return (
    <group ref={groupRef} position={[waypoints[0].x, waypoints[0].y, waypoints[0].z]}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.4}>
        {/* Soft, glowing Cyan Atmospheric Halo */}
        <mesh scale={1.16}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Outer Radiant Violet Atmospheric Halo */}
        <mesh scale={1.32}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Stylized Luminous 3D Moon Sphere */}
        <mesh ref={moonMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={moonTexture}
            bumpMap={moonTexture}
            bumpScale={0.035}
            roughness={0.45}
            metalness={0.05}
            emissive="#1e1b4b"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Orbiting Stardust Particles */}
        <AestheticStarDust count={isMobile ? 40 : 85} />
      </Float>
    </group>
  )
}

export default function CelestialMoonScene({ isMobile }: { isMobile: boolean }) {
  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 5.5], fov: isMobile ? 54 : 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Soft Ethereal Ambient Glow */}
      <ambientLight intensity={0.65} color="#e0e7ff" />

      {/* Main Stylized Light Source */}
      <directionalLight position={[6, 4, 5]} intensity={2.8} color="#ffffff" />

      {/* Cyan & Violet Atmospheric Rim Lights */}
      <pointLight position={[-6, -4, -3]} intensity={26} color="#38bdf8" distance={22} />
      <pointLight position={[3, -5, 2]} intensity={20} color="#a855f7" distance={20} />

      {/* Background Starfield */}
      <Stars
        radius={75}
        depth={45}
        count={isMobile ? 700 : 1600}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      <StylizedMoon isMobile={isMobile} />
    </Canvas>
  )
}
