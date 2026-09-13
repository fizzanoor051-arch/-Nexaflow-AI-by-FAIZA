
"use client";

import React from "react";

export interface WorkflowStepData {
  id?: string;
  type?: string;
  name?: string;
  title?: string;
  description?: string;
  action?: string;
  status?: "pending" | "running" | "completed" | "failed";
}

interface WorkflowStepProps {
  step: WorkflowStepData;
  index: number;
  total: number;
  editable?: boolean;
  onRemove?: (id: string) => void;
}

function StepIcon({
  type,
}: {
  type?: string;
}) {
  const normalized = type?.toLowerCase() || "";

  if (
    normalized.includes("email") ||
    normalized.includes("message") ||
    normalized.includes("notify")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (
    normalized.includes("lead") ||
    normalized.includes("customer") ||
    normalized.includes("user")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (
    normalized.includes("ai") ||
    normalized.includes("analy") ||
    normalized.includes("classif")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4"
      >
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
      </svg>
    );
  }

  if (
    normalized.includes("task") ||
    normalized.includes("assign")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
      >
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="M6 4v16" />
      <path d="M18 4v16" />
      <path d="M6 7h12" />
      <path d="M6 17h12" />
      <circle cx="6" cy="4" r="2" />
      <circle cx="18" cy="20" r="2" />
    </svg>
  );
}

function StatusIcon({
  status,
}: {
  status?: WorkflowStepData["status"];
}) {
  if (status === "completed") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400/10 text-red-300">
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />
      </span>
    );
  }

  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.05] text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

export default function WorkflowStep({
  step,
  index,
  total,
  editable = false,
  onRemove,
}: WorkflowStepProps) {
  const stepId = step.id || String(index);

  return (
    <div className="relative flex gap-3">
      {index < total - 1 && (
        <span className="absolute left-[15px] top-9 h-[calc(100%-18px)] w-px bg-white/[0.07]" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#0c1324] text-slate-400">
        <StepIcon type={step.type} />
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-violet-400/10">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-semibold text-slate-200">
                  {step.name || step.title || `Step ${index + 1}`}
                </p>

                <span className="shrink-0 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-medium text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {(step.description || step.action) && (
                <p className="mt-1 text-[10px] leading-4 text-slate-600">
                  {step.description || step.action}
                </p>
              )}

              {step.type && (
                <span className="mt-2 inline-flex rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-1 text-[8px] uppercase tracking-wider text-slate-600">
                  {step.type}
                </span>
              )}
            </div>

            <StatusIcon status={step.status} />
          </div>

          {editable && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(stepId)}
              className="mt-3 text-[9px] font-medium text-slate-700 transition-colors hover:text-red-300"
            >
              Remove step
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
