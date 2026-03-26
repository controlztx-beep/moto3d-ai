"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

export type DemoMaterialMode = "matte" | "glossy" | "metallic";

function matProps(mode: DemoMaterialMode) {
  switch (mode) {
    case "matte":
      return { metalness: 0.05, roughness: 0.95 };
    case "glossy":
      return { metalness: 0.12, roughness: 0.18 };
    case "metallic":
      return { metalness: 0.82, roughness: 0.22 };
    default:
      return { metalness: 0.5, roughness: 0.4 };
  }
}

function InteractiveBike({
  tankColor,
  materialMode,
  onHoverPart,
}: {
  tankColor: string;
  materialMode: DemoMaterialMode;
  onHoverPart?: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const col = useMemo(() => new THREE.Color(tankColor), [tankColor]);
  const m = matProps(materialMode);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  const setHover = (id: string | null) => onHoverPart?.(id);

  return (
    <group ref={groupRef} position={[0, 0.15, 0]}>
      <mesh
        position={[0, 0.65, 0.2]}
        scale={[0.48, 0.38, 0.82]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover("tank");
        }}
        onPointerLeave={() => setHover(null)}
      >
        <sphereGeometry args={[0.75, 28, 28]} />
        <meshStandardMaterial
          color={col}
          emissive={col}
          emissiveIntensity={0.06}
          metalness={m.metalness}
          roughness={m.roughness}
        />
      </mesh>

      <mesh
        position={[0, 0.42, -0.2]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover("engine");
        }}
        onPointerLeave={() => setHover(null)}
      >
        <boxGeometry args={[0.42, 0.38, 0.48]} />
        <meshStandardMaterial
          color="#1e1e2a"
          emissive="#0066ff"
          emissiveIntensity={0.08}
          metalness={0.75}
          roughness={0.28}
        />
      </mesh>

      <mesh
        position={[0, 0.28, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover("front-wheel");
        }}
        onPointerLeave={() => setHover(null)}
      >
        <torusGeometry args={[0.72, 0.12, 16, 32]} />
        <meshStandardMaterial color="#262635" metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh
        position={[0, 0.28, -0.95]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover("rear-wheel");
        }}
        onPointerLeave={() => setHover(null)}
      >
        <torusGeometry args={[0.72, 0.12, 16, 32]} />
        <meshStandardMaterial color="#262635" metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh
        position={[0.28, 0.4, -0.55]}
        rotation={[0, 0, Math.PI / 2]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover("exhaust");
        }}
        onPointerLeave={() => setHover(null)}
      >
        <cylinderGeometry args={[0.035, 0.04, 1, 10]} />
        <meshStandardMaterial
          color="#3a3842"
          metalness={0.8}
          roughness={0.3}
          emissive="#ff5522"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function DemoScene({
  tankColor,
  materialMode,
  onHoverPart,
}: {
  tankColor: string;
  materialMode: DemoMaterialMode;
  onHoverPart?: (id: string | null) => void;
}) {
  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#0a0a10"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 4]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.55} color="#0066ff" />
      <InteractiveBike
        tankColor={tankColor}
        materialMode={materialMode}
        onHoverPart={onHoverPart}
      />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.35} blur={2} far={4} />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 5}
      />
      <AdaptiveDpr pixelated />
    </Suspense>
  );
}

export function DemoMotorcycle({
  tankColor,
  materialMode,
  onHoverPart,
}: {
  tankColor: string;
  materialMode: DemoMaterialMode;
  onHoverPart?: (id: string | null) => void;
}) {
  return (
    <Canvas
      camera={{ position: [3.8, 2.2, 3.8], fov: 45 }}
      style={{ height: "100%", width: "100%" }}
      className="min-h-[280px] md:min-h-[360px]"
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <DemoScene
        tankColor={tankColor}
        materialMode={materialMode}
        onHoverPart={onHoverPart}
      />
    </Canvas>
  );
}
