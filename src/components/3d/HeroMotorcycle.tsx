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
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

const BLUE = "#0066FF";

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
  const { scene } = useGLTF('/models/Motorcycle.glb');

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Clone and apply stylish blue metallic material
  const styledScene = useMemo(() => {
    const clone = scene.clone(true);
    
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Clone material and apply blue metallic look
        if (child.material) {
          child.material = (child.material as THREE.MeshStandardMaterial).clone();
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.color.set(BLUE);
          mat.emissive.set(BLUE);
          mat.emissiveIntensity = 0.25;
          mat.metalness = 0.85;
          mat.roughness = 0.15;
        }
      }
    });
    
    return clone;
  }, [scene]);

  // Calculate bounds to center and scale
  const { center, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(styledScene);
    const size = box.getSize(new THREE.Vector3());
    const centerVec = box.getCenter(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.5;
    const scaleVal = maxDim > 0 ? targetSize / maxDim : 1;
    
    return { center: centerVec, scale: scaleVal };
  }, [styledScene]);

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <primitive 
        object={styledScene}
        scale={scale}
        position={[-center.x * scale, -center.y * scale, -center.z * scale]}
      />
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
      camera={{ position: [4.5, 2.5, 4.5], fov: 50 }}
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

// Preload the model
useGLTF.preload('/models/Motorcycle.glb');
