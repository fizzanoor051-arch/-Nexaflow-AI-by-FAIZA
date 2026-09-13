"use client";

import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-slate-950 shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:bg-slate-100 hover:shadow-[0_12px_40px_rgba(255,255,255,0.18)]",
  secondary:
    "bg-slate-800/80 text-white ring-1 ring-white/10 hover:bg-slate-700 hover:ring-white/20",
  outline:
    "bg-transparent text-white ring-1 ring-white/15 hover:bg-white/5 hover:ring-white/25",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger:
    "bg-red-500/10 text-red-300 ring-1 ring-red-400/20 hover:bg-red-500/15 hover:ring-red-400/30",
  success:
    "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20 hover:bg-emerald-500/15 hover:ring-emerald-400/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs rounded-lg",
  md: "min-h-10 px-4 text-sm rounded-xl",
  lg: "min-h-12 px-5 text-sm rounded-xl",
  icon: "h-10 w-10 rounded-xl p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "group relative inline-flex items-center justify-center gap-2",
        "font-medium tracking-[-0.01em]",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]",
        "active:scale-[0.98]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "select-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {children}

          {rightIcon && (
            <span
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}