
"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type AnalyticsData = {
  metrics: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    successRate: number;
    totalLeads: number;
    qualifiedLeads: number;
    aiActions: number;
    responseTime: number;
    conversionRate: number;
    totalTasks: number;
    activeWorkflows: number;
  };

  leadsOverTime: {
    date: string;
    leads: number;
  }[];

  workflowPerformance: {
    id: string;
    name: string;
    runs: number;
    successRate: number;
    status: string;
  }[];

  funnel: {
    label: string;
    value: number;
  }[];

  activity: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
};

const fallbackData: AnalyticsData = {
  metrics: {
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    successRate: 0,
    totalLeads: 0,
    qualifiedLeads: 0,
    aiActions: 0,
    responseTime: 0,
    conversionRate: 0,
    totalTasks: 0,
    activeWorkflows: 0,
  },

  leadsOverTime: [],

  workflowPerformance: [],

  funnel: [
    {
      label: "New leads",
      value: 0,
    },
    {
      label: "Contacted",
      value: 0,
    },
    {
      label: "Qualified",
      value: 0,
    },
    {
      label: "Converted",
      value: 0,
    },
  ],

  activity: [],
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getRelativeTime(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function MetricCard({
  label,
  value,
  suffix,
  detail,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  detail: string;
  icon: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#10130f]/90 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#e7b84b]/25">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#e7b84b]/50 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            {label}
          </p>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-white">
              {value}
            </span>

            {suffix && (
              <span className="text-sm font-semibold text-white/40">
                {suffix}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-white/35">
            {detail}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-[#e7b84b]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#10130f]/85 p-5 shadow-2xl backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-sm font-bold tracking-wide text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-white/35">
            {description}
          </p>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function LineChart({
  data,
}: {
  data: {
    date: string;
    leads: number;
  }[];
}) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-white/30">
        No lead activity yet
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map((item) => item.leads),
    1
  );

  const width = 700;
  const height = 240;
  const paddingX = 20;
  const paddingY = 25;

  const points = data
    .map((item, index) => {
      const x =
        paddingX +
        (index /
          Math.max(data.length - 1, 1)) *
          (width - paddingX * 2);

      const y =
        height -
        paddingY -
        (item.leads / maxValue) *
          (height - paddingY * 2);

      return {
        x,
        y,
        value: item.leads,
        date: item.date,
      };
    });

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = `
    ${path}
    L ${points[points.length - 1].x} ${height - paddingY}
    L ${points[0].x} ${height - paddingY}
    Z
  `;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[260px] w-full"
        preserveAspectRatio="none"
      >
        {[0, 1, 2, 3].map((line) => {
          const y =
            paddingY +
            (line / 3) *
              (height - paddingY * 2);

          return (
            <line
              key={line}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        <path
          d={areaPath}
          fill="rgba(231,184,75,0.07)"
        />

        <path
          d={path}
          fill="none"
          stroke="#e7b84b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <g key={point.date}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#10130f"
              stroke="#e7b84b"
              strokeWidth="2"
            />

            <text
              x={point.x}
              y={height - 4}
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize="10"
            >
              {point.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function SuccessBar({
  name,
  runs,
  successRate,
}: {
  name: string;
  runs: number;
  successRate: number;
}) {
  return (
    <div className="group rounded-2xl border border-white/8 bg-white/[0.025] p-4 transition hover:border-[#e7b84b]/20">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white/85">
            {name}
          </p>

          <p className="mt-1 text-[11px] text-white/30">
            {formatNumber(runs)} executions
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-[#f5d98b]">
            {successRate}%
          </p>

          <p className="text-[9px] uppercase tracking-wider text-white/25">
            success
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#b88a24] to-[#f5d98b] transition-all duration-700"
          style={{
            width: `${Math.min(
              Math.max(successRate, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function Funnel({
  data,
}: {
  data: {
    label: string;
    value: number;
  }[];
}) {
  const maxValue = Math.max(
    ...data.map((item) => item.value),
    1
  );

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage =
          (item.value / maxValue) * 100;

        return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-white/55">
                {index + 1}. {item.label}
              </span>

              <span className="text-xs font-semibold text-white/80">
                {formatNumber(item.value)}
              </span>
            </div>

            <div className="h-8 overflow-hidden rounded-lg border border-white/8 bg-white/[0.025]">
              <div
                className="flex h-full items-center rounded-lg bg-gradient-to-r from-[#80601d]/70 via-[#c49a36]/70 to-[#f5d98b]/70 px-3 transition-all duration-700"
                style={{
                  width: `${Math.max(
                    percentage,
                    item.value > 0 ? 10 : 0
                  )}%`,
                }}
              >
                {item.value > 0 && (
                  <span className="text-[10px] font-bold text-[#171811]">
                    {Math.round(
                      (item.value / maxValue) * 100
                    )}
                    %
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityIcon({
  type,
}: {
  type: string;
}) {
  const icons: Record<string, string> = {
    workflow: "↗",
    lead: "◇",
    task: "✓",
    ai: "✦",
  };

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs text-[#e7b84b]">
      {icons[type] || "•"}
    </span>
  );
}

export default function AnalyticsPage() {
  const [data, setData] =
    useState<AnalyticsData>(fallbackData);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  async function loadAnalytics(
    showLoader = false
  ) {
    try {
      if (showLoader) {
        setRefreshing(true);
      }

      const response = await fetch(
        "/api/analytics",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Analytics request failed."
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
            "Analytics unavailable."
        );
      }

      setData(result);
    } catch (error) {
      console.error(
        "Analytics loading error:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAnalytics();

    function handleWorkflowRun() {
      loadAnalytics();
    }

    window.addEventListener(
      "nexaflow:workflow-run",
      handleWorkflowRun
    );

    return () => {
      window.removeEventListener(
        "nexaflow:workflow-run",
        handleWorkflowRun
      );
    };
  }, []);

  const topWorkflow = useMemo(() => {
    return data.workflowPerformance[0];
  }, [data.workflowPerformance]);

  const funnelConversion =
    data.metrics.totalLeads === 0
      ? 0
      : Number(
          (
            (data.metrics.qualifiedLeads /
              data.metrics.totalLeads) *
            100
          ).toFixed(1)
        );

  return (
    <main className="min-h-screen bg-[#080a07] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#e7b84b]/[0.035] blur-3xl" />
        <div className="absolute right-[8%] top-[30%] h-96 w-96 rounded-full bg-emerald-400/[0.02] blur-3xl" />
        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-[#e7b84b]/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-white/30">
            <Link
              href="/dashboard"
              className="transition hover:text-white/70"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-white/55">
              Analytics
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#e7b84b]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f5d98b]/70">
                  Intelligence / Analytics
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-white/40">
                Understand workflow performance,
                lead movement and AI activity
                across your automation workspace.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  loadAnalytics(true)
                }
                disabled={refreshing}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-[#e7b84b]/30 hover:bg-[#e7b84b]/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing
                  ? "Refreshing..."
                  : "↻ Refresh"}
              </button>

              <Link
                href="/workflows"
                className="rounded-xl border border-[#e7b84b]/20 bg-[#e7b84b]/[0.07] px-4 py-2.5 text-xs font-semibold text-[#f5d98b] transition hover:bg-[#e7b84b]/[0.12]"
              >
                View workflows →
              </Link>
            </div>
          </div>
        </header>

        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Workflow runs"
            value={formatNumber(
              data.metrics.totalRuns
            )}
            detail={`${formatNumber(
              data.metrics.successfulRuns
            )} successful executions`}
            icon="↗"
          />

          <MetricCard
            label="Success rate"
            value={String(
              data.metrics.successRate
            )}
            suffix="%"
            detail={`${formatNumber(
              data.metrics.failedRuns
            )} runs need review`}
            icon="✓"
          />

          <MetricCard
            label="AI actions"
            value={formatNumber(
              data.metrics.aiActions
            )}
            detail="AI-assisted workflow activity"
            icon="✦"
          />

          <MetricCard
            label="Response time"
            value={String(
              data.metrics.responseTime
            )}
            suffix="ms"
            detail="Average automation response"
            icon="◌"
          />
        </div>

        {/* Lead trend + workflow success */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <Section
            title="Leads over time"
            description="Inbound lead activity across the last 7 days."
            action={
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/35">
                7 days
              </span>
            }
          >
            <LineChart
              data={data.leadsOverTime}
            />

            <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Total leads
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {formatNumber(
                    data.metrics.totalLeads
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Qualified
                </p>

                <p className="mt-1 text-lg font-bold text-[#f5d98b]">
                  {formatNumber(
                    data.metrics.qualifiedLeads
                  )}
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="Workflow success rate"
            description="Performance ranked by execution reliability."
          >
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-2xl bg-white/[0.04]"
                  />
                ))}
              </div>
            ) : data.workflowPerformance.length ? (
              <div className="space-y-3">
                {data.workflowPerformance.map(
                  (workflow) => (
                    <SuccessBar
                      key={workflow.id}
                      name={workflow.name}
                      runs={workflow.runs}
                      successRate={
                        workflow.successRate
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-white/30">
                No workflows available
              </div>
            )}
          </Section>
        </div>

        {/* Intelligence overview */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Section
            title="AI intelligence"
            description="Current AI-assisted operational activity."
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">
                  AI actions
                </span>

                <span className="text-xl font-bold text-white">
                  {formatNumber(
                    data.metrics.aiActions
                  )}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b691f] to-[#f5d98b]"
                  style={{
                    width: `${Math.min(
                      data.metrics.aiActions /
                        Math.max(
                          data.metrics.totalRuns,
                          1
                        ) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/25">
                    Success
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#5ed6a0]">
                    {data.metrics.successRate}%
                  </p>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/25">
                    Response
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#f5d98b]">
                    {data.metrics.responseTime}ms
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Conversion funnel"
            description="Lead progression through the workspace."
          >
            <Funnel data={data.funnel} />

            <div className="mt-5 border-t border-white/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/35">
                  Lead qualification
                </span>

                <span className="text-sm font-bold text-[#f5d98b]">
                  {funnelConversion}%
                </span>
              </div>
            </div>
          </Section>

          <Section
            title="Top-performing workflow"
            description="Highest current workflow reliability."
          >
            {topWorkflow ? (
              <div className="flex h-full min-h-[220px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e7b84b]/20 bg-[#e7b84b]/[0.07] text-xl text-[#f5d98b]">
                    ★
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {topWorkflow.name}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/35">
                    Currently leading the workspace
                    in execution reliability.
                  </p>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/25">
                      Success rate
                    </p>

                    <p className="mt-1 text-3xl font-bold text-[#f5d98b]">
                      {topWorkflow.successRate}%
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-white/25">
                      Runs
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {formatNumber(
                        topWorkflow.runs
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center text-xs text-white/30">
                No workflow performance data
              </div>
            )}
          </Section>
        </div>

        {/* Execution outcomes */}
        <div className="mt-5">
          <Section
            title="Execution outcomes"
            description="Current workflow execution health."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    Successful
                  </span>

                  <span className="text-emerald-300">
                    ✓
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-white">
                  {formatNumber(
                    data.metrics.successfulRuns
                  )}
                </p>

                <p className="mt-1 text-[10px] text-emerald-300/60">
                  Completed successfully
                </p>
              </div>

              <div className="rounded-2xl border border-[#e7b84b]/10 bg-[#e7b84b]/[0.035] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    Active workflows
                  </span>

                  <span className="text-[#f5d98b]">
                    ●
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-white">
                  {data.metrics.activeWorkflows}
                </p>

                <p className="mt-1 text-[10px] text-[#f5d98b]/60">
                  Currently operational
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    Needs review
                  </span>

                  <span className="text-red-300">
                    !
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-white">
                  {formatNumber(
                    data.metrics.failedRuns
                  )}
                </p>

                <p className="mt-1 text-[10px] text-red-300/60">
                  Failed executions
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Recent activity */}
        <div className="mt-5">
          <Section
            title="Recent activity"
            description="Live events generated by the NexaFlow workspace."
          >
            {data.activity.length ? (
              <div className="divide-y divide-white/6">
                {data.activity
                  .slice(0, 10)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 py-3.5"
                    >
                      <ActivityIcon
                        type={activity.type}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white/75">
                          {activity.title}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-white/30">
                          {activity.description}
                        </p>
                      </div>

                      <span className="shrink-0 text-[9px] text-white/25">
                        {getRelativeTime(
                          activity.createdAt
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-white/30">
                No recent activity
              </div>
            )}
          </Section>
        </div>

        {/* Bottom status */}
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#5ed6a0]" />

            <div>
              <p className="text-xs font-semibold text-white/65">
                Analytics engine operational
              </p>

              <p className="text-[10px] text-white/25">
                Metrics synchronized with the shared
                NexaFlow workspace store.
              </p>
            </div>
          </div>

          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
            NEXAFLOW / CONTROL
          </div>
        </div>
      </div>
    </main>
  );
}
