"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Maximize2,
  PanelLeftClose,
  PanelRightClose,
  Pencil,
  Share2,
  Save,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Motorcycle } from "@/stores/configuratorStore";
import { useConfiguratorStore } from "@/stores/configuratorStore";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function TopBar({ isDemoMode = false }: { isDemoMode?: boolean }) {
  const motorcycles = useConfiguratorStore((s) => s.motorcycles);
  const selectedMotorcycleId = useConfiguratorStore(
    (s) => s.selectedMotorcycleId,
  );
  const selectMotorcycle = useConfiguratorStore((s) => s.selectMotorcycle);
  const configName = useConfiguratorStore((s) => s.configName);
  const setConfigName = useConfiguratorStore((s) => s.setConfigName);
  const totalPrice = useConfiguratorStore((s) => s.totalPrice);
  const toggleLeftPanel = useConfiguratorStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = useConfiguratorStore((s) => s.toggleRightPanel);
  const toggleShareModal = useConfiguratorStore((s) => s.toggleShareModal);
  const globalColor = useConfiguratorStore((s) => s.globalColor);
  const globalMaterial = useConfiguratorStore((s) => s.globalMaterial);
  const partColors = useConfiguratorStore((s) => s.partColors);
  const equippedParts = useConfiguratorStore((s) => s.equippedParts);
  const currentConfigId = useConfiguratorStore((s) => s.currentConfigId);
  const setCurrentConfigId = useConfiguratorStore((s) => s.setCurrentConfigId);
  const isDirty = useConfiguratorStore((s) => s.isDirty);
  const setDirty = useConfiguratorStore((s) => s.setDirty);

  const [editing, setEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(configName);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setDraftName(configName);
  }, [configName]);

  const currentMoto = motorcycles.find(
    (m) => m.id === selectedMotorcycleId,
  ) as Motorcycle | undefined;

  const label = currentMoto
    ? `${currentMoto.brand} — ${currentMoto.name}`
    : "Select motorcycle";

  const saveName = React.useCallback(() => {
    setConfigName(draftName.trim());
    setEditing(false);
  }, [draftName, setConfigName]);

  const requestFullscreen = React.useCallback(() => {
    void document.documentElement.requestFullscreen?.();
  }, []);

  const handleSave = React.useCallback(async () => {
    if (isDemoMode) {
      toast.error('Please sign up to save configurations', {
        action: {
          label: 'Sign Up',
          onClick: () => window.location.href = '/register',
        },
      });
      return;
    }

    if (!selectedMotorcycleId) {
      toast.error('Please select a motorcycle first');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in to save configurations');
        return;
      }

      const config_data = {
        globalColor,
        globalMaterial,
        partColors,
        equippedParts,
      };

      const configData = {
        user_id: user.id,
        motorcycle_id: selectedMotorcycleId,
        name: configName || 'Untitled Configuration',
        config_data,
        total_price: totalPrice,
      };

      if (currentConfigId) {
        const { error } = await supabase
          .from('configurations')
          .update({ ...configData, updated_at: new Date().toISOString() })
          .eq('id', currentConfigId);

        if (error) throw error;
        toast.success('Configuration updated!');
      } else {
        const { data, error } = await supabase
          .from('configurations')
          .insert(configData)
          .select('id')
          .single();

        if (error) throw error;
        if (data) {
          setCurrentConfigId(data.id);
          toast.success('Configuration saved!');
        }
      }

      setDirty(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }, [
    isDemoMode,
    selectedMotorcycleId,
    configName,
    globalColor,
    globalMaterial,
    partColors,
    equippedParts,
    totalPrice,
    currentConfigId,
    setCurrentConfigId,
    setDirty,
  ]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2.5 border-b border-border bg-background/95 px-4 backdrop-blur-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  )}
                  aria-label="Back"
                >
                  <ChevronLeft className="size-4" />
                </Link>
              }
            />
            <TooltipContent>Back to Dashboard</TooltipContent>
          </Tooltip>

          <Select
            value={selectedMotorcycleId ?? undefined}
            onValueChange={(id) => {
              if (typeof id === "string" && id) selectMotorcycle(id);
            }}
          >
            <SelectTrigger size="sm" className="max-w-[min(100%,14rem)] min-w-0">
              <SelectValue>{label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {motorcycles.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.brand} — {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex">
          {editing ? (
            <Input
              autoFocus
              className="max-w-xs text-center"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") {
                  setDraftName(configName);
                  setEditing(false);
                }
              }}
            />
          ) : (
            <button
              type="button"
              className="flex max-w-full items-center gap-2 truncate text-sm font-medium"
              onClick={() => setEditing(true)}
            >
              <span className="truncate">
                {configName || "Untitled configuration"}
              </span>
              <Pencil className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <div className="flex items-center gap-2">
            {isDirty && !saving && (
              <div className="flex items-center gap-1.5 text-xs text-yellow-600">
                <div className="size-2 rounded-full bg-yellow-600" />
                <span className="hidden sm:inline">Unsaved</span>
              </div>
            )}
            {!isDirty && !saving && currentConfigId && (
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <Check className="size-3" />
                <span className="hidden sm:inline">Saved</span>
              </div>
            )}
            {saving && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </div>
            )}
          </div>

          <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1 font-bold text-primary text-sm">
            {formatUsd(totalPrice)}
          </div>

          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
              onClick={handleSave}
              disabled={saving}
              aria-label="Save configuration"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>Save configuration</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
              onClick={toggleLeftPanel}
              aria-label="Toggle parts panel"
            >
              <PanelLeftClose className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Toggle catalog</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
              onClick={toggleRightPanel}
              aria-label="Toggle details panel"
            >
              <PanelRightClose className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Toggle details</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
              onClick={toggleShareModal}
              aria-label="Share"
            >
              <Share2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
              onClick={requestFullscreen}
              aria-label="Fullscreen"
            >
              <Maximize2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Fullscreen</TooltipContent>
          </Tooltip>
        </div>
      </header>
  );
}
