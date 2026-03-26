"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaParts } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaParts.Root>) {
  return (
    <ScrollAreaParts.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaParts.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring"
      >
        {children}
      </ScrollAreaParts.Viewport>
      <ScrollBar />
      <ScrollAreaParts.Corner />
    </ScrollAreaParts.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaParts.Scrollbar>) {
  return (
    <ScrollAreaParts.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none p-0.5 transition-colors data-horizontal:h-2.5 data-vertical:h-full data-vertical:w-2.5 data-horizontal:flex-col data-horizontal:w-full",
        className,
      )}
      {...props}
    >
      <ScrollAreaParts.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaParts.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
