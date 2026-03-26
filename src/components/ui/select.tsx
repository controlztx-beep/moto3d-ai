"use client";

import * as React from "react";
import { Select as SelectParts } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectParts.Root>) {
  return <SelectParts.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectParts.Group>) {
  return <SelectParts.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectParts.Value>) {
  return <SelectParts.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectParts.Trigger> & {
  size?: "default" | "sm";
}) {
  return (
    <SelectParts.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent py-2 pr-2 pl-3 text-sm whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        className,
      )}
      {...props}
    >
      {children}
      <SelectParts.Icon>
        <ChevronDown className="size-4 opacity-50" />
      </SelectParts.Icon>
    </SelectParts.Trigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectParts.Popup>) {
  return (
    <SelectParts.Portal>
      <SelectParts.Positioner
        className="isolate z-50"
        sideOffset={4}
        alignItemWithTrigger={true}
      >
        <SelectParts.Popup
          data-slot="select-content"
          className={cn(
            "max-h-(--available-height) origin-(--transform-origin) rounded-md border bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=none]:transition-none",
            className,
          )}
          {...props}
        >
          <SelectParts.List className="max-h-[min(24rem,var(--available-height))] scroll-py-1 overflow-y-auto p-1">
            {children}
          </SelectParts.List>
        </SelectParts.Popup>
      </SelectParts.Positioner>
    </SelectParts.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectParts.Item>) {
  return (
    <SelectParts.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-2 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:[svg]:text-current data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectParts.ItemIndicator>
          <Check className="size-4" />
        </SelectParts.ItemIndicator>
      </span>
      <SelectParts.ItemText>{children}</SelectParts.ItemText>
    </SelectParts.Item>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
