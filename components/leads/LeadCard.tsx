
"use client";

import React from "react";
import Link from "next/link";

export type LeadPriority = "low" | "medium" | "high" | "urgent";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export interface LeadData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  priority?: LeadPriority | string;
  status?: LeadStatus | string;
  value?: number;
  createdAt?: string;
  lastActivity?: string;
}

interface LeadCardProps {
  lead: LeadData;
  compact?: boolean;
}

const priorityStyles: Record<string, string> = {
  low: "bg-slate-400/10 text-slate-400",
  medium: "bg-blue-400/10 text-blue-300",
  high: "bg-amber-400/10 text-amber-300",
  urgent: "bg-red-400/10 text-red-300",
};

const statusStyles: Record<string, string> = {
  new: "bg-violet-400/10 text-violet-300",
  contacted: "bg-blue-400/10 text-blue-300",
  qualified: "bg-emerald-400/10 text-emerald-300",
  converted: "bg-cyan-400/10 text-cyan-300",
  lost: "bg-red-400/10 text-red-300",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatValue(value?: number) {
  if (value === undefined) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LeadCard({
  lead,
  compact = false,
}: LeadCardProps) {
  const priority = (lead.priority || "medium").toLowerCase();
  const status = (lead.status || "new").toLowerCase();

  return (
    <Link
      href={`/leads?id=${lead.id}`}
      className="group block rounded-2xl border border-white/[0.07] bg-[#080d1b] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/15 hover:bg-[#0a1020] hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-xs font-semibold text-violet-300">
            {getInitials(lead.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-200 group-hover:text-white">
              {lead.name}
            </h3>

            {lead.company && (
              <p className="mt-0.5 truncate text-[10px] text-slate-600">
                {lead.company}
              </p>
            )}
          </div>
        </div>

        <span
          className={[
            "shrink-0 rounded-full px-2 py-1 text-[9px] font-medium capitalize",
            priorityStyles[priority] ||
              priorityStyles.medium,
          ].join(" ")}
        >
          {priority}
        </span>
      </div>

      {!compact && (
        <>
          <div className="mt-4 space-y-1.5">
            {lead.email && (
              <p className="truncate text-[10px] text-slate-600">
                {lead.email}
              </p>
            )}

            {lead.source && (
              <p className="text-[10px] text-slate-700">
                Source:{" "}
                <span className="text-slate-500">
                  {lead.source}
                </span>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
            <span
              className={[
                "rounded-full px-2 py-1 text-[9px] font-medium capitalize",
                statusStyles[status] || statusStyles.new,
              ].join(" ")}
            >
              {status}
            </span>

            <span className="text-xs font-semibold text-slate-400">
              {formatValue(lead.value)}
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
