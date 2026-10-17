import Link from "next/link";
import type { ComponentProps } from "react";

type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ActionLink({
  variant = "secondary",
  className,
  ...props
}: ActionLinkProps) {
  return (
    <Link
      {...props}
      className={["ui-button", `ui-button-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
