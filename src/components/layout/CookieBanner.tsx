"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('moto3d_cookies_accepted');
      if (!accepted) {
        setTimeout(() => setShow(true), 1000);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moto3d_cookies_accepted', 'true');
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-500"
      style={{ animation: 'slideUp 0.5s ease-out' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience. By using MOTO3D AI, you agree to our{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="flex gap-2">
            <Link href="/privacy">
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Link>
            <Button onClick={handleAccept} size="sm">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
