"use client";

import * as React from "react";
import { Brain, Mouse, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function WelcomeModal() {
  const [open, setOpen] = React.useState(false);
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('moto3d_onboarding_done');
      if (!hasSeenOnboarding) {
        setOpen(true);
      }
    }
  }, []);

  const handleGetStarted = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moto3d_onboarding_done', 'true');
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to MOTO3D AI Configurator! 🏍️
          </DialogTitle>
          <DialogDescription>
            Get started with these quick tips to make the most of your experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mouse className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Rotate & Zoom</h3>
            <p className="text-sm text-muted-foreground">
              Click and drag to rotate. Scroll to zoom in and out.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Customize Colors</h3>
            <p className="text-sm text-muted-foreground">
              Pick colors and materials at the bottom bar.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Ask AI</h3>
            <p className="text-sm text-muted-foreground">
              Click the chat bubble for AI recommendations.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dont-show"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don&apos;t show again
            </label>
          </div>
          <Button onClick={handleGetStarted} size="lg">
            Got it, let&apos;s go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
