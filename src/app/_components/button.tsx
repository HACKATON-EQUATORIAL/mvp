import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      disabled,
      loading = false,
      variant = "primary",
      ...props
    },
    ref,
  ) {
    const isUnavailable = disabled || loading;
    const classes = ["ui-button", `ui-button-${variant}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        {...props}
        ref={ref}
        type={props.type ?? "button"}
        className={classes}
        disabled={isUnavailable}
        aria-busy={loading || undefined}
      >
        {loading && <span className="ui-button-spinner" aria-hidden="true" />}
        <span className="ui-button-content">{children}</span>
      </button>
    );
  },
);
