import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantClasses = {
  primary: "bg-action-primary text-action-primary-text hover:brightness-95 focus-visible:outline-action-primary",
  "secondary-on-dark":
    "border border-mirage-200/40 text-text-on-dark hover:bg-white/10 focus-visible:outline-white",
  "secondary-on-light":
    "border border-border-light text-text-on-light hover:bg-bg-light-muted focus-visible:outline-mirage-700",
} as const;

type Variant = keyof typeof variantClasses;

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; className?: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; className?: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
