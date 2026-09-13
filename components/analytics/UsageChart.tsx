"use client";

interface UsageChartProps {
  used?: number;
  limit?: number;
  title?: string;
  subtitle?: string;
}

export default function UsageChart({
  used = 742,
  limit = 1000,
  title = "AI Usage",
  subtitle = "Your current monthly AI usage",
}: UsageChartProps) {
  const safeLimit = Math.max(limit, 1);
  const percentage = Math.min((used / safeLimit) * 100, 100);
  const remaining = Math.max(limit - used, 0);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="8.5" />
          </svg>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-3xl font-bold tracking-tight text-white">
              {used.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-slate-600">
              / {limit.toLocaleString()}
            </span>
          </div>

          <span className="text-sm font-semibold text-violet-300">
            {Math.round(percentage)}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-400 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-600">Usage this month</span>
          <span className="text-slate-400">
            {remaining.toLocaleString()} remaining
          </span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Today
          </p>
          <p className="mt-1 text-sm font-semibold text-white">84</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Avg/day
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {Math.round(used / 30)}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Status
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-400">
            Healthy
          </p>
        </div>
      </div>
    </div>
  );
}