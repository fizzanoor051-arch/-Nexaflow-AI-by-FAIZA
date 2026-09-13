import React from "react";

type StatsVariant =
  | "violet"
  | "blue"
  | "emerald"
  | "amber";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  variant?: StatsVariant;
  description?: string;
}

const variantStyles: Record<
  StatsVariant,
  {
    icon: string;
    glow: string;
  }
> = {
  violet: {
    icon: "bg-violet-500/10 text-violet-300 ring-violet-400/10",
    glow: "bg-violet-500/10",
  },
  blue: {
    icon: "bg-sky-500/10 text-sky-300 ring-sky-400/10",
    glow: "bg-sky-500/10",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/10",
    glow: "bg-emerald-500/10",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-300 ring-amber-400/10",
    glow: "bg-amber-500/10",
  },
};

export default function StatsCard({
  title,
  value,
  change,
  changeLabel = "vs. last month",
  trend = "up",
  icon,
  variant = "violet",
  description,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.035]">
      {/* Background glow */}
      <div
        className={[
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl",
          styles.glow,
          "opacity-40 transition-opacity duration-300 group-hover:opacity-60",
        ].join(" ")}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {title}
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {value}
              </p>
            </div>
          </div>

          {icon && (
            <div
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
                styles.icon,
              ].join(" ")}
            >
              <span className="h-5 w-5">{icon}</span>
            </div>
          )}
        </div>

        {(change || description) && (
          <div className="mt-4 flex items-center gap-2">
            {change && (
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold",
                  trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : trend === "down"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-white/5 text-slate-400",
                ].join(" ")}
              >
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {trend === "neutral" && "—"}
                {change}
              </span>
            )}

            <span className="truncate text-[10px] text-slate-600">
              {description || changeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}