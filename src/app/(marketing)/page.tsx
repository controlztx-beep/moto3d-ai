"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Code,
  Box,
  Play,
  Search,
  Share2,
  Smartphone,
  Store,
  Target,
  Wand2,
  Zap,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const DEMO_COLORS = [
  { hex: "#DC2626", label: "Red" },
  { hex: "#0a0a0a", label: "Black" },
  { hex: "#f5f5f5", label: "White" },
  { hex: "#9ca3af", label: "Silver" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#10b981", label: "Green" },
] as const;

const features = [
  {
    icon: Box,
    title: "Real-time 3D Configuration",
    body: "Interactive 3D models with realistic materials and lighting. Customers can rotate, zoom, and inspect every detail.",
  },
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    body: "Smart AI assistant suggests parts, colors, and configurations based on riding style and customer preferences.",
  },
  {
    icon: Code,
    title: "Easy Integration",
    body: "One line of code to embed. Works seamlessly with your existing website. No complex setup required.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    body: "Track customer configurations, popular choices, and conversion metrics. Optimize your inventory accordingly.",
  },
  {
    icon: Share2,
    title: "Social Sharing",
    body: "Customers can share their dream configurations on social media, generating organic marketing for your dealership.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    body: "Perfect experience on all devices. Touch-friendly controls and responsive design ensure accessibility everywhere.",
  },
];

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
    a: "We currently have 6 motorcycle models with more being added regularly. Pro and Business plans can also upload custom 3D models in GLB/GLTF format. Our team can create custom models for Enterprise clients.",
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
  const [demoColor, setDemoColor] = useState<string>("#DC2626");
  const [yearly, setYearly] = useState(false);

  const proPrice = yearly ? "$278" : "$29";
  const proPeriod = yearly ? "/yr" : "/mo";
  const bizPrice = yearly ? "$758" : "$79";
  const bizPeriod = yearly ? "/yr" : "/mo";

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen bg-[#0a0a0a] pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[calc(100vh-6rem)] items-center gap-12 lg:grid-cols-12">
            {/* Left Content - 55% */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <Badge
                variant="outline"
                className="mb-8 border-red-500/30 bg-transparent px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-red-500"
              >
                MOTO3D AI — CONFIGURATOR
              </Badge>

              <h1 className="mb-6">
                <span className="block text-5xl font-light text-white">
                  The Future of
                </span>
                <span className="block text-7xl font-bold text-white">
                  Motorcycle
                </span>
                <span className="block text-7xl font-bold text-red-500">
                  Configuration
                </span>
              </h1>

              <p className="mb-10 max-w-lg text-lg leading-relaxed text-neutral-400">
                AI-powered 3D configurator for dealerships. Let customers build
                their dream bike in real-time.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-14 bg-red-600 px-8 text-sm uppercase tracking-wide hover:bg-red-700"
                  >
                    Start Configuring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 border-white/20 bg-transparent px-8 text-sm uppercase tracking-wide text-white hover:border-white/40 hover:bg-white/5"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-xs text-neutral-500">
                No credit card required • Free plan available
              </p>
            </motion.div>

            {/* Right 3D Model - 45% */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-neutral-800 bg-[#0a0a0a] lg:h-[600px]">
                <HeroMotorcycle />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="scroll-mt-24 bg-[#0a0a0a] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              FEATURES
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Everything you need to sell
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="group h-full border-neutral-800 bg-[#121212] p-6 transition-all hover:-translate-y-1 hover:border-red-500/20">
                  <CardContent className="p-0">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {feature.body}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              HOW IT WORKS
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Three steps to get started
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Choose Your Model",
                desc: "Select from our library of motorcycle models or upload your own 3D models.",
                icon: Search,
              },
              {
                n: "02",
                title: "Customize & Configure",
                desc: "Use our intuitive interface to set up colors, parts, and pricing for your inventory.",
                icon: Wand2,
              },
              {
                n: "03",
                title: "Embed & Launch",
                desc: "Copy one line of code and paste it into your website. Start selling in minutes.",
                icon: Code,
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <Card className="h-full border-neutral-800 bg-[#121212] p-8">
                  <CardContent className="p-0">
                    <div className="mb-6 text-8xl font-bold text-red-500/10">
                      {step.n}
                    </div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
                {i < 2 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-8 -translate-y-1/2 translate-x-full bg-red-500/30 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section
        id="demo"
        className="scroll-mt-24 border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              SEE IT IN ACTION
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Real-time 3D Configuration
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#121212]">
              <div className="relative h-[400px] w-full lg:h-[500px]">
                <DemoMotorcycleGLB color={demoColor} />
              </div>
              <div className="border-t border-neutral-800 p-6">
                <p className="mb-3 text-xs uppercase tracking-wider text-neutral-500">
                  Choose Color
                </p>
                <div className="flex flex-wrap gap-3">
                  {DEMO_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.label}
                      onClick={() => setDemoColor(c.hex)}
                      className={cn(
                        "h-12 w-12 rounded-full border-2 transition-all hover:scale-110",
                        demoColor === c.hex
                          ? "border-red-500 ring-2 ring-red-500 ring-offset-2 ring-offset-[#121212]"
                          : "border-neutral-700 hover:border-neutral-600",
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <Link
                  href="/configurator?demo=true"
                  className="mt-6 inline-flex items-center text-sm text-red-500 hover:text-red-400"
                >
                  Try the full configurator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              WHY DEALERSHIPS CHOOSE US
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Built for success
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Box,
                title: "Real-time 3D",
                desc: "Interactive models customers can customize instantly",
              },
              {
                icon: Brain,
                title: "AI Assistant",
                desc: "Smart recommendations that increase conversions",
              },
              {
                icon: Code,
                title: "Easy Embed",
                desc: "One line of code to add to your website",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "Track configurations and customer interest",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-neutral-800 bg-[#121212] p-6">
                  <CardContent className="p-0">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-400">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="scroll-mt-24 border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              PRICING
            </p>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Simple, transparent pricing
            </h2>
            <div className="inline-flex items-center gap-3 rounded-full border border-neutral-800 bg-[#121212] p-1">
              <button
                onClick={() => setYearly(false)}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-medium transition-all",
                  !yearly
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-medium transition-all",
                  yearly
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Yearly
                <span className="ml-2 text-xs text-green-400">Save 20%</span>
              </button>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-neutral-800 bg-[#121212] p-6">
                <CardContent className="p-0">
                  <h3 className="mb-1 text-xl font-bold text-white">Starter</h3>
                  <p className="mb-6 text-sm text-neutral-400">
                    For trying it out
                  </p>
                  <p className="mb-6">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-neutral-400">/mo</span>
                  </p>
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="mb-6 w-full border-neutral-700 hover:border-neutral-600"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <ul className="space-y-3 text-sm">
                    {[
                      "1 motorcycle model",
                      "100 views / month",
                      "Basic customization",
                      "Community support",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span className="text-neutral-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="relative h-full border-red-500/50 bg-[#121212] p-6">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white">
                  Most Popular
                </Badge>
                <CardContent className="p-0">
                  <h3 className="mb-1 text-xl font-bold text-white">
                    Professional
                  </h3>
                  <p className="mb-6 text-sm text-neutral-400">
                    For growing dealerships
                  </p>
                  <p className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {proPrice}
                    </span>
                    <span className="text-neutral-400">{proPeriod}</span>
                  </p>
                  <Link href="/register?plan=pro">
                    <Button className="mb-6 w-full bg-red-600 hover:bg-red-700">
                      Start Free Trial
                    </Button>
                  </Link>
                  <ul className="space-y-3 text-sm">
                    {[
                      "10 motorcycle models",
                      "10,000 views / month",
                      "Full AI features",
                      "Priority support",
                      "Custom branding",
                      "Analytics dashboard",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span className="text-neutral-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Business */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-neutral-800 bg-[#121212] p-6">
                <CardContent className="p-0">
                  <h3 className="mb-1 text-xl font-bold text-white">Business</h3>
                  <p className="mb-6 text-sm text-neutral-400">
                    For multi-location dealers
                  </p>
                  <p className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {bizPrice}
                    </span>
                    <span className="text-neutral-400">{bizPeriod}</span>
                  </p>
                  <Link href="/register?plan=business">
                    <Button
                      variant="outline"
                      className="mb-6 w-full border-neutral-700 hover:border-neutral-600"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <ul className="space-y-3 text-sm">
                    {[
                      "50 motorcycle models",
                      "100,000 views / month",
                      "Advanced AI features",
                      "Dedicated support",
                      "White-label option",
                      "API access",
                      "Multi-user accounts",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span className="text-neutral-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-neutral-800 bg-[#121212] p-6">
                <CardContent className="p-0">
                  <h3 className="mb-1 text-xl font-bold text-white">
                    Enterprise
                  </h3>
                  <p className="mb-6 text-sm text-neutral-400">
                    For large organizations
                  </p>
                  <p className="mb-6">
                    <span className="text-4xl font-bold text-white">Custom</span>
                  </p>
                  <Link href="mailto:sales@moto3d.ai">
                    <Button
                      variant="outline"
                      className="mb-6 w-full border-neutral-700 hover:border-neutral-600"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                  <ul className="space-y-3 text-sm">
                    {[
                      "Unlimited models",
                      "Unlimited views",
                      "Custom AI training",
                      "24/7 phone support",
                      "Custom development",
                      "SLA guarantee",
                      "On-premise option",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span className="text-neutral-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BUILT FOR BUSINESSES */}
      <section className="border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              BUILT FOR MOTORCYCLE BUSINESSES
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Empower your dealership
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Online Showroom",
                desc: "Let customers configure bikes 24/7 on your website. No physical inventory needed for every color and configuration.",
              },
              {
                icon: Target,
                title: "Lead Generation",
                desc: "Every configuration is a potential sale. Capture customer interest automatically and follow up with personalized offers.",
              },
              {
                icon: Zap,
                title: "Competitive Edge",
                desc: "Stand out from competitors with cutting-edge 3D technology. Show you're a modern, tech-forward dealership.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-neutral-800 bg-[#121212] p-8">
                  <CardContent className="p-0">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-24 border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-500">
              FAQ
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Frequently asked questions
            </h2>
          </motion.div>

          <Accordion className="space-y-4">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-neutral-800 bg-[#121212] px-6"
              >
                <AccordionTrigger className="text-left text-white hover:text-red-500 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-neutral-800 bg-[#0a0a0a] py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to transform your showroom?
            </h2>
            <p className="mb-10 text-lg text-neutral-400">
              Be among the first dealerships to use AI-powered 3D configuration
            </p>
            <form
              className="mx-auto flex max-w-md gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const email = (
                  e.currentTarget.elements.namedItem("email") as HTMLInputElement
                )?.value;
                if (email) {
                  window.location.href = `/register?email=${encodeURIComponent(email)}`;
                }
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-neutral-700 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <Button
                type="submit"
                size="lg"
                className="shrink-0 bg-red-600 px-8 hover:bg-red-700"
              >
                Get Started
              </Button>
            </form>
            <p className="mt-6 text-xs text-neutral-500">
              No credit card required • Free plan • Setup in 5 minutes
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
