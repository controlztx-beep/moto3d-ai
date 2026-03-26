"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  GROUP_TO_CATEGORY,
  type Part,
} from "@/stores/configuratorStore";
import { useConfiguratorStore } from "@/stores/configuratorStore";

const categories = [
  { id: "engine", label: "Engine & Performance", icon: "🔧" },
  { id: "exhaust", label: "Exhaust System", icon: "💨" },
  { id: "wheels", label: "Wheels & Tires", icon: "⚙️" },
  { id: "suspension", label: "Suspension", icon: "🔩" },
  { id: "body", label: "Body & Fairings", icon: "🏍️" },
  { id: "seat", label: "Seat & Comfort", icon: "💺" },
  { id: "lights", label: "Lights", icon: "💡" },
  { id: "handlebars", label: "Controls", icon: "🎮" },
  { id: "brakes", label: "Brakes", icon: "🛑" },
  { id: "accessories", label: "Accessories", icon: "🔌" },
] as const;

const CATEGORY_TO_GROUP: Record<string, string> = {
  engine: "engine",
  exhaust: "exhaust",
  wheels: "front-wheel",
  suspension: "suspension",
  body: "body",
  seat: "seat",
  lights: "lights",
  handlebars: "handlebars",
  brakes: "brakes",
  accessories: "frame",
};

type FilterMode = "all" | "stock" | "upgrades";

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return `${s.slice(0, n).trim()}…`;
}

export function PartsCatalog() {
  const parts = useConfiguratorStore((s) => s.parts);
  const selectedPartGroup = useConfiguratorStore((s) => s.selectedPartGroup);
  const selectedPartData = useConfiguratorStore((s) => s.selectedPartData);
  const equippedParts = useConfiguratorStore((s) => s.equippedParts);
  const selectPartGroup = useConfiguratorStore((s) => s.selectPartGroup);
  const setSelectedPartData = useConfiguratorStore((s) => s.setSelectedPartData);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<FilterMode>("all");

  const filteredParts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return parts.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (filter === "stock") return p.is_stock;
      if (filter === "upgrades") return !p.is_stock;
      return true;
    });
  }, [parts, search, filter]);

  const partsByCategory = React.useMemo(() => {
    const map = new Map<string, Part[]>();
    for (const c of categories) {
      map.set(c.id, []);
    }
    for (const p of filteredParts) {
      const list = map.get(p.category);
      if (list) list.push(p);
    }
    return map;
  }, [filteredParts]);

  const defaultOpen = React.useMemo(
    () => categories.map((c) => c.id).filter((id) => (partsByCategory.get(id)?.length ?? 0) > 0),
    [partsByCategory],
  );

  const isCardActive = React.useCallback(
    (part: Part) => {
      if (!selectedPartData || selectedPartData.id !== part.id) return false;
      if (!selectedPartGroup) return false;
      return GROUP_TO_CATEGORY[selectedPartGroup] === part.category;
    },
    [selectedPartData, selectedPartGroup],
  );

  return (
    <div className="flex h-full flex-col space-y-3 p-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search parts..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {(
          [
            ["all", "All"],
            ["stock", "Stock"],
            ["upgrades", "Upgrades"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={cn(
              "rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors",
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted",
            )}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <Accordion
          key={filteredParts.map((p) => p.id).join("|")}
          multiple
          defaultValue={defaultOpen}
        >
          {categories.map((cat) => {
            const catParts = partsByCategory.get(cat.id) ?? [];
            if (catParts.length === 0) return null;

            return (
              <AccordionItem key={cat.id} value={cat.id}>
                <AccordionTrigger>
                  <span className="flex w-full items-center gap-2 pr-2">
                    <span aria-hidden>{cat.icon}</span>
                    <span className="flex-1 text-left">{cat.label}</span>
                    <Badge variant="secondary" className="shrink-0">
                      {catParts.length}
                    </Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {catParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      className={cn(
                        "mb-2 w-full cursor-pointer rounded-lg border border-border/50 p-3 text-left transition-all duration-200 hover:border-primary/50 hover:bg-muted/30",
                        isCardActive(part) &&
                          "border-primary bg-primary/5",
                      )}
                      onClick={() => {
                        const group = CATEGORY_TO_GROUP[part.category];
                        if (group) selectPartGroup(group);
                        setSelectedPartData(part);
                      }}
                    >
                      <div className="text-sm font-medium">{part.name}</div>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {truncate(part.description, 60)}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {part.price > 0 ? (
                            <span className="font-semibold text-primary text-sm">
                              ${part.price.toLocaleString("en-US")}
                            </span>
                          ) : (
                            <Badge variant="secondary">Stock</Badge>
                          )}
                        </div>
                        <div>
                          {equippedParts.includes(part.id) ? (
                            <Badge className="border-0 bg-green-500/20 text-green-400">
                              Equipped
                            </Badge>
                          ) : part.is_stock ? (
                            <Badge variant="outline">OEM</Badge>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
