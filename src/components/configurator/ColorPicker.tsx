"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { MaterialType } from "@/stores/configuratorStore";
import { useConfiguratorStore } from "@/stores/configuratorStore";

const colorPresets = [
  { name: "Kawasaki Green", hex: "#00CC00" },
  { name: "Racing Red", hex: "#FF0000" },
  { name: "Midnight Black", hex: "#111111" },
  { name: "Pearl White", hex: "#F0F0F0" },
  { name: "Electric Blue", hex: "#0066FF" },
  { name: "Neon Green", hex: "#00FF88" },
  { name: "Sunset Orange", hex: "#FF6600" },
  { name: "Gunmetal", hex: "#444455" },
  { name: "Candy Red", hex: "#CC0033" },
  { name: "Titanium Gray", hex: "#888899" },
] as const;

const materials: { type: MaterialType; label: string }[] = [
  { type: "matte", label: "Matte" },
  { type: "glossy", label: "Glossy" },
  { type: "metallic", label: "Metallic" },
  { type: "carbon", label: "Carbon" },
  { type: "brushed", label: "Brushed" },
];

export function ColorPicker() {
  const globalColor = useConfiguratorStore((s) => s.globalColor);
  const globalMaterial = useConfiguratorStore((s) => s.globalMaterial);
  const setGlobalColor = useConfiguratorStore((s) => s.setGlobalColor);
  const setGlobalMaterial = useConfiguratorStore((s) => s.setGlobalMaterial);
  const setPartColor = useConfiguratorStore((s) => s.setPartColor);
  const selectedPartGroup = useConfiguratorStore((s) => s.selectedPartGroup);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const applyColor = React.useCallback(
    (hex: string) => {
      setGlobalColor(hex);
      setPartColor("fuel-tank", hex);
      setPartColor("body", hex);
    },
    [setGlobalColor, setPartColor],
  );

  return (
    <div className="flex h-full w-full items-center gap-4 overflow-x-auto px-4">
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Paint
        </span>
        <div className="flex items-center gap-1.5">
          {colorPresets.map(({ name, hex }) => (
            <Tooltip key={hex}>
              <TooltipTrigger
                className={cn(
                  "h-7 w-7 shrink-0 rounded-full border-2 transition-all duration-200",
                  globalColor === hex
                    ? "scale-110 border-white ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "border-transparent hover:scale-110 hover:border-white/50",
                )}
                style={{ backgroundColor: hex }}
                onClick={() => applyColor(hex)}
                aria-label={name}
              />
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="shrink-0"
            onClick={() => inputRef.current?.click()}
            aria-label="Custom color"
          >
            <Plus className="size-4" />
          </Button>
          <input
            ref={inputRef}
            type="color"
            className="sr-only"
            value={globalColor}
            onChange={(e) => applyColor(e.target.value)}
          />
        </div>
      </div>

      <div className="mx-2 h-8 w-px shrink-0 bg-border" />

      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Material
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {materials.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              className={cn(
                "rounded-full px-3 py-1.5 font-medium text-xs transition-all",
                globalMaterial === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted",
              )}
              onClick={() => setGlobalMaterial(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-2 hidden h-8 w-px shrink-0 bg-border sm:block" />

      <div className="ml-auto flex shrink-0 items-center gap-2 text-muted-foreground text-xs">
        <span>
          Part:{" "}
          <span className="text-foreground">{selectedPartGroup ?? "None"}</span>
        </span>
        <span
          className="inline-block h-3 w-3 rounded-full border border-border"
          style={{ backgroundColor: globalColor }}
          aria-hidden
        />
      </div>
    </div>
  );
}
