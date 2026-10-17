import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, className, disabled, loading = false, ...props },
    ref,
  ) {
    const isUnavailable = disabled || loading;
    const classes = ["ui-button", className].filter(Boolean).join(" ");

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
        <span>{children}</span>
      </button>
    );
  },
);
