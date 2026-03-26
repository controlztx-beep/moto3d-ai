"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface Configuration {
  id: string;
  name: string;
  motorcycle_id: string;
  total_price: number;
  config_data: {
    globalColor?: string;
  };
  created_at: string;
  share_token?: string;
  motorcycles?: {
    name: string;
    brand: string;
  };
}

function formatTimeAgo(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ConfigurationsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [motoFilter, setMotoFilter] = React.useState("all");
  const [sort, setSort] = React.useState("newest");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [configs, setConfigs] = React.useState<Configuration[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const loadConfigurations = React.useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('configurations')
        .select('*, motorcycles(name, brand)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Load configs error:', error);
      toast.error('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    void loadConfigurations();
  }, [loadConfigurations]);

  const handleOpen = (id: string) => {
    router.push(`/configurator?config=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    setDeleting(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Configuration deleted');
      await loadConfigurations();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete configuration');
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (config: Configuration) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('configurations')
        .insert({
          user_id: user.id,
          motorcycle_id: config.motorcycle_id,
          name: `${config.name} (copy)`,
          config_data: config.config_data,
          total_price: config.total_price,
        });

      if (error) throw error;
      toast.success('Configuration duplicated');
      await loadConfigurations();
    } catch (error) {
      console.error('Duplicate error:', error);
      toast.error('Failed to duplicate configuration');
    }
  };

  const handleShare = (config: Configuration) => {
    if (config.share_token) {
      const url = `${window.location.origin}/shared/${config.share_token}`;
      navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard');
    } else {
      toast.error('Share link not available');
    }
  };

  const motorcycles = React.useMemo(() => {
    const unique = new Set<string>();
    configs.forEach((c) => {
      if (c.motorcycles) {
        unique.add(`${c.motorcycles.brand} ${c.motorcycles.name}`);
      }
    });
    return Array.from(unique).sort();
  }, [configs]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = configs.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (motoFilter !== "all" && c.motorcycles) {
        const motoName = `${c.motorcycles.brand} ${c.motorcycles.name}`;
        if (motoName !== motoFilter) return false;
      }
      return true;
    });
    if (sort === "oldest") list = [...list].reverse();
    if (sort === "price_high") list = [...list].sort((a, b) => b.total_price - a.total_price);
    if (sort === "price_low") list = [...list].sort((a, b) => a.total_price - b.total_price);
    return list;
  }, [configs, search, motoFilter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Configurations</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Saved builds and shareable setups
          </p>
        </div>
        <Link
          href="/configurator"
          className={cn(buttonVariants(), "inline-flex gap-2")}
        >
          <Plus className="size-4" />
          New Configuration
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search configurations..."
            className="pl-9"
          />
        </div>

        <Select
          value={motoFilter}
          onValueChange={(v) => setMotoFilter(typeof v === "string" ? v : "all")}
        >
          <SelectTrigger className="w-full lg:w-56">
            <SelectValue>
              {motoFilter === "all" ? "All Motorcycles" : motoFilter}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Motorcycles</SelectItem>
            {motorcycles.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => setSort(typeof v === "string" ? v : "newest")}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue>
              {sort === "newest"
                ? "Newest First"
                : sort === "oldest"
                  ? "Oldest First"
                  : sort === "price_high"
                    ? "Price High-Low"
                    : "Price Low-High"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price_high">Price High-Low</SelectItem>
            <SelectItem value="price_low">Price Low-High</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 self-start lg:self-auto">
          <Button
            type="button"
            variant={view === "grid" ? "secondary" : "outline"}
            size="icon-sm"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            type="button"
            variant={view === "list" ? "secondary" : "outline"}
            size="icon-sm"
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
          <FolderOpen className="size-10 text-muted-foreground" />
          <div>
            <div className="text-lg font-semibold">No configurations yet</div>
            <div className="mt-1 text-muted-foreground text-sm">
              Create your first motorcycle configuration
            </div>
          </div>
          <Link
            href="/configurator"
            className={cn(buttonVariants(), "mt-2 inline-flex")}
          >
            Start Configuring
          </Link>
        </div>
      ) : (
        <div
          className={cn(
            "mt-6",
            view === "grid"
              ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-3",
          )}
        >
          {filtered.map((c) => {
            const color = c.config_data?.globalColor || '#0066FF';
            const motoName = c.motorcycles ? `${c.motorcycles.brand} ${c.motorcycles.name}` : 'Unknown';
            
            return (
              <Card
                key={c.id}
                className={cn(
                  "border border-border transition-colors hover:border-primary/50 cursor-pointer",
                  view === "list" && "overflow-visible",
                )}
                onClick={() => handleOpen(c.id)}
              >
                <div
                  className={cn(
                    "h-32 w-full",
                    view === "list" && "hidden",
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${color}55, hsl(var(--background)))`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center text-3xl">
                    🏍️
                  </div>
                </div>
                <CardHeader className={cn(view === "grid" ? "" : "pb-0")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate">{c.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {motoName}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          "inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted/50",
                        )}
                        aria-label="More"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {deleting === c.id ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-44">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpen(c.id); }}>Open</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); void handleDuplicate(c); }}>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(c); }}>Share</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); void handleDelete(c.id); }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className={cn(view === "grid" ? "" : "pt-0")}>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <div className="text-primary font-bold">{formatUsd(c.total_price)}</div>
                    <div className="text-muted-foreground text-xs">{formatTimeAgo(c.created_at)}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
