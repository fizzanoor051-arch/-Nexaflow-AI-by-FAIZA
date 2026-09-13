
"use client";

import React from "react";
import Button from "@/components/ui/Button";
import type { LeadData } from "./LeadCard";

interface LeadDetailsProps {
  lead: LeadData;
  onClose?: () => void;
  onEdit?: () => void;
  onCreateTask?: () => void;
}

function formatValue(value?: number) {
  if (value === undefined) return "Not specified";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

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

export default function LeadDetails({
  lead,
  onClose,
  onEdit,
  onCreateTask,
}: LeadDetailsProps) {
  const initials = getInitials(lead.name);
  const priority = (lead.priority || "medium").toLowerCase();
  const status = (lead.status || "new").toLowerCase();

  const priorityVariant =
    priority === "urgent" || priority === "high"
      ? "danger"
      : priority === "medium"
        ? "warning"
        : "default";

  const statusVariant =
    status === "converted"
      ? "success"
      : status === "lost"
        ? "danger"
        : "default";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080d1b]">
      {/* Header */}
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-xs font-semibold text-violet-300">
              {initials}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                {lead.name}
              </h2>

              {lead.company && (
                <p className="mt-1 truncate text-[10px] text-slate-600">
                  {lead.company}
                </p>
              )}
            </div>
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge variant={statusVariant}>
            {status}
          </StatusBadge>

          <StatusBadge variant={priorityVariant}>
            {priority} priority
          </StatusBadge>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-b border-white/[0.06] p-5">
        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
          Contact information
        </p>

        <div className="space-y-3">
          {lead.email && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-slate-600">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[9px] text-slate-700">Email</p>
                <p className="truncate text-xs text-slate-400">
                  {lead.email}
                </p>
              </div>
            </div>
          )}

          {lead.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-slate-600">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M6.5 4.5h3l1.5 4-2 1.5a15 15 0 0 0 5 5l1.5-2 4 1.5v3c0 1-1 1.5-2 1.5C11 19 5 13 5 6.5c0-1 .5-2 1.5-2Z" />
                </svg>
              </div>

              <div>
                <p className="text-[9px] text-slate-700">Phone</p>
                <p className="text-xs text-slate-400">
                  {lead.phone}
                </p>
              </div>
            </div>
          )}

          {lead.source && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-slate-600">
                ↗
              </div>

              <div>
                <p className="text-[9px] text-slate-700">Source</p>
                <p className="text-xs text-slate-400">
                  {lead.source}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Information */}
      <div className="p-5">
        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
          Lead information
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[9px] text-slate-700">
              Potential value
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-300">
              {formatValue(lead.value)}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[9px] text-slate-700">
              Created
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {lead.createdAt || "Recently"}
            </p>
          </div>
        </div>

        {lead.lastActivity && (
          <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[9px] text-slate-700">
              Last activity
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {lead.lastActivity}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {onCreateTask && (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateTask}
              fullWidth
            >
              Create task
            </Button>
          )}

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              fullWidth
            >
              Edit lead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
