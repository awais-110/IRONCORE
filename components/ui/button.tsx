import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
};

export function Button({ href, variant = "primary", className, children, ...props }: ButtonProps) {
  const styles = cn(
    "inline-flex min-h-12 items-center justify-center border px-6 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 ease-impact",
    variant === "primary" && "border-accent bg-accent text-bg hover:bg-transparent hover:text-accent",
    variant === "outline" && "border-hairline-strong bg-transparent text-primary hover:border-accent hover:text-accent",
    variant === "ghost" && "border-transparent bg-transparent text-secondary hover:text-primary",
    className
  );

  if (href) {
    return <Link href={href} className={styles}>{children}</Link>;
  }

  return <button className={styles} {...props}>{children}</button>;
}
