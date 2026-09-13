import React from "react";

type CardVariant = "default" | "glass" | "elevated" | "interactive";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "border-white/10 bg-white/[0.025]",
  glass:
    "border-white/10 bg-white/[0.035] backdrop-blur-xl",
  elevated:
    "border-white/10 bg-[#0b1120] shadow-[0_20px_60px_rgba(0,0,0,0.25)]",
  interactive:
    "border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {/* Subtle top highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      {children}
    </div>
  );
}