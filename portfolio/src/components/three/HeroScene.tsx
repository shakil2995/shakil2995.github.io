import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#8b5cf6')

/** Additive particle shell that slowly rotates and drifts with the pointer. */
function ParticleSwarm({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const tmp = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Distribute on a lumpy spherical shell.
      const r = 2.4 + Math.random() * 1.9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions.set([x, y, z], i * 3)

      // Colour by height: cyan → violet (calmer, two-tone).
      const t = (y / 4.3 + 1) / 2
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
    ref.current.rotation.y += delta * 0.05
    // Pointer parallax — ease toward a small tilt.
    const px = state.pointer.x * 0.25
    const py = state.pointer.y * 0.25
    ref.current.rotation.x += (py - ref.current.rotation.x) * 0.04
    ref.current.rotation.z += (-px * 0.4 - ref.current.rotation.z) * 0.04
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.028}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Glowing, distorting core with a counter-rotating wireframe cage. */
function Core({ detail }: { detail: number }) {
  const cage = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.15
      cage.current.rotation.x += delta * 0.08
    }
  })

  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
      {/* Soft fake-bloom halo */}
      <mesh scale={2.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Distorting inner blob */}
      <mesh>
        <icosahedronGeometry args={[1.15, detail]} />
        <MeshDistortMaterial
          color="#6d28d9"
          emissive="#4c1d95"
          emissiveIntensity={0.55}
          roughness={0.12}
          metalness={0.65}
          distort={0.38}
          speed={1.8}
        />
      </mesh>

      {/* Wireframe cage */}
      <mesh ref={cage} scale={1.45}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
      </mesh>
    </Float>
  )
}

export default function HeroScene({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 1400 : 3200
  const detail = isMobile ? 5 : 8

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 5.6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 3, 4]} intensity={34} color="#22d3ee" distance={20} />
      <pointLight position={[-4, -2, -3]} intensity={26} color="#8b5cf6" distance={20} />

      <Stars radius={70} depth={40} count={isMobile ? 1500 : 3500} factor={4} saturation={0} fade speed={0.6} />
      <ParticleSwarm count={count} />
      <Core detail={detail} />
    </Canvas>
  )
}
