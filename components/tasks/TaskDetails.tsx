
"use client";

import React from "react";
import Button from "@/components/ui/Button";
import type { TaskData } from "./TaskCard";

interface TaskDetailsProps {
  task: TaskData;
  onClose?: () => void;
  onEdit?: () => void;
  onComplete?: () => void;
}

function StatusBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const styles = {
    default: "bg-white/[0.05] text-slate-400",
    success: "bg-emerald-400/10 text-emerald-300",
    warning: "bg-amber-400/10 text-amber-300",
    danger: "bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-2 py-1 text-[9px] font-medium capitalize",
        styles[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TaskDetails({
  task,
  onClose,
  onEdit,
  onComplete,
}: TaskDetailsProps) {
  const status = (task.status || "todo").toLowerCase();
  const priority = (task.priority || "medium").toLowerCase();
  const completed = status === "completed";

  const initials = task.assignee
    ? getInitials(task.assignee)
    : "F";

  const priorityVariant =
    priority === "urgent" || priority === "high"
      ? "danger"
      : priority === "medium"
        ? "warning"
        : "default";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080d1b]">
      {/* Header */}
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge>
                {status.replace("_", " ")}
              </StatusBadge>

              <StatusBadge variant={priorityVariant}>
                {priority} priority
              </StatusBadge>
            </div>

            <h2
              className={[
                "text-sm font-semibold",
                completed
                  ? "text-slate-600 line-through"
                  : "text-white",
              ].join(" ")}
            >
              {task.title}
            </h2>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="border-b border-white/[0.06] p-5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
            Description
          </p>

          <p className="text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        </div>
      )}

      {/* Details */}
      <div className="p-5">
        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
          Task details
        </p>

        <div className="space-y-3">
          {task.assignee && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/10 bg-violet-500/10 text-[9px] font-semibold text-violet-300">
                {initials}
              </div>

              <div>
                <p className="text-[9px] text-slate-700">
                  Assigned to
                </p>

                <p className="text-xs text-slate-400">
                  {task.assignee}
                </p>
              </div>
            </div>
          )}

          {task.dueDate && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[9px] text-slate-700">
                Due date
              </p>

              <p className="mt-1 text-xs font-medium text-slate-400">
                {task.dueDate}
              </p>
            </div>
          )}

          {task.workflowName && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[9px] text-slate-700">
                Related workflow
              </p>

              <p className="mt-1 text-xs font-medium text-slate-400">
                {task.workflowName}
              </p>
            </div>
          )}

          {task.createdAt && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[9px] text-slate-700">
                Created
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {task.createdAt}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {!completed && onComplete && (
            <Button
              variant="success"
              size="sm"
              onClick={onComplete}
              fullWidth
            >
              Mark complete
            </Button>
          )}

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              fullWidth
            >
              Edit task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
