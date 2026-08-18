import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Generates an ultra-realistic, highly detailed 2048x1024 Lunar Surface Texture
 * using 6-octave Fractal Brownian Motion (fBm), Voronoi impact crater networks,
 * and ray systems for 100% natural rugged lunar regolith.
 */
function createUltraRealisticMoonMaps(): { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const width = 2048
  const height = 1024

  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const colorCtx = colorCanvas.getContext('2d')!

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bumpCtx = bumpCanvas.getContext('2d')!

  const colorImg = colorCtx.createImageData(width, height)
  const bumpImg = bumpCtx.createImageData(width, height)
  const cData = colorImg.data
  const bData = bumpImg.data

  // Seeded hash helper for deterministic natural randomness
  function hash(x: number, y: number, z: number) {
    let p = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123
    return p - Math.floor(p)
  }

  // 3D Value Noise for smooth fractal basis
  function smoothNoise3D(x: number, y: number, z: number) {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const iz = Math.floor(z)
    const fx = x - ix
    const fy = y - iy
    const fz = z - iz

    // Quintic smoothstep
    const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10)
    const uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10)
    const uz = fz * fz * fz * (fz * (fz * 6 - 15) + 10)

    const n000 = hash(ix, iy, iz)
    const n100 = hash(ix + 1, iy, iz)
    const n010 = hash(ix, iy + 1, iz)
    const n110 = hash(ix + 1, iy + 1, iz)
    const n001 = hash(ix, iy, iz + 1)
    const n101 = hash(ix + 1, iy, iz + 1)
    const n011 = hash(ix, iy + 1, iz + 1)
    const n111 = hash(ix + 1, iy + 1, iz + 1)

    const nx00 = n000 + ux * (n100 - n000)
    const nx10 = n010 + ux * (n110 - n010)
    const nx01 = n001 + ux * (n101 - n001)
    const nx11 = n011 + ux * (n111 - n011)

    const nxy0 = nx00 + uy * (nx10 - nx00)
    const nxy1 = nx01 + uy * (nx11 - nx01)

    return nxy0 + uz * (nxy1 - nxy0)
  }

  // 6-Octave Fractal Brownian Motion (fBm) for realistic rocky terrain
  function fbm3D(x: number, y: number, z: number): number {
    let total = 0
    let amp = 0.5
    let freq = 2.0
    for (let o = 0; o < 6; o++) {
      total += smoothNoise3D(x * freq, y * freq, z * freq) * amp
      freq *= 2.1
      amp *= 0.48
    }
    return total
  }

  // Generate Major Lunar Mare Basins & Craters with Ray Systems
  interface CraterCenter {
    x: number
    y: number
    z: number
    r: number
    depth: number
    isMare: boolean
    hasRays: boolean
  }

  const craters: CraterCenter[] = []
  let seed = 77
  function rand() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  // 1. Dark Basaltic Maria (Oceanus Procellarum, Mare Imbrium, Mare Serenitatis, etc.)
  for (let i = 0; i < 12; i++) {
    const theta = rand() * Math.PI * 2
    const phi = (rand() - 0.5) * Math.PI * 0.75
    craters.push({
      x: Math.cos(phi) * Math.cos(theta),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.sin(theta),
      r: 0.32 + rand() * 0.42,
      depth: 0.45 + rand() * 0.3,
      isMare: true,
      hasRays: false,
    })
  }

  // 2. Large Named Impact Craters with Ray Systems (Tycho, Copernicus, Aristarchus)
  for (let i = 0; i < 6; i++) {
    const theta = rand() * Math.PI * 2
    const phi = (rand() - 0.5) * Math.PI * 0.85
    craters.push({
      x: Math.cos(phi) * Math.cos(theta),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.sin(theta),
      r: 0.12 + rand() * 0.16,
      depth: 0.8 + rand() * 0.4,
      isMare: false,
      hasRays: true,
    })
  }

  // 3. Medium & Small Impact Craters across the entire globe (no smooth zones)
  for (let i = 0; i < 260; i++) {
    const theta = rand() * Math.PI * 2
    const phi = (rand() - 0.5) * Math.PI * 0.96
    craters.push({
      x: Math.cos(phi) * Math.cos(theta),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.sin(theta),
      r: 0.02 + rand() * 0.08,
      depth: 0.35 + rand() * 0.6,
      isMare: false,
      hasRays: false,
    })
  }

  // Compute lunar surface map in spherical coordinate space
  for (let py = 0; py < height; py++) {
    const v = py / height
    const phi = (0.5 - v) * Math.PI
    const cosPhi = Math.cos(phi)
    const sinPhi = Math.sin(phi)

    for (let px = 0; px < width; px++) {
      const u = px / width
      const theta = u * Math.PI * 2 - Math.PI
      const sx = cosPhi * Math.cos(theta)
      const sy = sinPhi
      const sz = cosPhi * Math.sin(theta)

      // 6-octave rugged bedrock noise
      const terrainFbm = fbm3D(sx * 3.5, sy * 3.5, sz * 3.5)
      // Micro-craterlet high-frequency grain
      const microGrain = fbm3D(sx * 24.0, sy * 24.0, sz * 24.0) * 0.16

      let mareDarkness = 0
      let craterDisplacement = 0
      let rayBrightness = 0

      for (let c = 0; c < craters.length; c++) {
        const cr = craters[c]
        const dx = sx - cr.x
        const dy = sy - cr.y
        const dz = sz - cr.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < cr.r) {
          const nd = dist / cr.r
          if (cr.isMare) {
            // Basaltic plain
            const mareCurve = Math.cos(nd * (Math.PI / 2))
            mareDarkness = Math.max(mareDarkness, mareCurve * cr.depth)
          } else {
            // Realistic crater bowl + sharp rim
            if (nd > 0.7) {
              // Raised crater rim
              const rim = Math.sin((nd - 0.7) / 0.3 * Math.PI)
              craterDisplacement += rim * cr.depth * 0.42
            } else {
              // Deep bowl with central peak
              const bowl = Math.cos(nd / 0.7 * (Math.PI / 2))
              const centralPeak = nd < 0.2 ? (1 - nd / 0.2) * 0.25 : 0
              craterDisplacement -= bowl * cr.depth * 0.55 - centralPeak
            }
          }
        }

        // Ray systems extending from prominent craters (like Tycho)
        if (cr.hasRays && dist > cr.r * 0.8 && dist < cr.r * 5.0) {
          const angle = Math.atan2(dy, dx)
          const rayNoise = Math.sin(angle * 16.0 + dz * 12.0) * 0.5 + 0.5
          if (rayNoise > 0.6) {
            const rayFade = 1.0 - (dist - cr.r * 0.8) / (cr.r * 4.2)
            rayBrightness = Math.max(rayBrightness, (rayNoise - 0.6) * 2.5 * rayFade * 0.45)
          }
        }
      }

      // Natural lunar albedo calculation (highlands: ~190-220, maria: ~70-110)
      let albedo = 178 + terrainFbm * 45 + microGrain * 40 - mareDarkness * 105 + craterDisplacement * 65 + rayBrightness * 70
      albedo = Math.min(Math.max(albedo, 55), 250)

      // Bump/displacement map for physical crater relief
      let bump = 128 + terrainFbm * 38 + microGrain * 45 + craterDisplacement * 115 - mareDarkness * 25
      bump = Math.min(Math.max(bump, 5), 252)

      const idx = (py * width + px) * 4

      // Realistic Lunar dust tone: subtle warm/silver contrast
      cData[idx] = Math.round(albedo * 0.95)     // R
      cData[idx + 1] = Math.round(albedo * 0.97) // G
      cData[idx + 2] = Math.round(albedo * 1.02) // B
      cData[idx + 3] = 255

      bData[idx] = Math.round(bump)
      bData[idx + 1] = Math.round(bump)
      bData[idx + 2] = Math.round(bump)
      bData[idx + 3] = 255
    }
  }

  colorCtx.putImageData(colorImg, 0, 0)
  bumpCtx.putImageData(bumpImg, 0, 0)

  const colorTexture = new THREE.CanvasTexture(colorCanvas)
  colorTexture.wrapS = THREE.RepeatWrapping
  colorTexture.wrapT = THREE.ClampToEdgeWrapping
  colorTexture.anisotropy = 16

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
  bumpTexture.wrapS = THREE.RepeatWrapping
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping
  bumpTexture.anisotropy = 16

  return { colorMap: colorTexture, bumpMap: bumpTexture }
}

/** Shimmering orbital star dust particles */
function OrbitingStarDust({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const cyan = new THREE.Color('#38bdf8')
    const violet = new THREE.Color('#a855f7')
    const white = new THREE.Color('#ffffff')
    const tmp = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.15
      const radius = 1.35 + Math.random() * 0.9
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * (radius * 0.45) + (Math.random() - 0.5) * 0.3
      const z = Math.sin(angle) * (radius * 0.85)

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
      pointsRef.current.rotation.y += delta * 0.2
      pointsRef.current.rotation.x += delta * 0.08
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** The 100% Realistic 3D Moon with Rugged Lunar Regolith & Relief Shadows */
function RealisticMoon({ isMobile }: { isMobile: boolean }) {
  const moonMeshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const scrollProgressRef = useRef(0)

  const { colorMap, bumpMap } = useMemo(() => createUltraRealisticMoonMaps(), [])

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

  // Refined waypoints across sections
  const waypoints = useMemo(() => {
    if (isMobile) {
      return [
        { p: 0.0, x: 0.0, y: 1.15, z: -0.75, s: 0.9 },
        { p: 0.2, x: -0.75, y: 0.65, z: -0.6, s: 0.8 },
        { p: 0.45, x: 0.75, y: 0.35, z: -0.6, s: 0.8 },
        { p: 0.68, x: -0.75, y: 0.05, z: -0.6, s: 0.85 },
        { p: 0.85, x: 0.75, y: -0.1, z: -0.6, s: 0.8 },
        { p: 1.0, x: 0.0, y: 1.25, z: -0.6, s: 1.0 },
      ]
    }
    return [
      { p: 0.0, x: 2.35, y: 0.15, z: 0.0, s: 1.28 },
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
      // Natural axial rotation
      moonMeshRef.current.rotation.y += delta * 0.04 + scrollProgressRef.current * 0.015
      moonMeshRef.current.rotation.x = 0.1
    }
  })

  return (
    <group ref={groupRef} position={[waypoints[0].x, waypoints[0].y, waypoints[0].z]}>
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
        {/* Soft, ethereal cyan atmospheric glow ring */}
        <mesh scale={1.12}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh scale={1.25}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.03}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 100% Rugged, Photorealistic 3D Moon Sphere */}
        <mesh ref={moonMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[1, 128, 128]} />
          <meshStandardMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={0.16}
            roughness={0.96}
            metalness={0.01}
            emissive="#080c14"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Orbiting Stardust Particles */}
        <OrbitingStarDust count={isMobile ? 40 : 85} />
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
      {/* Soft space earthshine */}
      <ambientLight intensity={0.35} color="#c7d2fe" />

      {/* Harsh parallel sunlight casting deep lunar relief shadows */}
      <directionalLight position={[6, 3.2, 4.8]} intensity={4.0} color="#ffffff" />

      {/* Subtle deep-space rim accents */}
      <pointLight position={[-6, -4, -3]} intensity={18} color="#38bdf8" distance={22} />
      <pointLight position={[2, -5, 2]} intensity={14} color="#818cf8" distance={20} />

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

      <RealisticMoon isMobile={isMobile} />
    </Canvas>
  )
}
