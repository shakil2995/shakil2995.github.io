import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#8b5cf6')

/** Additive particle shell that slowly rotates and drifts with the pointer. */
function ParticleSwarm({ count, isMobile }: { count: number; isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const tmp = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Distribute on a balanced spherical shell
      const r = 2.2 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions.set([x, y, z], i * 3)

      // Gradient color by height: cyan → violet
      const t = (y / 3.8 + 1) / 2
      tmp.copy(CYAN).lerp(VIOLET, t)
      colors.set([tmp.r, tmp.g, tmp.b], i * 3)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.04
    // Gentle parallax
    const px = state.pointer.x * 0.2
    const py = state.pointer.y * 0.2
    ref.current.rotation.x += (py - ref.current.rotation.x) * 0.03
    ref.current.rotation.z += (-px * 0.3 - ref.current.rotation.z) * 0.03
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={isMobile ? 0.024 : 0.026}
        vertexColors
        transparent
        opacity={isMobile ? 0.65 : 0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Glowing, distorting crystal core with a counter-rotating wireframe cage. */
function Core({ detail, isMobile }: { detail: number; isMobile: boolean }) {
  const cage = useRef<THREE.Mesh>(null)
  const outerCage = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.12
      cage.current.rotation.x += delta * 0.06
    }
    if (outerCage.current) {
      outerCage.current.rotation.y += delta * 0.08
      outerCage.current.rotation.z -= delta * 0.04
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      {/* Soft fake-bloom halo */}
      <mesh scale={isMobile ? 1.6 : 2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={isMobile ? 0.02 : 0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Distorting inner crystal blob — rendered on desktop for rich 3D visuals, simplified on mobile for pristine clarity */}
      {!isMobile && (
        <mesh scale={1.15}>
          <icosahedronGeometry args={[1, detail]} />
          <MeshDistortMaterial
            color="#4c1d95"
            emissive="#7c3aed"
            emissiveIntensity={0.65}
            roughness={0.15}
            metalness={0.8}
            distort={0.32}
            speed={1.6}
            transparent
            opacity={0.92}
          />
        </mesh>
      )}

      {/* Inner Wireframe cage */}
      <mesh ref={cage} scale={isMobile ? 1.4 : 1.45}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={isMobile ? 0.22 : 0.28} />
      </mesh>

      {/* Outer subtle ring cage */}
      <mesh ref={outerCage} scale={isMobile ? 1.8 : 1.8}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={isMobile ? 0.12 : 0.16} />
      </mesh>
    </Float>
  )
}

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 800 : 2000
  const detail = isMobile ? 4 : 8
  const posX = isMobile ? 0 : 2.4
  const posY = isMobile ? -0.3 : 0.1

  return (
    <group position={[posX, posY, 0]}>
      <ParticleSwarm count={count} isMobile={isMobile} />
      <Core detail={detail} isMobile={isMobile} />
    </group>
  )
}

export default function HeroScene({ isMobile }: { isMobile: boolean }) {
  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 5.8], fov: isMobile ? 55 : 48 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 4, 4]} intensity={38} color="#22d3ee" distance={22} />
      <pointLight position={[-5, -3, -3]} intensity={28} color="#8b5cf6" distance={22} />

      <Stars radius={80} depth={45} count={isMobile ? 800 : 2000} factor={3.5} saturation={0} fade speed={0.5} />
      <SceneContent isMobile={isMobile} />
    </Canvas>
  )
}
