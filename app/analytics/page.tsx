"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

type RangeKey = "7d" | "30d" | "90d";
type ChartStyle = "area" | "line" | "bars" | "stepped";

const rangeLabels: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

const rangeData: Record<
  RangeKey,
  {
    labels: string[];
    values: number[];
  }
> = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [58, 72, 64, 86, 78, 92, 88],
  },
  "30d": {
    labels: [
      "Aug 15",
      "Aug 18",
      "Aug 21",
      "Aug 24",
      "Aug 27",
      "Aug 30",
      "Sep 2",
      "Sep 5",
      "Sep 8",
      "Sep 12",
    ],
    values: [42, 55, 49, 68, 61, 77, 71, 86, 80, 94],
  },
  "90d": {
    labels: ["Jun", "Jun", "Jul", "Jul", "Aug", "Aug", "Sep"],
    values: [38, 46, 52, 61, 68, 79, 94],
  },
};

const metrics = [
  {
    label: "AI runs",
    value: "1,247",
    change: "+18.4%",
    note: "vs. previous period",
    icon: "✦",
  },
  {
    label: "Successful runs",
    value: "1,182",
    change: "+21.7%",
    note: "94.8% success rate",
    icon: "✓",
  },
  {
    label: "Leads generated",
    value: "248",
    change: "+12.8%",
    note: "38.6% conversion",
    icon: "◎",
  },
  {
    label: "Tasks created",
    value: "436",
    change: "+16.2%",
    note: "Automation output",
    icon: "◌",
  },
];

const workflows = [
  {
    name: "Customer Support",
    runs: "342",
    success: 96,
    trend: "+4.2%",
  },
  {
    name: "Lead Qualification",
    runs: "286",
    success: 94,
    trend: "+3.8%",
  },
  {
    name: "Task Automation",
    runs: "241",
    success: 91,
    trend: "+2.1%",
  },
  {
    name: "Email Processing",
    runs: "198",
    success: 89,
    trend: "+1.6%",
  },
];

const activity = [
  {
    title: "Lead Qualification",
    detail: "Workflow completed successfully",
    time: "2 min ago",
    status: "success",
  },
  {
    title: "Customer Support",
    detail: "42 conversations processed",
    time: "18 min ago",
    status: "success",
  },
  {
    title: "Task Automation",
    detail: "18 new tasks generated",
    time: "41 min ago",
    status: "active",
  },
  {
    title: "Email Processing",
    detail: "7 messages classified",
    time: "1 hr ago",
    status: "success",
  },
];

const chartStyles: {
  key: ChartStyle;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    key: "area",
    label: "Area",
    description: "Premium filled trend",
    icon: "◒",
  },
  {
    key: "line",
    label: "Line",
    description: "Clean trend line",
    icon: "⌁",
  },
  {
    key: "bars",
    label: "Bars",
    description: "Detailed comparison",
    icon: "▥",
  },
  {
    key: "stepped",
    label: "Stepped",
    description: "Technical progression",
    icon: "⌞",
  },
];

const hourlyActivity = [
  22, 31, 28, 42, 51, 48, 62, 58, 71, 68, 79, 74,
  86, 82, 91, 87, 76, 81, 69, 63, 57, 48, 39, 31,
];

const channelData = [
  { label: "Email", value: 42 },
  { label: "Web", value: 28 },
  { label: "API", value: 18 },
  { label: "Other", value: 12 },
];

const outcomeData = [
  { label: "Completed", value: 1182 },
  { label: "Failed", value: 65 },
];

const leadFunnel = [
  { label: "Visitors", value: 1240, width: 100 },
  { label: "Qualified", value: 680, width: 55 },
  { label: "Engaged", value: 412, width: 33 },
  { label: "Converted", value: 248, width: 20 },
];

function downloadCsv() {
  const rows = [
    ["Metric", "Value", "Change"],
    ["AI runs", "1247", "18.4%"],
    ["Successful runs", "1182", "21.7%"],
    ["Leads generated", "248", "12.8%"],
    ["Tasks created", "436", "16.2%"],
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
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "nexaflow-analytics.csv";
  anchor.click();

  URL.revokeObjectURL(url);
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [chartStyle, setChartStyle] =
    useState<ChartStyle>("area");
  const [chartMenuOpen, setChartMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllWorkflows, setShowAllWorkflows] =
    useState(false);
  const [message, setMessage] = useState("");

  const chart = rangeData[range];
  const maxValue = Math.max(...chart.values);

  const visibleWorkflows = useMemo(
    () =>
      showAllWorkflows
        ? workflows
        : workflows.slice(0, 4),
    [showAllWorkflows]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setMessage("");

    window.setTimeout(() => {
      setRefreshing(false);
      setMessage("Analytics refreshed successfully.");
    }, 800);
  };

  const handleExport = () => {
    downloadCsv();
    setMessage("Analytics report exported successfully.");
  };

  const getPointX = (index: number) => {
    if (chart.values.length <= 1) return 50;

    return (
      (index / (chart.values.length - 1)) * 100
    );
  };

  const getPointY = (value: number) =>
    100 - value;

  const linePoints = chart.values
    .map(
      (value, index) =>
        `${getPointX(index)},${getPointY(value)}`
    )
    .join(" ");

  const areaPoints = [
    "0,100",
    ...chart.values.map(
      (value, index) =>
        `${getPointX(index)},${getPointY(value)}`
    ),
    "100,100",
  ].join(" ");

  const steppedPoints = chart.values
    .map((value, index) => {
      const x = getPointX(index);
      const y = getPointY(value);

      if (index === 0) return `${x},${y}`;

      const previousX = getPointX(index - 1);

      return `${previousX},${y} ${x},${y}`;
    })
    .join(" ");

  return (
    <main className="min-h-screen bg-[#151713] text-[#F4F0E6]">
      {/* =========================================================
          ATMOSPHERIC BACKGROUND
      ========================================================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(231,184,75,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(231,184,75,0.045) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 90%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 90%)",
          }}
        />

        <div className="absolute left-[-180px] top-[-260px] h-[650px] w-[650px] rounded-full bg-[#E7B84B]/[0.055] blur-[170px]" />

        <div className="absolute right-[-220px] top-[20%] h-[600px] w-[600px] rounded-full bg-[#7b876f]/[0.055] blur-[180px]" />

        <div className="absolute bottom-[-280px] left-[30%] h-[600px] w-[600px] rounded-full bg-[#E7B84B]/[0.025] blur-[170px]" />
      </div>

      <div className="relative mx-auto max-w-[1780px] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        {/* =========================================================
            HEADER
        ========================================================== */}
        <header className="mb-9">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex shrink-0 flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#E7B84B]/10 bg-[#1B1F19] px-3.5 text-sm font-medium text-[#9A9D94] transition-all duration-300 hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F5D98B]"
                >
                  <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>

                  <span className="hidden sm:inline">
                    Dashboard
                  </span>
                </Link>

                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.035] px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_9px_rgba(231,184,75,0.8)]" />

                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#E7B84B]">
                    Insights
                  </span>
                </div>
              </div>

              <div className="hidden h-[108px] w-px bg-[#E7B84B]/10 sm:block" />

              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#E7B84B]">
                    ANALYTICS / CONTROL CENTER
                  </span>

                  <span className="text-xs text-[#50544c]">
                    /
                  </span>

                  <span className="font-mono text-xs text-[#777b72]">
                    PERFORMANCE TELEMETRY
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[#F4F0E6] sm:text-4xl lg:text-[45px]">
                    Analytics
                  </h1>

                  <span className="hidden h-px w-16 bg-[#E7B84B]/35 sm:block" />
                </div>

                <p className="mt-2 max-w-3xl text-[14px] leading-6 text-[#9A9D94] sm:text-[15px]">
                  Monitor automation volume, workflow reliability,
                  conversion performance, system activity and
                  operational health from one centralized intelligence
                  layer.
                </p>
              </div>
            </div>

            {/* HEADER CONTROLS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-10 overflow-hidden rounded-xl border border-[#E7B84B]/10 bg-[#1B1F19]">
                {(["7d", "30d", "90d"] as RangeKey[]).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRange(item)}
                      className={`px-3.5 font-mono text-[10px] font-bold tracking-wider transition ${
                        range === item
                          ? "bg-[#E7B84B]/10 text-[#F5D98B]"
                          : "text-[#777b72] hover:bg-[#252A22] hover:text-[#F4F0E6]"
                      }`}
                    >
                      {item.toUpperCase()}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E7B84B]/10 bg-[#1B1F19] px-3.5 text-sm font-medium text-[#9A9D94] transition hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B] disabled:opacity-50"
              >
                <span
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                >
                  ↻
                </span>

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E7B84B]/25 bg-[#E7B84B]/[0.07] px-3.5 text-sm font-semibold text-[#F5D98B] transition hover:bg-[#E7B84B]/[0.12] hover:shadow-[0_0_28px_rgba(231,184,75,0.08)]"
              >
                ↓
                <span>Export report</span>
              </button>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E7B84B]/[0.07] pt-4 font-mono text-[10px] uppercase tracking-wider text-[#686c63]">
            <span>
              PERIOD:
              <span className="ml-2 text-[#B7BAAF]">
                {rangeLabels[range]}
              </span>
            </span>

            <span className="hidden text-[#42463f] sm:inline">
              /
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.7)]" />
              SYSTEMS OPERATIONAL
            </span>

            {message && (
              <>
                <span className="hidden text-[#42463f] sm:inline">
                  /
                </span>

                <span className="text-[#5ED6A0]">
                  {message}
                </span>
              </>
            )}
          </div>
        </header>

        {/* =========================================================
            KPI GRID
        ========================================================== */}
        <section className="mb-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f736b]">
                01 / Key performance indicators
              </p>

              <h2 className="mt-1.5 text-lg font-semibold text-[#F4F0E6]">
                Automation performance
              </h2>
            </div>

            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-[#555950] sm:block">
              LIVE TELEMETRY
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="group relative min-h-[166px] overflow-hidden rounded-2xl border border-[#E7B84B]/[0.09] bg-[#1B1F19]/90 p-5 shadow-[0_22px_65px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E7B84B]/20 hover:bg-[#20241D]"
              >
                <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/35 to-transparent" />

                <div className="absolute right-[-35px] top-[-45px] h-36 w-36 rounded-full bg-[#E7B84B]/[0.025] blur-3xl transition group-hover:bg-[#E7B84B]/[0.06]" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#7d8178]">
                        {String(index + 1).padStart(2, "0")} ·{" "}
                        {metric.label}
                      </p>

                      <p className="mt-3 text-[31px] font-semibold tracking-[-0.045em] text-[#F4F0E6]">
                        {metric.value}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.045] text-sm text-[#E7B84B]">
                      {metric.icon}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.04] px-2.5 py-1 font-mono text-[9px] font-bold text-[#5ED6A0]">
                      ↗ {metric.change}
                    </span>

                    <span className="text-right text-[9px] text-[#646860]">
                      {metric.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            MAIN ANALYTICS GRID
        ========================================================== */}
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
          {/* EXECUTION TREND */}
          <Card className="min-h-[530px] overflow-visible border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-0 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="border-b border-[#E7B84B]/[0.07] p-6 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_9px_rgba(231,184,75,0.8)]" />

                    <h2 className="text-base font-semibold text-[#F4F0E6]">
                      Automation volume
                    </h2>

                    <span className="rounded-full border border-[#E7B84B]/10 px-2 py-0.5 font-mono text-[8px] text-[#777b72]">
                      EXECUTIONS
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#777b72]">
                    AI workflow executions across the selected
                    reporting period.
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setChartMenuOpen(
                        (current) => !current
                      )
                    }
                    className="inline-flex h-10 items-center gap-3 rounded-xl border border-[#E7B84B]/10 bg-[#20241D] px-3.5 text-xs font-semibold text-[#B7BAAF] transition hover:border-[#E7B84B]/25 hover:text-[#F5D98B]"
                  >
                    <span className="text-[#E7B84B]">
                      {
                        chartStyles.find(
                          (item) =>
                            item.key === chartStyle
                        )?.icon
                      }
                    </span>

                    <span>
                      {
                        chartStyles.find(
                          (item) =>
                            item.key === chartStyle
                        )?.label
                      }
                    </span>

                    <span
                      className={`text-[9px] transition-transform ${
                        chartMenuOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {chartMenuOpen && (
                    <div className="absolute right-0 top-12 z-50 w-[235px] overflow-hidden rounded-2xl border border-[#E7B84B]/15 bg-[#20241D]/98 p-1.5 shadow-[0_25px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                      <div className="px-3 pb-2 pt-2.5">
                        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#62665d]">
                          Visualization mode
                        </p>
                      </div>

                      {chartStyles.map((style) => (
                        <button
                          key={style.key}
                          type="button"
                          onClick={() => {
                            setChartStyle(style.key);
                            setChartMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                            chartStyle === style.key
                              ? "bg-[#E7B84B]/[0.08] text-[#F5D98B]"
                              : "text-[#9A9D94] hover:bg-[#252A22] hover:text-[#F4F0E6]"
                          }`}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7B84B]/10 bg-[#151713] text-sm">
                            {style.icon}
                          </span>

                          <span className="min-w-0">
                            <span className="block text-xs font-semibold">
                              {style.label}
                            </span>

                            <span className="mt-0.5 block text-[10px] text-[#60645b]">
                              {style.description}
                            </span>
                          </span>

                          {chartStyle === style.key && (
                            <span className="ml-auto text-xs text-[#E7B84B]">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#62665d]">
                    Total executions
                  </p>

                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="text-3xl font-semibold tracking-[-0.04em] text-[#F4F0E6]">
                      1,247
                    </span>

                    <span className="rounded-full border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.04] px-2 py-1 font-mono text-[9px] font-bold text-[#5ED6A0]">
                      +18.4%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-wider text-[#646860]">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-5 rounded-full bg-[#E7B84B]" />
                    AI RUNS
                  </span>

                  <span>
                    PEAK{" "}
                    <strong className="text-[#B7BAAF]">
                      {maxValue * 10}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* GRAPH */}
            <div className="p-6 sm:p-7">
              <div className="relative h-[320px] w-full">
                <div className="pointer-events-none absolute inset-x-0 bottom-10 top-2 flex flex-col justify-between">
                  {[100, 75, 50, 25, 0].map(
                    (value) => (
                      <div
                        key={value}
                        className="flex items-center gap-3"
                      >
                        <span className="w-7 text-right font-mono text-[8px] text-[#50544c]">
                          {value}
                        </span>

                        <div className="h-px flex-1 bg-[#E7B84B]/[0.055]" />
                      </div>
                    )
                  )}
                </div>

                <div className="absolute bottom-10 left-10 right-0 top-2">
                  <svg
                    className="absolute inset-0 h-full w-full overflow-visible"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="goldAreaAnalytics"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#E7B84B"
                          stopOpacity="0.26"
                        />
                        <stop
                          offset="55%"
                          stopColor="#E7B84B"
                          stopOpacity="0.07"
                        />
                        <stop
                          offset="100%"
                          stopColor="#E7B84B"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {chartStyle === "area" && (
                      <>
                        <polygon
                          points={areaPoints}
                          fill="url(#goldAreaAnalytics)"
                        />

                        <polyline
                          points={linePoints}
                          fill="none"
                          stroke="#E7B84B"
                          strokeWidth="0.8"
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_0_9px_rgba(231,184,75,0.35)]"
                        />
                      </>
                    )}

                    {chartStyle === "line" && (
                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#E7B84B"
                        strokeWidth="1.25"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_10px_rgba(231,184,75,0.45)]"
                      />
                    )}

                    {chartStyle === "stepped" && (
                      <polyline
                        points={steppedPoints}
                        fill="none"
                        stroke="#E7B84B"
                        strokeWidth="1.1"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>

                  {chartStyle === "bars" && (
                    <div className="absolute inset-0 flex items-end gap-2 sm:gap-3">
                      {chart.values.map(
                        (value, index) => (
                          <div
                            key={`${value}-${index}`}
                            className="group relative flex h-full flex-1 items-end"
                          >
                            <div
                              className="relative w-full overflow-hidden rounded-t-xl border border-[#E7B84B]/15 bg-gradient-to-t from-[#8c6c20]/20 via-[#E7B84B]/20 to-[#F5D98B]/45 transition-all duration-300 group-hover:from-[#a17b18]/30 group-hover:to-[#F5D98B]/65"
                              style={{
                                height: `${value}%`,
                              }}
                            >
                              <div className="absolute inset-x-0 top-0 h-px bg-[#F5D98B] shadow-[0_0_12px_rgba(245,217,139,0.6)]" />

                              <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#E7B84B]/10 bg-[#151713]/95 px-2 py-1 font-mono text-[8px] font-bold text-[#F4F0E6] opacity-0 shadow-xl transition group-hover:opacity-100">
                                {value * 10} runs
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {chartStyle !== "bars" && (
                    <div className="pointer-events-none absolute inset-0">
                      {chart.values.map(
                        (value, index) => {
                          const x = getPointX(index);
                          const y = getPointY(value);

                          return (
                            <div
                              key={`${value}-${index}`}
                              className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                              }}
                            >
                              <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E7B84B]/10 opacity-0 blur-sm transition group-hover:opacity-100" />

                              <div className="relative h-2.5 w-2.5 rounded-full border-2 border-[#151713] bg-[#F5D98B] shadow-[0_0_9px_rgba(231,184,75,0.8)] transition group-hover:scale-125">
                                <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                              </div>

                              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#E7B84B]/10 bg-[#151713]/95 px-2.5 py-1.5 font-mono text-[8px] font-bold text-[#F4F0E6] opacity-0 shadow-xl transition group-hover:opacity-100">
                                {value * 10} runs
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-10 right-0 flex justify-between gap-2">
                  {chart.labels.map(
                    (label, index) => (
                      <span
                        key={`${label}-${index}`}
                        className="max-w-[60px] truncate font-mono text-[8px] text-[#555950]"
                      >
                        {label}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E7B84B]/[0.07] bg-[#20241D] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.8)]" />

                  <span className="text-[10px] text-[#777b72]">
                    Automation activity is trending upward
                  </span>
                </div>

                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#5ED6A0]">
                  +18.4% growth
                </span>
              </div>
            </div>
          </Card>

          {/* SUCCESS OVERVIEW */}
          <Card className="min-h-[530px] border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.8)]" />

                <h2 className="text-base font-semibold text-[#F4F0E6]">
                  Success overview
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#777b72]">
                Reliability across all active AI automation.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[17px] border-[#5ED6A0]/10">
                <div className="absolute inset-[-17px] rounded-full border-[17px] border-transparent border-t-[#5ED6A0]/80 border-r-[#5ED6A0]/45 -rotate-[38deg]" />

                <div className="text-center">
                  <p className="text-[42px] font-semibold tracking-[-0.05em] text-[#F4F0E6]">
                    94.8%
                  </p>

                  <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#686c63]">
                    Success rate
                  </p>
                </div>
              </div>

              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#E7B84B]/[0.07] bg-[#20241D] p-4">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#62665d]">
                    Successful
                  </p>

                  <p className="mt-1.5 text-lg font-semibold text-[#5ED6A0]">
                    1,182
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E7B84B]/[0.07] bg-[#20241D] p-4">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#62665d]">
                    Failed
                  </p>

                  <p className="mt-1.5 text-lg font-semibold text-[#B7BAAF]">
                    65
                  </p>
                </div>
              </div>

              <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#5ED6A0]/10 bg-[#5ED6A0]/[0.025] px-4 py-3">
                <span className="text-xs text-[#777b72]">
                  Reliability trend
                </span>

                <span className="font-mono text-xs font-bold text-[#5ED6A0]">
                  +2.6% ↗
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* =========================================================
            SECONDARY ANALYTICS
        ========================================================== */}
        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* HOURLY ACTIVITY */}
          <Card className="border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_24px_75px_rgba(0,0,0,0.22)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#656960]">
                  03 / Activity density
                </p>

                <h2 className="mt-1.5 text-base font-semibold text-[#F4F0E6]">
                  Hourly activity
                </h2>

                <p className="mt-1.5 text-xs text-[#777b72]">
                  Automation intensity throughout the day.
                </p>
              </div>

              <span className="rounded-lg border border-[#E7B84B]/10 bg-[#20241D] px-2 py-1 font-mono text-[8px] text-[#E7B84B]">
                24H
              </span>
            </div>

            <div className="mt-7 flex h-[155px] items-end gap-1">
              {hourlyActivity.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-[#80631e]/25 to-[#E7B84B]/65 transition-all duration-300 group-hover:from-[#A17B18]/40 group-hover:to-[#F5D98B]/80"
                    style={{
                      height: `${value}%`,
                    }}
                  />

                  <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#E7B84B]/10 bg-[#151713] px-2 py-1 font-mono text-[8px] text-[#F4F0E6] opacity-0 transition group-hover:opacity-100">
                    {value}%
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between font-mono text-[8px] text-[#555950]">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </Card>

          {/* CHANNEL MIX */}
          <Card className="border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_24px_75px_rgba(0,0,0,0.22)]">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#656960]">
                04 / Traffic intelligence
              </p>

              <h2 className="mt-1.5 text-base font-semibold text-[#F4F0E6]">
                Automation channels
              </h2>

              <p className="mt-1.5 text-xs text-[#777b72]">
                Where workflow activity is originating.
              </p>
            </div>

            <div className="mt-7">
              <div className="flex h-4 overflow-hidden rounded-full bg-[#252A22]">
                {channelData.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      width: `${item.value}%`,
                    }}
                    className="border-r border-[#151713] bg-[#E7B84B]/70 first:bg-[#F5D98B]/85 last:bg-[#9a7a2c]/55"
                  />
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {channelData.map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-sm ${
                            index === 0
                              ? "bg-[#F5D98B]"
                              : index === 1
                                ? "bg-[#E7B84B]"
                                : index === 2
                                  ? "bg-[#B99845]"
                                  : "bg-[#776332]"
                          }`}
                        />

                        <span className="text-xs text-[#9A9D94]">
                          {item.label}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] font-bold text-[#F4F0E6]">
                        {item.value}%
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#252A22]">
                      <div
                        className="h-full rounded-full bg-[#E7B84B]/55"
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* OUTCOME BREAKDOWN */}
          <Card className="border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_24px_75px_rgba(0,0,0,0.22)]">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#656960]">
                05 / Outcome distribution
              </p>

              <h2 className="mt-1.5 text-base font-semibold text-[#F4F0E6]">
                Run outcomes
              </h2>

              <p className="mt-1.5 text-xs text-[#777b72]">
                Successful vs failed automation executions.
              </p>
            </div>

            <div className="mt-7 flex items-center gap-6">
              <div
                className="relative h-32 w-32 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#5ED6A0 0deg 341.28deg, #E87575 341.28deg 360deg)",
                }}
              >
                <div className="absolute inset-[13px] flex flex-col items-center justify-center rounded-full bg-[#1B1F19]">
                  <span className="text-2xl font-semibold text-[#F4F0E6]">
                    94.8%
                  </span>

                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#656960]">
                    healthy
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-5">
                {outcomeData.map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#9A9D94]">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            index === 0
                              ? "bg-[#5ED6A0]"
                              : "bg-[#E87575]"
                          }`}
                        />

                        {item.label}
                      </span>

                      <span className="font-mono text-[10px] font-bold text-[#F4F0E6]">
                        {item.value}
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#252A22]">
                      <div
                        className={`h-full rounded-full ${
                          index === 0
                            ? "bg-[#5ED6A0]"
                            : "bg-[#E87575]"
                        }`}
                        style={{
                          width:
                            index === 0
                              ? "94.8%"
                              : "5.2%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* =========================================================
            WORKFLOW + ACTIVITY
        ========================================================== */}
        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
          {/* WORKFLOW PERFORMANCE */}
          <Card className="border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.7)]" />

                  <h2 className="text-base font-semibold text-[#F4F0E6]">
                    Workflow performance
                  </h2>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#777b72]">
                  Compare reliability and execution volume across
                  your automations.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAllWorkflows(
                    (current) => !current
                  )
                }
                className="w-fit font-mono text-[10px] font-bold uppercase tracking-wider text-[#E7B84B] transition hover:text-[#F5D98B]"
              >
                {showAllWorkflows
                  ? "Show less"
                  : "View all"}{" "}
                →
              </button>
            </div>

            <div className="mt-7 space-y-7">
              {visibleWorkflows.map((workflow, index) => (
                <div key={workflow.name}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-[#555950]">
                          0{index + 1}
                        </span>

                        <p className="truncate text-sm font-semibold text-[#D9D9CF]">
                          {workflow.name}
                        </p>
                      </div>

                      <p className="mt-1 text-[10px] text-[#62665d]">
                        {workflow.runs} executions
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] font-bold text-[#5ED6A0]">
                        {workflow.trend}
                      </span>

                      <span className="text-sm font-semibold text-[#F4F0E6]">
                        {workflow.success}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#252A22]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8b6b22] via-[#E7B84B] to-[#F5D98B] transition-all duration-700"
                      style={{
                        width: `${workflow.success}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ACTIVITY */}
          <Card className="border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.7)]" />

                <h2 className="text-base font-semibold text-[#F4F0E6]">
                  Recent activity
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#777b72]">
                Latest automation events from your workspace.
              </p>
            </div>

            <div className="mt-7 space-y-1">
              {activity.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="group flex gap-3 rounded-xl px-2 py-3 transition hover:bg-[#252A22]"
                >
                  <div className="relative flex w-5 justify-center">
                    {index < activity.length - 1 && (
                      <span className="absolute top-5 h-full w-px bg-[#E7B84B]/[0.07]" />
                    )}

                    <span
                      className={`relative z-10 mt-1 h-2 w-2 rounded-full ${
                        item.status === "success"
                          ? "bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.7)]"
                          : "bg-[#E7B84B] shadow-[0_0_7px_rgba(231,184,75,0.7)]"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-[#C8C9BF]">
                        {item.title}
                      </p>

                      <span className="font-mono text-[9px] text-[#555950]">
                        {item.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-[#62665d]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#E7B84B]/[0.07] pt-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#555950]">
                LIVE EVENT STREAM
              </span>
            </div>
          </Card>
        </section>

        {/* =========================================================
            LEAD FUNNEL
        ========================================================== */}
        <section className="mt-5">
          <Card className="border-[#E7B84B]/[0.09] bg-[#1B1F19]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#656960]">
                  06 / Conversion intelligence
                </p>

                <h2 className="mt-1.5 text-base font-semibold text-[#F4F0E6]">
                  Lead conversion funnel
                </h2>

                <p className="mt-1.5 text-xs text-[#777b72]">
                  Track how automation turns incoming activity into
                  qualified outcomes.
                </p>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-widest text-[#5ED6A0]">
                38.6% conversion
              </span>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {leadFunnel.map((item, index) => (
                <div
                  key={item.label}
                  className="relative"
                >
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#62665d]">
                        0{index + 1}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#D9D9CF]">
                        {item.label}
                      </p>
                    </div>

                    <span className="font-mono text-lg font-bold text-[#F4F0E6]">
                      {item.value.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#252A22]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#80631e] via-[#E7B84B] to-[#F5D98B]"
                      style={{
                        width: `${item.width}%`,
                      }}
                    />
                  </div>

                  {index < leadFunnel.length - 1 && (
                    <div className="absolute right-[-17px] top-[72px] hidden text-[#555950] md:block">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* =========================================================
            BOTTOM HEALTH METRICS
        ========================================================== */}
        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="group rounded-2xl border border-[#E7B84B]/[0.09] bg-[#1B1F19]/90 p-5 transition hover:border-[#E7B84B]/20 hover:bg-[#20241D]">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#62665d]">
              Lead conversion
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-semibold tracking-tight text-[#F4F0E6]">
                38.6%
              </p>

              <span className="font-mono text-[10px] font-bold text-[#5ED6A0]">
                +6.4%
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#252A22]">
              <div className="h-full w-[38.6%] rounded-full bg-[#E7B84B]" />
            </div>
          </div>

          <div className="group rounded-2xl border border-[#E7B84B]/[0.09] bg-[#1B1F19]/90 p-5 transition hover:border-[#E7B84B]/20 hover:bg-[#20241D]">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#62665d]">
              Average response
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-semibold tracking-tight text-[#F4F0E6]">
                1.8s
              </p>

              <span className="font-mono text-[10px] font-bold text-[#5ED6A0]">
                -12.2%
              </span>
            </div>

            <p className="mt-3 text-xs text-[#62665d]">
              Faster than the previous period
            </p>
          </div>

          <div className="group rounded-2xl border border-[#E7B84B]/[0.09] bg-[#1B1F19]/90 p-5 transition hover:border-[#E7B84B]/20 hover:bg-[#20241D]">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#62665d]">
              Active workflows
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-semibold tracking-tight text-[#F4F0E6]">
                12
              </p>

              <span className="font-mono text-[10px] font-bold text-[#E7B84B]">
                4 running now
              </span>
            </div>

            <p className="mt-3 text-xs text-[#62665d]">
              Automation capacity is healthy
            </p>
          </div>
        </section>

        {/* =========================================================
            SYSTEM HEALTH STRIP
        ========================================================== */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#E7B84B]/10 bg-[#1B1F19]/80">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#656960]">
                SYSTEM HEALTH
              </span>

              <span className="flex items-center gap-2 font-mono text-[9px] text-[#5ED6A0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
                API OPERATIONAL
              </span>

              <span className="flex items-center gap-2 font-mono text-[9px] text-[#5ED6A0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
                AUTOMATION HEALTHY
              </span>

              <span className="flex items-center gap-2 font-mono text-[9px] text-[#5ED6A0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />
                DATA SYNCED
              </span>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-widest text-[#555950]">
              LAST SYNC · JUST NOW
            </span>
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================== */}
        <footer className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-[#E7B84B]/[0.06] px-1 pb-3 pt-5 font-mono text-[9px] uppercase tracking-wider text-[#555950] sm:flex-row">
          <span>
            NexaFlow AI · Analytics Control Center
          </span>

          <div className="flex items-center gap-3">
            <span>Performance</span>
            <span className="text-[#3f433c]">•</span>
            <span>Automation</span>
            <span className="text-[#3f433c]">•</span>
            <span>Telemetry</span>
            <span className="text-[#3f433c]">•</span>
            <span>Insights</span>
          </div>
        </footer>
      </div>
    </main>
  );
}