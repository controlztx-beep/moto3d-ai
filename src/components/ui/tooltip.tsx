"use client";

import * as React from "react";
import { Tooltip as TooltipParts } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delay = 0,
  ...props
}: React.ComponentProps<typeof TooltipParts.Provider>) {
  return (
    <TooltipParts.Provider data-slot="tooltip-provider" delay={delay} {...props} />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipParts.Root>) {
  return <TooltipParts.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipParts.Trigger>) {
  return <TooltipParts.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipParts.Popup> & {
  sideOffset?: number;
}) {
  return (
    <TooltipParts.Portal>
      <TooltipParts.Positioner sideOffset={sideOffset} className="z-50">
        <TooltipParts.Popup
          data-slot="tooltip-content"
          className={cn(
            "fade-in-0 zoom-in-95 data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0 flex w-fit origin-(--transform-origin) flex-col rounded-md bg-foreground px-3 py-2 text-background text-xs text-balance animate-in data-[ending-style]:animate-out data-[ending-style]:zoom-out-95 data-[starting-style]:zoom-in-95",
            className,
          )}
          {...props}
        />
      </TooltipParts.Positioner>
    </TooltipParts.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
