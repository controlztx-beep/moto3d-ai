"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

if (typeof window !== 'undefined') {
  document.title = "Dashboard | MOTO3D AI";
}
import {
  BarChart3,
  Bike,
  DollarSign,
  Eye,
  Plus,
  Share2,
  Settings,
  Code,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ProfileRow = {
  full_name?: string | null;
};

const chartData = [
  { day: "Mon", views: 45 },
  { day: "Tue", views: 52 },
  { day: "Wed", views: 38 },
  { day: "Thu", views: 65 },
  { day: "Fri", views: 72 },
  { day: "Sat", views: 58 },
  { day: "Sun", views: 81 },
];

interface RecentConfig {
  id: string;
  name: string;
  total_price: number;
  created_at: string;
  config_data: { globalColor?: string };
  motorcycles?: { name: string; brand: string };
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

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = React.useState("");
  const [totalConfigs, setTotalConfigs] = React.useState<number>(0);
  const [recentConfigs, setRecentConfigs] = React.useState<RecentConfig[]>([]);
  const [totalValue, setTotalValue] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (!cancelled) router.push("/login");
          return;
        }

        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const profileRow = p as unknown as ProfileRow | null;
        if (!cancelled) {
          const fullName = profileRow?.full_name ?? user.user_metadata?.full_name;
          setUserName(
            fullName || 
            user.email?.split("@")[0] || 
            "User"
          );
        }

        const { count } = await supabase
          .from("configurations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (!cancelled) setTotalConfigs(count ?? 0);

        const { data: configs } = await supabase
          .from("configurations")
          .select("id, name, total_price, created_at, config_data, motorcycles(name, brand)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (!cancelled && configs) {
          const mappedConfigs = configs.map(c => ({
            ...c,
            motorcycles: Array.isArray(c.motorcycles) && c.motorcycles.length > 0 ? c.motorcycles[0] : undefined
          })) as RecentConfig[];
          setRecentConfigs(mappedConfigs);
          const total = configs.reduce((sum, c) => sum + (c.total_price || 0), 0);
          setTotalValue(total);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-0">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your configurations
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Bike,
            title: "Total Configurations",
            value: totalConfigs ?? 3,
            sub: "+2 this month",
          },
          {
            icon: Eye,
            title: "Total Views",
            value: "1,247",
            sub: "+18% from last month",
          },
          {
            icon: Share2,
            title: "Shared Configs",
            value: "12",
            sub: "+4 this week",
          },
          {
            icon: DollarSign,
            title: "Est. Value",
            value: formatUsd(totalValue),
            sub: "Total build value",
          },
        ].map((stat, i) => loading && i === 0 ? (
          <Card key={i} className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
            </div>
            <div className="mt-4 text-muted-foreground text-sm">{stat.title}</div>
            <div className="mt-2 text-3xl font-bold">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              <span className="text-green-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Configurations</CardTitle>
                <CardDescription>Your latest builds</CardDescription>
              </div>
              <Link
                href="/dashboard/configurations"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "inline-flex",
                )}
              >
                View All
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentConfigs.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No configurations yet. Create your first one!
                </div>
              ) : recentConfigs.map((c) => {
                const motoName = c.motorcycles ? `${c.motorcycles.brand} ${c.motorcycles.name}` : 'Unknown';
                const color = c.config_data?.globalColor || '#0066FF';
                
                return (
                  <div
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/50"
                    onClick={() => router.push(`/configurator?config=${c.id}`)}
                  >
                  <div
                    className="size-10 shrink-0 rounded-lg"
                    style={{ backgroundColor: color }}
                  />  
                  <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {motoName}
                      </div>
                  </div>
                      <div className="text-right font-semibold text-sm">
                        {formatUsd(c.total_price)}
                      </div>
                      <div className="text-right text-muted-foreground text-xs">
                        {formatTimeAgo(c.created_at)}
                      </div>          
                </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis dataKey="day" stroke="#8b8b99" tickLine={false} />
                    <YAxis stroke="#8b8b99" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#0b0b12",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump right back in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/configurator"
                className={cn(buttonVariants(), "inline-flex w-full justify-start gap-2")}
              >
                <Plus className="size-4" />
                New Configuration
              </Link>
              <Link
                href="/dashboard/embed"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex w-full justify-start gap-2",
                )}
              >
                <Code className="size-4" />
                Get Embed Code
              </Link>
              <Link
                href="/dashboard/analytics"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex w-full justify-start gap-2",
                )}
              >
                <BarChart3 className="size-4" />
                View Analytics
              </Link>
              <Link
                href="/dashboard/settings"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex w-full justify-start gap-2",
                )}
              >
                <Settings className="size-4" />
                Account Settings
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your usage this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">Free</div>
                <Badge className="border-0 bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Models</span>
                  <span>1 / 1 used</span>
                </div>
                <Progress value={100} className="bg-muted/40" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Views</span>
                  <span>87 / 100 used</span>
                </div>
                <Progress value={87} className="bg-muted/40" />
              </div>

              <Link
                href="/dashboard/billing"
                className={cn(buttonVariants(), "inline-flex w-full")}
              >
                Upgrade Plan
              </Link>
              <p className="text-xs text-muted-foreground">
                Upgrade to unlock unlimited models and views
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
