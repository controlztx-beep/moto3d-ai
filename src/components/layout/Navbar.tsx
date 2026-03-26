"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bike, Menu, ArrowRight, LogOut, Settings, LayoutDashboard, Palette } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Features", id: "features" },
  { label: "How it Works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "Docs", id: "faq" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    }
    void checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
      router.refresh();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Bike className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            MOTO3D{" "}
            <Badge className="ml-1 border-accent/40 bg-accent/15 px-1.5 py-0 text-[10px] font-bold tracking-wider text-accent">
              AI
            </Badge>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-300"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-muted-foreground hover:text-foreground",
                )}
              >
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none ring-primary focus-visible:ring-2">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/configurator')} className="cursor-pointer">
                    <Palette className="mr-2 size-4" />
                    Configurator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-muted-foreground hover:text-foreground",
                )}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "animate-pulse-glow gap-2 px-5",
                )}
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="font-display text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="hover:bg-muted/50 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors"
                    onClick={() => {
                      scrollToSection(item.id);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  href="/login"
                  className="hover:bg-muted/50 rounded-lg px-3 py-3 text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants(),
                    "animate-pulse-glow mt-4 w-full justify-center gap-2",
                  )}
                  onClick={() => setOpen(false)}
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
