
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { LeadData } from "./LeadCard";

interface LeadTableProps {
  leads: LeadData[];
  onSelect?: (lead: LeadData) => void;
}

function formatValue(value?: number) {
  if (value === undefined) return "—";

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
  variant?: "default" | "success" | "danger";
}) {
  const styles = {
    default: "bg-white/[0.05] text-slate-400",
    success: "bg-emerald-400/10 text-emerald-300",
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

export default function LeadTable({
  leads,
  onSelect,
}: LeadTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesQuery =
        !normalizedQuery ||
        lead.name.toLowerCase().includes(normalizedQuery) ||
        lead.email?.toLowerCase().includes(normalizedQuery) ||
        lead.company?.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (lead.status || "new").toLowerCase() === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080d1b]">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search leads..."
            className="h-9 w-full rounded-lg border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-violet-400/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-9 rounded-lg border border-white/[0.07] bg-[#0b1120] px-3 text-xs text-slate-500 outline-none focus:border-violet-400/20"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                Source
              </th>
              <th className="px-4 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                Value
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => {
              const status = (lead.status || "new").toLowerCase();

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelect?.(lead)}
                  className="group border-b border-white/[0.045] transition-colors hover:bg-white/[0.018]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/leads?id=${lead.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/10 text-[9px] font-semibold text-violet-300">
                        {getInitials(lead.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-300 group-hover:text-white">
                          {lead.name}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-slate-700">
                          {lead.email ||
                            lead.company ||
                            "No contact information"}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        status === "converted"
                          ? "success"
                          : status === "lost"
                            ? "danger"
                            : "default"
                      }
                    >
                      {status}
                    </StatusBadge>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-[10px] capitalize text-slate-500">
                      {lead.priority || "Medium"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-[10px] text-slate-600">
                      {lead.source || "Direct"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-slate-400">
                      {formatValue(lead.value)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-white/[0.045] md:hidden">
        {filteredLeads.map((lead) => (
          <Link
            key={lead.id}
            href={`/leads?id=${lead.id}`}
            className="block p-4 transition-colors hover:bg-white/[0.018]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-[9px] font-semibold text-violet-300">
                {getInitials(lead.name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-300">
                  {lead.name}
                </p>

                <p className="mt-0.5 truncate text-[9px] text-slate-700">
                  {lead.email ||
                    lead.company ||
                    "No contact information"}
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {formatValue(lead.value)}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <StatusBadge>
                {lead.status || "New"}
              </StatusBadge>

              <span className="text-[9px] capitalize text-slate-700">
                {lead.priority || "Medium"} priority
              </span>
            </div>
          </Link>
        ))}

        {filteredLeads.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-xs text-slate-600">
              No leads found.
            </p>
          </div>
        )}
      </div>

      {filteredLeads.length === 0 && (
        <div className="hidden px-4 py-10 text-center md:block">
          <p className="text-xs text-slate-600">
            No leads match your search.
          </p>
        </div>
      )}
    </div>
  );
}
