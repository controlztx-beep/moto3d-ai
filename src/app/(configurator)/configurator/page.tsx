"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, PanelLeft, PanelRight, X } from "lucide-react";
import { toast } from "sonner";

import { AIChat } from "@/components/configurator/AIChat";
import { ColorPicker } from "@/components/configurator/ColorPicker";
import { PartDetails } from "@/components/configurator/PartDetails";
import { PartsCatalog } from "@/components/configurator/PartsCatalog";
import { ShareModal } from "@/components/configurator/ShareModal";
import { TopBar } from "@/components/configurator/TopBar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import type { Motorcycle, Part, MaterialType } from "@/stores/configuratorStore";
import { useConfiguratorStore } from "@/stores/configuratorStore";

const DynamicCanvas = dynamic(
  () =>
    import("@/components/3d/ConfiguratorCanvas").then((m) => ({
      default: m.ConfiguratorCanvas,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    ),
  },
);

const fallbackMotorcycles: Motorcycle[] = [
  {
    id: "mock-1",
    name: "Ninja ZX-6R",
    brand: "Kawasaki",
    model_year: 2024,
    category: "sport",
    description: "Middleweight supersport",
    specifications: {
      engine: "636cc inline-4",
      power: "128 HP",
      torque: "70.8 Nm",
      weight: "196 kg",
    },
    base_price: 11399,
  },
];

const fallbackParts: Part[] = [
  {
    id: "p1",
    motorcycle_id: "mock-1",
    name: "Inline-4 636cc Engine",
    category: "engine",
    description: "High-revving inline-four producing 128 HP",
    detailed_info:
      "The heart of the ZX-6R features dual overhead cams with 16 valves at 13500 RPM.",
    specifications: { displacement: "636cc", type: "Inline-4", power: "128 HP" },
    price: 3200,
    weight: 58.5,
    material: "Aluminum alloy",
    is_stock: true,
    sort_order: 1,
  },
  {
    id: "p2",
    motorcycle_id: "mock-1",
    name: "Akrapovic Slip-On Exhaust",
    category: "exhaust",
    description: "Titanium slip-on for enhanced performance",
    detailed_info:
      "Premium titanium exhaust reducing weight by 3.2kg with +3 HP gain.",
    specifications: {
      material: "Titanium",
      weight_savings: "3.2 kg",
      power_gain: "+3 HP",
    },
    price: 899,
    weight: 2.1,
    material: "Titanium",
    is_stock: false,
    sort_order: 2,
  },
  {
    id: "p3",
    motorcycle_id: "mock-1",
    name: "Stock Exhaust",
    category: "exhaust",
    description: "Factory stainless steel exhaust",
    detailed_info: "Stock exhaust for emissions compliance.",
    specifications: { material: "Stainless Steel", weight: "5.3 kg" },
    price: 0,
    weight: 5.3,
    material: "Stainless Steel",
    is_stock: true,
    sort_order: 3,
  },
  {
    id: "p4",
    motorcycle_id: "mock-1",
    name: "Marchesini Forged Wheels",
    category: "wheels",
    description: "Lightweight forged racing wheels",
    detailed_info: "Forged aluminum saving 2.8kg for improved handling.",
    specifications: { material: "Forged Aluminum", weight_savings: "2.8 kg" },
    price: 2400,
    weight: 6.2,
    material: "Forged Aluminum",
    is_stock: false,
    sort_order: 4,
  },
  {
    id: "p5",
    motorcycle_id: "mock-1",
    name: "Stock Wheels",
    category: "wheels",
    description: "Factory cast aluminum wheels",
    detailed_info: "Cast aluminum wheels.",
    specifications: { material: "Cast Aluminum" },
    price: 0,
    weight: 9.0,
    material: "Cast Aluminum",
    is_stock: true,
    sort_order: 5,
  },
  {
    id: "p6",
    motorcycle_id: "mock-1",
    name: "Ohlins TTX Fork Kit",
    category: "suspension",
    description: "Professional race fork cartridge",
    detailed_info: "TTX Twin Tube with 30-click adjustments.",
    specifications: { type: "TTX Twin Tube" },
    price: 1850,
    weight: 3.2,
    material: "Aluminum/Titanium",
    is_stock: false,
    sort_order: 7,
  },
  {
    id: "p7",
    motorcycle_id: "mock-1",
    name: "Stock Fork",
    category: "suspension",
    description: "Showa SFF-BP Fork",
    detailed_info: "Separates damping and spring functions.",
    specifications: { type: "Inverted 41mm" },
    price: 0,
    weight: 8.5,
    material: "Aluminum/Steel",
    is_stock: true,
    sort_order: 6,
  },
  {
    id: "p8",
    motorcycle_id: "mock-1",
    name: "Racing Windscreen",
    category: "body",
    description: "Extended windscreen +40mm",
    detailed_info: "Reduces drag by 8%.",
    specifications: { height: "+40mm" },
    price: 129,
    weight: 0.4,
    material: "Polycarbonate",
    is_stock: false,
    sort_order: 9,
  },
  {
    id: "p9",
    motorcycle_id: "mock-1",
    name: "Gel Comfort Seat",
    category: "seat",
    description: "Gel-padded comfort seat",
    detailed_info: "Memory foam with gel inserts.",
    specifications: { comfort: "High" },
    price: 299,
    weight: 2.4,
    material: "Foam/Gel",
    is_stock: false,
    sort_order: 11,
  },
  {
    id: "p10",
    motorcycle_id: "mock-1",
    name: "Brembo M4 Calipers",
    category: "brakes",
    description: "Monobloc racing calipers",
    detailed_info: "CNC aluminum with 4x32mm pistons.",
    specifications: { type: "Monobloc radial" },
    price: 1200,
    weight: 1.9,
    material: "CNC Aluminum",
    is_stock: false,
    sort_order: 15,
  },
  {
    id: "p11",
    motorcycle_id: "mock-1",
    name: "Adjustable Rearsets",
    category: "handlebars",
    description: "CNC adjustable foot pegs",
    detailed_info: "6 positions with folding pegs.",
    specifications: { positions: "6" },
    price: 449,
    weight: 1.8,
    material: "CNC Aluminum",
    is_stock: false,
    sort_order: 14,
  },
  {
    id: "p12",
    motorcycle_id: "mock-1",
    name: "Frame Sliders",
    category: "accessories",
    description: "Crash protection sliders",
    detailed_info: "Delrin sliders for protection.",
    specifications: { install: "No-cut" },
    price: 89,
    weight: 0.6,
    material: "Aluminum/Delrin",
    is_stock: false,
    sort_order: 17,
  },
  {
    id: "p13",
    motorcycle_id: "mock-1",
    name: "Tank Pad",
    category: "accessories",
    description: "Carbon fiber tank protector",
    detailed_info: "3M adhesive protection pad.",
    specifications: { thickness: "2mm" },
    price: 35,
    weight: 0.1,
    material: "Polyurethane",
    is_stock: false,
    sort_order: 18,
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function ConfiguratorPageContent() {
  const searchParams = useSearchParams();
  const configId = searchParams.get('config');
  const isDemoMode = searchParams.get('demo') === 'true';
  const [showDemoBanner, setShowDemoBanner] = React.useState(isDemoMode);

  const selectedMotorcycleId = useConfiguratorStore(
    (s) => s.selectedMotorcycleId,
  );
  const setMotorcycles = useConfiguratorStore((s) => s.setMotorcycles);
  const setParts = useConfiguratorStore((s) => s.setParts);
  const selectMotorcycle = useConfiguratorStore((s) => s.selectMotorcycle);
  const calculatePrice = useConfiguratorStore((s) => s.calculatePrice);
  const setLoading = useConfiguratorStore((s) => s.setLoading);
  const isLeftPanelOpen = useConfiguratorStore((s) => s.isLeftPanelOpen);
  const isRightPanelOpen = useConfiguratorStore((s) => s.isRightPanelOpen);
  const toggleLeftPanel = useConfiguratorStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = useConfiguratorStore((s) => s.toggleRightPanel);
  const setConfigName = useConfiguratorStore((s) => s.setConfigName);
  const setGlobalColor = useConfiguratorStore((s) => s.setGlobalColor);
  const setGlobalMaterial = useConfiguratorStore((s) => s.setGlobalMaterial);
  const equipPart = useConfiguratorStore((s) => s.equipPart);
  const setCurrentConfigId = useConfiguratorStore((s) => s.setCurrentConfigId);
  const setDirty = useConfiguratorStore((s) => s.setDirty);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    let cancelled = false;
    async function loadMotorcycles() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: motos, error } = await supabase
          .from("motorcycles")
          .select("*")
          .eq("is_public", true);
        if (cancelled) return;
        if (error || !motos?.length) {
          setMotorcycles(fallbackMotorcycles);
          if (!configId) selectMotorcycle(fallbackMotorcycles[0].id);
        } else {
          setMotorcycles(motos as Motorcycle[]);
          if (!configId) selectMotorcycle((motos as Motorcycle[])[0].id);
        }
      } catch {
        if (!cancelled) {
          setMotorcycles(fallbackMotorcycles);
          if (!configId) selectMotorcycle(fallbackMotorcycles[0].id);
        }
      }
    }
    void loadMotorcycles();
    return () => {
      cancelled = true;
    };
  }, [setMotorcycles, selectMotorcycle, setLoading, configId]);

  React.useEffect(() => {
    if (!configId) return;
    let cancelled = false;
    async function loadConfiguration() {
      try {
        const supabase = createClient();
        const { data: config, error } = await supabase
          .from('configurations')
          .select('*')
          .eq('id', configId)
          .single();

        if (cancelled) return;
        if (error || !config) {
          toast.error('Configuration not found');
          return;
        }

        selectMotorcycle(config.motorcycle_id);
        setConfigName(config.name);
        setCurrentConfigId(config.id);

        if (config.config_data) {
          const { globalColor, globalMaterial, partColors, equippedParts } = config.config_data;
          if (globalColor) setGlobalColor(globalColor);
          if (globalMaterial) setGlobalMaterial(globalMaterial);
          if (partColors) {
            Object.entries(partColors).forEach(([group, state]) => {
              const typedState = state as { color: string; material: MaterialType };
              useConfiguratorStore.setState((s) => ({
                partColors: { ...s.partColors, [group]: typedState },
              }));
            });
          }
          if (equippedParts && Array.isArray(equippedParts)) {
            setTimeout(() => {
              equippedParts.forEach((partId: string) => equipPart(partId));
              setDirty(false);
            }, 500);
          }
        }
      } catch (err) {
        console.error('Load config error:', err);
        if (!cancelled) toast.error('Failed to load configuration');
      }
    }
    void loadConfiguration();
    return () => {
      cancelled = true;
    };
  }, [configId, selectMotorcycle, setConfigName, setGlobalColor, setGlobalMaterial, equipPart, setCurrentConfigId, setDirty]);

  React.useEffect(() => {
    if (!selectedMotorcycleId) return;
    let cancelled = false;
    async function loadParts() {
      setLoading(true);
      useConfiguratorStore.setState({
        equippedParts: [],
        selectedPartGroup: null,
        selectedPartData: null,
      });
      try {
        const supabase = createClient();
        const { data: p, error } = await supabase
          .from("parts")
          .select("*")
          .eq("motorcycle_id", selectedMotorcycleId)
          .order("sort_order");
        if (cancelled) return;
        if (error) {
          setParts(
            selectedMotorcycleId === "mock-1" ? fallbackParts : [],
          );
        } else if (p && p.length > 0) {
          setParts(p as Part[]);
        } else {
          setParts(
            selectedMotorcycleId === "mock-1" ? fallbackParts : [],
          );
        }
      } catch {
        if (!cancelled) {
          setParts(
            selectedMotorcycleId === "mock-1" ? fallbackParts : [],
          );
        }
      }
      calculatePrice();
      if (!cancelled) setLoading(false);
    }
    void loadParts();
    return () => {
      cancelled = true;
    };
  }, [selectedMotorcycleId, setParts, calculatePrice, setLoading]);

  const sheetLeftOpen = isMobile && isLeftPanelOpen;
  const sheetRightOpen = isMobile && isRightPanelOpen;

  React.useEffect(() => {
    if (isDemoMode) {
      useConfiguratorStore.setState({ currentConfigId: null });
    }
  }, [isDemoMode]);

  return (
    <TooltipProvider delay={200}>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        {showDemoBanner && isDemoMode && (
          <div className="relative z-50 flex items-center justify-between gap-4 border-b border-yellow-500/50 bg-yellow-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">
                🎨 You&apos;re in demo mode. Sign up to save your configurations!
              </div>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign Up Free
              </Link>
            </div>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="rounded-md p-1 hover:bg-yellow-500/20"
              aria-label="Close banner"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <TopBar isDemoMode={isDemoMode} />

        <div className="relative flex min-h-0 flex-1 flex-row overflow-hidden">
          {isLeftPanelOpen ? (
            <aside className="hidden h-full w-72 shrink-0 flex-col overflow-hidden border-border border-r bg-background lg:flex">
              <PartsCatalog />
            </aside>
          ) : null}

          <div className="relative min-h-0 min-w-0 flex-1">
            <DynamicCanvas />

            <div className="pointer-events-none absolute inset-0 lg:hidden">
              <div className="pointer-events-auto absolute top-3 left-3 z-10">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="shadow-md"
                  onClick={toggleLeftPanel}
                  aria-label="Open parts catalog"
                >
                  <PanelLeft className="size-4" />
                </Button>
              </div>
              <div className="pointer-events-auto absolute top-3 right-3 z-10">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="shadow-md"
                  onClick={toggleRightPanel}
                  aria-label="Open part details"
                >
                  <PanelRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {isRightPanelOpen ? (
            <aside className="hidden h-full w-80 shrink-0 flex-col overflow-hidden border-border border-l bg-background lg:flex">
              <PartDetails />
            </aside>
          ) : null}

          <AIChat />
        </div>

        <footer className="h-20 shrink-0 border-border border-t bg-background">
          <ColorPicker />
        </footer>

        <ShareModal />

        <Sheet
          open={sheetLeftOpen}
          onOpenChange={(open) => {
            if (!open) {
              useConfiguratorStore.setState({ isLeftPanelOpen: false });
            }
          }}
        >
          <SheetContent side="left" className="w-72 p-0 sm:max-w-72">
            <PartsCatalog />
          </SheetContent>
        </Sheet>

        <Sheet
          open={sheetRightOpen}
          onOpenChange={(open) => {
            if (!open) {
              useConfiguratorStore.setState({ isRightPanelOpen: false });
            }
          }}
        >
          <SheetContent side="right" className="w-80 p-0 sm:max-w-80">
            <ScrollArea className="h-full max-h-[100dvh]">
              <PartDetails />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    }>
      <ConfiguratorPageContent />
    </Suspense>
  );
}
