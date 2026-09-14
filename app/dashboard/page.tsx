"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import ActivityFeed, {
  type Activity,
} from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import StatsCard from "@/components/dashboard/StatsCard";

type ChartStyle = "area" | "line" | "bars";
type Range = "7D" | "30D" | "90D";

type Workflow = {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  runs: number;
  success: number;
  lastRun: string;
};

type IconName =
  | "arrow"
  | "refresh"
  | "download"
  | "search"
  | "plus"
  | "workflow"
  | "users"
  | "tasks"
  | "spark"
  | "activity"
  | "check"
  | "clock"
  | "arrowUp"
  | "arrowDown"
  | "chevron"
  | "pause"
  | "play"
  | "x"
  | "external"
  | "settings"
  | "chart"
  | "bell"
  | "database";

function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.9-3" />
          <path d="M4 4v4h4" />
          <path d="M4 13a8 8 0 0 0 14.9 3" />
          <path d="M20 20v-4h-4" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "workflow":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="7" height="6" rx="1.5" />
          <rect x="14" y="14" width="7" height="6" rx="1.5" />
          <path d="M10 7h3a2 2 0 0 1 2 2v5" />
          <path d="m12 12 3 3 3-3" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
          <circle cx="9.5" cy="7.5" r="3.5" />
          <path d="M16 4.5a3.5 3.5 0 0 1 0 6.8" />
          <path d="M17 14.5a4 4 0 0 1 4 4V20" />
        </svg>
      );

    case "tasks":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="m8 9 1.5 1.5L12 8" />
          <path d="M14 9h3" />
          <path d="m8 14 1.5 1.5L12 13" />
          <path d="M14 14h3" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
          <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "arrowUp":
      return (
        <svg {...common}>
          <path d="m6 14 6-6 6 6" />
        </svg>
      );

    case "arrowDown":
      return (
        <svg {...common}>
          <path d="m6 10 6 6 6-6" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m7 10 5 5 5-5" />
        </svg>
      );

    case "pause":
      return (
        <svg {...common}>
          <path d="M9 5v14" />
          <path d="M15 5v14" />
        </svg>
      );

    case "play":
      return (
        <svg {...common}>
          <path d="m9 6 9 6-9 6V6Z" />
        </svg>
      );

    case "x":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 5h5v5" />
          <path d="m19 5-8 8" />
          <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-6" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
        </svg>
      );

    default:
      return null;
  }
}

const chartData: Record<Range, number[]> = {
  "7D": [42, 55, 48, 68, 61, 78, 72],
  "30D": [38, 46, 43, 58, 51, 64, 60, 72, 67, 76, 70, 82],
  "90D": [30, 36, 34, 43, 41, 49, 46, 55, 53, 62, 59, 69],
};

const chartLabels: Record<Range, string[]> = {
  "7D": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30D": [
    "1",
    "4",
    "7",
    "10",
    "13",
    "16",
    "19",
    "22",
    "25",
    "28",
    "29",
    "30",
  ],
  "90D": [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const initialWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Lead qualification",
    status: "active",
    runs: 1284,
    success: 98,
    lastRun: "2 min ago",
  },
  {
    id: "wf-2",
    name: "Customer follow-up",
    status: "active",
    runs: 846,
    success: 96,
    lastRun: "8 min ago",
  },
  {
    id: "wf-3",
    name: "Weekly reporting",
    status: "paused",
    runs: 312,
    success: 91,
    lastRun: "2 hours ago",
  },
  {
    id: "wf-4",
    name: "Database sync",
    status: "active",
    runs: 209,
    success: 99,
    lastRun: "14 min ago",
  },
];

const initialActivities: Activity[] = [
  {
    id: "1",
    title: "Lead qualification workflow completed",
    description: "42 leads processed successfully",
    time: "2 min ago",
    type: "success",
  },
  {
    id: "2",
    title: "Customer follow-up workflow started",
    description: "18 contacts queued for follow-up",
    time: "8 min ago",
    type: "workflow",
  },
  {
    id: "3",
    title: "New lead added",
    description: "Acme Corporation",
    time: "21 min ago",
    type: "lead",
  },
  {
    id: "4",
    title: "AI assistant completed analysis",
    description: "Campaign performance report",
    time: "35 min ago",
    type: "ai",
  },
  {
    id: "5",
    title: "Database sync completed",
    description: "1,204 records synchronized",
    time: "1 hour ago",
    type: "success",
  },
];

function MiniChart({
  data,
  labels,
  type,
}: {
  data: number[];
  labels: string[];
  type: ChartStyle;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);

  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 92 - ((value - min) / range) * 68;

      return `${x},${y}`;
    })
    .join(" ");

  if (type === "bars") {
    return (
      <div className="flex h-full items-end gap-2 px-1">
        {data.map((value, index) => {
          const height = 22 + ((value - min) / range) * 62;

          return (
            <div
              key={`${value}-${index}`}
              className="group flex h-full flex-1 items-end"
            >
              <div
                className="relative w-full rounded-t-md bg-[#E7B84B]/50 transition-all duration-300 group-hover:bg-[#F5D98B]/75"
                style={{ height: `${height}%` }}
              >
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md borderborder-[#F5D98B]/[0.08] bg-[#1B1F19] px-1.5 py-1 text-[8px] font-semibold text-[#F4F0E6] opacity-0 transition-opacity group-hover:opacity-100">
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="dashboardArea"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
           <stop
  offset="0%"
  stopColor="rgba(231,184,75,0.28)"
/>
<stop
  offset="100%"
  stopColor="rgba(231,184,75,0)"
/>
          </linearGradient>
        </defs>

        {type === "area" && (
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#dashboardArea)"
          />
        )}

        <polyline
          points={points}
          fill="none"
          stroke="rgba(231,184,75,0.9)"
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
        />

        {data.map((value, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100;
          const y = 92 - ((value - min) / range) * 68;

          return (
            <circle
              key={`${value}-${index}`}
              cx={x}
              cy={y}
              r="1.8"
              fill="#F5D98B"
              className="opacity-0 transition-opacity hover:opacity-100"
            />
          );
        })}
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex translate-y-7 justify-between">
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="text-[8px] font-medium text-[#9A9D94]"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADDITIONAL PREMIUM SAAS ANALYTICS COMPONENTS                              */
/* -------------------------------------------------------------------------- */

function CircularPercentage({
  value,
  label,
  caption,
  size = 112,
  accent = "gold",
}: {
  value: number;
  label: string;
  caption?: string;
  size?: number;
  accent?: "gold" | "green";
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  const stroke =
  accent === "green"
    ? "#5ED6A0"
    : "#E7B84B";

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="7"
          />

          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-1000"
            style={{
              filter:
                accent === "gold"
                  ? "drop-shadow(0 0 7px rgba(231,184,75,0.35))"
                  : accent === "green"
                    ? "drop-shadow(0 0 7px rgba(94,214,160,0.25))"
                    : "drop-shadow(0 0 7px rgba(167,139,250,0.25))",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-semibold tracking-[-0.04em] text-[#F4F0E6]">
            {value}%
          </span>

          <span className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.16em] text-[#9A9D94]">
            score
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-[#F4F0E6]">
          {label}
        </p>

        {caption && (
          <p className="mt-1 max-w-[150px] text-[9px] leading-4 text-[#9A9D94]">
            {caption}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: stroke,
              boxShadow: `0 0 8px ${stroke}`,
            }}
          />

          <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#9A9D94]">
            live telemetry
          </span>
        </div>
      </div>
    </div>
  );
}

function MetricSparkline({
  data,
  positive = true,
}: {
  data: number[];
  positive?: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const difference = Math.max(max - min, 1);

  const points = data
    .map((value, index) => {
      const x =
        (index / Math.max(data.length - 1, 1)) * 100;
      const y =
        92 - ((value - min) / difference) * 70;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-10 w-20 overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={
          positive
            ? "#5ED6A0"
            : "#E87575"
        }
        strokeWidth="2.2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OperationsMetric({
  eyebrow,
  value,
  detail,
  icon,
  trend,
  data,
}: {
  eyebrow: string;
  value: string;
  detail: string;
  icon: IconName;
  trend: string;
  data: number[];
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F5D98B]/[0.16]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#E7B84B]/[0.035] blur-3xl transition-all duration-500 group-hover:bg-[#E7B84B]/[0.07]" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7B84B]/[0.12] bg-[#E7B84B]/[0.05] text-[#E7B84B]">
              <Icon name={icon} size={13} />
            </span>

            <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.18em] text-[#9A9D94]">
              {eyebrow}
            </span>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-[25px] font-semibold tracking-[-0.05em] text-[#F4F0E6]">
              {value}
            </span>

            <span className="mb-1 rounded-full border border-[#5ED6A0]/[0.15] bg-[#5ED6A0]/[0.06] px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#5ED6A0]">
              {trend}
            </span>
          </div>

          <p className="mt-1 text-[8px] leading-4 text-[#9A9D94]">
            {detail}
          </p>
        </div>

        <MetricSparkline data={data} />
      </div>
    </div>
  );
}

function AIIntelligencePanel() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#F5D98B]/[0.13] bg-[#20241D]/95 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E7B84B]/[0.07] blur-[80px]" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#E7B84B]/[0.025] blur-[70px]" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#F5D98B]/[0.2] bg-[#E7B84B]/[0.06]">
              <div className="absolute inset-2 rounded-full border border-[#E7B84B]/[0.2] animate-pulse" />

              <div className="relative h-5 w-5 rounded-full bg-[#F5D98B] shadow-[0_0_22px_rgba(231,184,75,0.75)]">
                <div className="absolute inset-[5px] rounded-full bg-[#fff2c4]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-[#E7B84B]">
                  AI OPERATIONS
                </span>

                <span className="h-px w-7 bg-[#E7B84B]/30" />

                <span className="font-mono text-[7px] text-[#9A9D94]">
                  CORE-01
                </span>
              </div>

              <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.035em] text-[#F4F0E6]">
                Intelligence Engine
              </h3>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.8)]" />

                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#5ED6A0]">
                  ONLINE
                </span>

                <span className="text-[8px] text-[#9A9D94]">
                  · all systems nominal
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/[0.055] bg-black/[0.12] px-3 py-2.5">
              <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#9A9D94]">
                Latency
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#F4F0E6]">
                184ms
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.055] bg-black/[0.12] px-3 py-2.5">
              <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#9A9D94]">
                Uptime
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#5ED6A0]">
                99.9%
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.055] bg-black/[0.12] px-3 py-2.5">
              <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#9A9D94]">
                Tokens
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#F4F0E6]">
                84.2K
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Lead scoring", "ACTIVE", "AI"],
            ["Intent detection", "ACTIVE", "ML"],
            ["Smart routing", "ACTIVE", "AUTO"],
            ["Report synthesis", "READY", "GEN"],
          ].map(([name, status, code]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-xl border border-[#F5D98B]/[0.06] bg-[#1B1F19]/80 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[9px] font-semibold text-[#F4F0E6]">
                  {name}
                </p>

                <p className="mt-1 font-mono text-[7px] tracking-[0.12em] text-[#9A9D94]">
                  {code} / MODULE
                </p>
              </div>

              <span className="ml-2 rounded-full border border-[#5ED6A0]/[0.15] bg-[#5ED6A0]/[0.05] px-1.5 py-1 font-mono text-[6px] font-bold tracking-[0.12em] text-[#5ED6A0]">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaaSAnalyticsOverview() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#E7B84B]">
              01
            </span>

            <span className="h-px w-8 bg-[#E7B84B]/40" />

            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#9A9D94]">
              LIVE TELEMETRY
            </span>
          </div>

          <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.03em] text-[#F4F0E6]">
            Automation intelligence
          </h3>

          <p className="mt-1 text-[9px] leading-4 text-[#9A9D94]">
            Real-time operational signals across your AI workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.14em] text-[#9A9D94]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.65)]" />
          telemetry synchronized
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OperationsMetric
          eyebrow="Workflow volume"
          value="2.65K"
          detail="Total automation executions"
          icon="workflow"
          trend="+18.4%"
          data={[35, 41, 38, 52, 48, 62, 68, 73]}
        />

        <OperationsMetric
          eyebrow="Success rate"
          value="96%"
          detail="Completed without intervention"
          icon="check"
          trend="+2.8%"
          data={[72, 74, 73, 79, 81, 83, 87, 91]}
        />

        <OperationsMetric
          eyebrow="AI activity"
          value="84.2K"
          detail="Intelligence operations processed"
          icon="spark"
          trend="+24.6%"
          data={[31, 38, 43, 41, 54, 61, 69, 78]}
        />

        <OperationsMetric
          eyebrow="Data sync"
          value="99.9%"
          detail="Workspace data availability"
          icon="database"
          trend="+0.4%"
          data={[91, 92, 95, 94, 97, 96, 99, 100]}
        />
      </div>
    </section>
  );
}

function PerformanceDistribution() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.09] bg-[#20241D]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#E7B84B]/[0.04] blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#E7B84B]">
              EXECUTION DISTRIBUTION
            </p>

            <h3 className="mt-1.5 text-[14px] font-semibold text-[#F4F0E6]">
              Workflow health
            </h3>

            <p className="mt-1 text-[8px] text-[#9A9D94]">
              Current automation state across the workspace.
            </p>
          </div>

          <span className="rounded-full border border-[#5ED6A0]/[0.13] bg-[#5ED6A0]/[0.05] px-2 py-1 font-mono text-[7px] font-bold text-[#5ED6A0]">
            STABLE
          </span>
        </div>

        <div className="mt-7 grid items-center gap-5 sm:grid-cols-[auto_1fr]">
          <CircularPercentage
            value={96}
            label="Automation health"
            caption="Successful workflow execution across active pipelines."
            size={128}
            accent="green"
          />

          <div className="space-y-3">
            {[
              {
                name: "Successful",
                value: "2,544",
                percentage: "96%",
                width: "96%",
                dot: "bg-[#5ED6A0]",
              },
              {
                name: "Needs review",
                value: "72",
                percentage: "3%",
                width: "31%",
                dot: "bg-[#E7B84B]",
              },
              {
                name: "Failed",
                value: "34",
                percentage: "1%",
                width: "13%",
                dot: "bg-[#E87575]",
              },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.dot}`}
                    />

                    <span className="text-[8px] font-medium text-[#9A9D94]">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-[#9A9D94]">
                      {item.value}
                    </span>

                    <span className="font-mono text-[8px] font-semibold text-[#F4F0E6]">
                      {item.percentage}
                    </span>
                  </div>
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-current transition-all duration-700"
                    style={{
                      width: item.width,
                      color:
                        item.name === "Successful"
                          ? "#5ED6A0"
                          : item.name === "Needs review"
                            ? "#E7B84B"
                            : "#E87575",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.09] bg-[#20241D]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#E7B84B]/[0.045] blur-3xl" />

        <div className="relative">
          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#E7B84B]">
            RESOURCE UTILIZATION
          </p>

          <h3 className="mt-1.5 text-[14px] font-semibold text-[#F4F0E6]">
            Intelligence capacity
          </h3>

          <p className="mt-1 text-[8px] text-[#9A9D94]">
            Current consumption of workspace AI resources.
          </p>

          <div className="mt-7 flex flex-col items-center">
            <CircularPercentage
              value={78}
              label="AI capacity"
              caption="22% headroom available before optimization is recommended."
              size={138}
              accent="gold"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/[0.05] bg-black/[0.1] p-2.5">
              <p className="font-mono text-[6px] uppercase tracking-[0.12em] text-[#9A9D94]">
                INPUT
              </p>

              <p className="mt-1 text-[11px] font-semibold text-[#F4F0E6]">
                42.8K
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-black/[0.1] p-2.5">
              <p className="font-mono text-[6px] uppercase tracking-[0.12em] text-[#9A9D94]">
                OUTPUT
              </p>

              <p className="mt-1 text-[11px] font-semibold text-[#F4F0E6]">
                41.4K
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-black/[0.1] p-2.5">
              <p className="font-mono text-[6px] uppercase tracking-[0.12em] text-[#9A9D94]">
                CACHE
              </p>

              <p className="mt-1 text-[11px] font-semibold text-[#F4F0E6]">
                91%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
       "overflow-hidden rounded-2xl border border-[#F5D98B]/[0.09]",
      "bg-[#20241D]/90 shadow-[0_24px_70px_rgba(0,0,0,0.24)]",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] px-5 py-5 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold tracking-tight text-[#F4F0E6] sm:text-[14px]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[10px] leading-4 text-[#9A9D94]">
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [range, setRange] = useState<Range>("7D");
  const [chartStyle, setChartStyle] =
    useState<ChartStyle>("area");

  const [search, setSearch] = useState("");

  const [showChartMenu, setShowChartMenu] =
    useState(false);

  const [showExportMenu, setShowExportMenu] =
    useState(false);

  const [showWorkflowMenu, setShowWorkflowMenu] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [workflows, setWorkflows] =
    useState(initialWorkflows);

  const [activities, setActivities] =
    useState(initialActivities);

  const filteredWorkflows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return workflows;
    }

    return workflows.filter((workflow) =>
      workflow.name.toLowerCase().includes(query)
    );
  }, [search, workflows]);

  const activeWorkflows = workflows.filter(
    (workflow) => workflow.status === "active"
  ).length;

  const totalRuns = workflows.reduce(
    (total, workflow) => total + workflow.runs,
    0
  );

  const averageSuccess = Math.round(
    workflows.reduce(
      (total, workflow) => total + workflow.success,
      0
    ) / Math.max(workflows.length, 1)
  );

  function handleRefresh() {
    if (isRefreshing) return;

    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);

      setActivities((current) => [
        {
          id: `refresh-${Date.now()}`,
          title: "Dashboard refreshed",
          description:
            "Latest workspace metrics are now visible",
          time: "just now",
          type: "success",
        },
        ...current.slice(0, 4),
      ]);
    }, 700);
  }

  function handleExport() {
    const rows = [
      ["Workflow", "Status", "Runs", "Success", "Last Run"],
      ...workflows.map((workflow) => [
        workflow.name,
        workflow.status,
        String(workflow.runs),
        `${workflow.success}%`,
        workflow.lastRun,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${cell.replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexaflow-dashboard.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  }

  function handleCreateWorkflow() {
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: "New automation workflow",
      status: "draft",
      runs: 0,
      success: 100,
      lastRun: "Never",
    };

    setWorkflows((current) => [
      newWorkflow,
      ...current,
    ]);

    setActivities((current) => [
      {
        id: `activity-${Date.now()}`,
        title: "New workflow created",
        description:
          "New automation workflow is ready to configure",
        time: "just now",
        type: "workflow",
      },
      ...current.slice(0, 4),
    ]);

    setShowWorkflowMenu(false);
  }

  function handleToggleWorkflow(id: string) {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? {
              ...workflow,
              status:
                workflow.status === "active"
                  ? "paused"
                  : "active",
            }
          : workflow
      )
    );
  }

  function handleQuickAction(type: string) {
    if (type === "workflow") {
      handleCreateWorkflow();
      return;
    }

    if (type === "lead") {
      router.push("/leads");
      return;
    }

    if (type === "task") {
      router.push("/tasks");
      return;
    }

    if (type === "ai") {
      setActivities((current) => [
        {
          id: `ai-${Date.now()}`,
          title: "AI assistant opened",
          description:
            "NexaFlow AI is ready for your request",
          time: "just now",
          type: "ai",
        },
        ...current.slice(0, 4),
      ]);

      router.push("/conversations");
    }
  }

  return (
    <div className="relative space-y-8 overflow-hidden rounded-[28px] bg-[#151713] p-1">
      {/* PREMIUM ATMOSPHERIC DASHBOARD BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[-120px] h-[360px] w-[360px] rounded-full bg-[#E7B84B]/[0.035] blur-[100px]" />

        <div className="absolute right-[4%] top-[22%] h-[280px] w-[280px] rounded-full bg-[#A78BFA]/[0.025] blur-[100px]" />

        <div className="absolute bottom-[-120px] left-[38%] h-[300px] w-[300px] rounded-full bg-[#E7B84B]/[0.025] blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,217,139,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Page heading */}
      <section className="relative z-10 flex flex-col gap-5 px-2 pt-2 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_10px_rgba(231,184,75,0.9)]" />

            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#E7B84B]">
              NexaFlow / Operations
            </span>

            <span className="h-px w-8 bg-[#E7B84B]/30" />

            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#9A9D94]">
              SYS-01
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-[#F4F0E6] sm:text-[38px]">
            Good to see you, Faiza.
          </h2>

          <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#9A9D94]">
            Monitor your automations, workflows and workspace
            activity from one place.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_9px_rgba(94,214,160,0.8)]" />

            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#5ED6A0]">
              System operational
            </span>

            <span className="font-mono text-[8px] text-[#9A9D94]">
              · AI services connected
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/80 px-3.5 text-[10px] font-semibold text-[#9A9D94] shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all hover:border-[#F5D98B]/[0.18] hover:bg-[#252A22] hover:text-[#F4F0E6]"
          >
            <Icon
              name="refresh"
              size={14}
              className={
                isRefreshing ? "animate-spin" : ""
              }
            />

            {isRefreshing ? "Refreshing" : "Refresh"}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowExportMenu((value) => !value)
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E7B84B]/[0.16] bg-[#E7B84B]/[0.07] px-4 text-[10px] font-semibold text-[#F5D98B] shadow-[0_10px_35px_rgba(231,184,75,0.06)] transition-all hover:border-[#F5D98B]/[0.28] hover:bg-[#E7B84B]/[0.12]"
            >
              <Icon name="download" size={14} />
              Export
              <Icon name="chevron" size={13} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-12 z-40 w-48 overflow-hidden rounded-xl border border-[#F5D98B]/[0.1] bg-[#20241D] p-1.5 shadow-2xl">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#9A9D94] hover:bg-white/[0.05] hover:text-[#F4F0E6]"
                >
                  <Icon name="download" size={14} />
                  Download CSV
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowExportMenu(false)
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#9A9D94] hover:bg-white/[0.05] hover:text-[#F4F0E6]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ADDED: SAAS OPERATIONAL TELEMETRY */}
      <div className="relative z-10">
        <SaaSAnalyticsOverview />
      </div>

      {/* ADDED: AI CORE STATUS */}
      <div className="relative z-10">
        <AIIntelligencePanel />
      </div>

           {/* ADDED: CIRCULAR PERCENTAGE + HEALTH VISUALS */}
      <div className="relative z-10">
        <PerformanceDistribution />
      </div>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group relative">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#E7B84B]/10 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative">
            <StatsCard
              title="Active workflows"
              value={activeWorkflows}
              change="+12%"
              trend="up"
              description="Compared with last period"
              accent="violet"
              icon={<Icon name="workflow" size={18} />}
              href="/workflows"
            />
          </div>
        </div>

        <div className="group relative">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#E7B84B]/10 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative">
            <StatsCard
              title="Automation runs"
              value={totalRuns.toLocaleString()}
              change="+18%"
              trend="up"
              description="Total workflow executions"
              accent="blue"
              icon={<Icon name="activity" size={18} />}
            />
          </div>
        </div>

        <div className="group relative">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#5ED6A0]/10 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative">
            <StatsCard
              title="Success rate"
              value={`${averageSuccess}%`}
              change="+2.4%"
              trend="up"
              description="Average workflow success"
              accent="emerald"
              icon={<Icon name="check" size={18} />}
            />
          </div>
        </div>

        <div className="group relative">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#E7B84B]/10 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative">
            <StatsCard
              title="Pending tasks"
              value="24"
              change="-8%"
              trend="down"
              description="Tasks waiting for action"
              accent="amber"
              icon={<Icon name="tasks" size={18} />}
              href="/tasks"
            />
          </div>
        </div>
      </section>

      {/* Operations intelligence strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-[#E7B84B]/10 bg-[#20241D]/85 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all duration-300 hover:border-[#E7B84B]/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#E7B84B]/8 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_10px_rgba(94,214,160,0.8)]" />
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#E7B84B]/75">
                  Operations
                </span>
              </div>

              <p className="mt-3 text-[12px] font-semibold text-[#F4F0E6]">
                System operational
              </p>

              <p className="mt-1 text-[9px] leading-4 text-[#9A9D94]">
                All automation services are responding normally.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.06] text-[#5ED6A0]">
              <Icon name="activity" size={17} />
            </div>
          </div>

          <div className="mt-5 h-px bg-[#F5D98B]/[0.06]" />

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#9A9D94]">
              Uptime
            </span>

            <span className="font-mono text-[9px] font-bold text-[#5ED6A0]">
              99.98%
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-[#E7B84B]/10 bg-[#20241D]/85 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all duration-300 hover:border-[#E7B84B]/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#E7B84B]/8 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#E7B84B]/75">
                  Throughput
                </span>
              </div>

              <p className="mt-3 text-[12px] font-semibold text-[#F4F0E6]">
                8,421 executions
              </p>

              <p className="mt-1 text-[9px] leading-4 text-[#9A9D94]">
                Current automation execution volume.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.06] text-[#E7B84B]">
              <Icon name="chart" size={17} />
            </div>
          </div>

          <div className="mt-5 flex h-7 items-end gap-1.5">
            {[34, 46, 38, 61, 52, 72, 66, 84, 71, 91, 78, 96].map(
              (height, index) => (
                <div
                  key={`${height}-${index}`}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[#E7B84B]/15 to-[#F5D98B]/55 transition-all duration-300 group-hover:from-[#E7B84B]/25 group-hover:to-[#F5D98B]/75"
                  style={{ height: `${height}%` }}
                />
              )
            )}
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-[#E7B84B]/10 bg-[#20241D]/85 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all duration-300 hover:border-[#E7B84B]/20">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#5ED6A0]/8 blur-3xl" />

          <div className="relative flex items-center gap-5">
            <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="7"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#E7B84B"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="263.9"
                  strokeDashoffset="10.5"
                  className="drop-shadow-[0_0_7px_rgba(231,184,75,0.35)]"
                />
              </svg>

              <div className="relative text-center">
                <p className="text-[17px] font-bold tracking-[-0.04em] text-[#F4F0E6]">
                  {averageSuccess}%
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />

                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.17em] text-[#E7B84B]/75">
                  Intelligence
                </span>
              </div>

              <p className="mt-2 text-[12px] font-semibold text-[#F4F0E6]">
                Automation health
              </p>

              <p className="mt-1 text-[9px] leading-4 text-[#9A9D94]">
                AI monitored success performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main analytics + quick actions */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <Section
          title="Automation performance"
          subtitle="Workflow execution volume over time"
          action={
            <div className="flex items-center gap-2">
              <div className="hidden items-center rounded-lg border border-[#F5D98B]/[0.07] bg-[#F5D98B]/[0.02] p-0.5 sm:flex">
                {(["7D", "30D", "90D"] as Range[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={[
                      "rounded-md px-2.5 py-1.5 text-[8px] font-bold transition-all",
                      range === item
                        ? "bg-[#E7B84B]/[0.12] text-[#F5D98B] shadow-[inset_0_0_0_1px_rgba(231,184,75,0.12)]"
                        : "text-[#6F746B] hover:text-[#F4F0E6]",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setShowChartMenu((value) => !value)
                  }
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-[#F5D98B]/[0.07] bg-[#F5D98B]/[0.025] px-2.5 text-[9px] font-semibold capitalize text-[#9A9D94] transition-all hover:border-[#E7B84B]/20 hover:text-[#F5D98B]"
                >
                  {chartStyle}
                  <Icon name="chevron" size={12} />
                </button>

                {showChartMenu && (
                  <div className="absolute right-0 top-10 z-30 w-32 rounded-xl border border-[#E7B84B]/10 bg-[#1B1F19] p-1.5 shadow-2xl shadow-black/40">
                    {(["area", "line", "bars"] as ChartStyle[]).map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setChartStyle(item);
                            setShowChartMenu(false);
                          }}
                          className={[
                            "flex w-full rounded-lg px-3 py-2 text-left text-[9px] font-medium capitalize",
                            chartStyle === item
                              ? "bg-[#E7B84B]/[0.09] text-[#F5D98B]"
                              : "text-[#9A9D94] hover:bg-white/[0.04] hover:text-[#F4F0E6]",
                          ].join(" ")}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          }
        >
          <div className="px-5 pb-6 pt-6 sm:px-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#E7B84B]/55">
                    LIVE TELEMETRY
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.8)]" />
                </div>

                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#F4F0E6]">
                  8,421
                </p>

                <p className="mt-1 text-[9px] text-[#6F746B]">
                  Total executions
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-[#5ED6A0]/10 bg-[#5ED6A0]/[0.06] px-2.5 py-1 text-[9px] font-bold text-[#5ED6A0]">
                <Icon name="arrowUp" size={11} />
                18.4%
              </div>
            </div>

            <div className="relative h-[245px]">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[100, 75, 50, 25, 0].map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-3"
                  >
                    <span className="w-7 text-right font-mono text-[8px] text-[#5E635B]">
                      {value}
                    </span>

                    <div className="h-px flex-1 bg-[#F5D98B]/[0.045]" />
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-10 bottom-8 top-2">
                <MiniChart
                  data={chartData[range]}
                  labels={chartLabels[range]}
                  type={chartStyle}
                />
              </div>

              <div className="pointer-events-none absolute inset-x-10 bottom-8 top-2 bg-[linear-gradient(90deg,transparent,rgba(231,184,75,0.015),transparent)]" />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_7px_rgba(231,184,75,0.55)]" />

                <span className="text-[9px] font-medium text-[#9A9D94]">
                  Successful runs
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4E544B]" />

                <span className="text-[9px] font-medium text-[#6F746B]">
                  Previous period
                </span>
              </div>

              <div className="ml-auto hidden items-center gap-2 sm:flex">
                <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#6F746B]">
                  ENGINE
                </span>

                <span className="font-mono text-[8px] font-bold text-[#5ED6A0]">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </Section>

        <QuickActions
          onCreateWorkflow={() => handleQuickAction("workflow")}
          onAddLead={() => handleQuickAction("lead")}
          onCreateTask={() => handleQuickAction("task")}
          onOpenAssistant={() => handleQuickAction("ai")}
        />
      </section>
      {/* Workflow section */}
<div className="relative overflow-hidden rounded-2xl border border-[#E7B84B]/[0.10] bg-[#1B1F19] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
  
  {/* Analytics-style atmospheric background */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#E7B84B]/[0.035] blur-3xl" />
    <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[#5ED6A0]/[0.018] blur-3xl" />

    {/* Architectural grid */}
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #F5D98B 1px, transparent 1px),
          linear-gradient(to bottom, #F5D98B 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />

    {/* Gold center glow */}
    <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E7B84B]/30 to-transparent" />
  </div>

  {/* Actual section content */}
  <div className="relative z-10">
    <Section
      title="Workflow health"
      subtitle="Monitor automation status and recent execution performance"
      action={
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Icon
              name="search"
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6F746B]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workflows"
              className="h-9 w-44 rounded-xl border border-[#E7B84B]/[0.10] bg-[#151713] pl-8 pr-3 font-mono text-[9px] text-[#F4F0E6] outline-none placeholder:text-[#5E635B] transition-all hover:border-[#E7B84B]/20 focus:border-[#E7B84B]/35 focus:ring-1 focus:ring-[#E7B84B]/10"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowWorkflowMenu((value) => !value)
              }
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.06] px-3 text-[9px] font-semibold text-[#D8D5C8] transition-all hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/[0.10] hover:text-[#F5D98B]"
            >
              <Icon name="plus" size={13} />
              Add
            </button>

            {showWorkflowMenu && (
              <div className="absolute right-0 top-11 z-30 w-52 rounded-xl border border-[#E7B84B]/15 bg-[#1B1F19] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
                <div className="border-b border-[#F5D98B]/[0.06] px-3 py-2">
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#6F746B]">
                    Workflow actions
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateWorkflow}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#E7B84B]/[0.06]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7B84B]/15 bg-[#E7B84B]/[0.05] text-[#E7B84B]">
                    <Icon name="workflow" size={13} />
                  </span>

                  <span>
                    <span className="block text-[9px] font-semibold text-[#F4F0E6]">
                      New workflow
                    </span>

                    <span className="mt-0.5 block font-mono text-[7px] text-[#6F746B]">
                      Create automation flow
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="divide-y divide-[#F5D98B]/[0.05]">
        {filteredWorkflows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E7B84B]/10 bg-[#E7B84B]/[0.025] text-[#6F746B]">
              <Icon name="search" size={17} />
            </div>

            <p className="mt-4 text-[11px] font-semibold text-[#D8D5C8]">
              No workflows found
            </p>

            <p className="mt-1 font-mono text-[8px] text-[#6F746B]">
              Try a different workflow name.
            </p>
          </div>
        ) : (
          filteredWorkflows.map((workflow, index) => (
            <div
              key={workflow.id}
              className="group relative flex flex-col gap-4 overflow-hidden px-5 py-5 transition-all duration-300 hover:bg-[#E7B84B]/[0.025] sm:flex-row sm:items-center sm:px-6"
            >
              {/* Gold hover rail */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#E7B84B]/0 to-transparent transition-all duration-300 group-hover:via-[#E7B84B]/50" />

              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7B84B]/12 bg-[#E7B84B]/[0.05] text-[#E7B84B] transition-all group-hover:border-[#E7B84B]/25 group-hover:bg-[#E7B84B]/[0.09]">
                    <Icon name="workflow" size={17} />
                  </div>

                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-md border border-[#1B1F19] bg-[#252A22] px-1 font-mono text-[6px] text-[#6F746B]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[11px] font-semibold text-[#F4F0E6]">
                      {workflow.name}
                    </p>

                    {workflow.status === "active" && (
                      <span className="hidden rounded-md border border-[#E7B84B]/15 bg-[#E7B84B]/[0.04] px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.12em] text-[#E7B84B] sm:inline-flex">
                        Live
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 font-mono text-[8px] text-[#6F746B]">
                    {workflow.runs.toLocaleString()} runs
                    <span className="mx-1.5 text-[#454941]">·</span>
                    Last run {workflow.lastRun}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5 sm:flex sm:items-center sm:gap-8">
                {/* Success */}
                <div className="min-w-[80px]">
                  <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#5E635B]">
                    Success
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[#F5D98B]/[0.05]">
                      <div
                        className="h-full rounded-full bg-[#5ED6A0]"
                        style={{
                          width: `${workflow.success}%`,
                        }}
                      />
                    </div>

                    <p className="font-mono text-[9px] font-semibold text-[#E1DED3]">
                      {workflow.success}%
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="min-w-[70px]">
                  <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#5E635B]">
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        workflow.status === "active" &&
                          "bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.55)]",
                        workflow.status === "paused" &&
                          "bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.55)]",
                        workflow.status === "draft" &&
                          "bg-[#6F746B]",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />

                    <span className="text-[9px] font-semibold capitalize text-[#A6A79F]">
                      {workflow.status}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() =>
                    handleToggleWorkflow(workflow.id)
                  }
                  className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#E7B84B]/[0.08] bg-[#E7B84B]/[0.02] px-2.5 text-[8px] font-semibold text-[#777B72] transition-all hover:border-[#E7B84B]/25 hover:bg-[#E7B84B]/[0.06] hover:text-[#F5D98B]"
                >
                  <Icon
                    name={
                      workflow.status === "active"
                        ? "pause"
                        : "play"
                    }
                    size={11}
                  />

                  {workflow.status === "active"
                    ? "Pause"
                    : "Run"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#F5D98B]/[0.05] bg-[#151713]/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#5E635B]">
          Showing {filteredWorkflows.length} of{" "}
          {workflows.length} workflows
        </p>

        <Link
          href="/analytics"
          className="group inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#E7B84B]/80 transition-colors hover:text-[#F5D98B]"
        >
          View analytics

          <Icon
            name="arrow"
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </Section>
  </div>
</div>


      {/* Advanced analytics grid */}
      <section className="grid gap-5 lg:grid-cols-3">
        <Section
          title="Execution distribution"
          subtitle="Automation outcome breakdown"
        >
          <div className="px-5 py-6 sm:px-6">
            <div className="flex items-center gap-6">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.045)"
                    strokeWidth="10"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#5ED6A0"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="301.6"
                    strokeDashoffset="12"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#E7B84B"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="301.6"
                    strokeDashoffset="270"
                    opacity="0.9"
                  />
                </svg>

                <div className="relative text-center">
                  <p className="text-xl font-bold tracking-[-0.05em] text-[#F4F0E6]">
                    98%
                  </p>

                  <p className="font-mono text-[6px] uppercase tracking-[0.12em] text-[#6F746B]">
                    healthy
                  </p>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[9px] text-[#9A9D94]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
                    Successful
                  </span>

                  <span className="font-mono text-[9px] font-bold text-[#5ED6A0]">
                    98%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[9px] text-[#9A9D94]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B]" />
                    Retried
                  </span>

                  <span className="font-mono text-[9px] font-bold text-[#E7B84B]">
                    1.4%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[9px] text-[#9A9D94]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E87575]" />
                    Failed
                  </span>

                  <span className="font-mono text-[9px] font-bold text-[#E87575]">
                    0.6%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="AI operations"
          subtitle="Intelligence layer activity"
        >
          <div className="relative overflow-hidden px-5 py-6 sm:px-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#E7B84B]/[0.07] blur-3xl" />

            <div className="relative flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7B84B]/20 bg-[#E7B84B]/[0.06] text-[#F5D98B] shadow-[0_0_35px_rgba(231,184,75,0.09)]">
                <div className="absolute inset-2 rounded-full border border-[#F5D98B]/20" />
                <Icon name="spark" size={21} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.8)]" />

                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#5ED6A0]">
                    ONLINE
                  </span>
                </div>

                <p className="mt-1 text-[12px] font-semibold text-[#F4F0E6]">
                  NexaFlow Intelligence
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#F5D98B]/[0.06] bg-[#F5D98B]/[0.02] p-3">
                <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#5E635B]">
                  AI tasks
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#F4F0E6]">
                  1,284
                </p>
              </div>

              <div className="rounded-xl border border-[#F5D98B]/[0.06] bg-[#F5D98B]/[0.02] p-3">
                <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#5E635B]">
                  Confidence
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#F5D98B]">
                  96.8%
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-[#5ED6A0]/10 bg-[#5ED6A0]/[0.035] px-3 py-2.5">
              <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#6F746B]">
                Model status
              </span>

              <span className="flex items-center gap-1.5 text-[8px] font-bold text-[#5ED6A0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
                ACTIVE
              </span>
            </div>
          </div>
        </Section>

        <Section
          title="System resources"
          subtitle="Current workspace capacity"
        >
          <div className="space-y-5 px-5 py-6 sm:px-6">
            {[
              {
                label: "Workflow engine",
                value: "84%",
                width: "84%",
              },
              {
                label: "AI processing",
                value: "67%",
                width: "67%",
              },
              {
                label: "Database capacity",
                value: "42%",
                width: "42%",
              },
            ].map((resource) => (
              <div key={resource.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-medium text-[#9A9D94]">
                    {resource.label}
                  </span>

                  <span className="font-mono text-[8px] font-bold text-[#E7B84B]">
                    {resource.value}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E7B84B]/50 to-[#F5D98B]"
                    style={{ width: resource.width }}
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-[#F5D98B]/[0.05] pt-4">
              <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#5E635B]">
                Resource status
              </span>

              <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#5ED6A0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
                Stable
              </span>
            </div>
          </div>
        </Section>
      </section>

  {/* Activity + workspace summary */}
<section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
  <ActivityFeed
    activities={activities}
    title="Recent activity"
    subtitle="Latest events across your workspace"
    viewAllHref="/analytics"
  />

  <Section
    title="Workspace summary"
    subtitle="Current NexaFlow environment"
  >
    <div className="relative overflow-hidden border-t border-[#F5D98B]/[0.08] bg-[#20241D] px-5 py-6 sm:px-6">
      {/* Premium dashboard atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[#20241D]" />

      {/* Subtle olive depth */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#5D642F]/[0.035] blur-[90px]" />

      {/* Very soft champagne glow */}
      <div className="pointer-events-none absolute bottom-[-70px] left-[35%] h-40 w-40 rounded-full bg-[#E7B84B]/[0.018] blur-[80px]" />

      {/* Fine top line */}
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/25 to-transparent sm:inset-x-6" />

      <div className="relative z-10 space-y-5">
        {/* DATABASE STATUS */}
        <div className="group flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#151713] text-[#E7B84B] transition-all duration-200 group-hover:border-[#E7B84B]/30 group-hover:bg-[#252A22]">
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[#F5D98B]/[0.035] to-transparent" />

              <span className="relative z-10">
                <Icon name="database" size={16} />
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-[#F4F0E6]">
                Database
              </p>

              <p className="mt-1 truncate font-mono text-[8px] text-[#777D70]">
                Primary workspace database
              </p>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#5ED6A0]/10 bg-[#151713] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[#5ED6A0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.7)]" />
            Healthy
          </span>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-[#F5D98B]/[0.06]" />

        {/* METRICS */}
        <div className="grid grid-cols-2 gap-3">
          {/* AUTOMATIONS */}
          <div className="group relative overflow-hidden rounded-xl border border-[#F5D98B]/[0.065] bg-[#151713] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-y-3 left-0 w-[2px] -translate-x-full rounded-r-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

            <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.08] to-transparent" />

            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#777D70]">
              Automations
            </p>

            <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#F4F0E6]">
              {workflows.length}
            </p>
          </div>

          {/* SUCCESS */}
          <div className="group relative overflow-hidden rounded-xl border border-[#F5D98B]/[0.065] bg-[#151713] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-y-3 left-0 w-[2px] -translate-x-full rounded-r-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

            <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.08] to-transparent" />

            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#777D70]">
              Success
            </p>

            <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#F5D98B]">
              {averageSuccess}%
            </p>
          </div>
        </div>

        {/* AI STATUS */}
        <div className="group relative overflow-hidden rounded-xl border border-[#E7B84B]/10 bg-[#1B1F19] p-4 transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:shadow-[0_14px_32px_rgba(0,0,0,0.22)]">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#E7B84B]/[0.035] blur-2xl transition-transform duration-500 group-hover:scale-125" />

          <div className="relative flex items-start gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#151713] text-[#F5D98B]">
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[#F5D98B]/[0.035] to-transparent" />

              <span className="relative z-10">
                <Icon name="spark" size={16} />
              </span>

              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-[#1B1F19] bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.7)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-semibold text-[#F5D98B]">
                  NexaFlow AI
                </p>

                <span className="rounded-full border border-[#5ED6A0]/10 bg-[#151713] px-1.5 py-0.5 font-mono text-[6px] font-bold uppercase tracking-[0.12em] text-[#5ED6A0]">
                  ONLINE
                </span>
              </div>

              <p className="mt-1 text-[9px] leading-4 text-[#9A9D94]">
                Your automation workspace is running
                normally. Ask the AI assistant to analyze
                performance or create a workflow.
              </p>

              <button
                type="button"
                onClick={() => handleQuickAction("ai")}
                className="group mt-3 inline-flex items-center gap-2 rounded-lg border border-[#E7B84B]/15 bg-[#151713] px-3 py-2 text-[10px] font-semibold text-[#F5D98B] transition-all duration-200 hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F4F0E6] hover:shadow-[0_0_24px_rgba(231,184,75,0.06)] active:scale-[0.98]"
              >
                <span>Open AI assistant</span>

                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  <Icon name="arrow" size={11} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE SETTINGS */}
        <Link
          href="/settings"
          className="group flex items-center justify-between rounded-xl border border-[#F5D98B]/[0.06] bg-[#151713] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E7B84B]/20 hover:bg-[#252A22] hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F5D98B]/[0.06] bg-[#20241D] transition-colors group-hover:border-[#E7B84B]/20">
              <Icon
                name="settings"
                size={14}
                className="text-[#6F746B] transition-colors group-hover:text-[#E7B84B]"
              />
            </span>

            <span className="text-[9px] font-semibold text-[#9A9D94] transition-colors group-hover:text-[#F4F0E6]">
              Workspace settings
            </span>
          </span>

          <Icon
            name="arrow"
            size={12}
            className="text-[#6F746B] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#E7B84B]"
          />
              </Link>
      </div>
    </div>
  </Section>
</section>

</div>
  );
}