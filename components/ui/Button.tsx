import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-text-inverse hover:bg-primary-light focus:ring-accent",
    secondary:
      "border border-border bg-surface text-text hover:bg-bg focus:ring-accent",
    danger:
      "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15 focus:ring-danger",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
