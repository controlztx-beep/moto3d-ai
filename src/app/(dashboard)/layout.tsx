"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bike,
  Code,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
};

type ProfileRow = {
  full_name?: string | null;
  email?: string | null;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/configurator", label: "Configurator", icon: Wrench },
  { href: "/dashboard/configurations", label: "My Configurations", icon: FolderOpen },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/leads", label: "Leads", icon: MessageSquare },
  { href: "/dashboard/embed", label: "Embed Widget", icon: Code },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
] as const;

function initialsFromName(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function pageTitleForPath(pathname: string) {
  if (pathname.startsWith("/dashboard/configurations")) return "My Configurations";
  if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
  if (pathname.startsWith("/dashboard/embed")) return "Embed Widget";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  if (pathname.startsWith("/dashboard/billing")) return "Billing";
  return "Dashboard";
}

function SidebarContent({
  profile,
  onLogout,
  closeMobile,
}: {
  profile: Profile | null;
  onLogout: () => void;
  closeMobile?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bike className="size-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight">MOTO3D</span>
            <Badge className="border-0 bg-primary text-primary-foreground">AI</Badge>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => closeMobile?.()}
              className={cn(
                "flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t px-3 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-auto w-full justify-start gap-3 px-2 py-2",
            )}
          >
            <Avatar size="default">
              <AvatarFallback>
                {initialsFromName(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-medium">
                {profile?.full_name || "User"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {profile?.email || ""}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => closeMobile?.()}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => closeMobile?.()}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (!cancelled) {
            router.push("/login");
          }
          return;
        }

        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!cancelled) {
          const profileRow = p as unknown as ProfileRow | null;
          setProfile({
            id: user.id,
            full_name:
              profileRow?.full_name ?? user.user_metadata?.full_name ?? null,
            email: profileRow?.email ?? user.email ?? null,
          });
        }
      } catch {
        if (!cancelled) {
          router.push("/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const onLogout = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-border border-r bg-background lg:flex">
        <SidebarContent profile={profile} onLogout={onLogout} />
      </aside>

      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-border border-b bg-background/95 px-4 backdrop-blur lg:pl-[calc(16rem+1.5rem)] lg:pr-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "lg:hidden",
              )}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent profile={profile} onLogout={onLogout} closeMobile={() => {}} />
            </SheetContent>
          </Sheet>
          <div className="text-sm font-semibold">
            {pageTitleForPath(pathname)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:flex">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-9 w-64 pl-9"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border-0 bg-transparent p-0 hover:bg-transparent">
              <Avatar size="default">
                <AvatarFallback>
                  {initialsFromName(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {profile?.full_name || profile?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/")}>
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/configurator")}>
                Configurator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-500">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main
        className={cn(
          "h-[calc(100vh-3.5rem)] overflow-y-auto p-6",
          "lg:ml-64",
        )}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
