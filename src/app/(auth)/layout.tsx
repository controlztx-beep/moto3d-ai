import Link from "next/link";
import { Bike } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="text-foreground mb-10 inline-flex items-center gap-2 self-start transition-opacity hover:opacity-90"
        >
          <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Bike className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-base font-bold tracking-tight">
            MOTO3D{" "}
            <Badge className="border-accent/40 bg-accent/15 ml-1 px-1.5 py-0 text-[10px] font-bold text-accent">
              AI
            </Badge>
          </span>
        </Link>
        <div className="mx-auto w-full max-w-md flex-1">{children}</div>
      </div>

      <div className="from-primary/25 via-[hsl(260_45%_14%)] to-accent/15 relative hidden w-1/2 overflow-hidden bg-gradient-to-br lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/20 animate-float absolute top-[12%] left-[18%] h-32 w-32 rounded-full blur-2xl" />
          <div className="bg-accent/15 animate-float absolute right-[14%] bottom-[20%] h-40 w-40 rounded-full blur-3xl [animation-delay:1.2s]" />
          <div className="border-primary/10 absolute top-1/4 right-1/4 h-3 w-3 rounded-full border bg-white/10" />
          <div className="border-accent/20 absolute bottom-1/3 left-1/4 h-2 w-2 rounded-full border bg-white/10 [animation-delay:0.5s]" />
          <div className="border-primary/15 absolute top-1/2 left-1/3 h-2 w-2 rounded-full border bg-white/5" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <p className="font-display text-primary mb-4 text-sm font-semibold tracking-[0.2em] uppercase">
            MOTO3D AI
          </p>
          <h2 className="font-display text-foreground text-4xl font-bold tracking-tight md:text-5xl">
            Configure. Customize. Create.
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            Build dream bikes in real time with AI-guided configuration and
            studio-grade 3D.
          </p>
        </div>
      </div>
    </div>
  );
}
