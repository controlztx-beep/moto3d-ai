"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Code,
  Box,
  Layers,
  Play,
  Search,
  Share2,
  Smartphone,
  Star,
  Wand2,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const HeroMotorcycle = dynamic(
  () =>
    import("@/components/3d/HeroMotorcycle").then((m) => ({
      default: m.HeroMotorcycle,
    })),
  { ssr: false },
);

const DemoMotorcycleGLB = dynamic(
  () =>
    import("@/components/3d/DemoMotorcycleGLB").then((m) => ({
      default: m.DemoMotorcycleGLB,
    })),
  { ssr: false },
);

const sectionReveal = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function AnimatedInt({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const c = animate(0, value, {
      duration: 2.1,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.floor(v)),
    });
    return () => c.stop();
  }, [visible, value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function AnimatedDecimal({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const c = animate(0, value, {
      duration: 2.1,
      ease: "easeOut",
      onUpdate: (v) => setN(Number(v.toFixed(1))),
    });
    return () => c.stop();
  }, [visible, value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

const DEMO_COLORS = [
  { hex: "#FF3333", label: "Red" },
  { hex: "#0066FF", label: "Blue" },
  { hex: "#111111", label: "Black" },
  { hex: "#EEEEEE", label: "White" },
  { hex: "#00FF88", label: "Green" },
  { hex: "#FF8800", label: "Orange" },
] as const;

const brands = [
  "RevMoto Labs",
  "Atlas Ride Co.",
  "Northline Motors",
  "Veloce Moto",
  "IronPulse",
  "Driftline EU",
  "Thundergrid",
  "NeoCycle",
];

const features = [
  {
    icon: Box,
    title: "Real-time 3D Configuration",
    body: "Interactive 3D models with realistic materials and lighting. Rotate, zoom, and inspect every detail.",
  },
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    body: "Smart AI assistant suggests parts, colors, and configurations based on riding style and preferences.",
  },
  {
    icon: Layers,
    title: "Detailed Parts Database",
    body: "Comprehensive information about every component - specifications, compatibility, pricing, and purpose.",
  },
  {
    icon: Code,
    title: "Easy Website Integration",
    body: "Embed the configurator on any website with a simple code snippet. Full API access for custom integrations.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    body: "Perfect experience on any device. Touch-optimized 3D controls for mobile users.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    body: "Track user interactions, popular configurations, and conversion metrics in real-time.",
  },
] as const;

const faqItems = [
  {
    q: "How does the 3D configurator work?",
    a: "Our configurator uses WebGL and Three.js to render photorealistic 3D motorcycle models directly in the browser. Users can rotate, zoom, and customize every part of the motorcycle in real-time. No plugins or downloads required.",
  },
  {
    q: "What AI features are included?",
    a: "Our AI assistant powered by Google Gemini can recommend parts based on riding style, explain technical specifications in simple language, suggest compatible accessories, analyze configurations for performance, and even generate marketing descriptions for dealerships.",
  },
  {
    q: "How do I integrate it into my website?",
    a: 'Simply copy our embed code snippet and paste it into your website\'s HTML. The configurator loads as an iframe and automatically adapts to your site\'s layout. We also provide a JavaScript SDK and REST API for custom integrations.',
  },
  {
    q: "What motorcycle models are available?",
    a: "We have a growing library of 50+ motorcycle models from major brands. Pro and Business plans can also upload custom 3D models in GLB/GLTF format. Our team can also create custom models for Enterprise clients.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Our Starter plan is completely free forever with 1 motorcycle model and 100 views per month. Pro and Business plans come with a 14-day free trial with full features, no credit card required.",
  },
  {
    q: "Do you support Arabic and French?",
    a: "Yes! MOTO3D AI supports English, French, and Arabic with full RTL support. Additional languages can be added for Enterprise clients.",
  },
];

export default function MarketingPage() {
  const [demoColor, setDemoColor] = useState<string>("#0066FF");
  const [yearly, setYearly] = useState(false);

  const proPrice = yearly ? "$278" : "$29";
  const proPeriod = yearly ? "/yr" : "/mo";
  const bizPrice = yearly ? "$758" : "$79";
  const bizPeriod = yearly ? "/yr" : "/mo";

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-screen pt-24"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 55% at 50% -10%, hsl(var(--primary) / 0.12), transparent 55%),
            linear-gradient(to right, hsl(var(--border) / 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-8">
          <motion.div
            className="flex flex-col justify-center lg:col-span-7"
            initial="hidden"
            animate="show"
            variants={sectionReveal}
          >
            <motion.div variants={fadeUp}>
              <Badge
                variant="outline"
                className="border-primary/40 animate-glow text-foreground mb-6 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm"
              >
                🚀 Now in Beta — Start Free Today
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl font-bold tracking-tight md:text-7xl md:leading-[1.05]"
            >
              <span className="block">Configure Any</span>
              <span className="block">Motorcycle in</span>
              <span className="block">
                3D with{" "}
                <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mt-6 max-w-lg text-xl leading-relaxed md:text-xl"
            >
              Let your customers configure motorcycles in real-time 3D. AI-powered part recommendations, detailed specifications, and seamless website integration.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "animate-pulse-glow h-12 gap-2 px-8 text-base",
                )}
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#demo"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border/80 hover:border-primary/50 h-12 gap-2 px-8 text-base",
                )}
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Demo
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-base">⚡</span>
                Real-time 3D
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-base">🤖</span>
                AI-Powered
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-base">🔌</span>
                Easy Embed
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative h-[340px] w-full sm:h-[420px] lg:col-span-5 lg:h-[min(72vh,560px)]"
          >
            <div className="from-primary/15 pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br to-transparent blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-[hsl(222.2_84%_5%)] shadow-2xl shadow-primary/10">
              <HeroMotorcycle />
            </div>
          </motion.div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="border-border/50 bg-background/40 relative border-y py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-muted-foreground mb-8 text-center text-sm font-medium">
            Trusted by leading motorcycle companies
          </p>
          <div className="relative overflow-hidden">
            <div className="animate-marquee flex w-max gap-12 pr-12">
              {[...brands, ...brands].map((b, i) => (
                <span
                  key={`${b}-${i}`}
                  className="text-muted-foreground shrink-0 text-lg font-semibold tracking-tight opacity-80"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="from-background via-card/20 to-background relative scroll-mt-24 bg-gradient-to-b py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                Everything you need
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg"
            >
              Powerful features to revolutionize motorcycle sales
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionReveal}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card className="border-border/50 bg-card/50 group h-full rounded-xl border p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-0">
                    <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display mb-2 text-lg font-semibold">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.body}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-border/30 border-t py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              How it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg"
            >
              Three simple steps to get started
            </motion.p>
          </motion.div>

          <div className="relative mt-16">
            <div className="border-primary/20 absolute top-14 left-0 hidden h-px w-full border-t-2 border-dashed lg:block" />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={sectionReveal}
              className="grid gap-10 lg:grid-cols-3 lg:gap-8"
            >
              {[
                {
                  n: "01",
                  t: "Choose Your Model",
                  d: "Select from our extensive library of motorcycle models or upload your own 3D models.",
                  icon: Search,
                },
                {
                  n: "02",
                  t: "Customize with AI",
                  d: "Use our AI assistant to modify parts, colors, and accessories. Get intelligent suggestions.",
                  icon: Wand2,
                },
                {
                  n: "03",
                  t: "Share & Convert",
                  d: "Generate shareable links, embed on your website, and convert visitors into buyers.",
                  icon: Share2,
                },
              ].map((s) => (
                <motion.div key={s.n} variants={fadeUp}>
                  <Card className="border-border/60 bg-card/40 hover:border-primary/30 relative rounded-xl border p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="from-primary to-accent mb-4 bg-gradient-to-br bg-clip-text text-5xl font-black text-transparent">
                      {s.n}
                    </div>
                    <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-lg p-2">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display mb-2 text-xl font-semibold">
                      {s.t}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {s.d}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section
        id="demo"
        className="from-primary/5 scroll-mt-24 bg-gradient-to-b to-transparent py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              See it in action
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg"
            >
              Live preview — paint, materials, and part inspection in the
              browser.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-16"
          >
            <div className="border-border/50 bg-card/60 flex flex-col overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md lg:flex-row">
              <div className="relative min-h-[300px] flex-1 lg:min-h-[400px]">
                <DemoMotorcycleGLB color={demoColor} />
              </div>
              <div className="border-border/50 flex w-full flex-col gap-6 border-t p-6 lg:w-[340px] lg:border-t-0 lg:border-l">
                <div>
                  <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
                    Tank color
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {DEMO_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.label}
                        aria-label={c.label}
                        onClick={() => setDemoColor(c.hex)}
                        className={cn(
                          "h-10 w-10 rounded-full border-2 transition-transform hover:scale-110",
                          demoColor === c.hex
                            ? "border-primary ring-primary ring-2 ring-offset-2 ring-offset-card"
                            : "border-border",
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
                <div className="border-border/50 bg-background/50 flex flex-1 flex-col rounded-xl border p-4">
                  <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
                    Real-time preview
                  </p>
                  <p className="text-muted-foreground text-sm">
                    See your color changes applied instantly to the 3D motorcycle model. The real GLB model showcases realistic materials and lighting.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-8 text-center text-sm">
              This is just a preview. The full configurator has 100x more
              features.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "animate-pulse-glow gap-2",
                )}
              >
                Unlock the full studio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[hsl(222.2_45%_6%)] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionReveal}
            className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6"
          >
            {[
              {
                node: (
                  <>
                    <AnimatedInt value={50} suffix="+" />
                  </>
                ),
                label: "Motorcycle Models",
              },
              {
                node: (
                  <>
                    <AnimatedInt value={10000} suffix="+" />
                  </>
                ),
                label: "Parts Database",
              },
              {
                node: (
                  <>
                    <AnimatedInt value={200} suffix="+" />
                  </>
                ),
                label: "Dealerships",
              },
              {
                node: (
                  <>
                    <AnimatedDecimal value={99.9} suffix="%" />
                  </>
                ),
                label: "Uptime",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className={cn(
                  "text-center",
                  i > 0 &&
                    "border-border/50 md:border-primary/25 md:border-l md:pl-8",
                )}
              >
                <div className="from-primary to-accent bg-gradient-to-r bg-clip-text font-display text-4xl font-bold text-transparent md:text-5xl">
                  {s.node}
                </div>
                <p className="text-muted-foreground mt-2 text-sm font-medium">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="scroll-mt-24 py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg"
            >
              Choose the plan that matches your showroom velocity.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-12 flex flex-col items-center justify-center gap-3"
          >
            <div className="border-border/60 bg-card/40 flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-sm">
              <span className={cn("text-sm", !yearly && "text-foreground font-semibold")}>
                Monthly
              </span>
              <Switch checked={yearly} onCheckedChange={setYearly} />
              <span className={cn("text-sm flex items-center gap-2", yearly && "text-foreground font-semibold")}>
                Yearly
                <Badge className="border-accent/50 bg-accent/15 text-accent border text-[10px]">
                  Save 20%
                </Badge>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={sectionReveal}
            className="mt-16 grid gap-6 lg:grid-cols-4"
          >
            <motion.div variants={fadeUp}>
              <Card className="border-border/60 bg-card/50 flex h-full flex-col rounded-xl border p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <h3 className="font-display text-lg font-semibold">Starter</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Perfect for trying out the platform
                </p>
                <p className="font-display mt-6 text-4xl font-bold">$0</p>
                <p className="text-muted-foreground text-sm">Free forever</p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "1 motorcycle model",
                    "100 views / month",
                    "Basic AI chat",
                    "Community support",
                    "MOTO3D watermark",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-auto w-full",
                  )}
                >
                  Get Started
                </Link>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="lg:col-span-1 lg:scale-[1.04] lg:z-10"
            >
              <Card className="border-primary shadow-primary/20 relative flex h-full flex-col rounded-xl border-2 bg-card/80 p-8 shadow-xl backdrop-blur-md">
                <Badge className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 border-0">
                  Most Popular
                </Badge>
                <h3 className="font-display text-lg font-semibold">
                  Professional
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  For growing dealerships
                </p>
                <p className="font-display mt-6 text-4xl font-bold">
                  {proPrice}
                  <span className="text-muted-foreground text-lg font-medium">
                    {proPeriod}
                  </span>
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "10 motorcycle models",
                    "10,000 views / month",
                    "Full AI features",
                    "Priority support",
                    "No watermark",
                    "Custom branding",
                    "Basic analytics",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register?plan=pro"
                  className={cn(
                    buttonVariants(),
                    "animate-pulse-glow mt-auto w-full",
                  )}
                >
                  Start Free Trial
                </Link>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-border/60 bg-card/50 flex h-full flex-col rounded-xl border p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <h3 className="font-display text-lg font-semibold">Business</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  For large operations
                </p>
                <p className="font-display mt-6 text-4xl font-bold">
                  {bizPrice}
                  <span className="text-muted-foreground text-lg font-medium">
                    {bizPeriod}
                  </span>
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Unlimited models",
                    "Unlimited views",
                    "Full AI + API access",
                    "Dedicated support",
                    "White-label solution",
                    "Advanced analytics",
                    "Webhook integrations",
                    "Team management",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register?plan=business"
                  className={cn(buttonVariants(), "mt-auto w-full")}
                >
                  Start Free Trial
                </Link>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-border/60 bg-card/50 flex h-full flex-col rounded-xl border p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <h3 className="font-display text-lg font-semibold">Enterprise</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  For manufacturers & large chains
                </p>
                <p className="font-display mt-6 text-4xl font-bold">Custom</p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Everything in Business",
                    "Custom AI training",
                    "On-premise deployment",
                    "SLA guarantee",
                    "Custom integrations",
                    "Dedicated account manager",
                  ].map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="mailto:sales@moto3d.ai"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-auto w-full",
                  )}
                >
                  Contact Sales
                </Link>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="from-card/15 border-border/40 border-t py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              Loved by dealerships worldwide
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={sectionReveal}
            className="mt-16 grid gap-6 md:grid-cols-3"
          >
            {[
              {
                quote:
                  "MOTO3D AI transformed our online sales. Customers spend 3x more time on our site and conversion rate increased by 40%.",
                name: "Ahmed Benali",
                role: "CEO at MarocMoto",
                initials: "AB",
              },
              {
                quote:
                  "The AI recommendations are incredibly accurate. It's like having a motorcycle expert available 24/7 for every customer.",
                name: "Sarah Mitchell",
                role: "Digital Manager at EuroSpeed",
                initials: "SM",
              },
              {
                quote:
                  "Integration was seamless. We had the configurator running on our website in less than 30 minutes.",
                name: "Karim Dupont",
                role: "CTO at BikeZone France",
                initials: "KD",
              },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="border-border/50 bg-card/40 h-full rounded-xl border p-8 backdrop-blur-xl">
                  <CardContent className="flex h-full flex-col p-0">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="text-accent h-4 w-4 fill-accent"
                        />
                      ))}
                    </div>
                    <p className="text-foreground/90 flex-1 text-sm leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <Avatar className="border-primary/30 h-11 w-11 border">
                        <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                          {t.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-24 py-24 md:py-32"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              Frequently asked questions
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-16"
          >
            <Accordion className="space-y-2">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="border-border/60 bg-card/30 rounded-xl border px-4"
                >
                  <AccordionTrigger className="text-left text-base hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="from-primary/20 via-[hsl(260_40%_12%)] to-accent/15 absolute inset-0 bg-gradient-to-br" />
        <div className="animate-float pointer-events-none absolute top-10 left-[10%] h-24 w-24 rounded-2xl border border-white/10 bg-white/5 blur-sm" />
        <div className="animate-spin-slow pointer-events-none absolute right-[15%] bottom-16 h-32 w-32 rounded-full border border-primary/20 bg-primary/5 blur-md" />
        <div className="animate-float pointer-events-none absolute top-1/3 right-1/4 h-16 w-40 -rotate-12 rounded-full border border-accent/20 bg-accent/5" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionReveal}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold md:text-5xl"
            >
              Ready to revolutionize your motorcycle sales?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg"
            >
              Join 200+ dealerships already using MOTO3D AI
            </motion.p>
            <motion.form
              variants={fadeUp}
              className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="Work email"
                className="border-border bg-background/80 text-foreground focus-visible:ring-primary flex-1 rounded-lg border px-4 py-3 text-sm outline-none focus-visible:ring-2"
              />
              <Button type="submit" size="lg" className="animate-pulse-glow shrink-0 px-8">
                Get Started Free
              </Button>
            </motion.form>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mt-6 text-sm"
            >
              No credit card required · Free plan available · Setup in 5 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
