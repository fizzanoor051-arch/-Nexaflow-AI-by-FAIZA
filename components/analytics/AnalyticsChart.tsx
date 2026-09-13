"use client";

import { useMemo } from "react";

export interface AnalyticsPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  data?: AnalyticsPoint[];
  title?: string;
  subtitle?: string;
  valueLabel?: string;
}

const defaultData: AnalyticsPoint[] = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 51 },
  { label: "Thu", value: 76 },
  { label: "Fri", value: 68 },
  { label: "Sat", value: 89 },
  { label: "Sun", value: 82 },
];

export default function AnalyticsChart({
  data = defaultData,
  title = "Workflow Activity",
  subtitle = "Automation activity over the last 7 days",
  valueLabel = "Executions",
}: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const chartPoints = useMemo(() => {
    const width = 700;
    const height = 240;
    const paddingX = 30;
    const paddingY = 24;

    return data.map((item, index) => {
      const x =
        data.length === 1
          ? width / 2
          : paddingX +
            (index / (data.length - 1)) * (width - paddingX * 2);

      const y =
        height -
        paddingY -
        (item.value / maxValue) * (height - paddingY * 2);

      return {
        ...item,
        x,
        y,
      };
    });
  }, [data, maxValue]);

  const linePath = chartPoints
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath =
    chartPoints.length > 0
      ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} 240 L ${chartPoints[0].x} 240 Z`
      : "";

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Total
          </p>
          <p className="mt-0.5 text-lg font-bold text-white">{total}</p>
        </div>
      </div>

      <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-white/[0.04] bg-[#070b1c]">
        <div className="absolute inset-0 flex flex-col justify-between px-4 py-6">
          {[100, 75, 50, 25, 0].map((value) => (
            <div
              key={value}
              className="border-t border-dashed border-white/[0.05]"
            />
          ))}
        </div>

        <div className="absolute left-0 right-0 top-0 h-[240px] px-2">
          <svg
            viewBox="0 0 700 240"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <defs>
              <linearGradient
                id="analyticsAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0" />
              </linearGradient>

              <filter id="analyticsGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {areaPath && (
              <path
                d={areaPath}
                fill="url(#analyticsAreaGradient)"
              />
            )}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="rgb(139,92,246)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#analyticsGlow)"
              />
            )}

            {chartPoints.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#070b1c"
                  stroke="rgb(167,139,250)"
                  strokeWidth="3"
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-between px-7">
          {data.map((item) => (
            <span
              key={item.label}
              className="text-[11px] font-medium text-slate-600"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-600">{valueLabel}</span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live data
        </span>
      </div>
    </div>
  );
}