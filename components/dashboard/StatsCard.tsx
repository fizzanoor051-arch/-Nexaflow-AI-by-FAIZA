"use client";

import type { ReactNode } from "react";

export type StatsCardTrend = "up" | "down" | "neutral";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: StatsCardTrend;
  description?: string;
  icon?: ReactNode;
  accent?: "violet" | "blue" | "emerald" | "amber" | "rose" | "cyan";
  href?: string;
  onClick?: () => void;
  loading?: boolean;
}

/*
 * Dashboard content palette
 * Keep all original accent names for compatibility,
 * but map them into the NexaFlow olive / champagne system.
 */
const accentStyles = {
  violet: {
    icon: "border-[#E7B84B]/20 bg-[#E7B84B]/[0.07] text-[#D9AE4A]",
    glow: "bg-[#E7B84B]/[0.045]",
    line: "bg-[#E7B84B]",
  },

  blue: {
    icon: "border-[#F5D98B]/15 bg-[#F5D98B]/[0.055] text-[#D8C487]",
    glow: "bg-[#F5D98B]/[0.035]",
    line: "bg-[#F5D98B]",
  },

  emerald: {
    icon: "border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.07] text-[#5ED6A0]",
    glow: "bg-[#5ED6A0]/[0.035]",
    line: "bg-[#5ED6A0]",
  },

  amber: {
    icon: "border-[#E7B84B]/20 bg-[#E7B84B]/[0.07] text-[#E2C77D]",
    glow: "bg-[#E7B84B]/[0.04]",
    line: "bg-[#E7B84B]",
  },

  rose: {
    icon: "border-[#E87575]/15 bg-[#E87575]/[0.055] text-[#E58A8A]",
    glow: "bg-[#E87575]/[0.03]",
    line: "bg-[#E87575]",
  },

  cyan: {
    icon: "border-[#F5D98B]/15 bg-[#F5D98B]/[0.05] text-[#D8C487]",
    glow: "bg-[#F5D98B]/[0.03]",
    line: "bg-[#F5D98B]",
  },
};

function TrendIcon({ trend }: { trend: StatsCardTrend }) {
  if (trend === "neutral") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-3 w-3"
      >
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (trend === "down") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-3 w-3"
      >
        <path d="m7 9 5 5 5-5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3 w-3"
    >
      <path d="m7 15 5-5 5 5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CardContent({
  title,
  value,
  change,
  trend = "neutral",
  description,
  icon,
  accent = "violet",
  href,
  onClick,
}: StatsCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl",
        "border border-[#F5D98B]/[0.08]",
        "bg-[#20241D]/80 p-5",
        "backdrop-blur-xl",
        "shadow-[0_20px_60px_rgba(0,0,0,0.20)]",
        "transition-all duration-300",
        (href || onClick) &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-[#E7B84B]/25 hover:bg-[#252A22]/90 hover:shadow-[0_22px_55px_rgba(0,0,0,0.26)]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Ambient dashboard glow */}
      <div
        className={[
          "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl",
          "opacity-70 transition-transform duration-500 group-hover:scale-125",
          styles.glow,
        ].join(" ")}
      />

      {/* Gold micro-line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/25 to-transparent" />

      {/* Accent line */}
      <div
        className={[
          "absolute left-0 top-0 h-px w-20 opacity-60",
          styles.line,
        ].join(" ")}
      />

      {/* Subtle inner highlight */}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.06] to-transparent" />

      <div className="relative">
        {/* TOP AREA */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777D70]">
                {title}
              </p>

              <span className="hidden h-1 w-1 rounded-full bg-[#E7B84B]/50 sm:block" />
            </div>

            {/* VALUE + TREND */}
            <div className="mt-3 flex items-baseline gap-2">
              <p className="truncate text-[28px] font-semibold tracking-[-0.045em] text-[#F4F0E6]">
                {value}
              </p>

              {change && (
                <span
                  className={[
                    "inline-flex shrink-0 items-center gap-0.5 rounded-full",
                    "border px-1.5 py-0.5",
                    "text-[9px] font-bold",
                    trend === "up" &&
                      "border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.07] text-[#5ED6A0]",
                    trend === "down" &&
                      "border-[#E87575]/15 bg-[#E87575]/[0.07] text-[#E58A8A]",
                    trend === "neutral" &&
                      "border-[#F5D98B]/[0.07] bg-[#F5D98B]/[0.035] text-[#777D70]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <TrendIcon trend={trend} />
                  {change}
                </span>
              )}
            </div>
          </div>

          {/* ICON */}
          {icon && (
            <div
              className={[
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                "transition-all duration-300 group-hover:scale-105",
                styles.icon,
              ].join(" ")}
            >
              {/* Icon highlight */}
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.035] to-transparent" />

              <span className="relative z-10 h-[18px] w-[18px]">
                {icon}
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM AREA */}
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="min-h-[18px] text-[10px] leading-4 text-[#777D70]">
            {description || "Compared with the previous period"}
          </p>

          {(href || onClick) && (
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                "border border-[#F5D98B]/[0.07]",
                "bg-[#151713]/60",
                "text-[#555B50]",
                "transition-all duration-200",
                "group-hover:border-[#E7B84B]/20",
                "group-hover:bg-[#E7B84B]/[0.06]",
                "group-hover:text-[#E7B84B]",
                "group-hover:translate-x-0.5",
              ].join(" ")}
            >
              <ArrowIcon />
            </span>
          )}
        </div>
      </div>

      {/* Bottom hover highlight */}
      <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Left hover rail */}
      {(href || onClick) && (
        <span className="pointer-events-none absolute inset-y-4 left-0 w-[2px] -translate-x-full rounded-r-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      )}
    </div>
  );
}

export default function StatsCard(props: StatsCardProps) {
  const {
    href,
    onClick,
    loading = false,
  } = props;

  {/* LOADING STATE */}
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.07] bg-[#20241D]/75 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
        {/* Loading top line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/15 to-transparent" />

        <div className="animate-pulse">
          <div className="h-2.5 w-24 rounded-full bg-[#F4F0E6]/[0.055]" />

          <div className="mt-4 h-8 w-28 rounded-lg bg-[#F4F0E6]/[0.055]" />

          <div className="mt-4 h-2.5 w-36 rounded-full bg-[#F4F0E6]/[0.035]" />

          <div className="mt-5 h-px w-full bg-[#F5D98B]/[0.035]" />
        </div>
      </div>
    );
  }

  {/* LINK CARD */}
  if (href) {
    return (
      <a
        href={href}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[#E7B84B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151713]"
      >
        <CardContent {...props} />
      </a>
    );
  }

  {/* CLICKABLE CARD */}
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[#E7B84B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151713]"
      >
        <CardContent {...props} />
      </button>
    );
  }

  return <CardContent {...props} />;
}