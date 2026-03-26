"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { useConfiguratorStore } from "@/stores/configuratorStore";
import { ColorPicker } from "@/components/configurator/ColorPicker";

const DynamicCanvas = dynamic(
  () => import("@/components/3d/ConfiguratorCanvas").then((mod) => mod.ConfiguratorCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

export default function EmbedPage({ params }: { params: { orgId: string } }) {
  const motorcycles = useConfiguratorStore((s) => s.motorcycles);
  const selectedMotorcycleId = useConfiguratorStore((s) => s.selectedMotorcycleId);
  const selectMotorcycle = useConfiguratorStore((s) => s.selectMotorcycle);

  React.useEffect(() => {
    if (motorcycles.length > 0 && !selectedMotorcycleId) {
      selectMotorcycle(motorcycles[0].id);
    }
  }, [motorcycles, selectedMotorcycleId, selectMotorcycle]);

  const currentMotorcycle = motorcycles.find((m) => m.id === selectedMotorcycleId);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h1 className="font-display text-lg font-bold">
            {currentMotorcycle ? `${currentMotorcycle.brand} ${currentMotorcycle.name}` : 'MOTO3D AI'}
          </h1>
          <p className="text-xs text-muted-foreground">3D Motorcycle Configurator</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Embed ID: {params.orgId}
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative flex-1">
        <DynamicCanvas />
      </div>

      {/* Color Picker */}
      <div className="border-t border-border bg-background p-4">
        <ColorPicker />
      </div>

      {/* Watermark */}
      <div className="border-t border-border bg-muted/30 px-4 py-2 text-center">
        <Link 
          href="https://moto3d-ai.vercel.app" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Powered by <span className="font-semibold">MOTO3D AI</span>
        </Link>
      </div>
    </div>
  );
}
