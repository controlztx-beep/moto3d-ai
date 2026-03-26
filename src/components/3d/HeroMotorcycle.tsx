"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

const BLUE = "#0066FF";
const DARK = "#1a1a24";
const ORANGE_TIP = "#ff4400";

function Particles() {
  const groupRef = useRef<THREE.Group>(null);
  const data = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        base: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 5 + 0.5,
          (Math.random() - 0.5) * 6,
        ),
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.45 ? "#0066FF" : "#00FF88",
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = groupRef.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const d = data[i];
      const amp = 0.08;
      mesh.position.set(
        d.base.x + Math.sin(t * 0.3 + d.phase) * amp,
        d.base.y + Math.cos(t * 0.25 + d.phase * 1.3) * amp,
        d.base.z + Math.sin(t * 0.2 + d.phase * 0.7) * amp,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {data.map((d, i) => (
        <mesh key={i} position={d.base}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial
            color={d.color}
            emissive={d.color}
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.35}
            opacity={0.4}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function MotorcycleModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const metal = {
    metalness: 0.8,
    roughness: 0.2,
  } as const;

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 12]} />
        <meshStandardMaterial
          color={BLUE}
          emissive={BLUE}
          emissiveIntensity={0.35}
          {...metal}
        />
      </mesh>
      <mesh position={[-0.12, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.35, 10]} />
        <meshStandardMaterial
          color={BLUE}
          emissive={BLUE}
          emissiveIntensity={0.25}
          {...metal}
        />
      </mesh>
      <mesh position={[0.12, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.35, 10]} />
        <meshStandardMaterial
          color={BLUE}
          emissive={BLUE}
          emissiveIntensity={0.25}
          {...metal}
        />
      </mesh>

      <mesh position={[0, 0.35, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.15, 16, 32]} />
        <meshStandardMaterial color="#222230" {...metal} />
      </mesh>
      <mesh position={[0, 0.35, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.15, 16, 32]} />
        <meshStandardMaterial color="#222230" {...metal} />
      </mesh>

      <group position={[0, 0.45, -0.15]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 0.35, 0.5]} />
          <meshStandardMaterial
            color={DARK}
            emissive={BLUE}
            emissiveIntensity={0.12}
            {...metal}
          />
        </mesh>
        <mesh position={[0.22, -0.05, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 10]} />
          <meshStandardMaterial color="#2a2a38" {...metal} />
        </mesh>
        <mesh position={[-0.22, -0.05, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.18, 10]} />
          <meshStandardMaterial color="#2a2a38" {...metal} />
        </mesh>
      </group>

      <mesh position={[0, 0.95, 0.35]} scale={[0.55, 0.42, 0.95]}>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshStandardMaterial
          color="#0044cc"
          emissive={BLUE}
          emissiveIntensity={0.08}
          metalness={0.55}
          roughness={0.18}
        />
      </mesh>

      <mesh position={[0, 0.88, -0.55]}>
        <boxGeometry args={[0.35, 0.12, 0.55]} />
        <meshStandardMaterial color="#0d0d14" roughness={0.65} metalness={0.15} />
      </mesh>

      <mesh position={[0, 1.05, 0.95]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.15, 8]} />
        <meshStandardMaterial color="#3a3a48" {...metal} />
      </mesh>

      <mesh position={[-0.15, 0.72, 1.05]} rotation={[Math.PI / 2.3, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55, 8]} />
        <meshStandardMaterial color="#4a4a5a" {...metal} />
      </mesh>
      <mesh position={[0.15, 0.72, 1.05]} rotation={[-Math.PI / 2.3, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55, 8]} />
        <meshStandardMaterial color="#4a4a5a" {...metal} />
      </mesh>

      <mesh position={[0.32, 0.42, -0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 1.2, 10]} />
        <meshStandardMaterial color="#33303a" {...metal} />
      </mesh>
      <mesh position={[0.78, 0.42, -0.95]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.04, 0.12, 8]} />
        <meshStandardMaterial
          color={ORANGE_TIP}
          emissive={ORANGE_TIP}
          emissiveIntensity={1.2}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#06060b"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 4]} intensity={1.15} />
      <pointLight position={[-4, 3, -2]} intensity={0.8} color={BLUE} distance={12} />
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.6}>
        <MotorcycleModel />
      </Float>
      <Particles />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} blur={2} far={4.5} />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 6}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export function HeroMotorcycle() {
  return (
    <Canvas
      camera={{ position: [5, 3, 5], fov: 45 }}
      style={{ height: "100%", width: "100%" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
