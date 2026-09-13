
"use client";

import React from "react";

export type WorkflowStatusType =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "archived";

interface WorkflowStatusProps {
  status: WorkflowStatusType | string;
  size?: "sm" | "md";
  showDot?: boolean;
}

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  draft: {
    label: "Draft",
    className: "border-slate-400/10 bg-slate-400/10 text-slate-300",
    dotClassName: "bg-slate-400",
  },
  active: {
    label: "Active",
    className: "border-emerald-400/10 bg-emerald-400/10 text-emerald-300",
    dotClassName: "bg-emerald-400",
  },
  paused: {
    label: "Paused",
    className: "border-amber-400/10 bg-amber-400/10 text-amber-300",
    dotClassName: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    className: "border-blue-400/10 bg-blue-400/10 text-blue-300",
    dotClassName: "bg-blue-400",
  },
  failed: {
    label: "Failed",
    className: "border-red-400/10 bg-red-400/10 text-red-300",
    dotClassName: "bg-red-400",
  },
  archived: {
    label: "Archived",
    className: "border-slate-400/10 bg-slate-400/10 text-slate-500",
    dotClassName: "bg-slate-500",
  },
};

export default function WorkflowStatus({
  status,
  size = "sm",
  showDot = true,
}: WorkflowStatusProps) {
  const normalizedStatus = status.toLowerCase();
  const config =
    statusConfig[normalizedStatus] || statusConfig.draft;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm"
          ? "px-2 py-1 text-[10px]"
          : "px-2.5 py-1.5 text-xs",
        config.className,
      ].join(" ")}
    >
      {showDot && (
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            config.dotClassName,
            normalizedStatus === "active"
              ? "animate-pulse"
              : "",
          ].join(" ")}
        />
      )}

      {config.label}
    </span>
  );
}
