"use client";

import Link from "next/link";
import { Bike, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

function SocialIconGitHub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function SocialIconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.882 6.064-6.882zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 11.408z" />
    </svg>
  );
}

function SocialIconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialIconYouTube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const product = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Configurator", href: "/configurator?demo=true" },
  { label: "Log In", href: "/login" },
  { label: "Sign Up", href: "/register" },
];

const company = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contact", href: "mailto:contact@moto3d.ai" },
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-neutral-800 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <Bike className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                MOTO3D{" "}
                <Badge className="ml-1 border-red-500/40 bg-red-500/15 px-1.5 py-0 text-[10px] font-bold text-red-500">
                  AI
                </Badge>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              AI-powered 3D motorcycle configurator for modern dealerships.
              Transform your showroom experience.
            </p>
            <p className="text-sm leading-relaxed text-neutral-400">
              Photoreal previews, smart recommendations, and frictionless checkout flows.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/moto3d-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-red-500"
                aria-label="GitHub"
              >
                <SocialIconGitHub className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/moto3dai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-red-500"
                aria-label="X (Twitter)"
              >
                <SocialIconX className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/moto3d-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-red-500"
                aria-label="LinkedIn"
              >
                <SocialIconLinkedIn className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@moto3dai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-red-500"
                aria-label="YouTube"
              >
                <SocialIconYouTube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h3>
            <ul className="space-y-3">
              {product.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-red-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-red-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-red-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
              Newsletter
            </p>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thanks — you are on the list.");
              }}
            >
              <Input
                type="email"
                required
                placeholder="you@dealership.com"
                className="bg-background/60 border-border/80"
              />
              <Button type="submit" className="gap-2 shrink-0">
                <Send className="h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="text-muted-foreground mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-center text-sm sm:flex-row sm:text-left">
          <p>© 2025 MOTO3D AI. All rights reserved.</p>
          <p>Built with ❤️ for motorcycle enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
