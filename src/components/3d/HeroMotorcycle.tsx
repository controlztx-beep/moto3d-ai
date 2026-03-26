"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  ContactShadows,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

function MotorcycleModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/Motorcycle.glb');

  // Slow rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Clone scene and preserve natural colors
  const naturalScene = useMemo(() => {
    const clone = scene.clone(true);
    
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Keep natural colors but ensure materials are properly set up
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          // Don't override colors - let the model's natural colors show
          // Just ensure good material properties for premium look
          mat.metalness = Math.min(mat.metalness || 0.3, 0.7);
          mat.roughness = Math.max(mat.roughness || 0.3, 0.2);
        }
      }
    });
    
    return clone;
  }, [scene]);

  // Calculate bounds to center and scale
  const { center, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(naturalScene);
    const size = box.getSize(new THREE.Vector3());
    const centerVec = box.getCenter(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.8;
    const scaleVal = maxDim > 0 ? targetSize / maxDim : 1;
    
    return { center: centerVec, scale: scaleVal };
  }, [naturalScene]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <primitive 
        object={naturalScene}
        scale={scale}
        position={[-center.x * scale, -center.y * scale, -center.z * scale]}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Pure dark background for premium automotive feel */}
      <color attach="background" args={["#0a0a0a"]} />
      
      {/* Clean studio lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      
      <MotorcycleModel />
      
      {/* Clean ground shadow */}
      <ContactShadows 
        position={[0, -1.2, 0]} 
        opacity={0.5} 
        scale={10} 
        blur={2} 
        far={4} 
      />
      
      {/* Subtle environment for reflections */}
      <Environment preset="studio" />
    </>
  );
}

export function HeroMotorcycle() {
  return (
    <Canvas
      camera={{ position: [4, 2, 4], fov: 45 }}
      style={{ height: "100%", width: "100%" }}
      gl={{ antialias: true, alpha: false }}
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
