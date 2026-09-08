import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-out outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_4px_16px_-8px_rgba(23,23,30,0.2)] hover:scale-[1.03] hover:-translate-y-px hover:shadow-[0_10px_32px_-8px_rgba(109,90,224,0.28)] active:scale-[0.95] active:translate-y-0 active:shadow-[0_2px_8px_-4px_rgba(23,23,30,0.2)]",
        secondary:
          "glass text-foreground hover:bg-foreground/[0.04] hover:scale-[1.02] active:scale-[0.95]",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:scale-[1.02] active:scale-[0.95]",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-[1.02] active:scale-[0.95]",
        link: "text-porcelain underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-white hover:brightness-105 hover:scale-[1.02] active:scale-[0.95]",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        default: "h-11 px-6",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
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
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
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
