"use client";

import * as React from "react";
import {
  Brain,
  Crosshair,
  DollarSign,
  Layers,
  Loader2,
  Scale,
  Sparkles,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { buildConfiguratorContext } from "@/lib/ai/build-config-context";
import { renderMarkdown } from "@/lib/ai/markdown";
import { useConfiguratorStore } from "@/stores/configuratorStore";

function formatSpecKey(key: string) {
  return key.replace(/_/g, " ");
}

export function PartDetails() {
  const selectedPartData = useConfiguratorStore((s) => s.selectedPartData);
  const motorcycles = useConfiguratorStore((s) => s.motorcycles);
  const selectedMotorcycleId = useConfiguratorStore(
    (s) => s.selectedMotorcycleId,
  );
  const parts = useConfiguratorStore((s) => s.parts);
  const equippedParts = useConfiguratorStore((s) => s.equippedParts);
  const globalColor = useConfiguratorStore((s) => s.globalColor);
  const globalMaterial = useConfiguratorStore((s) => s.globalMaterial);
  const totalPrice = useConfiguratorStore((s) => s.totalPrice);
  const configName = useConfiguratorStore((s) => s.configName);
  const equipPart = useConfiguratorStore((s) => s.equipPart);
  const unequipPart = useConfiguratorStore((s) => s.unequipPart);

  const [aiAnalysis, setAiAnalysis] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [followupContent, setFollowupContent] = React.useState<string | null>(
    null,
  );
  const [followupLoading, setFollowupLoading] = React.useState(false);

  React.useEffect(() => {
    if (!selectedPartData) return;
    setAiAnalysis("");
    setFollowupContent(null);
  }, [selectedPartData]);

  const motorcycleName = React.useMemo(() => {
    const m = motorcycles.find((x) => x.id === selectedMotorcycleId);
    return m ? `${m.brand} ${m.name}` : "Unknown motorcycle";
  }, [motorcycles, selectedMotorcycleId]);

  const contextForChat = React.useCallback(() => {
    return buildConfiguratorContext({
      motorcycles,
      selectedMotorcycleId,
      parts,
      equippedParts,
      globalColor,
      globalMaterial,
      totalPrice,
      selectedPartData,
      configName,
    });
  }, [
    motorcycles,
    selectedMotorcycleId,
    parts,
    equippedParts,
    globalColor,
    globalMaterial,
    totalPrice,
    selectedPartData,
    configName,
  ]);

  const handleGetAiAnalysis = React.useCallback(async () => {
    const p = selectedPartData;
    if (!p) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-part", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partName: p.name,
          partCategory: p.category,
          partSpecs: JSON.stringify(p.specifications),
          motorcycleName,
        }),
      });
      const data = (await res.json()) as { analysis?: string; error?: string };
      if (!res.ok) {
        setAiAnalysis(
          data.error === "AI not configured"
            ? "AI features require an API key. Add GOOGLE_AI_API_KEY to your .env.local file."
            : "Failed to get AI analysis. Please try again.",
        );
        return;
      }
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis("Failed to get AI analysis. Please try again.");
      }
    } catch {
      setAiAnalysis("Failed to get AI analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedPartData, motorcycleName]);

  const askChatQuestion = React.useCallback(
    async (question: string) => {
      setFollowupLoading(true);
      setFollowupContent(null);
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            context: contextForChat(),
          }),
        });
        const data = (await res.json()) as { response?: string; error?: string };
        if (!res.ok) {
          setFollowupContent(
            data.error === "AI not configured"
              ? "AI features require an API key. Add GOOGLE_AI_API_KEY to your .env.local file."
              : "Sorry, I could not answer that. Please try again.",
          );
          return;
        }
        if (data.response) {
          setFollowupContent(data.response);
        } else {
          setFollowupContent("Sorry, I could not answer that. Please try again.");
        }
      } catch {
        setFollowupContent("Sorry, I could not answer that. Please try again.");
      } finally {
        setFollowupLoading(false);
      }
    },
    [contextForChat],
  );

  if (!selectedPartData) {
    const currentMotorcycle = motorcycles.find((m) => m.id === selectedMotorcycleId);
    
    if (!currentMotorcycle) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-muted-foreground">
          <Crosshair className="size-10 opacity-50" />
          <p className="text-sm">Select a motorcycle to begin</p>
        </div>
      );
    }

    const specs = (currentMotorcycle.specifications as Record<string, unknown>) || {};
    const specEntries = Object.entries(specs).filter(([, v]) => v != null);

    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {currentMotorcycle.brand}
            </h2>
            <h3 className="font-display text-xl text-foreground">
              {currentMotorcycle.name}
            </h3>
            <Badge className="mt-2" variant="secondary">
              {currentMotorcycle.category}
            </Badge>
          </div>

          {currentMotorcycle.description && (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {currentMotorcycle.description}
              </p>
              <Separator className="my-4" />
            </>
          )}

          {specEntries.length > 0 && (
            <>
              <h4 className="mb-3 font-semibold text-sm">Specifications</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground capitalize">
                      {formatSpecKey(key)}
                    </div>
                    <div className="mt-1 font-medium text-sm">{String(value)}</div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}

          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="size-4 text-primary" />
              <span className="text-xs text-muted-foreground">Base Price</span>
            </div>
            <div className="font-display text-2xl font-bold">
              ${currentMotorcycle.base_price.toLocaleString("en-US")}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
            <Crosshair className="size-4 shrink-0" />
            <p>Select a part from the catalog or click on the 3D model to see details</p>
          </div>
        </div>
      </div>
    );
  }

  const part = selectedPartData;
  const specs = part.specifications ?? {};
  const specEntries = Object.entries(specs);

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <div className="shrink-0">
        <h2 className="font-bold text-lg">{part.name}</h2>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {part.category}
          </Badge>
        </div>
        <Separator className="mt-3" />
      </div>

      <Tabs defaultValue="overview" className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
        <TabsList className="h-auto w-full shrink-0 flex-wrap justify-start gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specs</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="min-h-0 flex-1 overflow-y-auto data-[orientation=vertical]:mt-0"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            {part.description}
          </p>
          {part.detailed_info ? (
            <div className="mt-4">
              <h3 className="font-medium text-foreground text-sm">Details</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                {part.detailed_info}
              </p>
            </div>
          ) : null}
          <Separator className="my-4" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <Scale className="mb-1 size-4 text-primary" />
              <div className="text-muted-foreground text-xs">Weight</div>
              <div className="font-medium text-sm">{part.weight} kg</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
              <Layers className="mb-1 size-4 text-primary" />
              <div className="text-muted-foreground text-xs">Material</div>
              <div className="font-medium text-sm">{part.material}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <DollarSign className="mb-1 size-4 text-primary" />
              <div className="text-muted-foreground text-xs">Price</div>
              <div className="font-medium text-sm">
                {part.price > 0
                  ? `$${part.price.toLocaleString("en-US")}`
                  : "Included"}
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <Tag className="mb-1 size-4 text-primary" />
              <div className="text-muted-foreground text-xs">Type</div>
              <div className="font-medium text-sm">
                {part.is_stock ? "OEM Part" : "Aftermarket"}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="specs"
          className="min-h-0 flex-1 overflow-y-auto data-[orientation=vertical]:mt-0"
        >
          {specEntries.length > 0 ? (
            <div>
              {specEntries.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-border/30 border-b py-2.5 last:border-0"
                >
                  <span className="text-muted-foreground text-sm capitalize">
                    {formatSpecKey(k)}
                  </span>
                  <span className="text-right font-medium text-sm">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No specifications available
            </p>
          )}
        </TabsContent>

        <TabsContent
          value="ai"
          className="min-h-0 flex-1 overflow-y-auto data-[orientation=vertical]:mt-0"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Brain className="size-8 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  AI Analysis
                </h3>
                <p className="text-muted-foreground text-xs">
                  Powered by Gemini — insights for this specific part.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="w-full gap-2"
              onClick={() => void handleGetAiAnalysis()}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Get AI Analysis
                </>
              )}
            </Button>

            {aiAnalysis ? (
              <div
                className="max-w-none text-foreground text-sm leading-relaxed [&_code]:text-xs [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(aiAnalysis),
                }}
              />
            ) : null}

            <div className="flex flex-col gap-2 border-border/50 border-t pt-3">
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Quick questions
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 text-sm"
                onClick={() =>
                  void askChatQuestion(
                    "Is this part compatible with my current setup?",
                  )
                }
                disabled={followupLoading}
              >
                <Sparkles className="size-4 shrink-0" />
                Is this compatible with my setup?
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 text-sm"
                onClick={() =>
                  void askChatQuestion(
                    "What are better alternatives to this part for my motorcycle?",
                  )
                }
                disabled={followupLoading}
              >
                <Sparkles className="size-4 shrink-0" />
                What are better alternatives?
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2 text-sm"
                onClick={() =>
                  void askChatQuestion(
                    "Give maintenance tips for this specific part.",
                  )
                }
                disabled={followupLoading}
              >
                <Sparkles className="size-4 shrink-0" />
                Maintenance tips for this part
              </Button>
            </div>

            {followupLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="size-4 animate-spin" />
                Thinking…
              </div>
            ) : null}

            {followupContent ? (
              <div
                className="rounded-lg border border-border/50 bg-muted/20 p-3 text-sm leading-relaxed [&_code]:text-xs"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(followupContent),
                }}
              />
            ) : null}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-auto shrink-0 border-border border-t bg-background p-4">
        {!part.is_stock ? (
          equippedParts.includes(part.id) ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                unequipPart(part.id);
              }}
            >
              Remove Upgrade
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                equipPart(part.id);
              }}
            >
              Equip This Upgrade
            </Button>
          )
        ) : (
          <div className="flex justify-center">
            <Badge className="bg-muted px-4 py-2 text-muted-foreground">
              Stock Part — Included
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
