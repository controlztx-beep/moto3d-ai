"use client";

import dynamic from "next/dynamic";

const FloatingParts = dynamic(
  () =>
    import("@/components/3d/FloatingParts").then((m) => ({
      default: m.FloatingParts,
    })),
  { ssr: false },
);

export function FloatingPartsBackground() {
  return <FloatingParts />;
}
