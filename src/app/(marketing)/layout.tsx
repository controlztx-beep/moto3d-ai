import { FloatingPartsBackground } from "@/components/3d/FloatingPartsBackground";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.18]">
        <FloatingPartsBackground />
      </div>
      <div className="from-primary/8 via-background/80 to-accent/6 pointer-events-none fixed inset-0 z-0 bg-gradient-to-b" />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
