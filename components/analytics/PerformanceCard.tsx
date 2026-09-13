interface PerformanceCardProps {
  title?: string;
  value?: string;
  change?: string;
  description?: string;
  icon?: React.ReactNode;
  positive?: boolean;
}

export default function PerformanceCard({
  title = "Automation Efficiency",
  value = "94.8%",
  change = "+12.4%",
  description = "Compared with the previous period",
  icon,
  positive = true,
}: PerformanceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.04]">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition-all duration-500 group-hover:bg-violet-500/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {value}
            </span>

            <span
              className={`text-xs font-semibold ${
                positive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {change}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-600">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
          {icon || (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 19V9" />
              <path d="M10 19V5" />
              <path d="M16 19v-7" />
              <path d="M22 19V3" />
            </svg>
          )}
        </div>
      </div>

      <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-400"
          style={{ width: positive ? "82%" : "42%" }}
        />
      </div>
    </div>
  );
}