import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <h1 className="font-display text-3xl font-bold">Pricing</h1>
      <p className="text-muted-foreground mt-3 max-w-md text-sm">
        Plans and comparison live on the homepage. Jump to the pricing section
        for full details.
      </p>
      <Link
        href="/#pricing"
        className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
      >
        View pricing on homepage
      </Link>
    </main>
  );
}
