
"use client";

import React from "react";
import Link from "next/link";
import WorkflowStatus, {
  WorkflowStatusType,
} from "./WorkflowStatus";

export interface WorkflowCardData {
  id: string;
  name: string;
  description?: string;
  status?: WorkflowStatusType | string;
  steps?: number;
  executions?: number;
  successRate?: number;
  updatedAt?: string;
  category?: string;
}

interface WorkflowCardProps {
  workflow: WorkflowCardData;
  compact?: boolean;
}

function WorkflowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 17h14" />
      <circle cx="5" cy="7" r="2" />
      <circle cx="19" cy="17" r="2" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export default function WorkflowCard({
  workflow,
  compact = false,
}: WorkflowCardProps) {
  const status = workflow.status || "draft";

  return (
    <Link
      href={`/workflows/${workflow.id}`}
      className={[
        "group block overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080d1b] transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-violet-400/15 hover:bg-[#0a1020]",
        "hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)]",
      ].join(" ")}
    >
      <div className="relative p-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
              <WorkflowIcon />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
                {workflow.name}
              </h3>

              {workflow.category && (
                <p className="mt-0.5 truncate text-[9px] uppercase tracking-wider text-slate-700">
                  {workflow.category}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Workflow options"
            onClick={(event) => event.preventDefault()}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
          >
            <MoreIcon />
          </button>
        </div>

        {!compact && workflow.description && (
          <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-600">
            {workflow.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <WorkflowStatus status={status} />

          {workflow.updatedAt && (
            <span className="truncate text-[9px] text-slate-700">
              {workflow.updatedAt}
            </span>
          )}
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-3 border-t border-white/[0.06] bg-white/[0.012]">
          <div className="px-3 py-2.5">
            <p className="text-[9px] text-slate-700">Steps</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              {workflow.steps ?? 0}
            </p>
          </div>

          <div className="border-l border-white/[0.06] px-3 py-2.5">
            <p className="text-[9px] text-slate-700">
              Executions
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              {workflow.executions ?? 0}
            </p>
          </div>

          <div className="border-l border-white/[0.06] px-3 py-2.5">
            <p className="text-[9px] text-slate-700">
              Success
            </p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-300">
              {workflow.successRate ?? 0}%
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}
