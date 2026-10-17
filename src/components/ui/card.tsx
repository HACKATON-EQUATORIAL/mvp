import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div {...props} data-slot="card" className={cn("info-card", className)} />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card-header"
      className={cn("card-header", className)}
    />
  );
}

// Keep the heading semantics used by the educational journey.
function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      data-slot="card-title"
      className={cn("card-title", className)}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      {...props}
      data-slot="card-description"
      className={cn("card-description", className)}
    />
  );
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card-action"
      className={cn("card-action", className)}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card-content"
      className={cn("card-content", className)}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card-footer"
      className={cn("card-footer", className)}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
