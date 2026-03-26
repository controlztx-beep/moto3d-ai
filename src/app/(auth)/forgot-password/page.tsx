"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSent(true);
      toast.success("Check your email for the reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border/60 bg-card/40 shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Forgot your password?
        </CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-6">
            <p className="text-foreground text-sm leading-relaxed">
              Check your email for the reset link. Follow the instructions to
              choose a new password.
            </p>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex w-full justify-center",
              )}
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="focus-visible:ring-primary pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
            <p className="text-center">
              <Link
                href="/login"
                className="text-primary text-sm font-medium hover:underline"
              >
                Back to login
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
