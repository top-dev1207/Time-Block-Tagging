import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Time Value Tier Badges
        "tier-10k": "border-transparent bg-tier-10k text-primary-foreground font-semibold",
        "tier-1k": "border-transparent bg-tier-1k text-primary-foreground font-semibold",
        "tier-100": "border-transparent bg-tier-100 text-primary-foreground font-semibold",
        "tier-10": "border-transparent bg-tier-10 text-primary-foreground font-semibold",
        // Category Badges
        revenue: "border-transparent bg-revenue text-primary-foreground",
        recovery: "border-transparent bg-recovery text-primary-foreground",
        relationships: "border-transparent bg-relationships text-primary-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
