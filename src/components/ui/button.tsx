import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 tracking-tight relative group/btn",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 terminal:bg-transparent terminal:text-primary terminal:border terminal:border-primary terminal:hover:bg-primary terminal:hover:text-black terminal:hover:shadow-[0_0_15px_rgba(0,255,65,0.5)]",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary/10 terminal:rounded-none terminal:border-2 terminal:hover:bg-primary terminal:hover:text-black",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 terminal:bg-transparent terminal:border terminal:border-primary/50 terminal:text-primary/70 terminal:hover:border-primary terminal:hover:text-primary",
        ghost: "hover:bg-primary/10 hover:text-primary terminal:hover:bg-primary terminal:hover:text-black terminal:rounded-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 terminal:bg-transparent terminal:border terminal:border-destructive terminal:text-destructive terminal:hover:bg-destructive terminal:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline terminal:no-underline terminal:hover:terminal-glow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
