"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import {
  type MaterialType,
  useConfiguratorStore,
} from "@/stores/configuratorStore";

function getPartMaterial(
  baseColor: string,
  matType: MaterialType,
  isHovered: boolean,
  isSelected: boolean,
) {
  let roughness = 0.15;
  let metalness = 0.9;
  switch (matType) {
    case "matte":
      roughness = 0.9;
      metalness = 0.1;
      break;
    case "glossy":
      roughness = 0.1;
      metalness = 0.3;
      break;
    case "metallic":
      roughness = 0.15;
      metalness = 0.9;
      break;
    case "carbon":
      roughness = 0.4;
      metalness = 0.5;
      break;
    case "brushed":
      roughness = 0.35;
      metalness = 0.85;
      break;
    default:
      break;
  }

  const emissive = isSelected ? "#00FF88" : isHovered ? "#0066FF" : "#000000";
  const emissiveIntensity = isSelected ? 0.2 : isHovered ? 0.15 : 0;

  return (
    <meshStandardMaterial
      color={baseColor}
      roughness={roughness}
      metalness={metalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function usePartHighlight(name: string) {
  const hovered =
    useConfiguratorStore((s) => s.hoveredPartGroup === name);
  const selected =
    useConfiguratorStore((s) => s.selectedPartGroup === name);
  return { hovered, selected };
}

function PartGroup({
  name,
  position,
  children,
}: {
  name: string;
  position?: [number, number, number];
  children: React.ReactNode;
}) {
  const hoverPartGroup = useConfiguratorStore((s) => s.hoverPartGroup);
  const selectPartGroup = useConfiguratorStore((s) => s.selectPartGroup);

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        hoverPartGroup(name);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        hoverPartGroup(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectPartGroup(name);
      }}
    >
      {children}
    </group>
  );
}

function FrontWheel() {
  const { hovered, selected } = usePartHighlight("front-wheel");
  return (
    <PartGroup name="front-wheel" position={[0, 0.4, 1.3]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.12, 16, 48]} />
        {getPartMaterial("#1a1a1a", "matte", hovered, selected)}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.03, 8, 48]} />
        {getPartMaterial("#999999", "metallic", hovered, selected)}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.01, 24]} />
        {getPartMaterial("#666666", "metallic", hovered, selected)}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        {getPartMaterial("#333333", "metallic", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function RearWheel() {
  const { hovered, selected } = usePartHighlight("rear-wheel");
  return (
    <PartGroup name="rear-wheel" position={[0, 0.4, -1.2]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.14, 16, 48]} />
        {getPartMaterial("#1a1a1a", "matte", hovered, selected)}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.03, 8, 48]} />
        {getPartMaterial("#999999", "metallic", hovered, selected)}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.01, 24]} />
        {getPartMaterial("#666666", "metallic", hovered, selected)}
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.02, 8, 20]} />
        {getPartMaterial("#FFD700", "metallic", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Frame() {
  const { hovered, selected } = usePartHighlight("frame");
  return (
    <PartGroup name="frame" position={[0, 0, 0]}>
      <mesh position={[0, 0.9, 0.05]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        {getPartMaterial("#2a2a2a", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0, 0.55, 0.5]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
        {getPartMaterial("#2a2a2a", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0, 0.85, -0.5]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
        {getPartMaterial("#2a2a2a", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0, 0.42, -0.65]} rotation={[0.05, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />
        {getPartMaterial("#2a2a2a", "metallic", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Engine() {
  const { hovered, selected } = usePartHighlight("engine");
  return (
    <PartGroup name="engine" position={[0, 0.38, 0.15]}>
      <mesh>
        <boxGeometry args={[0.38, 0.3, 0.5]} />
        {getPartMaterial("#333333", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0, 0.2, 0.12]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.32, 0.12, 0.25]} />
        {getPartMaterial("#444444", "metallic", hovered, selected)}
      </mesh>
      {[0.05, 0.09, 0.13, 0.17].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.4, 0.015, 0.3]} />
          {getPartMaterial("#444444", "metallic", hovered, selected)}
        </mesh>
      ))}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.25]} />
        {getPartMaterial("#222222", "metallic", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Exhaust() {
  const { hovered, selected } = usePartHighlight("exhaust");
  return (
    <PartGroup name="exhaust" position={[0, 0, 0]}>
      <mesh position={[0.2, 0.3, -0.1]} rotation={[0.5, 0, 0.1]}>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 8]} />
        {getPartMaterial("#8B7355", "brushed", hovered, selected)}
      </mesh>
      <mesh position={[0.2, 0.22, -0.65]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.022, 0.018, 0.6, 8]} />
        {getPartMaterial("#8B7355", "brushed", hovered, selected)}
      </mesh>
      <mesh position={[0.2, 0.28, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.045, 0.38, 16]} />
        {getPartMaterial("#666666", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0.2, 0.28, -1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.055, 0.02, 16]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff4400"
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </PartGroup>
  );
}

function FuelTank() {
  const globalColor = useConfiguratorStore((s) => s.globalColor);
  const globalMaterial = useConfiguratorStore((s) => s.globalMaterial);
  const { hovered, selected } = usePartHighlight("fuel-tank");
  return (
    <PartGroup name="fuel-tank" position={[0, 1.08, 0.3]}>
      <mesh scale={[0.24, 0.18, 0.4]}>
        <sphereGeometry args={[1, 32, 16]} />
        {getPartMaterial(globalColor, globalMaterial, hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Body() {
  const globalColor = useConfiguratorStore((s) => s.globalColor);
  const globalMaterial = useConfiguratorStore((s) => s.globalMaterial);
  const { hovered, selected } = usePartHighlight("body");
  return (
    <PartGroup name="body" position={[0, 0, 0]}>
      <mesh position={[0, 1.12, 0.95]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[0.32, 0.22, 0.25]} />
        {getPartMaterial(globalColor, globalMaterial, hovered, selected)}
      </mesh>
      <mesh position={[0, 1.28, 0.85]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.01]} />
        <meshStandardMaterial
          color="#88ccff"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0.19, 0.65, 0.2]} rotation={[0.2, 0, -0.15]}>
        <boxGeometry args={[0.01, 0.28, 0.55]} />
        {getPartMaterial(globalColor, globalMaterial, hovered, selected)}
      </mesh>
      <mesh position={[-0.19, 0.65, 0.2]} rotation={[0.2, 0, 0.15]}>
        <boxGeometry args={[0.01, 0.28, 0.55]} />
        {getPartMaterial(globalColor, globalMaterial, hovered, selected)}
      </mesh>
      <mesh position={[0, 0.92, -0.85]}>
        <boxGeometry args={[0.18, 0.1, 0.45]} />
        {getPartMaterial(globalColor, globalMaterial, hovered, selected)}
      </mesh>
      <mesh position={[0, 0.58, 1.35]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.14, 0.015, 0.32]} />
        {getPartMaterial(globalColor, globalMaterial, hovered, selected)}
      </mesh>
      <mesh position={[0, 0.32, -1.35]}>
        <boxGeometry args={[0.16, 0.015, 0.28]} />
        {getPartMaterial("#1a1a1a", "matte", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Seat() {
  const { hovered, selected } = usePartHighlight("seat");
  return (
    <PartGroup name="seat" position={[0, 0, 0]}>
      <mesh position={[0, 1.0, -0.35]}>
        <boxGeometry args={[0.26, 0.08, 0.45]} />
        {getPartMaterial("#111111", "matte", hovered, selected)}
      </mesh>
      <mesh position={[0, 0.96, -0.7]}>
        <boxGeometry args={[0.2, 0.06, 0.2]} />
        {getPartMaterial("#111111", "matte", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Handlebars() {
  const { hovered, selected } = usePartHighlight("handlebars");
  return (
    <PartGroup name="handlebars" position={[0, 1.32, 1.0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 8]} />
        {getPartMaterial("#333333", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        {getPartMaterial("#111111", "matte", hovered, selected)}
      </mesh>
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        {getPartMaterial("#111111", "matte", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Suspension() {
  const { hovered, selected } = usePartHighlight("suspension");
  return (
    <PartGroup name="suspension" position={[0, 0, 0]}>
      <mesh position={[0.07, 0.88, 1.12]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.018, 0.85, 8]} />
        {getPartMaterial("#FFD700", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[-0.07, 0.88, 1.12]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.018, 0.85, 8]} />
        {getPartMaterial("#FFD700", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0, 0.65, -0.65]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.012, 0.32, 8]} />
        {getPartMaterial("#333333", "metallic", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

function Lights() {
  const { hovered, selected } = usePartHighlight("lights");
  return (
    <PartGroup name="lights" position={[0, 0, 0]}>
      <mesh position={[0, 1.18, 1.18]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={selected ? "#00FF88" : hovered ? "#0066FF" : "#ffffff"}
          emissiveIntensity={
            selected ? 0.45 : hovered ? 0.35 : 0.5
          }
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.9, -1.08]}>
        <boxGeometry args={[0.12, 0.025, 0.015]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive={selected ? "#00FF88" : hovered ? "#0066FF" : "#ff0000"}
          emissiveIntensity={
            selected ? 0.5 : hovered ? 0.25 : 0.8
          }
        />
      </mesh>
    </PartGroup>
  );
}

function Brakes() {
  const { hovered, selected } = usePartHighlight("brakes");
  return (
    <PartGroup name="brakes" position={[0, 0, 0]}>
      <mesh position={[0.12, 0.28, 1.3]}>
        <boxGeometry args={[0.035, 0.07, 0.05]} />
        {getPartMaterial("#cc0000", "metallic", hovered, selected)}
      </mesh>
      <mesh position={[0.1, 0.25, -1.2]}>
        <boxGeometry args={[0.03, 0.05, 0.04]} />
        {getPartMaterial("#cc0000", "metallic", hovered, selected)}
      </mesh>
    </PartGroup>
  );
}

export function MotorcycleModel() {
  const groupRef = useRef<THREE.Group>(null);
  const hoveredPartGroup = useConfiguratorStore((s) => s.hoveredPartGroup);

  useFrame((_, delta) => {
    if (groupRef.current && hoveredPartGroup === null) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <FrontWheel />
      <RearWheel />
      <Frame />
      <Engine />
      <Exhaust />
      <FuelTank />
      <Body />
      <Seat />
      <Handlebars />
      <Suspension />
      <Lights />
      <Brakes />
    </group>
  );
}
