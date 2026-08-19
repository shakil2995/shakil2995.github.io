import { useMemo, useRef, useEffect, type ReactNode } from 'react'
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
  // 0.00: Hero — Azure Blue & Starlight Ice. Deliberately blue rather than
  // cyan; the old sky-400 rim carried a green channel of 189, which on a
  // neutral pearl surface read as a green cast across the shadow side.
  { p: 0.00, primary: new THREE.Color('#4f8bf5'), secondary: new THREE.Color('#818cf8'), emissive: new THREE.Color('#0c192e') },
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

  // Pearlescent silver-white base.
  //
  // This gradient must run top-to-bottom, NOT diagonally. The texture is mapped
  // equirectangularly with wrapS = RepeatWrapping, so any horizontal variation
  // makes the left edge (u=0) and right edge (u=1) different colours — and
  // where they meet on the sphere you get an instant step from slate back to
  // white. That seam read as a hard-edged second shadow crossing the real
  // terminator, and because this same canvas is also the bumpMap the step
  // became a normal-map cliff that shaded like one too. Varying only in v
  // wraps seamlessly and still gives the pole-to-limb falloff.
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

  /**
   * Draws a surface feature, repeating it across the u seam when it straddles
   * the edge. Without this, features near u=0 or u=1 get sliced in half and
   * leave their own hard edge at exactly the same place.
   */
  function drawWrapped(cx: number, r: number, draw: (x: number) => void) {
    draw(cx)
    if (cx - r < 0) draw(cx + width)
    if (cx + r > width) draw(cx - width)
  }

  // Soft lunar maria basins (semi-transparent for dynamic light transmission)
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

      // Luminous crater edge highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = Math.max(r * 0.08, 1.4)
      ctx.beginPath()
      ctx.arc(x - r * 0.12, cy - r * 0.12, r * 0.94, Math.PI * 0.65, Math.PI * 1.85)
      ctx.stroke()
    })
  }

  const texture = new THREE.CanvasTexture(canvas)
  // Colour maps must be tagged sRGB or three applies the wrong transfer curve.
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 16
  return texture
}

/** Scratch colour reused across frames — allocating inside useFrame churns the GC. */
const scratchColor = new THREE.Color()

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

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.18
      pointsRef.current.rotation.x += delta * 0.06

      // Update particle colors based on current theme
      const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute
      const time = performance.now() * 0.001
      for (let i = 0; i < count; i++) {
        const mix = (Math.sin(time * 2 + i * 0.1) + 1) * 0.5
        scratchColor.copy(primaryColor).lerp(secondaryColor, mix)
        colAttr.setXYZ(i, scratchColor.r, scratchColor.g, scratchColor.b)
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

/**
 * Multi-depth parallax starfield, evaluated entirely on the GPU.
 *
 * The previous version rebuilt 600 positions + 600 colours on the CPU every
 * frame and re-uploaded both buffers (~14KB of bus traffic per frame). All of
 * that motion is a pure function of time, so it now lives in the vertex shader
 * and the attribute buffers are uploaded exactly once.
 *
 * This also fixes a latent bug: the old per-frame colour write overwrote the
 * per-star hues assigned at init, so every star rendered the same flat tint.
 * Here `aColor` survives to the fragment stage and the variety is visible.
 */
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

  // Wrap a coordinate into [-size/2, size/2] so the field tiles seamlessly.
  float wrap(float v, float size) {
    return mod(v + size * 0.5, size) - size * 0.5;
  }

  void main() {
    // Shared cosmic river: everything drifts along the same diagonal, scaled
    // by per-star speed so nearer stars visibly outrun distant ones.
    float driftX = uTime * 0.35 * aSpeed * 7.0 + uMouse.x * aSpeed * 3.5;
    float driftY = uTime * 0.55 * aSpeed * 7.0 + uScroll * aSpeed * 12.0 + uMouse.y * aSpeed * 3.5;

    vec3 p = position;
    p.x = wrap(p.x - driftX, ${STAR_FIELD_SIZE}.0);
    p.y = wrap(p.y - driftY, ${STAR_FIELD_SIZE}.0);

    // Clusters breathe in and out of visibility in harmonious waves.
    float breathe = 0.5 + 0.5 * sin(uTime * 0.4 + aPhase);
    vAlpha = 0.65 + breathe * 0.35;
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
    // Soft round sprite. Untextured THREE points are squares by default —
    // this is what makes them read as stars rather than pixels.
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;
    float falloff = 1.0 - smoothstep(0.0, 0.25, d);
    gl_FragColor = vec4(vColor * vAlpha, falloff * vAlpha * 0.88);
  }
`

function DepthParallaxStarfield({ count = 600 }: { count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const size = useThree((state) => state.size)

  useEffect(subscribeScroll, [])

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const phase = new Float32Array(count)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * STAR_FIELD_SIZE
      const y = (Math.random() - 0.5) * STAR_FIELD_SIZE
      // Deep cosmic distance: kept between -90 and -30 so no stars are bloated near camera
      const z = -90 + Math.random() * 60

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      // Distance-based velocity: far stars drift in a slower, majestic phase.
      const depthFactor = (z + 90) / 60
      spd[i] = 0.012 + depthFactor * 0.038
      phase[i] = Math.random() * Math.PI * 2

      // Subtle celestial star colours — these now actually reach the screen.
      const starHue = Math.random()
      if (starHue > 0.75) {
        col[i * 3] = 0.70; col[i * 3 + 1] = 0.88; col[i * 3 + 2] = 1.0 // Ice cyan
      } else if (starHue > 0.55) {
        col[i * 3] = 0.88; col[i * 3 + 1] = 0.78; col[i * 3 + 2] = 1.0 // Soft violet
      } else {
        col[i * 3] = 0.95; col[i * 3 + 1] = 0.96; col[i * 3 + 2] = 1.0 // Platinum white
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(spd, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      // Slightly larger than the old 0.035 square points: the round falloff
      // discards the corners, so same number reads smaller on screen.
      uSize: { value: 0.042 },
      uScale: { value: 300 },
    }),
    [],
  )

  // Free GPU memory if the star count changes (mobile/desktop breakpoint flip).
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const u = matRef.current?.uniforms
    if (!u) return
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value = getScrollProgress()
    u.uMouse.value.set(state.pointer.x * 2, state.pointer.y * 2)
    u.uScale.value = size.height * state.gl.getPixelRatio() * 0.5
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

const RIBBON_SEGMENTS = 16
const SPARKS_PER_METEOR = 6

/** Authentic Earth-view sleek shooting stars burning through 4 progressive atmospheric ionization stages */
function MeteorShower({
  isMobile,
  flashRef,
}: {
  isMobile: boolean
  flashRef: React.MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Points>(null)
  const sparksRef = useRef<THREE.Points>(null)
  const MAX_METEORS = isMobile ? 4 : 7

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

  const spawnTimer = useRef(999) // Instant spawn on initial load
  const nextSpawnInterval = useRef(1.4)

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
  }, [MAX_METEORS])

  useFrame((_, delta) => {
    spawnTimer.current += delta

    // Randomized spawn cadence
    if (spawnTimer.current > nextSpawnInterval.current) {
      spawnTimer.current = 0
      nextSpawnInterval.current = isMobile ? (2.2 + Math.random() * 2.2) : (1.4 + Math.random() * 2.0)

      // Burst count: 70% single, 20% double, 10% triple meteor cluster
      const burstRoll = Math.random()
      const burstCount = isMobile ? (burstRoll < 0.8 ? 1 : 2) : (burstRoll < 0.68 ? 1 : burstRoll < 0.88 ? 2 : 3)

      for (let b = 0; b < burstCount; b++) {
        const inactive = meteors.current.find((m) => !m.active)
        if (!inactive) break

        // Size variance: 12% rare large, 38% medium, 50% small fine stardust
        const sizeRoll = Math.random()
        const isRareLarge = sizeRoll < 0.12
        const isMedium = sizeRoll >= 0.12 && sizeRoll < 0.50

        // Build a randomized 4-stage mineral color sequence: C1 -> C2 -> C3 -> C4
        const startIndex = Math.floor(Math.random() * METEOR_THEMES.length)
        const stage0 = METEOR_THEMES[startIndex]
        const stage1 = METEOR_THEMES[(startIndex + 1) % METEOR_THEMES.length]
        const stage2 = METEOR_THEMES[(startIndex + 2) % METEOR_THEMES.length]
        const stage3 = METEOR_THEMES[(startIndex + 3) % METEOR_THEMES.length]

        inactive.active = true
        inactive.isLarge = isRareLarge
        inactive.colorStages = [stage0, stage1, stage2, stage3]

        // Random starting zone across upper and right sky
        const originType = Math.random()
        let startX: number, startY: number
        if (originType < 0.5) {
          // Top-right zone
          startX = (isMobile ? 1.8 : 3.5) + Math.random() * 2.5 + b * 0.8
          startY = 2.8 + Math.random() * 1.5 + b * 0.6
        } else if (originType < 0.8) {
          // Top-center zone
          startX = (Math.random() - 0.5) * 3.0 + b * 0.7
          startY = 3.2 + Math.random() * 1.4 + b * 0.5
        } else {
          // Right-middle edge zone
          startX = (isMobile ? 2.5 : 4.6) + Math.random() * 1.8 + b * 0.6
          startY = 0.6 + Math.random() * 2.2 + b * 0.7
        }

        inactive.x = startX
        inactive.y = startY
        inactive.z = 1.2 + (Math.random() - 0.5) * 0.8

        // Trajectory angle variance
        const angle = THREE.MathUtils.degToRad(25 + Math.random() * 16) // 25 to 41 degrees downward-left
        let speed: number, headW: number, len: number, lifeTime: number

        if (isRareLarge) {
          // Rare Large Meteor
          speed = (isMobile ? 2.1 : 2.5) + Math.random() * 0.3
          headW = isMobile ? 0.030 : 0.044
          len = 1.9 + Math.random() * 0.6
          lifeTime = 4.8 + Math.random() * 0.6 // ~5s
          flashRef.current = 0.55
        } else if (isMedium) {
          // Medium Shooting Star
          speed = (isMobile ? 1.9 : 2.2) + Math.random() * 0.3
          headW = isMobile ? 0.015 : 0.022
          len = 1.0 + Math.random() * 0.5
          lifeTime = 3.8 + Math.random() * 1.0
          flashRef.current = Math.max(flashRef.current, 0.1)
        } else {
          // Small Stardust Meteor
          speed = (isMobile ? 1.6 : 1.9) + Math.random() * 0.3
          headW = isMobile ? 0.006 : 0.009
          len = 0.45 + Math.random() * 0.35
          lifeTime = 2.8 + Math.random() * 1.2
          flashRef.current = Math.max(flashRef.current, 0.04)
        }

        inactive.vx = -speed * Math.cos(angle)
        inactive.vy = -speed * Math.sin(angle)
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

    if (!meshRef.current || !headRef.current || !sparksRef.current) return
    const ribbonPos = (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const ribbonCol = (meshRef.current.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array

    const headPos = (headRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const headCol = (headRef.current.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array

    const sparkPos = (sparksRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const sparkCol = (sparksRef.current.geometry.attributes.color as THREE.BufferAttribute).array as Float32Array

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

      // Sustained brightness curve: quick fade-in, long visible flight, smooth fade-out
      const lifeProg = m.life / m.maxLife
      let meteorAlpha = 1.0
      if (lifeProg < 0.10) {
        meteorAlpha = lifeProg / 0.10
      } else if (lifeProg > 0.86) {
        meteorAlpha = Math.max(0, (1.0 - lifeProg) / 0.14)
      }

      // 4-Stage Progressive Atmospheric Mineral Combustion: C1 -> C2 -> C3 -> C4 -> Disappears
      // 3 transitions across lifeProg [0.0 - 1.0]: stage 0, stage 1, stage 2, stage 3
      const phase = lifeProg * 3.0 // 0.0 to 3.0
      const stageIdx = Math.min(Math.floor(phase), 2)
      const nextStageIdx = stageIdx + 1
      const stageFrac = phase - stageIdx
      // Hold each color clearly for most of the stage, then smoothly crossfade
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
      const headBright = (m.isLarge ? 2.2 : 1.8) * meteorAlpha
      headCol[headBase] = 1.0 * headBright
      headCol[headBase + 1] = 0.98 * headBright
      headCol[headBase + 2] = 1.0 * headBright

      // 2. Burning Tapered Meteor Body with 4 Progressive Mineral Color Stages
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

        // Burning flame color: Incandescent White -> Current Stage Mineral Flame -> Deep Tail Stardust
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

        const boost = (m.isLarge ? 2.0 : 1.6) * fade
        ribbonCol[leftIdx] = r * boost
        ribbonCol[leftIdx + 1] = g * boost
        ribbonCol[leftIdx + 2] = b * boost

        ribbonCol[rightIdx] = r * boost
        ribbonCol[rightIdx + 1] = g * boost
        ribbonCol[rightIdx + 2] = b * boost
      }

      // 3. Slipstream Stardust Spark Embers
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

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.geometry.attributes.color.needsUpdate = true
    headRef.current.geometry.attributes.position.needsUpdate = true
    headRef.current.geometry.attributes.color.needsUpdate = true
    sparksRef.current.geometry.attributes.position.needsUpdate = true
    sparksRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <group>
      {/* 3D Tapered Earth-Scale Meteor Ribbon Body */}
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

      {/* Burning Incandescent Head Spark */}
      <points ref={headRef} geometry={headGeom}>
        <pointsMaterial
          size={isMobile ? 0.048 : 0.072}
          vertexColors
          transparent
          sizeAttenuation
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Stardust Slipstream Embers */}
      <points ref={sparksRef} geometry={sparksGeom}>
        <pointsMaterial
          size={isMobile ? 0.014 : 0.020}
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

/** The Smart Dynamic 3D Celestial Moon Guide */
/**
 * A sphere sitting off the optical axis does not project to a circle — it
 * projects to an ellipse stretched along the radial direction by 1/cos θ. The
 * hero moon sits ~27° off axis, which measures out at 11.5% wider than tall:
 * the "skew". That is correct perspective, so we don't cancel it outright —
 * compressing the radial axis by this fraction of the error leaves the moon
 * reading round without flattening it into an orthographic cut-out.
 */
const OFF_AXIS_CORRECTION = 0.6

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
  /** Damped uniform scale, tracked apart from scale.x — see the aspect fix below. */
  const uniformScaleRef = useRef(1)

  const moonTexture = useMemo(() => createSmartAestheticMoonTexture(), [])

  useEffect(subscribeScroll, [])
  useEffect(() => () => moonTexture.dispose(), [moonTexture])

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
      { p: 0.0, x: 2.75, y: 0.58, z: 0.0, s: 0.95 },   // Hero: upper-right, clear of the headline & tagline
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
    const progress = getScrollProgress()
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

      // Damped on its own rather than off scale.x, which now also carries the
      // aspect correction below and would otherwise feed back into itself.
      uniformScaleRef.current = THREE.MathUtils.damp(uniformScaleRef.current, target.s, 4, delta)
      const s = uniformScaleRef.current

      const px = groupRef.current.position.x
      const py = groupRef.current.position.y
      const radial = Math.hypot(px, py)
      const depth = Math.max(state.camera.position.z - groupRef.current.position.z, 0.001)
      // cos θ between the view axis and the direction to the moon.
      const cosTheta = depth / Math.hypot(radial, depth)
      const squash = OFF_AXIS_CORRECTION * (1 - cosTheta)
      // Split the correction across x and y by where the moon actually sits.
      // Every waypoint lands within ~12° of an axis, so this diagonal form
      // tracks the true radial squash closely without having to rotate the
      // group — which would visibly roll the surface as the moon travels.
      const dx = radial > 1e-4 ? px / radial : 0
      const dy = radial > 1e-4 ? py / radial : 0
      groupRef.current.scale.set(s * (1 - squash * dx * dx), s * (1 - squash * dy * dy), s)
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
      <FloatGroup speed={1.6} rotationIntensity={0.25} floatIntensity={0.4}>
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
      </FloatGroup>
    </group>
  )
}

/**
 * Key-light sweep, in scene units. At the top of the page the moon is lit from
 * the side so the terminator is visible (a waxing crescent); by the contact
 * section the light has swung frontal and the moon reads full — the phase
 * completes as the visitor completes the journey.
 */
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

    // Decay meteor fireball flash back to base level
    if (flashRef.current > 0.001) {
      flashRef.current = THREE.MathUtils.lerp(flashRef.current, 0, delta * 3.5)
    } else {
      flashRef.current = 0
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = baseAmbient + flashRef.current * 0.45
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={baseAmbient} color="#e9e8f2" />
      <directionalLight
        ref={keyLightRef}
        position={[KEY_LIGHT_CRESCENT.x, KEY_LIGHT_CRESCENT.y, KEY_LIGHT_CRESCENT.z]}
        intensity={isMobile ? 3.3 : 2.8}
        // Faintly amber rather than pure white — a warm lit limb against the
        // cool blue fill is what gives the moon its blue/amber duality.
        color="#ffeccb"
      />
      <directionalLight ref={fillLightRef} position={[-4, -3, 2]} intensity={isMobile ? 1.32 : 1.1} color="#4f8bf5" />
    </>
  )
}

export default function CelestialMoonScene({ isMobile }: { isMobile: boolean }) {
  const primaryColor = useMemo(() => new THREE.Color('#4f8bf5'), [])
  const secondaryColor = useMemo(() => new THREE.Color('#818cf8'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#0c192e'), [])
  const flashRef = useRef(0)

  return (
    <Canvas
      frameloop="always"
      className="w-full h-full"
      dpr={[1, isMobile ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 5.5], fov: isMobile ? 54 : 46 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        // 'high-performance' asks for the discrete GPU — a battery tax on phones.
        powerPreference: isMobile ? 'default' : 'high-performance',
      }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <DynamicSceneLighting primaryColor={primaryColor} isMobile={isMobile} flashRef={flashRef} />

      {/* Dynamic Multi-Depth Parallax Starfield (Breathing unison drift) */}
      <DepthParallaxStarfield count={isMobile ? 280 : 600} />

      {/* Dynamic Meteor Shower with periodic shooting stars & glowing large fireballs */}
      <MeteorShower isMobile={isMobile} flashRef={flashRef} />

      <SmartCelestialMoon
        isMobile={isMobile}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        emissiveColor={emissiveColor}
      />
    </Canvas>
  )
}
