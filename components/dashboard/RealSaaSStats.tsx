"use client";

import { useCallback, useEffect, useState } from "react";

type Period = "week" | "month";

type Trend = "up" | "down" | "neutral";

type DashboardStats = {
totalLeads: number;
qualifiedLeads: number;
activeWorkflows: number;
tasksCompleted: number;
aiActions: number;
conversionRate: number;

periodLeadsCreated: number;
periodQualifiedLeads: number;
periodTasksCompleted: number;
periodAiActions: number;
periodConversionRate: number;
};

type StatChange = {
value: number;
trend: Trend;
};

type GraphPoint = {
value: number;
};

type ApiResponse = {
success: boolean;
period: Period;
stats: DashboardStats;
changes?: {
totalLeads?: StatChange;
qualifiedLeads?: StatChange;
activeWorkflows?: StatChange;
tasksCompleted?: StatChange;
aiActions?: StatChange;
conversionRate?: StatChange;
};
graphData?: {
totalLeads?: GraphPoint[];
qualifiedLeads?: GraphPoint[];
activeWorkflows?: GraphPoint[];
tasksCompleted?: GraphPoint[];
aiActions?: GraphPoint[];
conversionRate?: GraphPoint[];
};
error?: string;
};

type Stat = {
key:
| "totalLeads"
| "qualifiedLeads"
| "activeWorkflows"
| "tasksCompleted"
| "aiActions"
| "conversionRate";
label: string;
value: string;
change: string;
description: string;
icon: string;
trend: Trend;
accent: string;
graph: number[];
source: string;
};

const statConfig = [
{
key: "totalLeads",
label: "Total Leads",
icon: "◉",
accent: "from-cyan-400/20 to-blue-500/5",
source: "Leads",
},
{
key: "qualifiedLeads",
label: "Qualified Leads",
icon: "✦",
accent: "from-violet-400/20 to-purple-500/5",
source: "Lead qualification",
},
{
key: "activeWorkflows",
label: "Active Workflows",
icon: "↯",
accent: "from-fuchsia-400/20 to-pink-500/5",
source: "Workflows",
},
{
key: "tasksCompleted",
label: "Tasks Completed",
icon: "✓",
accent: "from-emerald-400/20 to-teal-500/5",
source: "Tasks",
},
{
key: "aiActions",
label: "AI Actions",
icon: "✧",
accent: "from-amber-400/20 to-orange-500/5",
source: "AI activity",
},
{
key: "conversionRate",
label: "Conversion Rate",
icon: "↗",
accent: "from-blue-400/20 to-indigo-500/5",
source: "Leads",
},
] as const;

function formatNumber(value: number) {
return new Intl.NumberFormat("en-US").format(value);
}

function formatChange(change: number) {
if (Math.abs(change) < 0.05) {
return "No change";
}

const rounded = Math.abs(change).toFixed(1);

return `${rounded}%`;
}

function getTrend(change: StatChange | undefined): Trend {
if (!change) {
return "neutral";
}

if (change.trend === "up") {
return "up";
}

if (change.trend === "down") {
return "down";
}

return "neutral";
}

function getGraphValues(
points: GraphPoint[] | undefined,
fallback: number
) {
if (!points || points.length === 0) {
return [fallback];
}

return points.map((point) =>
typeof point.value === "number" && Number.isFinite(point.value)
? point.value
: 0
);
}

function buildStats(data: ApiResponse): Stat[] {
const period = data.period;

const changes = data.changes ?? {};
const graphs = data.graphData ?? {};

const periodDescription =
period === "week" ? "this week" : "this month";

const totalLeadsChange = changes.totalLeads;
const qualifiedLeadsChange = changes.qualifiedLeads;
const activeWorkflowsChange = changes.activeWorkflows;
const tasksCompletedChange = changes.tasksCompleted;
const aiActionsChange = changes.aiActions;
const conversionRateChange = changes.conversionRate;

return [
{
key: "totalLeads",
label: "Total Leads",
value: formatNumber(data.stats.periodLeadsCreated),
change: formatChange(totalLeadsChange?.value ?? 0),
description: periodDescription,
icon: statConfig[0].icon,
trend: getTrend(totalLeadsChange),
accent: statConfig[0].accent,
graph: getGraphValues(
graphs.totalLeads,
data.stats.periodLeadsCreated
),
source: statConfig[0].source,
},
{
key: "qualifiedLeads",
label: "Qualified Leads",
value: formatNumber(data.stats.periodQualifiedLeads),
change: formatChange(qualifiedLeadsChange?.value ?? 0),
description: periodDescription,
icon: statConfig[1].icon,
trend: getTrend(qualifiedLeadsChange),
accent: statConfig[1].accent,
graph: getGraphValues(
graphs.qualifiedLeads,
data.stats.periodQualifiedLeads
),
source: statConfig[1].source,
},
{
key: "activeWorkflows",
label: "Active Workflows",
value: formatNumber(data.stats.activeWorkflows),
change: formatChange(activeWorkflowsChange?.value ?? 0),
description: "currently active",
icon: statConfig[2].icon,
trend: getTrend(activeWorkflowsChange),
accent: statConfig[2].accent,
graph: getGraphValues(
graphs.activeWorkflows,
data.stats.activeWorkflows
),
source: statConfig[2].source,
},
{
key: "tasksCompleted",
label: "Tasks Completed",
value: formatNumber(data.stats.periodTasksCompleted),
change: formatChange(tasksCompletedChange?.value ?? 0),
description: periodDescription,
icon: statConfig[3].icon,
trend: getTrend(tasksCompletedChange),
accent: statConfig[3].accent,
graph: getGraphValues(
graphs.tasksCompleted,
data.stats.periodTasksCompleted
),
source: statConfig[3].source,
},
{
key: "aiActions",
label: "AI Actions",
value: formatNumber(data.stats.periodAiActions),
change: formatChange(aiActionsChange?.value ?? 0),
description: periodDescription,
icon: statConfig[4].icon,
trend: getTrend(aiActionsChange),
accent: statConfig[4].accent,
graph: getGraphValues(
graphs.aiActions,
data.stats.periodAiActions
),
source: statConfig[4].source,
},
{
key: "conversionRate",
label: "Conversion Rate",
value: `${data.stats.periodConversionRate.toFixed(1)}%`,
change: formatChange(conversionRateChange?.value ?? 0),
description: periodDescription,
icon: statConfig[5].icon,
trend: getTrend(conversionRateChange),
accent: statConfig[5].accent,
graph: getGraphValues(
graphs.conversionRate,
data.stats.periodConversionRate
),
source: statConfig[5].source,
},
];
}

function TrendIcon({ trend }: { trend: Trend }) {
if (trend === "neutral") {
return ( <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-white/40">
— </span>
);
}

return (
<span
className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
        trend === "up"
          ? "bg-emerald-400/10 text-emerald-400"
          : "bg-red-400/10 text-red-400"
      }`}
>
{trend === "up" ? "↑" : "↓"} </span>
);
}

function StatCardSkeleton() {
return ( <div className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl"> <div className="flex items-start justify-between"> <div className="flex items-center gap-3"> <div className="h-10 w-10 rounded-xl bg-white/[0.08]" />


      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-white/[0.08]" />
        <div className="h-2 w-20 rounded bg-white/[0.05]" />
      </div>
    </div>

    <div className="h-5 w-16 rounded bg-white/[0.06]" />
  </div>

  <div className="mt-7 h-9 w-28 rounded bg-white/[0.08]" />

  <div className="mt-3 h-5 w-40 rounded bg-white/[0.05]" />

  <div className="mt-5 h-px w-full bg-white/[0.06]" />
</div>


);
}

function MiniGraph({
values,
trend,
}: {
values: number[];
trend: Trend;
}) {
const max = Math.max(...values, 1);
const min = Math.min(...values, 0);
const range = Math.max(max - min, 1);

return ( <div className="flex h-11 items-end gap-1">
{values.slice(-8).map((value, index) => {
const normalized =
((value - min) / range) * 70 + 30;


    const height = Math.max(
      12,
      Math.min(100, normalized)
    );

    return (
      <div
        key={`${value}-${index}`}
        className={`w-1.5 rounded-full transition-all duration-500 ${
          trend === "up"
            ? "bg-emerald-400/35 group-hover:bg-emerald-400/60"
            : trend === "down"
              ? "bg-red-400/35 group-hover:bg-red-400/60"
              : "bg-white/20 group-hover:bg-white/35"
        }`}
        style={{
          height: `${height}%`,
        }}
      />
    );
  })}
</div>


);
}

export default function RealSaaSStats() {
const [period, setPeriod] = useState<Period>("week");
const [stats, setStats] = useState<Stat[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadStats = useCallback(async (selectedPeriod: Period) => {
try {
setLoading(true);
setError("");


  const response = await fetch(
    `/api/dashboard/stats?period=${selectedPeriod}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  const data: ApiResponse = await response.json();

  if (!data.success || !data.stats) {
    throw new Error(
      data.error ||
        "Unable to load dashboard statistics."
    );
  }

  setStats(buildStats(data));
} catch (err) {
  console.error("Dashboard stats fetch error:", err);

  setStats([]);

  setError(
    err instanceof Error
      ? err.message
      : "Unable to load dashboard statistics."
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
void loadStats(period);
}, [period, loadStats]);

const handlePeriodChange = (selectedPeriod: Period) => {
if (selectedPeriod === period) {
return;
}


setPeriod(selectedPeriod);


};

return ( <section className="w-full space-y-5">
{/* Header */} <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"> <div> <div className="mb-2 flex items-center gap-2"> <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />


        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
          Live workspace
        </span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        Performance overview
      </h2>

      <p className="mt-1 text-sm text-white/45">
        Monitor your business activity and AI automation
        performance.
      </p>
    </div>

    {/* Period switcher */}
    <div className="flex w-fit items-center rounded-xl border border-white/10 bg-white/[0.035] p-1 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => handlePeriodChange("week")}
        disabled={loading && period === "week"}
        className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-300 ${
          period === "week"
            ? "bg-white/[0.10] text-white shadow-lg shadow-black/10"
            : "text-white/40 hover:text-white/75"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        This week
      </button>

      <button
        type="button"
        onClick={() => handlePeriodChange("month")}
        disabled={loading && period === "month"}
        className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-300 ${
          period === "month"
            ? "bg-white/[0.10] text-white shadow-lg shadow-black/10"
            : "text-white/40 hover:text-white/75"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        This month
      </button>
    </div>
  </div>

  {/* Loading */}
  {loading && (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statConfig.map((stat) => (
        <StatCardSkeleton key={stat.label} />
      ))}
    </div>
  )}

  {/* Error */}
  {!loading && error && (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-300">
            Unable to load dashboard statistics
          </p>

          <p className="mt-1 text-xs text-white/40">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadStats(period)}
          className="w-fit rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white transition hover:bg-white/[0.10]"
        >
          Try again
        </button>
      </div>
    </div>
  )}

  {/* Stats */}
  {!loading && !error && (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={`${stat.key}-${index}`}
          className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.055]"
          style={{
            animationDelay: `${index * 70}ms`,
          }}
        >
          {/* Ambient glow */}
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${stat.accent} opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
          />

          {/* Top row */}
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-lg text-white/80">
                {stat.icon}
              </div>

              <div>
                <p className="text-sm font-medium text-white/60">
                  {stat.label}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/25">
                  {stat.source}
                </p>
              </div>
            </div>

            <div
              className={`rounded-lg border px-2 py-1 text-[10px] font-medium ${
                stat.trend === "up"
                  ? "border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-400/80"
                  : stat.trend === "down"
                    ? "border-red-400/10 bg-red-400/[0.05] text-red-400/80"
                    : "border-white/10 bg-white/[0.04] text-white/40"
              }`}
            >
              {stat.trend === "up"
                ? "INCREASING"
                : stat.trend === "down"
                  ? "DECREASING"
                  : "STABLE"}
            </div>
          </div>

          {/* Main number */}
          <div className="relative mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-white sm:text-[34px]">
                {stat.value}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <TrendIcon trend={stat.trend} />

                <span
                  className={`text-xs font-semibold ${
                    stat.trend === "up"
                      ? "text-emerald-400"
                      : stat.trend === "down"
                        ? "text-red-400"
                        : "text-white/40"
                  }`}
                >
                  {stat.change}
                </span>

                <span className="text-xs text-white/30">
                  vs previous period
                </span>
              </div>
            </div>

            {/* Real graph */}
            <MiniGraph
              values={stat.graph}
              trend={stat.trend}
            />
          </div>

          {/* Bottom line */}
          <div className="relative mt-5 h-px w-full overflow-hidden bg-white/[0.06]">
            <div
              className={`h-full transition-all duration-500 group-hover:w-[85%] ${
                stat.trend === "up"
                  ? "w-[72%] bg-gradient-to-r from-emerald-400/40 to-transparent"
                  : stat.trend === "down"
                    ? "w-[48%] bg-gradient-to-r from-red-400/40 to-transparent"
                    : "w-[60%] bg-gradient-to-r from-white/20 to-transparent"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Empty */}
  {!loading && !error && stats.length === 0 && (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-8 text-center backdrop-blur-xl">
      <p className="text-sm font-medium text-white/70">
        No dashboard statistics available yet.
      </p>

      <p className="mt-1 text-xs text-white/35">
        Create some leads, workflows, or tasks to see
        activity here.
      </p>
    </div>
  )}
</section>


);
}
