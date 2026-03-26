"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import {
  type MaterialType,
  useConfiguratorStore,
} from "@/stores/configuratorStore";

function getMaterialProps(matType: MaterialType) {
  switch (matType) {
    case "matte":
      return { roughness: 0.9, metalness: 0.1 };
    case "glossy":
      return { roughness: 0.1, metalness: 0.3 };
    case "metallic":
      return { roughness: 0.15, metalness: 0.9 };
    case "carbon":
      return { roughness: 0.4, metalness: 0.5 };
    case "brushed":
      return { roughness: 0.35, metalness: 0.85 };
    default:
      return { roughness: 0.15, metalness: 0.9 };
  }
}

function mapMeshNameToPart(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('engine') || lowerName.includes('motor')) return 'engine';
  if (lowerName.includes('exhaust') || lowerName.includes('pipe') || lowerName.includes('muffler')) return 'exhaust';
  if (lowerName.includes('wheel') || lowerName.includes('tire') || lowerName.includes('rim')) {
    return lowerName.includes('front') ? 'front-wheel' : 'rear-wheel';
  }
  if (lowerName.includes('seat')) return 'seat';
  if (lowerName.includes('fork') || lowerName.includes('suspension')) return 'suspension';
  if (lowerName.includes('brake') || lowerName.includes('caliper')) return 'brakes';
  if (lowerName.includes('light') || lowerName.includes('lamp') || lowerName.includes('headlight')) return 'lights';
  if (lowerName.includes('handle') || lowerName.includes('bar')) return 'handlebars';
  if (lowerName.includes('tank') || lowerName.includes('fuel')) return 'fuel-tank';
  if (lowerName.includes('frame')) return 'frame';
  return 'body';
}

export function MotorcycleModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/Motorcycle.glb');
  
  const { globalColor, globalMaterial, hoveredPartGroup, selectedPartGroup } = useConfiguratorStore();
  const hoverPartGroup = useConfiguratorStore((s) => s.hoverPartGroup);
  const selectPartGroup = useConfiguratorStore((s) => s.selectPartGroup);

  // Clone the scene so we can modify materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Log mesh names for debugging
    console.log('=== GLB Model Structure ===');
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log('Mesh:', child.name, 'Material:', child.material?.name || 'unnamed');
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.partName = child.name || 'body';
      }
    });
    console.log('=========================');
    
    return clone;
  }, [scene]);

  // Update colors and materials reactively
  useEffect(() => {
    const matProps = getMaterialProps(globalMaterial);
    
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (!mat) return;
        
        // Clone material if not already cloned
        if (!child.userData.materialCloned) {
          child.material = mat.clone();
          child.userData.materialCloned = true;
        }
        
        const clonedMat = child.material as THREE.MeshStandardMaterial;
        const meshName = child.name.toLowerCase();
        const partCategory = mapMeshNameToPart(meshName);
        
        // Apply global color to body/paintable parts
        const isPaintable = partCategory === 'body' || partCategory === 'fuel-tank' || 
                           meshName.includes('fairing') || meshName.includes('cowl') || 
                           meshName.includes('fender') || meshName.includes('cover') ||
                           meshName.includes('panel') || meshName.includes('shroud');
        
        if (isPaintable) {
          clonedMat.color.set(globalColor);
        }
        
        // Apply material properties
        clonedMat.roughness = matProps.roughness;
        clonedMat.metalness = matProps.metalness;

        // Hover/selection glow
        if (hoveredPartGroup && partCategory === hoveredPartGroup) {
          clonedMat.emissive.set('#0066FF');
          clonedMat.emissiveIntensity = 0.15;
        } else if (selectedPartGroup && partCategory === selectedPartGroup) {
          clonedMat.emissive.set('#00FF88');
          clonedMat.emissiveIntensity = 0.2;
        } else {
          clonedMat.emissive.set('#000000');
          clonedMat.emissiveIntensity = 0;
        }
      }
    });
  }, [clonedScene, globalColor, globalMaterial, hoveredPartGroup, selectedPartGroup]);

  // Slow auto-rotation when not interacting
  useFrame((_, delta) => {
    if (groupRef.current && !hoveredPartGroup) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Calculate bounds to center and scale the model
  const { center, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const centerVec = box.getCenter(new THREE.Vector3());
    
    // Scale to fit in roughly 3 units
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 3;
    const scaleVal = maxDim > 0 ? targetSize / maxDim : 1;
    
    return { center: centerVec, scale: scaleVal };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        scale={scale}
        position={[-center.x * scale, -center.y * scale + 0.5, -center.z * scale]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          const meshName = (e.object as THREE.Mesh)?.name?.toLowerCase() || '';
          const partCategory = mapMeshNameToPart(meshName);
          selectPartGroup(partCategory);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          const meshName = (e.object as THREE.Mesh)?.name?.toLowerCase() || '';
          const partCategory = mapMeshNameToPart(meshName);
          hoverPartGroup(partCategory);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          hoverPartGroup(null);
        }}
      />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/Motorcycle.glb');
