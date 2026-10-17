import Link from "next/link";
import type { ComponentProps } from "react";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionLinkProps = ComponentProps<typeof Link> &
  Pick<ButtonProps, "variant" | "size">;

// Navigation remains a native link; Base UI Button always has button semantics.
export function ActionLink({
  variant = "secondary",
  size = "default",
  className,
  ...props
}: ActionLinkProps) {
  return (
    <Link
      {...props}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  );
}
