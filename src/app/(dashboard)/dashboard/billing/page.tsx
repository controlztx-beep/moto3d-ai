"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

if (typeof window !== 'undefined') {
  document.title = "Billing | MOTO3D AI";
}
import { Check, Loader2, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PLANS } from "@/lib/stripe/config";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPlan] = React.useState<'free' | 'pro' | 'business'>('free');
  
  const isStripeConfigured = React.useMemo(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    return !!key && key !== 'pk_test_placeholder' && key.startsWith('pk_');
  }, []);

  const handleUpgrade = async (plan: 'pro' | 'business') => {
    setLoadingPlan(plan);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to create checkout session');
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to open billing portal');
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage your plan and invoices
        </p>
      </div>

      {success && (
        <Alert className="mt-4 border-green-500/50 bg-green-500/10">
          <Check className="size-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Subscription activated! Your plan has been upgraded.
          </AlertDescription>
        </Alert>
      )}

      {canceled && (
        <Alert className="mt-4 border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="size-4 text-yellow-600" />
          <AlertDescription className="text-yellow-600">
            Checkout canceled. You can try again anytime.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mt-4 border-red-500/50 bg-red-500/10">
          <AlertCircle className="size-4 text-red-500" />
          <AlertDescription className="text-red-500">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-6 border border-border">
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <CardDescription>Your current subscription</CardDescription>
          </div>
          <Badge className="border-0 bg-green-500/20 text-green-400">Active</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {PLANS.free.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-4 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Models</span>
                <span>1 / 1 used</span>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Views</span>
                <span>87 / 100 used</span>
              </div>
              <Progress value={87} />
            </div>
          </div>

          {currentPlan !== 'free' && (
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleManageSubscription}
              disabled={loadingPortal || !isStripeConfigured}
            >
              {loadingPortal && <Loader2 className="mr-2 size-4 animate-spin" />}
              Manage Subscription
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Available Plans</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Starter</CardTitle>
                <Badge variant="secondary">Current Plan</Badge>
              </div>
              <CardDescription>Perfect for trying out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$0</div>
              <Button disabled className="w-full">
                Your Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-primary/40">
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For growing dealerships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$29/mo</div>
              <ul className="space-y-2 text-sm">
                {PLANS.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {!isStripeConfigured ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <Button 
                        className="w-full" 
                        onClick={() => handleUpgrade('pro')}
                        disabled={true}
                      >
                        Upgrade
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stripe not configured yet</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade('pro')}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === 'pro' && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Upgrade
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription>For large operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$79/mo</div>
              <ul className="space-y-2 text-sm">
                {PLANS.business.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {!isStripeConfigured ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <Button 
                        className="w-full" 
                        onClick={() => handleUpgrade('business')}
                        disabled={true}
                      >
                        Upgrade
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stripe not configured yet</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade('business')}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === 'business' && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Upgrade
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8 border border-border">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Invoices and payment activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  date: "Dec 2024",
                  desc: "Free Plan",
                  amount: "$0.00",
                  status: "Active",
                  invoice: "-",
                },
                {
                  date: "Nov 2024",
                  desc: "Free Plan",
                  amount: "$0.00",
                  status: "Active",
                  invoice: "-",
                },
              ].map((row) => (
                <TableRow key={row.date}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Badge className="border-0 bg-green-500/20 text-green-400">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.invoice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-muted-foreground text-sm">
            No paid invoices yet
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 border border-border">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Saved cards and billing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-muted-foreground text-sm">
            No payment method on file
          </div>
          <Link
            href="/dashboard/billing"
            className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
          >
            Add Payment Method
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

