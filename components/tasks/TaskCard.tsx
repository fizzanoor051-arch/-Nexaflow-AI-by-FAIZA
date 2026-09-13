
"use client";

import React from "react";
import Link from "next/link";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority | string;
  status?: TaskStatus | string;
  dueDate?: string;
  assignee?: string;
  workflowName?: string;
  createdAt?: string;
}

interface TaskCardProps {
  task: TaskData;
  compact?: boolean;
  onComplete?: (task: TaskData) => void;
}

const priorityStyles: Record<string, string> = {
  low: "bg-slate-400/10 text-slate-400",
  medium: "bg-blue-400/10 text-blue-300",
  high: "bg-amber-400/10 text-amber-300",
  urgent: "bg-red-400/10 text-red-300",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex rounded-full bg-white/[0.05] px-2 py-1 text-[9px] font-medium capitalize text-slate-400">
      {children}
    </span>
  );
}

export default function TaskCard({
  task,
  compact = false,
  onComplete,
}: TaskCardProps) {
  const status = (task.status || "todo").toLowerCase();
  const priority = (task.priority || "medium").toLowerCase();

  const completed = status === "completed";

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#080d1b] p-4 transition-all duration-300 hover:border-violet-400/12 hover:bg-[#0a1020]">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onComplete?.(task)}
          aria-label={
            completed
              ? "Task completed"
              : "Mark task as completed"
          }
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
            completed
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-white/[0.12] bg-white/[0.02] text-transparent hover:border-violet-400/30",
          ].join(" ")}
        >
          {completed && (
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <Link
            href={`/tasks?id=${task.id}`}
            className={[
              "block text-xs font-semibold transition-colors",
              completed
                ? "text-slate-600 line-through"
                : "text-slate-300 hover:text-white",
            ].join(" ")}
          >
            {task.title}
          </Link>

          {!compact && task.description && (
            <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-700">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full px-2 py-1 text-[9px] font-medium capitalize",
                priorityStyles[priority] ||
                  priorityStyles.medium,
              ].join(" ")}
            >
              {priority}
            </span>

            <StatusBadge>
              {status.replace("_", " ")}
            </StatusBadge>

            {task.dueDate && (
              <span className="text-[9px] text-slate-700">
                Due {task.dueDate}
              </span>
            )}
          </div>
        </div>

        {task.assignee && (
          <div
            title={task.assignee}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[8px] font-semibold text-slate-500"
          >
            {getInitials(task.assignee)}
          </div>
        )}
      </div>

      {!compact && task.workflowName && (
        <div className="mt-3 border-t border-white/[0.05] pt-3">
          <span className="text-[9px] text-slate-700">
            Workflow:{" "}
            <span className="text-slate-500">
              {task.workflowName}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
