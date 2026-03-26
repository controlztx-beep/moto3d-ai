"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ContactShadows, Environment } from "@react-three/drei";

export function EnvironmentSetup() {
  const grid = useMemo(
    () => new THREE.GridHelper(20, 40, 0x111122, 0x111122),
    [],
  );

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[10, 10, 5]}
        intensity={1.5}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <directionalLight position={[0, 8, -10]} intensity={0.3} color="#0066FF" />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={15}
        blur={2.5}
        far={4}
      />
      <primitive object={grid} position={[0, -0.01, 0]} />
    </>
  );
}
