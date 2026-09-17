import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        // ✅ VIDEO CALL CONTROL BAR VARIANTS
        control:
          "bg-muted/60 hover:bg-muted/80 text-foreground border border-border/50 backdrop-blur",

        "control-active":
          "bg-green-500/15 text-green-600 hover:bg-green-500/25 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.20)]",

        "control-muted":
          "bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.18)]",

        "control-share":
          "bg-indigo-500/15 text-indigo-600 hover:bg-indigo-500/25 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.18)]",

        "control-record":
          "bg-red-500/15 text-red-600 hover:bg-red-500/25 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.22)]",

        "control-hand":
          "bg-yellow-400/20 text-yellow-700 hover:bg-yellow-400/30 border border-yellow-400/25 shadow-[0_0_10px_rgba(250,204,21,0.18)]",

        "control-participants":
          "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.18)]",

        "control-danger":
          "bg-red-600 text-white hover:bg-red-700 border border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.22)]",
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };