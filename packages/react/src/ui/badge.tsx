import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-colors [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-primary/35 bg-primary/20 text-primary-foreground',
        secondary: 'border-border/70 bg-secondary/75 text-secondary-foreground',
        destructive: 'border-destructive/35 bg-destructive/18 text-destructive',
        outline: 'border-border/80 bg-background/30 text-foreground',
        profit: 'border-profit/30 bg-profit/12 text-profit',
        loss: 'border-loss/30 bg-loss/12 text-loss',
        info: 'border-info/30 bg-info/12 text-info',
        warning: 'border-warning/30 bg-warning/12 text-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
