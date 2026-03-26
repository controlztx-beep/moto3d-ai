"use client";

import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function Part({
  children,
  speed,
  axis,
}: {
  children: ReactNode;
  speed: number;
  axis: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = axis[0] * t;
    ref.current.rotation.y = axis[1] * t;
    ref.current.rotation.z = axis[2] * t;
    ref.current.position.y = Math.sin(t * 0.8) * 0.15;
  });
  return <group ref={ref}>{children}</group>;
}

function FloatingScene() {
  const parts = useMemo(
    () => [
      {
        key: "gear",
        pos: [-1.2, 0.2, 0] as [number, number, number],
        speed: 0.35,
        axis: [0.2, 1, 0] as [number, number, number],
        node: (
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
            <meshStandardMaterial
              color="#1a2230"
              metalness={0.85}
              roughness={0.2}
              emissive="#0066ff"
              emissiveIntensity={0.15}
            />
          </mesh>
        ),
      },
      {
        key: "piston",
        pos: [1, 0.5, 0.2] as [number, number, number],
        speed: 0.5,
        axis: [0.3, 0.6, 0.1] as [number, number, number],
        node: (
          <mesh>
            <cylinderGeometry args={[0.12, 0.14, 0.45, 12]} />
            <meshStandardMaterial
              color="#252530"
              metalness={0.9}
              roughness={0.18}
              emissive="#00ff88"
              emissiveIntensity={0.12}
            />
          </mesh>
        ),
      },
      {
        key: "wheel",
        pos: [0.3, -0.4, 0.8] as [number, number, number],
        speed: 0.28,
        axis: [1, 0.2, 0] as [number, number, number],
        node: (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.04, 12, 28]} />
            <meshStandardMaterial color="#2c2c3a" metalness={0.8} roughness={0.25} />
          </mesh>
        ),
      },
      {
        key: "exhaust",
        pos: [-0.6, -0.2, -0.7] as [number, number, number],
        speed: 0.42,
        axis: [0.1, 0.2, 0.9] as [number, number, number],
        node: (
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
            <meshStandardMaterial
              color="#3a363f"
              metalness={0.7}
              roughness={0.35}
              emissive="#ff6633"
              emissiveIntensity={0.25}
            />
          </mesh>
        ),
      },
      {
        key: "plug",
        pos: [1.1, -0.1, -0.4] as [number, number, number],
        speed: 0.55,
        axis: [0.4, 0.4, 0.4] as [number, number, number],
        node: (
          <group>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.22, 8]} />
              <meshStandardMaterial color="#c8c8d8" metalness={0.75} roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[0.1, 0.08, 0.1]} />
              <meshStandardMaterial
                color="#222"
                metalness={0.5}
                roughness={0.4}
                emissive="#0066ff"
                emissiveIntensity={0.08}
              />
            </mesh>
          </group>
        ),
      },
      {
        key: "caliper",
        pos: [-0.9, 0.6, -0.3] as [number, number, number],
        speed: 0.38,
        axis: [0.2, 1, 0.3] as [number, number, number],
        node: (
          <mesh>
            <boxGeometry args={[0.18, 0.22, 0.14]} />
            <meshStandardMaterial
              color="#101018"
              metalness={0.6}
              roughness={0.35}
              emissive="#00ff88"
              emissiveIntensity={0.1}
            />
          </mesh>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[2, 3, 2]} intensity={0.7} color="#0066ff" />
      <pointLight position={[-2, 1, -1]} intensity={0.45} color="#00ff88" />
      {parts.map((p) => (
        <group key={p.key} position={p.pos}>
          <Part speed={p.speed} axis={p.axis}>
            {p.node}
          </Part>
        </group>
      ))}
    </>
  );
}

export function FloatingParts() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      style={{ width: "100%", height: "55vh", pointerEvents: "none" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false }}
    >
      <FloatingScene />
    </Canvas>
  );
}
