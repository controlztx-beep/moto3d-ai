"use client";

import { Suspense, useEffect, useState } from "react";
import { AdaptiveDpr, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { EnvironmentSetup } from "./EnvironmentSetup";
import { MotorcycleModel } from "./MotorcycleModel";

export function ConfiguratorCanvas() {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowOverlay(false), 2000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#08080F" }}
      >
        <Suspense fallback={null}>
          <MotorcycleModel />
          <EnvironmentSetup />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableDamping
        />
        <AdaptiveDpr pixelated />
      </Canvas>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#08080F]/90 transition-opacity duration-500",
          showOverlay ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!showOverlay}
      >
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">
          Loading 3D Model...
        </p>
      </div>
    </div>
  );
}
