import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      default: "ui-button-primary",
      primary: "ui-button-primary",
      secondary: "ui-button-secondary",
      outline: "ui-button-secondary",
      ghost: "ui-button-ghost",
      destructive: "ui-button-destructive",
      link: "ui-button-link",
    },
    size: {
      default: "",
      xs: "ui-button-size-xs",
      sm: "ui-button-size-sm",
      lg: "ui-button-size-lg",
      icon: "ui-button-size-icon",
      "icon-xs": "ui-button-size-icon-xs",
      "icon-sm": "ui-button-size-icon-sm",
      "icon-lg": "ui-button-size-icon-lg",
      recording: "ui-button-size-recording",
      "recording-secondary": "ui-button-size-recording-secondary",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

export type ButtonProps = Omit<
  ButtonPrimitive.Props,
  "className" | "children"
> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children?: ReactNode;
    loading?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      {...props}
      type={props.type ?? "button"}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"] || undefined}
    >
      {loading && (
        <LoaderCircle className="ui-button-spinner" aria-hidden="true" />
      )}
      <span className="ui-button-content">{children}</span>
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
