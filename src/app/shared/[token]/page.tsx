"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SharedConfig {
  id: string;
  name: string;
  total_price: number;
  config_data: {
    globalColor?: string;
    globalMaterial?: string;
    equippedParts?: string[];
  };
  motorcycles: {
    name: string;
    brand: string;
    base_price: number;
  };
}

interface Part {
  id: string;
  name: string;
  category: string;
  price: number;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SharedConfigPage() {
  const params = useParams();
  const token = params.token as string;
  const [config, setConfig] = React.useState<SharedConfig | null>(null);
  const [parts, setParts] = React.useState<Part[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadSharedConfig() {
      setLoading(true);
      try {
        const supabase = createClient();
        
        const { data: configData, error: configError } = await supabase
          .from('configurations')
          .select('*, motorcycles(name, brand, base_price)')
          .eq('share_token', token)
          .eq('is_public', true)
          .single();

        if (configError || !configData) {
          setError('Configuration not found');
          return;
        }

        setConfig(configData as unknown as SharedConfig);

        if (configData.config_data?.equippedParts?.length) {
          const { data: partsData } = await supabase
            .from('parts')
            .select('id, name, category, price')
            .in('id', configData.config_data.equippedParts);

          if (partsData) {
            setParts(partsData);
          }
        }
      } catch (err) {
        console.error('Load error:', err);
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    }

    void loadSharedConfig();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="size-6 text-destructive" />
              <CardTitle>Configuration Not Found</CardTitle>
            </div>
            <CardDescription>
              This configuration may have been deleted or is not publicly shared.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/register"
              className={cn(buttonVariants(), "w-full")}
            >
              Create Your Own Configuration
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const color = config.config_data?.globalColor || '#0066FF';
  const material = config.config_data?.globalMaterial || 'metallic';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">MOTO3D AI</div>
          </div>
          <Link
            href="/register"
            className={cn(buttonVariants(), "gap-2")}
          >
            Configure Your Own
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div
          className="mb-8 rounded-xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${color}33, hsl(var(--background)))`,
          }}
        >
          <div className="mb-4 text-6xl">🏍️</div>
          <h1 className="text-3xl font-bold">{config.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {config.motorcycles.brand} {config.motorcycles.name}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Configuration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Price</div>
                <div className="text-2xl font-bold text-primary">
                  {formatUsd(config.total_price)}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Base Price</div>
                <div className="font-semibold">
                  {formatUsd(config.motorcycles.base_price)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Customizations</div>
                <div className="font-semibold">
                  {formatUsd(config.total_price - config.motorcycles.base_price)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Color</div>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="size-8 rounded-full border-2 border-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-sm">{color}</span>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Material</div>
                <div className="mt-1 font-semibold capitalize">{material}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {parts.length > 0 && (
          <Card className="mt-6 border-border">
            <CardHeader>
              <CardTitle>Equipped Parts ({parts.length})</CardTitle>
              <CardDescription>
                Custom parts and upgrades in this configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Check className="size-4 text-primary" />
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {part.category}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      {formatUsd(part.price)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="text-lg font-semibold">
              Ready to build your own custom motorcycle?
            </div>
            <p className="text-muted-foreground">
              Create, customize, and share your dream bike with MOTO3D AI
            </p>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              Get Started Free
            </Link>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12 border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by MOTO3D AI - The Ultimate Motorcycle Configurator</p>
        </div>
      </footer>
    </div>
  );
}
