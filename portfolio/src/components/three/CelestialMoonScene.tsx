import { useMemo, useRef, useEffect, useState, useCallback, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getScrollProgress, subscribeScroll } from '../../hooks/useScrollProgress'

/**
 * Local stand-in for drei's <Float>. Same motion, but lets us drop
 * @react-three/drei (and its dependency tree) from the bundle entirely.
 */
function FloatGroup({
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
  children,
}: {
  speed?: number
  rotationIntensity?: number
  floatIntensity?: number
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const offset = useMemo(() => Math.random() * 10000, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = offset + state.clock.elapsedTime * speed
    ref.current.rotation.x = (Math.cos(t / 4) * rotationIntensity) / 8
    ref.current.rotation.y = (Math.sin(t / 4) * rotationIntensity) / 8
    ref.current.rotation.z = (Math.sin(t / 4) * rotationIntensity) / 20
    ref.current.position.y = (Math.sin(t / 4) * floatIntensity) / 10
  })

  return <group ref={ref}>{children}</group>
}

/** Section-based Dynamic Color Themes for Smart Atmospheric Shifting */
interface SectionTheme {
  p: number
  primary: THREE.Color   // Dominant rim & halo light
  secondary: THREE.Color // Ambient depth tint
  emissive: THREE.Color  // Subtle inner core glow
}

const SECTION_THEMES: SectionTheme[] = [
  // 0.00: Hero — Azure Blue & Starlight Ice
  { p: 0.00, primary: new THREE.Color('#4f8bf5'), secondary: new THREE.Color('#818cf8'), emissive: new THREE.Color('#0c192e') },
  // 0.20: About — Royal Violet & Indigo
  { p: 0.20, primary: new THREE.Color('#a855f7'), secondary: new THREE.Color('#6366f1'), emissive: new THREE.Color('#1e1035') },
  // 0.45: Skills — Neon Teal & Mint Green
  { p: 0.45, primary: new THREE.Color('#2dd4bf'), secondary: new THREE.Color('#06b6d4'), emissive: new THREE.Color('#062420') },
  // 0.68: Projects — Radiant Magenta & Electric Violet
  { p: 0.68, primary: new THREE.Color('#ec4899'), secondary: new THREE.Color('#a855f7'), emissive: new THREE.Color('#290c2b') },
  // 0.85: Timeline — Cyber Amber & Warm Gold
  { p: 0.85, primary: new THREE.Color('#f59e0b'), secondary: new THREE.Color('#fb923c'), emissive: new THREE.Color('#261706') },
  // 1.00: Contact — Electric Cyan & Ultra Violet Beacon
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

  const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
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

  function drawWrapped(cx: number, r: number, draw: (x: number) => void) {
    draw(cx)
    if (cx - r < 0) draw(cx + width)
    if (cx + r > width) draw(cx - width)
  }

  // Soft lunar maria basins
  for (let i = 0; i < 12; i++) {
    const cx = (rand() * 0.8 + 0.1) * width
    const cy = (rand() * 0.7 + 0.15) * height
    const r = 100 + rand() * 200

    drawWrapped(cx, r, (x) => {
      const rg = ctx.createRadialGradient(x, cy, 0, x, cy, r)
      rg.addColorStop(0, 'rgba(71, 85, 105, 0.28)')
      rg.addColorStop(0.6, 'rgba(100, 116, 139, 0.14)')
      rg.addColorStop(1, 'transparent')

      ctx.fillStyle = rg
      ctx.beginPath()
      ctx.arc(x, cy, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // Stylized crater rings with soft highlights
  for (let i = 0; i < 45; i++) {
    const cx = rand() * width
    const cy = (rand() * 0.8 + 0.1) * height
    const r = 12 + rand() * 38

    drawWrapped(cx, r, (x) => {
      const craterGrad = ctx.createRadialGradient(x, cy, 0, x, cy, r)
      craterGrad.addColorStop(0, 'rgba(30, 41, 59, 0.35)')
      craterGrad.addColorStop(0.7, 'rgba(71, 85, 105, 0.18)')
      craterGrad.addColorStop(1, 'transparent')

      ctx.fillStyle = craterGrad
      ctx.beginPath()
      ctx.arc(x, cy, r, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = Math.max(r * 0.08, 1.4)
      ctx.beginPath()
      ctx.arc(x - r * 0.12, cy - r * 0.12, r * 0.94, Math.PI * 0.65, Math.PI * 1.85)
      ctx.stroke()
    })
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 16
  return texture
}

const scratchColor = new THREE.Color()

/** Swirling Orbital Star Particles that dynamically shift colors with the theme */
function DynamicOrbitStars({
  count = 35,
  isMobile,
  primaryColor,
  secondaryColor,
}: {
  count?: number
  isMobile?: boolean
  primaryColor: THREE.Color
  secondaryColor: THREE.Color
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const actualCount = isMobile ? Math.min(count, 10) : count

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const colors = new Float32Array(actualCount * 3)

    for (let i = 0; i < actualCount; i++) {
      const angle = (i / actualCount) * Math.PI * 2 + Math.random() * 0.15
      const radius = 1.35 + Math.random() * 0.95
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * (radius * 0.45) + (Math.random() - 0.5) * 0.35
      const z = Math.sin(angle) * (radius * 0.85)

      positions.set([x, y, z], i * 3)
      colors.set([0.75, 0.88, 1.0], i * 3)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { geometry: g }
  }, [actualCount])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.18
      pointsRef.current.rotation.x += delta * 0.06

      const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute
      const time = performance.now() * 0.001
      for (let i = 0; i < actualCount; i++) {
        const mix = (Math.sin(time * 2.0 + i * 0.1) + 1) * 0.5
        scratchColor.copy(primaryColor).lerp(secondaryColor, mix)
        colAttr.setXYZ(i, scratchColor.r, scratchColor.g, scratchColor.b)
      }
      colAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={isMobile ? 0.028 : 0.035}
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

const STAR_FIELD_SIZE = 65

const starVertexShader = /* glsl */ `
  attribute float aSpeed;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uScale;

  varying vec3 vColor;
  varying float vAlpha;

  float wrap(float v, float size) {
    return mod(v + size * 0.5, size) - size * 0.5;
  }

  void main() {
    float driftX = uTime * 0.18 * aSpeed * 4.5 + uMouse.x * aSpeed * 2.5;
    float driftY = uTime * 0.28 * aSpeed * 4.5 + uScroll * aSpeed * 9.0 + uMouse.y * aSpeed * 2.5;

    vec3 p = position;
    p.x = wrap(p.x - driftX, ${STAR_FIELD_SIZE}.0);
    p.y = wrap(p.y - driftY, ${STAR_FIELD_SIZE}.0);

    // 1.3x star twinkle cadence
    float breathe = 0.5 + 0.5 * sin(uTime * 0.124 + aPhase);
    vAlpha = 0.78 + breathe * 0.22;
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (uScale / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const starFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;
    float falloff = 1.0 - smoothstep(0.0, 0.25, d);
    gl_FragColor = vec4(vColor * vAlpha, falloff * vAlpha * 0.88);
  }
`

function DepthParallaxStarfield({ isMobile, count }: { isMobile?: boolean; count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const size = useThree((state) => state.size)
  const actualCount = count ?? (isMobile ? 140 : 600)

  useEffect(subscribeScroll, [])

  const geometry = useMemo(() => {
    const pos = new Float32Array(actualCount * 3)
    const spd = new Float32Array(actualCount)
    const phase = new Float32Array(actualCount)
    const col = new Float32Array(actualCount * 3)

    for (let i = 0; i < actualCount; i++) {
      const x = (Math.random() - 0.5) * STAR_FIELD_SIZE
      const y = (Math.random() - 0.5) * STAR_FIELD_SIZE
      const z = -90 + Math.random() * 60

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const depthFactor = (z + 90) / 60
      spd[i] = 0.012 + depthFactor * 0.038
      phase[i] = Math.random() * Math.PI * 2

      const starHue = Math.random()
      if (starHue > 0.75) {
        col[i * 3] = 0.70; col[i * 3 + 1] = 0.88; col[i * 3 + 2] = 1.0
      } else if (starHue > 0.55) {
        col[i * 3] = 0.88; col[i * 3 + 1] = 0.78; col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 0.95; col[i * 3 + 1] = 0.96; col[i * 3 + 2] = 1.0
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(spd, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    return g
  }, [actualCount])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uSize: { value: isMobile ? 0.048 : 0.042 },
      uScale: { value: size.height * (isMobile ? 1.0 : 1.5) * 0.5 },
    }),
    [isMobile, size.height],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const u = matRef.current?.uniforms
    if (!u) return
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value = getScrollProgress()
    if (!isMobile) {
      u.uMouse.value.set(state.pointer.x * 2, state.pointer.y * 2)
    }
  })

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface MeteorColorTheme {
  head: [number, number, number]
  body: [number, number, number]
  tail: [number, number, number]
}

const METEOR_THEMES: MeteorColorTheme[] = [
  // 0: Electric Cyan / Magnesium Ice
  { head: [1.0, 1.0, 1.0], body: [0.22, 0.74, 0.97], tail: [0.39, 0.40, 0.95] },
  // 1: Aurora Emerald / Nickel Flame
  { head: [1.0, 1.0, 1.0], body: [0.20, 0.83, 0.60], tail: [0.06, 0.71, 0.83] },
  // 2: Solar Amber / Sodium Gold Flame
  { head: [1.0, 1.0, 1.0], body: [0.96, 0.62, 0.04], tail: [0.95, 0.25, 0.37] },
  // 3: Cosmic Magenta / Nitrogen Violet
  { head: [1.0, 1.0, 1.0], body: [0.93, 0.28, 0.60], tail: [0.55, 0.36, 0.96] },
]

interface MeteorItem {
  active: boolean
  isLarge: boolean
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  headWidth: number
  length: number
  life: number
  maxLife: number
  colorStages: [MeteorColorTheme, MeteorColorTheme, MeteorColorTheme, MeteorColorTheme]
  sparks: Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number }>
}

/** High-intensity Meteor Shower with atmospheric ionization stages */
function MeteorShower({
  isMobile,
  flashRef,
}: {
  isMobile: boolean
  flashRef: React.RefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Points>(null)
  const sparksRef = useRef<THREE.Points>(null)
  const MAX_METEORS = isMobile ? 4 : 20
  const RIBBON_SEGMENTS = isMobile ? 6 : 16
  const SPARKS_PER_METEOR = isMobile ? 2 : 6

  const meteors = useRef<MeteorItem[]>(
    Array.from({ length: MAX_METEORS }, () => ({
      active: false,
      isLarge: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      headWidth: 0.04,
      length: 0,
      life: 0,
      maxLife: 1,
      colorStages: [METEOR_THEMES[0], METEOR_THEMES[1], METEOR_THEMES[2], METEOR_THEMES[3]],
      sparks: Array.from({ length: SPARKS_PER_METEOR }, () => ({
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 1,
        maxLife: 1,
      })),
    }))
  )

  const spawnTimer = useRef(999)
  const nextSpawnInterval = useRef(1.4)
  const stormStart = useRef<number | null>(null)

  useEffect(() => {
    const onStorm = () => {
      stormStart.current = performance.now()
      spawnTimer.current = 999
      flashRef.current = 0.65
    }
    window.addEventListener('shakil:meteor-storm', onStorm)
    return () => window.removeEventListener('shakil:meteor-storm', onStorm)
  }, [flashRef])

  const { ribbonGeom, headGeom, sparksGeom } = useMemo(() => {
    const vertsPerMeteor = (RIBBON_SEGMENTS + 1) * 2
    const totalVerts = MAX_METEORS * vertsPerMeteor
    const pos = new Float32Array(totalVerts * 3)
    pos.fill(-999)
    const col = new Float32Array(totalVerts * 3)

    const indices: number[] = []
    for (let m = 0; m < MAX_METEORS; m++) {
      const vOffset = m * vertsPerMeteor
      for (let s = 0; s < RIBBON_SEGMENTS; s++) {
        const i0 = vOffset + s * 2
        const i1 = vOffset + s * 2 + 1
        const i2 = vOffset + (s + 1) * 2
        const i3 = vOffset + (s + 1) * 2 + 1

        indices.push(i0, i1, i2)
        indices.push(i1, i3, i2)
      }
    }

    const rG = new THREE.BufferGeometry()
    rG.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    rG.setAttribute('color', new THREE.BufferAttribute(col, 3))
    rG.setIndex(indices)

    const headPos = new Float32Array(MAX_METEORS * 3)
    headPos.fill(-999)
    const headCol = new Float32Array(MAX_METEORS * 3)
    const hG = new THREE.BufferGeometry()
    hG.setAttribute('position', new THREE.BufferAttribute(headPos, 3))
    hG.setAttribute('color', new THREE.BufferAttribute(headCol, 3))

    const totalSparks = MAX_METEORS * SPARKS_PER_METEOR
    const sparkPos = new Float32Array(totalSparks * 3)
    sparkPos.fill(-999)
    const sparkCol = new Float32Array(totalSparks * 3)
    const sG = new THREE.BufferGeometry()
    sG.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
    sG.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3))

    return { ribbonGeom: rG, headGeom: hG, sparksGeom: sG }
  }, [MAX_METEORS, RIBBON_SEGMENTS, SPARKS_PER_METEOR])

  useEffect(() => {
    return () => {
      ribbonGeom.dispose()
      headGeom.dispose()
      sparksGeom.dispose()
    }
  }, [ribbonGeom, headGeom, sparksGeom])

  useFrame((_, delta) => {
    spawnTimer.current += delta
    let isStormSpawning = false

    if (stormStart.current !== null) {
      const stormElapsed = performance.now() - stormStart.current
      // 5-second meteor shower action
      if (stormElapsed < 4800) {
        isStormSpawning = true
      } else {
        isStormSpawning = false
      }
      if (stormElapsed >= 5200) {
        stormStart.current = null
      }
    }

    if (spawnTimer.current > nextSpawnInterval.current) {
      spawnTimer.current = 0
      nextSpawnInterval.current = isStormSpawning
        ? (isMobile ? (0.24 + Math.random() * 0.12) : (0.12 + Math.random() * 0.08))
        : isMobile ? (2.8 + Math.random() * 2.4) : (1.4 + Math.random() * 2.0)

      const burstCount = isStormSpawning
        ? (isMobile ? 2 : (Math.random() < 0.6 ? 3 : 4))
        : (isMobile ? 1 : (Math.random() < 0.68 ? 1 : Math.random() < 0.88 ? 2 : 3))

      for (let b = 0; b < burstCount; b++) {
        const inactive = meteors.current.find((m) => !m.active)
        if (!inactive) break

        const sizeRoll = Math.random()
        const isRareLarge = sizeRoll < (isStormSpawning ? 0.35 : 0.12)
        const isMedium = sizeRoll >= (isStormSpawning ? 0.35 : 0.12) && sizeRoll < 0.65

        const startIndex = Math.floor(Math.random() * METEOR_THEMES.length)
        const stage0 = METEOR_THEMES[startIndex]
        const stage1 = METEOR_THEMES[(startIndex + 1) % METEOR_THEMES.length]
        const stage2 = METEOR_THEMES[(startIndex + 2) % METEOR_THEMES.length]
        const stage3 = METEOR_THEMES[(startIndex + 3) % METEOR_THEMES.length]

        inactive.active = true
        inactive.isLarge = isRareLarge
        inactive.colorStages = [stage0, stage1, stage2, stage3]

        // Natural organic random origins (exact same zones as regular meteors)
        const originType = Math.random()
        let startX: number, startY: number

        if (originType < 0.5) {
          // Top-right zone
          startX = (isMobile ? 1.8 : 3.5) + Math.random() * 2.5 + b * 0.6
          startY = 2.8 + Math.random() * 1.5 + b * 0.4
        } else if (originType < 0.8) {
          // Top-center zone
          startX = (Math.random() - 0.5) * 3.2 + b * 0.5
          startY = 3.2 + Math.random() * 1.4 + b * 0.4
        } else {
          // Right-middle edge zone
          startX = (isMobile ? 2.5 : 4.6) + Math.random() * 1.8 + b * 0.5
          startY = 0.6 + Math.random() * 2.2 + b * 0.5
        }

        inactive.x = startX
        inactive.y = startY
        inactive.z = 1.2 + (Math.random() - 0.5) * 0.8

        const angle = THREE.MathUtils.degToRad(25 + Math.random() * 16)
        let speed: number, headW: number, len: number, lifeTime: number

        if (isRareLarge) {
          speed = (isMobile ? 2.2 : 2.6) + Math.random() * 0.4
          headW = isMobile ? 0.030 : 0.044
          len = 2.0 + Math.random() * 0.7
          lifeTime = 3.8 + Math.random() * 0.6
          flashRef.current = Math.max(flashRef.current, 0.35)
        } else if (isMedium) {
          speed = (isMobile ? 1.9 : 2.3) + Math.random() * 0.3
          headW = isMobile ? 0.016 : 0.024
          len = 1.1 + Math.random() * 0.5
          lifeTime = 3.4 + Math.random() * 0.8
          flashRef.current = Math.max(flashRef.current, 0.1)
        } else {
          speed = (isMobile ? 1.6 : 1.9) + Math.random() * 0.3
          headW = isMobile ? 0.007 : 0.010
          len = 0.5 + Math.random() * 0.35
          lifeTime = 2.8 + Math.random() * 0.8
        }

        inactive.vx = -speed * Math.cos(angle)
        inactive.vy = -speed * Math.sin(angle)
        if (isStormSpawning) {
          inactive.vx *= 1.2
          inactive.vy *= 1.2
        }
        inactive.vz = 0
        inactive.headWidth = headW
        inactive.length = len
        inactive.life = 0
        inactive.maxLife = lifeTime

        inactive.sparks.forEach((sp) => {
          sp.life = 1
        })
      }
    }

    const ribbonPos = meshRef.current?.geometry.attributes.position.array as Float32Array | undefined
    const ribbonCol = meshRef.current?.geometry.attributes.color.array as Float32Array | undefined
    const headPos = headRef.current?.geometry.attributes.position.array as Float32Array | undefined
    const headCol = headRef.current?.geometry.attributes.color.array as Float32Array | undefined
    const sparkPos = sparksRef.current?.geometry.attributes.position.array as Float32Array | undefined
    const sparkCol = sparksRef.current?.geometry.attributes.color.array as Float32Array | undefined

    if (!ribbonPos || !ribbonCol || !headPos || !headCol || !sparkPos || !sparkCol) return

    const vertsPerMeteor = (RIBBON_SEGMENTS + 1) * 2

    meteors.current.forEach((m, mIdx) => {
      const vBase = mIdx * vertsPerMeteor * 3
      const headBase = mIdx * 3
      const sparkBase = mIdx * SPARKS_PER_METEOR * 3

      if (!m.active) {
        for (let k = 0; k < vertsPerMeteor * 3; k++) ribbonPos[vBase + k] = -999
        headPos[headBase] = -999; headPos[headBase + 1] = -999; headPos[headBase + 2] = -999
        for (let s = 0; s < SPARKS_PER_METEOR * 3; s++) sparkPos[sparkBase + s] = -999
        return
      }

      m.life += delta
      if (m.life >= m.maxLife) {
        m.active = false
        return
      }

      m.x += m.vx * delta
      m.y += m.vy * delta
      m.z += m.vz * delta

      const vLen = Math.hypot(m.vx, m.vy, m.vz)
      const dirX = m.vx / vLen
      const dirY = m.vy / vLen

      const perpLen = Math.hypot(-dirY, dirX) || 1
      const normX = -dirY / perpLen
      const normY = dirX / perpLen

      const lifeProg = m.life / m.maxLife
      let meteorAlpha = 1.0
      if (lifeProg < 0.10) {
        meteorAlpha = lifeProg / 0.10
      } else if (lifeProg > 0.86) {
        meteorAlpha = Math.max(0, (1.0 - lifeProg) / 0.14)
      }

      const phase = lifeProg * 3.0
      const stageIdx = Math.min(Math.floor(phase), 2)
      const nextStageIdx = stageIdx + 1
      const stageFrac = phase - stageIdx
      const stageT = THREE.MathUtils.smoothstep(stageFrac, 0.25, 0.75)

      const cA = m.colorStages[stageIdx]
      const cB = m.colorStages[nextStageIdx]

      const curBodyR = THREE.MathUtils.lerp(cA.body[0], cB.body[0], stageT)
      const curBodyG = THREE.MathUtils.lerp(cA.body[1], cB.body[1], stageT)
      const curBodyB = THREE.MathUtils.lerp(cA.body[2], cB.body[2], stageT)

      const curTailR = THREE.MathUtils.lerp(cA.tail[0], cB.tail[0], stageT)
      const curTailG = THREE.MathUtils.lerp(cA.tail[1], cB.tail[1], stageT)
      const curTailB = THREE.MathUtils.lerp(cA.tail[2], cB.tail[2], stageT)

      // 1. Sleek Burning Incandescent Head
      headPos[headBase] = m.x
      headPos[headBase + 1] = m.y
      headPos[headBase + 2] = m.z
      const headBright = (m.isLarge ? 2.4 : 1.9) * meteorAlpha
      headCol[headBase] = 1.0 * headBright
      headCol[headBase + 1] = 0.98 * headBright
      headCol[headBase + 2] = 1.0 * headBright

      // 2. Burning Tapered Meteor Body
      for (let s = 0; s <= RIBBON_SEGMENTS; s++) {
        const u = s / RIBBON_SEGMENTS
        const width = m.headWidth * Math.pow(1 - u, 1.4)
        const halfW = width * 0.5

        const cx = m.x - dirX * (u * m.length)
        const cy = m.y - dirY * (u * m.length)
        const cz = m.z

        const leftIdx = vBase + (s * 2) * 3
        const rightIdx = vBase + (s * 2 + 1) * 3

        ribbonPos[leftIdx] = cx + normX * halfW
        ribbonPos[leftIdx + 1] = cy + normY * halfW
        ribbonPos[leftIdx + 2] = cz

        ribbonPos[rightIdx] = cx - normX * halfW
        ribbonPos[rightIdx + 1] = cy - normY * halfW
        ribbonPos[rightIdx + 2] = cz

        const fade = Math.pow(1 - u, 1.2) * meteorAlpha
        let r = 1, g = 1, b = 1
        if (u < 0.25) {
          const t = u / 0.25
          r = THREE.MathUtils.lerp(1.0, curBodyR, t)
          g = THREE.MathUtils.lerp(1.0, curBodyG, t)
          b = THREE.MathUtils.lerp(1.0, curBodyB, t)
        } else {
          const t = (u - 0.25) / 0.75
          r = THREE.MathUtils.lerp(curBodyR, curTailR, t)
          g = THREE.MathUtils.lerp(curBodyG, curTailG, t)
          b = THREE.MathUtils.lerp(curBodyB, curTailB, t)
        }

        const boost = (m.isLarge ? 2.2 : 1.7) * fade
        ribbonCol[leftIdx] = r * boost
        ribbonCol[leftIdx + 1] = g * boost
        ribbonCol[leftIdx + 2] = b * boost

        ribbonCol[rightIdx] = r * boost
        ribbonCol[rightIdx + 1] = g * boost
        ribbonCol[rightIdx + 2] = b * boost
      }

      // 3. Stardust Spark Embers
      m.sparks.forEach((sp, sIdx) => {
        const spIdx = sparkBase + sIdx * 3
        if (sp.life >= sp.maxLife) {
          sp.life = 0
          sp.maxLife = 0.35 + Math.random() * 0.35
          sp.x = m.x + (Math.random() - 0.5) * (m.headWidth * 0.6)
          sp.y = m.y + (Math.random() - 0.5) * (m.headWidth * 0.6)
          sp.z = m.z
          sp.vx = -dirX * (0.5 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.3
          sp.vy = -dirY * (0.5 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.3
          sp.vz = 0
        } else {
          sp.life += delta
          sp.x += sp.vx * delta
          sp.y += sp.vy * delta
        }

        const spAlpha = Math.max(0, 1 - sp.life / sp.maxLife) * meteorAlpha * 0.85
        sparkPos[spIdx] = sp.x
        sparkPos[spIdx + 1] = sp.y
        sparkPos[spIdx + 2] = sp.z

        sparkCol[spIdx] = curBodyR * spAlpha * 1.3
        sparkCol[spIdx + 1] = curBodyG * spAlpha * 1.3
        sparkCol[spIdx + 2] = curBodyB * spAlpha * 1.3
      })
    })

    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true
      meshRef.current.geometry.attributes.color.needsUpdate = true
    }
    if (headRef.current) {
      headRef.current.geometry.attributes.position.needsUpdate = true
      headRef.current.geometry.attributes.color.needsUpdate = true
    }
    if (sparksRef.current) {
      sparksRef.current.geometry.attributes.position.needsUpdate = true
      sparksRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={ribbonGeom}>
        <meshBasicMaterial
          vertexColors
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <points ref={headRef} geometry={headGeom}>
        <pointsMaterial
          size={isMobile ? 0.052 : 0.076}
          vertexColors
          transparent
          sizeAttenuation
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={sparksRef} geometry={sparksGeom}>
        <pointsMaterial
          size={isMobile ? 0.015 : 0.022}
          vertexColors
          transparent
          sizeAttenuation
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

const OFF_AXIS_CORRECTION = 0.6

interface ChunkItem {
  basePos: THREE.Vector3
  blastVel: THREE.Vector3
  rotAxis: THREE.Vector3
  rotSpeed: number
  geomIndex: number
  scale: [number, number, number]
}

/**
 * 3D Procedural Moon Shatter & Gravitational Reassembly System.
 * 28 jagged, faceted rocky chunks explode in 3D with impact momentum,
 * drift at zero-G apex, and are gravitationally accelerated back into a solid moon.
 */
function MoonShatterChunks({
  isMobile,
  moonTexture,
  flashRef,
  onShatterStateChange,
}: {
  isMobile: boolean
  moonTexture: THREE.CanvasTexture
  flashRef: React.MutableRefObject<number>
  onShatterStateChange: (isShattered: boolean) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const dustRef = useRef<THREE.Points>(null)
  const shatterStartRef = useRef<number | null>(null)
  const impactDirRef = useRef<THREE.Vector3>(new THREE.Vector3(-0.8, -0.5, 0.1))
  const wasShatteredRef = useRef(false)

  const numChunks = isMobile ? 8 : 28

  // 4 varied jagged rock chunk geometries
  const geometries = useMemo(() => {
    const g1 = new THREE.DodecahedronGeometry(0.26, 0)
    const g2 = new THREE.IcosahedronGeometry(0.24, 0)
    const g3 = new THREE.TetrahedronGeometry(0.30, 0)
    const g4 = new THREE.OctahedronGeometry(0.27, 0)
    return [g1, g2, g3, g4]
  }, [])

  const sharedMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonTexture,
      bumpScale: 0.045,
      roughness: 0.48,
      metalness: 0.08,
      emissive: new THREE.Color('#ff9933'),
      emissiveIntensity: 2.5,
    })
  }, [moonTexture])

  useEffect(() => {
    return () => {
      geometries.forEach((g) => g.dispose())
      sharedMaterial.dispose()
    }
  }, [geometries, sharedMaterial])

  // Pre-generate golden spiral spherical distribution
  const chunks = useMemo<ChunkItem[]>(() => {
    const list: ChunkItem[] = []
    for (let i = 0; i < numChunks; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / numChunks)
      const phi = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 0.35 + 0.55 * (0.4 + 0.6 * ((i * 37) % 100) / 100)

      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)

      const basePos = new THREE.Vector3(x, y, z)
      const outward = basePos.clone().normalize()
      const speed = 1.4 + ((i * 53) % 100) / 100 * 1.6
      const blastVel = outward.clone().multiplyScalar(speed)

      const rx = Math.sin(i * 1.7) || 0.5
      const ry = Math.cos(i * 2.3) || 0.5
      const rz = Math.sin(i * 3.1) || 0.5
      const rotAxis = new THREE.Vector3(rx, ry, rz).normalize()
      const rotSpeed = 2.4 + ((i * 41) % 100) / 100 * 3.8

      const sx = 0.75 + ((i * 19) % 100) / 100 * 0.5
      const sy = 0.75 + ((i * 29) % 100) / 100 * 0.5
      const sz = 0.75 + ((i * 31) % 100) / 100 * 0.5

      list.push({
        basePos,
        blastVel,
        rotAxis,
        rotSpeed,
        geomIndex: i % 4,
        scale: [sx, sy, sz],
      })
    }
    return list
  }, [numChunks])

  // Spark dust nebula expanding & contracting around the shattered core
  const numDust = isMobile ? 12 : 56
  const { dustGeom, dustVel } = useMemo(() => {
    const pos = new Float32Array(numDust * 3)
    pos.fill(-999)
    const col = new Float32Array(numDust * 3)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))

    const vels = Array.from({ length: numDust }, () => {
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI
      const dir = new THREE.Vector3(
        Math.cos(phi) * Math.cos(theta),
        Math.cos(phi) * Math.sin(theta),
        Math.sin(phi)
      ).normalize()
      return dir.multiplyScalar(2.0 + Math.random() * 2.2)
    })

    return { dustGeom: g, dustVel: vels }
  }, [numDust])

  useEffect(() => {
    return () => {
      dustGeom.dispose()
    }
  }, [dustGeom])

  useEffect(() => {
    const onShatter = (e: Event) => {
      const custom = e as CustomEvent<{ dir?: THREE.Vector3 }>
      if (custom.detail?.dir) {
        impactDirRef.current.copy(custom.detail.dir).normalize()
      }
      shatterStartRef.current = performance.now()
      wasShatteredRef.current = true
      onShatterStateChange(true)

      // Impart violent outward momentum biased along impact vector
      const dir = impactDirRef.current
      chunks.forEach((chunk) => {
        const outward = chunk.basePos.clone().normalize()
        chunk.blastVel
          .copy(outward)
          .multiplyScalar(1.5 + Math.random() * 1.5)
          .addScaledVector(dir, 1.3 + Math.random() * 0.9)
      })
    }

    window.addEventListener('shakil:moon-shatter', onShatter)
    return () => window.removeEventListener('shakil:moon-shatter', onShatter)
  }, [chunks, onShatterStateChange])

  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    if (shatterStartRef.current === null) {
      group.visible = false
      return
    }

    const elapsed = performance.now() - shatterStartRef.current
    const SHATTER_DURATION = 5000 // 5 seconds exact reassembly lifecycle
    const t = elapsed / SHATTER_DURATION

    if (t >= 1.0) {
      // Re-fusion instant: Snap whole, flash scene, hide fragments
      shatterStartRef.current = null
      group.visible = false
      if (wasShatteredRef.current) {
        wasShatteredRef.current = false
        onShatterStateChange(false)
        flashRef.current = 1.35
      }
      return
    }

    group.visible = true

    let disp = 0
    let rotFactor = 0
    let emissiveBright = 1.0
    const emissiveCol = scratchColor

    if (t < 0.52) {
      // Phase 1: Explosive Outward Blast & Zero-G Drift (0s - 2.6s)
      const p = t / 0.52
      const ease = 1 - Math.pow(1 - p, 3.2) // Outward drag deceleration
      disp = ease
      rotFactor = t * 5.2

      // Superheated molten fracture core -> glowing starlight cyan
      if (t < 0.16) {
        const heat = 1 - t / 0.16
        emissiveCol.setRGB(1.0, 0.88 + heat * 0.12, 0.65 + heat * 0.35)
        emissiveBright = 3.5 - (1 - heat) * 1.8
      } else {
        const cool = (t - 0.16) / 0.36
        emissiveCol.setRGB(
          THREE.MathUtils.lerp(1.0, 0.25, cool),
          THREE.MathUtils.lerp(0.88, 0.75, cool),
          THREE.MathUtils.lerp(0.65, 0.98, cool)
        )
        emissiveBright = 1.2
      }
    } else {
      // Phase 2: Gravitational Vortex & Reassembly Acceleration (2.6s - 5.0s)
      const g = (t - 0.52) / 0.48
      const pull = Math.pow(g, 2.7) // Accelerating inward gravitational pull
      disp = Math.max(0, 1 - pull)
      rotFactor = (0.52 * 5.2) * (1 - pull) // Re-align precisely to original orientation

      // Gravitational compression surge & magnetic re-fusion glow
      const surge = Math.pow(g, 2.2)
      emissiveCol.setRGB(
        THREE.MathUtils.lerp(0.25, 0.95, surge),
        THREE.MathUtils.lerp(0.75, 0.98, surge),
        1.0
      )
      emissiveBright = 1.2 + surge * 2.2
    }

    sharedMaterial.emissive.copy(emissiveCol)
    sharedMaterial.emissiveIntensity = emissiveBright

    // Position and tumble each chunk
    const children = group.children
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const mesh = children[i] as THREE.Mesh | undefined
      if (!mesh) continue

      mesh.position.copy(chunk.basePos).addScaledVector(chunk.blastVel, disp * 2.15)
      mesh.rotation.set(
        chunk.rotAxis.x * rotFactor * chunk.rotSpeed,
        chunk.rotAxis.y * rotFactor * chunk.rotSpeed,
        chunk.rotAxis.z * rotFactor * chunk.rotSpeed
      )
    }

    // Update glowing stardust debris points
    const dustPos = dustGeom.attributes.position.array as Float32Array
    const dustCol = dustGeom.attributes.color.array as Float32Array
    for (let d = 0; d < numDust; d++) {
      const idx = d * 3
      const vel = dustVel[d]
      dustPos[idx] = vel.x * disp * 1.5
      dustPos[idx + 1] = vel.y * disp * 1.5
      dustPos[idx + 2] = vel.z * disp * 1.5

      dustCol[idx] = emissiveCol.r * (emissiveBright * 0.7)
      dustCol[idx + 1] = emissiveCol.g * (emissiveBright * 0.7)
      dustCol[idx + 2] = emissiveCol.b * (emissiveBright * 0.7)
    }
    dustGeom.attributes.position.needsUpdate = true
    dustGeom.attributes.color.needsUpdate = true
  })

  return (
    <group ref={groupRef} visible={false}>
      {chunks.map((chunk, idx) => (
        <mesh
          key={idx}
          geometry={geometries[chunk.geomIndex]}
          material={sharedMaterial}
          scale={chunk.scale}
        />
      ))}

      <points ref={dustRef} geometry={dustGeom}>
        <pointsMaterial
          size={isMobile ? 0.038 : 0.055}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function SmartCelestialMoon({
  isMobile,
  primaryColor,
  secondaryColor,
  emissiveColor,
  moonPosRef,
  flashRef,
}: {
  isMobile: boolean
  primaryColor: THREE.Color
  secondaryColor: THREE.Color
  emissiveColor: THREE.Color
  moonPosRef: React.MutableRefObject<THREE.Vector3>
  flashRef: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const moonMeshRef = useRef<THREE.Mesh>(null)
  const uniformScaleRef = useRef(1)
  const blastStartRef = useRef<number | null>(null)
  const [isShattered, setIsShattered] = useState(false)
  const reconnectedAtRef = useRef<number | null>(null)

  useEffect(() => {
    const onStorm = () => {
      blastStartRef.current = performance.now()
    }
    window.addEventListener('shakil:meteor-storm', onStorm)
    return () => window.removeEventListener('shakil:meteor-storm', onStorm)
  }, [])

  const moonTexture = useMemo(() => createSmartAestheticMoonTexture(), [])

  useEffect(subscribeScroll, [])
  useEffect(() => () => moonTexture.dispose(), [moonTexture])

  const waypoints = useMemo(() => {
    if (isMobile) {
      return [
        { p: 0.0, x: 0.92, y: 1.6, z: -1.0, s: 0.95 },
        { p: 0.2, x: -0.92, y: 0.65, z: -0.9, s: 0.75 },
        { p: 0.45, x: 0.92, y: 0.35, z: -0.9, s: 0.7 },
        { p: 0.68, x: -0.92, y: 0.05, z: -0.9, s: 0.8 },
        { p: 0.85, x: 0.92, y: -0.1, z: -0.9, s: 0.75 },
        { p: 1.0, x: 0.0, y: 1.65, z: -0.9, s: 1.1 },
      ]
    }
    return [
      { p: 0.0, x: 2.75, y: 0.58, z: 0.0, s: 0.95 },
      { p: 0.2, x: -2.35, y: 0.35, z: 0.2, s: 1.25 },
      { p: 0.45, x: 2.4, y: 0.2, z: 0.1, s: 1.2 },
      { p: 0.68, x: -2.35, y: -0.1, z: 0.3, s: 1.35 },
      { p: 0.85, x: 2.35, y: 0.05, z: 0.2, s: 1.25 },
      { p: 1.0, x: 0.0, y: 1.45, z: -0.2, s: 1.65 },
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

  const handleShatterStateChange = useCallback((shattered: boolean) => {
    setIsShattered(shattered)
    if (!shattered) {
      reconnectedAtRef.current = performance.now()
    }
  }, [])

  const _projVec = useMemo(() => new THREE.Vector3(), [])
  const moonScreenBounds = useRef({ x: -999, y: -999, r: 50 })

  useEffect(() => {
    const isInteractive = (el: EventTarget | null) => {
      if (!el || !(el instanceof HTMLElement)) return false
      const tag = el.tagName.toLowerCase()
      if (['button', 'a', 'input', 'textarea', 'select'].includes(tag)) return true
      if (el.closest('button, a, input, textarea, select, [role="button"], .nav-link')) return true
      return false
    }

    const onPointerMove = (e: MouseEvent) => {
      const b = moonScreenBounds.current
      const dist = Math.hypot(e.clientX - b.x, e.clientY - b.y)
      if (dist <= b.r && !isInteractive(e.target)) {
        document.body.style.cursor = 'pointer'
      } else if (document.body.style.cursor === 'pointer') {
        document.body.style.cursor = 'auto'
      }
    }

    const onClick = (e: MouseEvent) => {
      const b = moonScreenBounds.current
      const dist = Math.hypot(e.clientX - b.x, e.clientY - b.y)
      if (dist <= b.r && !isInteractive(e.target)) {
        window.dispatchEvent(new CustomEvent('shakil:meteor-summon'))
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('click', onClick)
      document.body.style.cursor = 'auto'
    }
  }, [])

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.033)
    const progress = getScrollProgress()
    const target = getTargetTransform(progress)

    getInterpolatedTheme(progress, primaryColor, secondaryColor, emissiveColor)

    // Storm spin acceleration from very slow to fast (0.0s to 5.0s)
    let spinBoost = 0
    let spinGlow = 0
    if (blastStartRef.current !== null) {
      const elapsed = performance.now() - blastStartRef.current
      const t = Math.min(Math.max(elapsed / 5000, 0), 1)
      if (elapsed >= 5000) {
        blastStartRef.current = null
      } else {
        // Starts very slow and accelerates exponentially to ~20 rad/s before impact
        spinBoost = Math.pow(t, 2.4) * 20.0
        spinGlow = Math.pow(t, 2.0) * 1.6
      }
    }

    // Elastic settling bounce when reassembled
    let settleScale = 1
    if (reconnectedAtRef.current !== null) {
      const tRec = (performance.now() - reconnectedAtRef.current) / 1000
      if (tRec >= 1) {
        reconnectedAtRef.current = null
      } else {
        settleScale = 1 + 0.14 * Math.exp(-6 * tRec) * Math.sin(18 * tRec)
      }
    }

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        target.x + (isMobile ? 0 : state.pointer.x * 0.12),
        4.5,
        safeDelta
      )
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        target.y + (isMobile ? 0 : state.pointer.y * 0.12),
        4.5,
        safeDelta
      )
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        target.z,
        4.5,
        safeDelta
      )

      // Broadcast world position to killer meteor
      moonPosRef.current.copy(groupRef.current.position)

      uniformScaleRef.current = THREE.MathUtils.damp(uniformScaleRef.current, target.s, 4.5, safeDelta)
      const s = uniformScaleRef.current

      const scaleMultiplier = settleScale
      if (isMobile) {
        groupRef.current.scale.set(s * scaleMultiplier, s * scaleMultiplier, s * scaleMultiplier)
        moonScreenBounds.current.x = ((target.x / 2.5 + 1) * state.size.width) / 2
        moonScreenBounds.current.y = ((-target.y / 2.5 + 1) * state.size.height) / 2
        moonScreenBounds.current.r = 65
      } else {
        const px = groupRef.current.position.x
        const py = groupRef.current.position.y
        const radial = Math.hypot(px, py)
        const depth = Math.max(state.camera.position.z - groupRef.current.position.z, 0.001)
        const cosTheta = depth / Math.hypot(radial, depth)
        const squash = OFF_AXIS_CORRECTION * (1 - cosTheta)
        const dx = radial > 1e-4 ? px / radial : 0
        const dy = radial > 1e-4 ? py / radial : 0

        groupRef.current.scale.set(
          s * (1 - squash * dx * dx) * scaleMultiplier,
          s * (1 - squash * dy * dy) * scaleMultiplier,
          s * scaleMultiplier
        )

        // Calculate 2D screen-space coordinates of the moon for 100% reliable clicks
        groupRef.current.updateWorldMatrix(true, false)
        _projVec.setFromMatrixPosition(groupRef.current.matrixWorld)
        _projVec.project(state.camera)
        const screenX = ((_projVec.x + 1) * state.size.width) / 2
        const screenY = ((-_projVec.y + 1) * state.size.height) / 2
        const fovRad = THREE.MathUtils.degToRad((state.camera as THREE.PerspectiveCamera).fov || 50)
        const distZ = Math.max(state.camera.position.z - groupRef.current.position.z, 1.0)
        const radiusPx = (s * state.size.height) / (2 * Math.tan(fovRad / 2) * distZ)
        moonScreenBounds.current.x = screenX
        moonScreenBounds.current.y = screenY
        moonScreenBounds.current.r = Math.max(radiusPx * 1.15, 45)
      }
    }

    if (moonMeshRef.current) {
      moonMeshRef.current.rotation.y += safeDelta * 0.05 + progress * 0.015 + spinBoost * safeDelta
      moonMeshRef.current.rotation.x = 0.08

      const mat = moonMeshRef.current.material as THREE.MeshStandardMaterial
      if (mat) {
        mat.emissive.lerp(emissiveColor, safeDelta * 3)
        mat.emissiveIntensity = (isMobile ? 0.42 : 0.33) + spinGlow
      }
    }
  })

  return (
    <group ref={groupRef} position={[waypoints[0].x, waypoints[0].y, waypoints[0].z]}>
      <FloatGroup speed={1.6} rotationIntensity={0.25} floatIntensity={0.4}>
        {/* Solid Pristine Moon Sphere (hidden while shattered, interactive on click) */}
        <mesh
          ref={moonMeshRef}
          visible={!isShattered}
          onClick={(e) => {
            e.stopPropagation()
            window.dispatchEvent(new CustomEvent('shakil:meteor-summon'))
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <sphereGeometry args={[1, isMobile ? 24 : 48, isMobile ? 24 : 48]} />
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

        {/* 3D Shattered Rock Debris & Gravitational Reassembly System */}
        <MoonShatterChunks
          isMobile={isMobile}
          moonTexture={moonTexture}
          flashRef={flashRef}
          onShatterStateChange={handleShatterStateChange}
        />

        {/* Dynamic Color Shifting Star Dust */}
        <DynamicOrbitStars isMobile={isMobile} count={isMobile ? 10 : 35} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </FloatGroup>
    </group>
  )
}

const _killerDir = new THREE.Vector3()
const _killerUp = new THREE.Vector3(0, 1, 0)
const _killerEnd = new THREE.Vector3()

/**
 * Colossal Killer Impactor:
 * Launched 4.15s into the storm, accelerating directly into the moon.
 * Impacts at 5.0s, punches straight through, triggering scene flash and moon shatter.
 */
function KillerMeteor({
  moonPosRef,
  flashRef,
}: {
  moonPosRef: React.MutableRefObject<THREE.Vector3>
  flashRef: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Points>(null)
  const sparksRef = useRef<THREE.Points>(null)
  const tailMeshRef = useRef<THREE.Mesh>(null)

  const flightRef = useRef<{
    start: number
    from: THREE.Vector3
    to: THREE.Vector3
    dur: number
    hitFired: boolean
  } | null>(null)

  useEffect(() => {
    let timer: number | undefined
    const onStorm = () => {
      timer = window.setTimeout(() => {
        const moon = moonPosRef.current
        flightRef.current = {
          start: performance.now(),
          from: moon.clone().add(new THREE.Vector3(6.4, 4.0, -0.25)),
          to: moon.clone(),
          dur: 850, // Lands at 5000ms sharp
          hitFired: false,
        }
      }, 4150)
    }
    window.addEventListener('shakil:meteor-storm', onStorm)
    return () => {
      window.removeEventListener('shakil:meteor-storm', onStorm)
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [moonPosRef])

  const tailGeom = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.035, 0.16, 4.2, 8, 1, true)
    g.translate(0, -2.1, 0)
    return g
  }, [])

  const headGeom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3))
    return g
  }, [])

  const sparksGeom = useMemo(() => {
    const count = 14
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.18
      pos[i * 3 + 1] = -Math.random() * 2.8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.18
      col[i * 3] = 1.0; col[i * 3 + 1] = 0.65; col[i * 3 + 2] = 0.25
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])

  useEffect(
    () => () => {
      tailGeom.dispose()
      headGeom.dispose()
      sparksGeom.dispose()
    },
    [tailGeom, headGeom, sparksGeom],
  )

  useFrame(() => {
    const group = groupRef.current
    const head = headRef.current
    const tail = tailMeshRef.current
    if (!group || !head || !tail) return

    const flight = flightRef.current
    if (!flight) {
      group.visible = false
      return
    }

    const elapsed = performance.now() - flight.start
    const t = elapsed / flight.dur

    // Punch through exit: continues flying past moon for 250ms while fading
    if (t >= 1.0 && !flight.hitFired) {
      flight.hitFired = true
      flashRef.current = 1.95 // Cataclysmic impact flash
      _killerDir.copy(flight.to).sub(flight.from).normalize()
      window.dispatchEvent(
        new CustomEvent('shakil:moon-shatter', { detail: { dir: _killerDir.clone() } }),
      )
    }

    if (t >= 1.32) {
      flightRef.current = null
      group.visible = false
      return
    }

    group.visible = true
    _killerDir.copy(flight.to).sub(flight.from).normalize()

    // Calculate position: from -> to -> punch-through overshoot
    _killerEnd.copy(flight.to).addScaledVector(_killerDir, 3.5)
    if (t < 1.0) {
      group.position.lerpVectors(flight.from, flight.to, t)
    } else {
      const exitT = (t - 1.0) / 0.32
      group.position.lerpVectors(flight.to, _killerEnd, exitT)
      const fade = Math.max(0, 1 - exitT)
      const mat = tail.material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = 0.9 * fade
    }

    group.quaternion.setFromUnitVectors(_killerUp, _killerDir)
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={tailMeshRef} geometry={tailGeom}>
        <meshBasicMaterial
          color="#ffa73b"
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points ref={headRef} geometry={headGeom}>
        <pointsMaterial
          size={0.34}
          color="#ffffff"
          transparent
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={sparksRef} geometry={sparksGeom}>
        <pointsMaterial
          size={0.048}
          vertexColors
          transparent
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

const KEY_LIGHT_CRESCENT = new THREE.Vector3(6.2, 3.4, 1.2)
const KEY_LIGHT_FULL = new THREE.Vector3(2.0, 3.0, 6.0)

function DynamicSceneLighting({
  primaryColor,
  isMobile,
  flashRef,
}: {
  primaryColor: THREE.Color
  isMobile: boolean
  flashRef: React.MutableRefObject<number>
}) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const fillLightRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const baseAmbient = isMobile ? 0.86 : 0.73

  useEffect(subscribeScroll, [])

  useFrame((_, delta) => {
    if (keyLightRef.current) {
      const phase = THREE.MathUtils.smoothstep(getScrollProgress(), 0, 1)
      keyLightRef.current.position.lerpVectors(KEY_LIGHT_CRESCENT, KEY_LIGHT_FULL, phase)
    }

    if (fillLightRef.current) {
      fillLightRef.current.color.lerp(primaryColor, delta * 3)
    }

    if (flashRef.current > 0.001) {
      flashRef.current = THREE.MathUtils.lerp(flashRef.current, 0, delta * 3.2)
    } else {
      flashRef.current = 0
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = baseAmbient + flashRef.current * 0.65
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={baseAmbient} color="#e9e8f2" />
      <directionalLight
        ref={keyLightRef}
        position={[KEY_LIGHT_CRESCENT.x, KEY_LIGHT_CRESCENT.y, KEY_LIGHT_CRESCENT.z]}
        intensity={isMobile ? 3.3 : 2.8}
        color="#ffeccb"
      />
      <directionalLight ref={fillLightRef} position={[-4, -3, 2]} intensity={isMobile ? 1.32 : 1.1} color="#4f8bf5" />
    </>
  )
}

/**
 * Adaptive Dynamic Resolution Scaling (DRS)
 * Automatically optimizes DPR to 1.0 during active touch/scroll motion,
 * and seamlessly ramps back to full crisp native DPR once scroll settles.
 */
function AdaptiveDprController({ isMobile }: { isMobile: boolean }) {
  const setDpr = useThree((state) => state.setDpr)
  const isScrolling = useRef(false)
  const timeoutId = useRef<number | null>(null)

  useEffect(() => {
    const baseDpr = isMobile ? 0.85 : 1.5
    const scrollDpr = isMobile ? 0.70 : 1.0

    const onScroll = () => {
      if (!isScrolling.current) {
        isScrolling.current = true
        setDpr(scrollDpr)
      }
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current)
      }
      timeoutId.current = window.setTimeout(() => {
        isScrolling.current = false
        setDpr(baseDpr)
      }, 140)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timeoutId.current !== null) window.clearTimeout(timeoutId.current)
    }
  }, [isMobile, setDpr])

  return null
}

export default function CelestialMoonScene({ isMobile }: { isMobile: boolean }) {
  const primaryColor = useMemo(() => new THREE.Color('#4f8bf5'), [])
  const secondaryColor = useMemo(() => new THREE.Color('#818cf8'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#0c192e'), [])
  const flashRef = useRef(0)
  const moonPosRef = useRef(new THREE.Vector3(2.75, 0.58, 0))

  return (
    <Canvas
      frameloop="always"
      className="w-full h-full"
      dpr={isMobile ? 0.85 : [1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: isMobile ? 54 : 46 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? 'default' : 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <AdaptiveDprController isMobile={isMobile} />
      <DynamicSceneLighting primaryColor={primaryColor} isMobile={isMobile} flashRef={flashRef} />

      {/* Dynamic Multi-Depth Parallax Starfield */}
      <DepthParallaxStarfield isMobile={isMobile} count={isMobile ? 100 : 600} />

      {/* Torrential Meteor Shower (10-20+ streaming active meteors during storm) */}
      <MeteorShower isMobile={isMobile} flashRef={flashRef} />

      {/* Colossal Killer Impactor */}
      <KillerMeteor moonPosRef={moonPosRef} flashRef={flashRef} />

      {/* The 3D Celestial Moon with Shatter & Gravitational Reassembly */}
      <SmartCelestialMoon
        isMobile={isMobile}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        emissiveColor={emissiveColor}
        moonPosRef={moonPosRef}
        flashRef={flashRef}
      />
    </Canvas>
  )
}
