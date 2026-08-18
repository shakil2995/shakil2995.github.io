import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Generates a photorealistic 2048x1024 equirectangular Lunar map
 * using 3D spherical coordinate sampling to eliminate any pole/texture distortion.
 */
function createPhotorealisticMoonMaps(): { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
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

  // Seeded random helper
  let seed = 42
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  // Generate 48 realistic 3D lunar crater centers on the unit sphere
  interface LunarFeature {
    x: number
    y: number
    z: number
    radius: number
    depth: number
    isMare: boolean
  }

  const features: LunarFeature[] = []

  // Major lunar maria (dark volcanic plains like Mare Tranquillitatis, Oceanus Procellarum)
  for (let i = 0; i < 9; i++) {
    const theta = pseudoRandom() * Math.PI * 2
    const phi = (pseudoRandom() - 0.5) * Math.PI * 0.8
    features.push({
      x: Math.cos(phi) * Math.cos(theta),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.sin(theta),
      radius: 0.35 + pseudoRandom() * 0.45,
      depth: 0.35 + pseudoRandom() * 0.25,
      isMare: true,
    })
  }

  // Distinct impact craters (like Tycho, Copernicus, Kepler with bright ray systems)
  for (let i = 0; i < 90; i++) {
    const theta = pseudoRandom() * Math.PI * 2
    const phi = (pseudoRandom() - 0.5) * Math.PI * 0.95
    features.push({
      x: Math.cos(phi) * Math.cos(theta),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.sin(theta),
      radius: 0.03 + pseudoRandom() * 0.12,
      depth: 0.4 + pseudoRandom() * 0.5,
      isMare: false,
    })
  }

  // 3D Simplex-like noise approximation on sphere
  function noise3D(x: number, y: number, z: number) {
    const s = Math.sin(x * 12.0 + Math.cos(y * 14.0 + z * 8.0)) * 0.5 +
              Math.sin(y * 22.0 + Math.cos(z * 18.0 + x * 10.0)) * 0.25 +
              Math.sin(z * 45.0 + Math.cos(x * 35.0 + y * 35.0)) * 0.125
    return s * 0.5 + 0.5
  }

  // High-frequency regolith grain
  function grain3D(x: number, y: number, z: number) {
    return (Math.sin(x * 160 + y * 130 + z * 140) * 0.5 + 0.5) * 0.08
  }

  for (let py = 0; py < height; py++) {
    const v = py / height
    const phi = (0.5 - v) * Math.PI // from PI/2 to -PI/2
    const cosPhi = Math.cos(phi)
    const sinPhi = Math.sin(phi)

    for (let px = 0; px < width; px++) {
      const u = px / width
      const theta = u * Math.PI * 2 - Math.PI // from -PI to PI
      const sx = cosPhi * Math.cos(theta)
      const sy = sinPhi
      const sz = cosPhi * Math.sin(theta)

      const baseNoise = noise3D(sx, sy, sz)
      const fineGrain = grain3D(sx, sy, sz)

      let mareDarkness = 0
      let craterElevation = 0

      for (let f = 0; f < features.length; f++) {
        const feat = features[f]
        const dx = sx - feat.x
        const dy = sy - feat.y
        const dz = sz - feat.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < feat.radius) {
          const normDist = dist / feat.radius
          if (feat.isMare) {
            // Smooth dark basin
            const factor = Math.cos(normDist * (Math.PI / 2))
            mareDarkness = Math.max(mareDarkness, factor * feat.depth)
          } else {
            // Impact crater with raised rim and depressed floor
            if (normDist > 0.75) {
              // Raised rim
              const rimFactor = Math.sin((normDist - 0.75) * 4 * Math.PI)
              craterElevation += rimFactor * feat.depth * 0.35
            } else {
              // Depressed floor
              const floorFactor = (1 - normDist / 0.75)
              craterElevation -= floorFactor * feat.depth * 0.45
            }
          }
        }
      }

      // Calculate realistic lunar albedo & grayscale color
      // Lunar highlands: light silver-grey (~180-210)
      // Lunar maria: dark basalt (~85-115)
      let albedo = 185 + baseNoise * 40 + fineGrain * 30 - mareDarkness * 85 + craterElevation * 50
      albedo = Math.min(Math.max(albedo, 65), 245)

      // Bump/displacement value (0 to 255)
      let bump = 128 + baseNoise * 28 + craterElevation * 90 - mareDarkness * 20
      bump = Math.min(Math.max(bump, 10), 250)

      const idx = (py * width + px) * 4

      // Subtle warm/cool lunar tint
      cData[idx] = Math.round(albedo * 0.96)     // R
      cData[idx + 1] = Math.round(albedo * 0.98) // G
      cData[idx + 2] = Math.round(albedo * 1.04) // B (subtle cool lunar blue)
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
  colorTexture.anisotropy = 8

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
  bumpTexture.wrapS = THREE.RepeatWrapping
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping
  bumpTexture.anisotropy = 8

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

/** The Photorealistic 3D Moon with Realistic Lighting, Relief Shading & Smooth Scroll Path */
function RealisticMoon({ isMobile }: { isMobile: boolean }) {
  const moonMeshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const scrollProgressRef = useRef(0)

  const { colorMap, bumpMap } = useMemo(() => createPhotorealisticMoonMaps(), [])

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

  // Refined waypoints:
  // Desktop: Positioned on the right (x: 2.35) during Hero, giving full room to the center text
  // Mobile: Positioned cleanly behind/above with balanced scaling
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
      // Smooth position interpolation with subtle cursor parallax
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
      // Slow continuous realistic axial spin
      moonMeshRef.current.rotation.y += delta * 0.05 + scrollProgressRef.current * 0.015
      moonMeshRef.current.rotation.x = 0.12 // slight axial tilt
    }
  })

  return (
    <group ref={groupRef} position={[waypoints[0].x, waypoints[0].y, waypoints[0].z]}>
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
        {/* Soft, ethereal cyan atmospheric glow ring */}
        <mesh scale={1.14}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh scale={1.28}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.035}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Photorealistic Moon Sphere with Procedural Lunar Maria & Craters */}
        <mesh ref={moonMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={0.09}
            roughness={0.92}
            metalness={0.02}
            emissive="#090d16"
            emissiveIntensity={0.2}
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
      {/* Ambient Earthshine / Space lighting */}
      <ambientLight intensity={0.4} color="#c7d2fe" />

      {/* Sunlight creating crisp lunar terminator relief shadows */}
      <directionalLight position={[6, 3, 4.5]} intensity={3.6} color="#ffffff" />

      {/* Subtle Cyan/Violet Accent Rim Lights */}
      <pointLight position={[-6, -4, -3]} intensity={22} color="#38bdf8" distance={22} />
      <pointLight position={[2, -5, 2]} intensity={16} color="#818cf8" distance={20} />

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
