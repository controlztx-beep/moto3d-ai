"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Model({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Motorcycle.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = (child.material as THREE.Material).clone();
        child.castShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Apply color to all meshes
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.color) {
          mat.color.set(color);
          mat.roughness = 0.15;
          mat.metalness = 0.9;
        }
      }
    });
  }, [clonedScene, color]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const { center, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const s = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(s.x, s.y, s.z);
    return { center: c, scale: maxDim > 0 ? 2.5 / maxDim : 1 };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={scale}
        position={[-center.x * scale, -center.y * scale, -center.z * scale]}
      />
    </group>
  );
}

export function DemoMotorcycleGLB({ color = "#0066FF" }: { color?: string }) {
  return (
    <Canvas
      camera={{ position: [4, 2, 4], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-3, 2, -3]} intensity={0.5} />
        <Model color={color} />
        <ContactShadows position={[0, -1, 0]} opacity={0.4} blur={2} far={4} />
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/Motorcycle.glb");
