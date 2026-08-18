import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

/** Generates a procedural lunar surface texture with crater patterns */
function createMoonTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // Base lunar gradient
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, '#e2e8f0')
    grad.addColorStop(0.5, '#cbd5e1')
    grad.addColorStop(1, '#94a3b8')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    // Generate procedural lunar mares (dark plains)
    for (let i = 0; i < 18; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 60 + Math.random() * 140
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r)
      rg.addColorStop(0, 'rgba(71, 85, 105, 0.45)')
      rg.addColorStop(0.7, 'rgba(100, 116, 139, 0.2)')
      rg.addColorStop(1, 'transparent')
      ctx.fillStyle = rg
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Generate smaller craters
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 2 + Math.random() * 14
      ctx.fillStyle = 'rgba(51, 65, 85, 0.35)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()

      // Crater rim highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(x - 0.8, y - 0.8, r, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

/** Swarm of mini star particles that orbit the moon */
function MoonOrbitStars({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const cyan = new THREE.Color('#22d3ee')
    const violet = new THREE.Color('#a78bfa')
    const white = new THREE.Color('#ffffff')
    const tmp = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Elliptical orbit around the moon
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2
      const radius = 1.4 + Math.random() * 1.0
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * (radius * 0.55) + (Math.random() - 0.5) * 0.4
      const z = Math.sin(angle) * (radius * 0.8)

      positions.set([x, y, z], i * 3)

      const rand = Math.random()
      if (rand < 0.4) tmp.copy(cyan)
      else if (rand < 0.75) tmp.copy(violet)
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
      pointsRef.current.rotation.y += delta * 0.35
      pointsRef.current.rotation.x += delta * 0.12
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

/** 3D Celestial Moon with Atmospheric Rim Lighting and Scroll Trajectory */
function CelestialMoon({ isMobile }: { isMobile: boolean }) {
  const moonRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const scrollProgressRef = useRef(0)

  const moonTexture = useMemo(() => createMoonTexture(), [])

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

  // Waypoints along the scroll journey: [x, y, z, scale]
  // 0.00: Hero (Right side on desktop, top on mobile)
  // 0.20: About (Left side highlighting bio & stats)
  // 0.45: Skills (Right side illuminating stack)
  // 0.68: Projects (Left side next to featured cards)
  // 0.85: Timeline (Right side next to journey items)
  // 1.00: Contact (Centered beacon above contact)
  const waypoints = useMemo(() => {
    if (isMobile) {
      return [
        { p: 0.0, x: 0.0, y: 1.1, z: -0.8, s: 0.95 },
        { p: 0.2, x: -0.7, y: 0.6, z: -0.6, s: 0.85 },
        { p: 0.45, x: 0.7, y: 0.4, z: -0.6, s: 0.85 },
        { p: 0.68, x: -0.7, y: 0.1, z: -0.6, s: 0.9 },
        { p: 0.85, x: 0.7, y: 0.0, z: -0.6, s: 0.85 },
        { p: 1.0, x: 0.0, y: 1.2, z: -0.6, s: 1.05 },
      ]
    }
    return [
      { p: 0.0, x: 2.1, y: 0.2, z: 0.0, s: 1.3 },
      { p: 0.2, x: -2.3, y: 0.3, z: 0.2, s: 1.15 },
      { p: 0.45, x: 2.4, y: 0.2, z: 0.1, s: 1.1 },
      { p: 0.68, x: -2.3, y: -0.1, z: 0.3, s: 1.2 },
      { p: 0.85, x: 2.3, y: 0.1, z: 0.2, s: 1.1 },
      { p: 1.0, x: 0.0, y: 1.5, z: -0.2, s: 1.4 },
    ]
  }, [isMobile])

  // Interpolate position based on scrollProgress
  const getTargetTransform = (progress: number) => {
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i]
      const b = waypoints[i + 1]
      if (progress >= a.p && progress <= b.p) {
        const t = (progress - a.p) / (b.p - a.p)
        // Smooth easing (cosine)
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
      // Smooth damp to target position and scale
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

    if (moonRef.current) {
      // Slow continuous axial rotation + scroll speed spin
      moonRef.current.rotation.y += delta * 0.08 + scrollProgressRef.current * 0.02
      moonRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[waypoints[0].x, waypoints[0].y, waypoints[0].z]}>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Soft Glowing Atmospheric Shell (Cyan / Violet Rim Halo) */}
        <mesh scale={1.26}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh scale={1.42}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* The 3D Textured Moon Sphere */}
        <mesh ref={moonRef} castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={moonTexture}
            bumpMap={moonTexture}
            bumpScale={0.06}
            roughness={0.82}
            metalness={0.12}
            color="#f1f5f9"
            emissive="#1e1b4b"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Orbiting Star Particles */}
        <MoonOrbitStars count={isMobile ? 45 : 90} />
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
      <ambientLight intensity={0.55} color="#e0e7ff" />
      {/* Sunlight on the Moon */}
      <directionalLight position={[6, 4, 5]} intensity={3.2} color="#ffffff" />
      {/* Subtle Cyan/Violet Accent Rim Lights */}
      <pointLight position={[-6, -3, -2]} intensity={25} color="#22d3ee" distance={20} />
      <pointLight position={[0, -5, 3]} intensity={18} color="#8b5cf6" distance={20} />

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

      <CelestialMoon isMobile={isMobile} />
    </Canvas>
  )
}
