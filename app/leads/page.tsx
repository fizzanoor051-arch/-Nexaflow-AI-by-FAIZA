"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  priority: string;
}

type LeadForm = {
  name: string;
  email: string;
  company: string;
  status: string;
  priority: string;
};

const LOCAL_STORAGE_KEY = "nexaflow-local-leads";

const EMPTY_FORM: LeadForm = {
  name: "",
  email: "",
  company: "",
  status: "new",
  priority: "medium",
};

const STATUS_OPTIONS = [
  "all",
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
];

const PRIORITY_OPTIONS = [
  "all",
  "high",
  "medium",
  "low",
];

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "L"
  );
}

function formatStatus(status: string) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function statusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "qualified":
      return "border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.08] text-[#79E0B1]";
    case "won":
      return "border-[#E7B84B]/25 bg-[#E7B84B]/[0.09] text-[#F5D98B]";
    case "contacted":
      return "border-[#A7AE9A]/20 bg-[#A7AE9A]/[0.07] text-[#C1C6B9]";
    case "lost":
      return "border-[#E87575]/20 bg-[#E87575]/[0.08] text-[#F09A9A]";
    default:
      return "border-[#E7B84B]/20 bg-[#E7B84B]/[0.07] text-[#E7C65F]";
  }
}

function priorityClasses(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "border-[#E87575]/20 bg-[#E87575]/[0.07] text-[#F09A9A]";
    case "low":
      return "border-[#9A9D94]/15 bg-[#9A9D94]/[0.04] text-[#9A9D94]";
    default:
      return "border-[#E7B84B]/20 bg-[#E7B84B]/[0.06] text-[#E7C65F]";
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [sortBy, setSortBy] = useState("name");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] =
    useState<Lead | null>(null);

  const [viewLead, setViewLead] =
    useState<Lead | null>(null);

  const [form, setForm] =
    useState<LeadForm>(EMPTY_FORM);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] =
    useState("");

  const [deleteLeadId, setDeleteLeadId] =
    useState<string | null>(null);

  const [hydrated, setHydrated] = useState(false);

  const loadLeads = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/leads", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load leads");
      }

      const data = await response.json();

      const apiLeads: Lead[] = Array.isArray(data.leads)
        ? data.leads
        : [];

      let localLeads: Lead[] = [];

      try {
        const saved = localStorage.getItem(
          LOCAL_STORAGE_KEY
        );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            localLeads = parsed;
          }
        }
      } catch {
        localLeads = [];
      }

      const merged = [...localLeads];

      apiLeads.forEach((apiLead) => {
        const alreadyExists = merged.some(
          (lead) => lead.id === apiLead.id
        );

        if (!alreadyExists) {
          merged.push(apiLead);
        }
      });

      setLeads(merged);
    } catch {
      setError(
        "We couldn't load your leads. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setHydrated(true);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(leads)
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [leads, hydrated]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = window.setTimeout(() => {
      setActionMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.company || "")
          .toLowerCase()
          .includes(query) ||
        lead.status.toLowerCase().includes(query) ||
        lead.priority.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        lead.status.toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "all" ||
        lead.priority.toLowerCase() ===
          priorityFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "priority") {
        const rank: Record<string, number> = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (
          (rank[a.priority.toLowerCase()] || 9) -
          (rank[b.priority.toLowerCase()] || 9)
        );
      }

      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    leads,
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status.toLowerCase() === "new"
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) =>
      lead.status.toLowerCase() === "qualified"
  ).length;

  const highPriorityLeads = leads.filter(
    (lead) =>
      lead.priority.toLowerCase() === "high"
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status.toLowerCase() === "won"
  ).length;

  const conversionRate =
    totalLeads > 0
      ? Math.round((wonLeads / totalLeads) * 100)
      : 0;

  const openAddModal = () => {
    setEditingLead(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
    setError("");
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);

    setForm({
      name: lead.name,
      email: lead.email,
      company: lead.company || "",
      status: lead.status || "new",
      priority: lead.priority || "medium",
    });

    setModalOpen(true);
    setViewLead(null);
    setError("");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const company = form.company.trim();

    if (!name || !email) {
      setError(
        "Lead name and email are required."
      );
      return;
    }

    if (!email.includes("@")) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (editingLead) {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === editingLead.id
            ? {
                ...lead,
                name,
                email,
                company,
                status: form.status,
                priority: form.priority,
              }
            : lead
        )
      );

      setActionMessage("Lead updated successfully.");
    } else {
      const newLead: Lead = {
        id: `local-${Date.now()}`,
        name,
        email,
        company,
        status: form.status,
        priority: form.priority,
      };

      setLeads((current) => [
        newLead,
        ...current,
      ]);

      setActionMessage("Lead added successfully.");
    }

    setModalOpen(false);
    setEditingLead(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleDelete = () => {
    if (!deleteLeadId) return;

    setLeads((current) =>
      current.filter(
        (lead) => lead.id !== deleteLeadId
      )
    );

    if (viewLead?.id === deleteLeadId) {
      setViewLead(null);
    }

    setDeleteLeadId(null);
    setActionMessage("Lead deleted successfully.");
  };

  const updateLeadStatus = (
    leadId: string,
    status: string
  ) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status,
            }
          : lead
      )
    );

    setViewLead((current) =>
      current?.id === leadId
        ? {
            ...current,
            status,
          }
        : current
    );

    setActionMessage(
      `Lead marked as ${formatStatus(status)}.`
    );
  };

  const handleExport = () => {
    if (filteredLeads.length === 0) {
      setActionMessage(
        "There are no leads to export."
      );
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Company",
      "Status",
      "Priority",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.company || "",
      lead.status,
      lead.priority,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexaflow-leads.csv";
    link.click();

    URL.revokeObjectURL(url);

    setActionMessage("Leads exported successfully.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("name");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#151713] text-[#F4F0E6] selection:bg-[#E7B84B]/20 selection:text-[#F5D98B]">

      {/* =========================================================
          NEXAFLOW ATMOSPHERIC BACKGROUND
          ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#151713]">

        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#5D642F]/[0.055] blur-[160px]" />

        <div className="absolute right-[-180px] top-[12%] h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.022] blur-[170px]" />

        <div className="absolute bottom-[-280px] left-[32%] h-[560px] w-[560px] rounded-full bg-[#252A22]/70 blur-[160px]" />

        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #F5D98B 1px, transparent 1px),
              linear-gradient(to bottom, #F5D98B 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Center vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#151713_82%)]" />

        {/* Fine upper glow */}
        <div className="absolute left-1/2 top-0 h-px w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================================================
            HEADER
            ========================================================= */}

        <header className="relative mb-7">

          {/* Header top micro-line */}
          <div className="pointer-events-none absolute -top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/15 to-transparent" />

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            {/* LEFT HEADER */}
            <div className="flex min-w-0 items-start gap-4">

              <div className="flex shrink-0 flex-col gap-3">

                <Link
                  href="/dashboard"
                  className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#F5D98B]/[0.09] bg-[#1B1F19]/90 px-3.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(245,217,139,0.025),0_12px_35px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 hover:border-[#E7B84B]/40 hover:bg-[#20241D] hover:text-[#F5D98B] hover:shadow-[0_0_30px_rgba(231,184,75,0.08)]"
                >
                  <span className="text-lg text-[#E7B84B] transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>

                  <span className="hidden sm:inline">
                    Dashboard
                  </span>
                </Link>

                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E7B84B]/15 bg-[#1B1F19]/80 px-3 py-2 shadow-[inset_0_1px_0_rgba(245,217,139,0.025)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_10px_rgba(231,184,75,0.8)]" />

                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#D8B85B]">
                    CRM
                  </span>
                </div>
              </div>

              <div className="hidden h-[94px] w-px bg-[#F5D98B]/[0.08] sm:block" />

              <div className="min-w-0 pt-0.5">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/20 bg-[#E7B84B]/[0.055] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E7C86B] shadow-[0_0_20px_rgba(231,184,75,0.035)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.8)]" />

                    Lead Management
                  </span>

                  <span className="text-xs text-[#555A50]">
                    /
                  </span>

                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#777D70]">
                    CRM Workspace
                  </span>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#F4F0E6] sm:text-4xl lg:text-[42px]">
                  Leads
                </h1>

                <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#9A9D94] sm:text-[15px]">
                  Capture, qualify, organize, and convert
                  your business leads from one intelligent
                  workspace.
                </p>

                {/* Operational metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#64695F]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-[#5ED6A0]" />
                    Pipeline active
                  </span>

                  <span>
                    Records / {totalLeads}
                  </span>

                  <span>
                    Mode / Live
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT HEADER */}
            <div className="flex flex-wrap items-center gap-2">

              <div className="hidden items-center gap-2 rounded-xl border border-[#5ED6A0]/15 bg-[#1B1F19]/80 px-3.5 py-2.5 text-xs font-medium text-[#9FA69A] shadow-[inset_0_1px_0_rgba(245,217,139,0.02)] lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.65)]" />

                CRM operational
              </div>

              <button
                type="button"
                title="Refresh leads"
                onClick={() => loadLeads(true)}
                disabled={refreshing}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#F5D98B]/[0.09] bg-[#1B1F19]/90 px-3.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-300 hover:border-[#E7B84B]/35 hover:bg-[#20241D] hover:text-[#E7C86B] hover:shadow-[0_0_25px_rgba(231,184,75,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={
                    refreshing
                      ? "animate-spin text-[#E7B84B]"
                      : "text-[#B4A66E]"
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
                title="Export filtered leads"
                onClick={handleExport}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#F5D98B]/[0.09] bg-[#1B1F19]/90 px-3.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-300 hover:border-[#E7B84B]/35 hover:bg-[#20241D] hover:text-[#E7C86B] hover:shadow-[0_0_25px_rgba(231,184,75,0.06)]"
              >
                <span className="text-[#C2AD67]">
                  ↓
                </span>

                <span className="hidden sm:inline">
                  Export
                </span>
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#E7B84B] px-4 text-sm font-bold text-[#15130D] shadow-[0_8px_25px_rgba(231,184,75,0.10)] transition-all duration-300 hover:bg-[#F0C85C] hover:shadow-[0_0_32px_rgba(231,184,75,0.22)] active:scale-[0.98]"
              >
                <span className="text-base">
                  ＋
                </span>

                Add lead
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================
            TOAST
            ========================================================= */}

        {actionMessage && (
          <div className="fixed right-5 top-5 z-[120]">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-[#5ED6A0]/20 bg-[#121611]/95 px-4 py-3 text-xs font-medium text-[#79E0B1] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">

              <div className="absolute left-0 top-0 h-full w-px bg-[#5ED6A0]/60" />

              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#5ED6A0]/15 bg-[#5ED6A0]/10">
                ✓
              </span>

              {actionMessage}
            </div>
          </div>
        )}

        {/* =========================================================
            ERROR
            ========================================================= */}

        {error && (
          <div className="relative mb-5 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#E87575]/15 bg-[#201615]/80 px-4 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.18)]">

            <div className="absolute left-0 top-0 h-full w-px bg-[#E87575]/60" />

            <div className="flex items-center gap-3">

              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E87575]/15 bg-[#E87575]/10 text-[#F09A9A]">
                !
              </span>

              <p className="text-sm text-[#F09A9A]">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-medium text-[#D98383] transition hover:text-[#F0A0A0]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =========================================================
            STATS
            ========================================================= */}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">

          {[
            {
              label: "Total leads",
              value: totalLeads,
              icon: "◎",
              note: "All captured leads",
            },
            {
              label: "New",
              value: newLeads,
              icon: "✦",
              note: "Needs attention",
            },
            {
              label: "Qualified",
              value: qualifiedLeads,
              icon: "✓",
              note: "Sales-ready",
            },
            {
              label: "High priority",
              value: highPriorityLeads,
              icon: "◆",
              note: "Hot opportunities",
            },
            {
              label: "Conversion",
              value: `${conversionRate}%`,
              icon: "↗",
              note: `${wonLeads} won leads`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.075] bg-[#20241D]/85 p-5 shadow-[inset_0_1px_0_rgba(245,217,139,0.025),0_15px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E7B84B]/20 hover:bg-[#252A22]"
            >

              {/* Gold ambient corner */}
              <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-[#E7B84B]/[0.025] blur-2xl transition-opacity duration-300 group-hover:bg-[#E7B84B]/[0.045]" />

              {/* Top micro-line */}
              <div className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent opacity-70" />

              <div className="relative flex items-start justify-between">

                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A9D94]">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.035em] text-[#F4F0E6]">
                    {stat.value}
                  </p>

                  <p className="mt-1.5 text-xs text-[#777D70]">
                    {stat.note}
                  </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.05] text-sm text-[#E7B84B] shadow-[inset_0_1px_0_rgba(245,217,139,0.035)] transition-all duration-300 group-hover:border-[#E7B84B]/25 group-hover:bg-[#E7B84B]/[0.08] group-hover:shadow-[0_0_20px_rgba(231,184,75,0.07)]">
                  {stat.icon}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* =========================================================
            MAIN CRM PANEL
            ========================================================= */}

        <Card className="relative overflow-hidden border-[#F5D98B]/[0.08] bg-[#1B1F19]/95 p-0 shadow-[inset_0_1px_0_rgba(245,217,139,0.025),0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">

          {/* Main panel top gold line */}
          <div className="absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/35 to-transparent" />

          {/* =====================================================
              PANEL HEADER
              ===================================================== */}

          <div className="border-b border-[#F5D98B]/[0.07] bg-[#20241D]/55 p-5 sm:p-6">

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_9px_rgba(231,184,75,0.8)]" />

                  <h2 className="text-[15px] font-semibold tracking-tight text-[#F4F0E6] sm:text-base">
                    Lead pipeline
                  </h2>

                  <span className="rounded-full border border-[#F5D98B]/[0.08] bg-[#151713]/70 px-2 py-0.5 font-mono text-[9px] font-medium text-[#777D70]">
                    {filteredLeads.length}
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-[#777D70]">
                  Search, filter, qualify, and manage your
                  opportunities.
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full xl:max-w-sm">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#777D70]">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search leads, email, company..."
                  className="h-11 w-full rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] pl-9 pr-9 text-sm text-[#F4F0E6] outline-none placeholder:text-[#555A50] shadow-[inset_0_1px_0_rgba(245,217,139,0.02)] transition-all focus:border-[#E7B84B]/35 focus:bg-[#1B1F19] focus:shadow-[0_0_25px_rgba(231,184,75,0.05)]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#777D70] transition hover:text-[#F4F0E6]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* ===================================================
                FILTERS
                =================================================== */}

            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-wrap items-center gap-2">

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-10 rounded-lg border border-[#F5D98B]/[0.08] bg-[#151713] px-3 text-xs font-medium text-[#9A9D94] outline-none shadow-[inset_0_1px_0_rgba(245,217,139,0.02)] transition hover:border-[#E7B84B]/25 hover:bg-[#1B1F19] focus:border-[#E7B84B]/35"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-[#1B1F19] text-[#F4F0E6]"
                    >
                      {status === "all"
                        ? "All statuses"
                        : formatStatus(status)}
                    </option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value
                    )
                  }
                  className="h-10 rounded-lg border border-[#F5D98B]/[0.08] bg-[#151713] px-3 text-xs font-medium text-[#9A9D94] outline-none shadow-[inset_0_1px_0_rgba(245,217,139,0.02)] transition hover:border-[#E7B84B]/25 hover:bg-[#1B1F19] focus:border-[#E7B84B]/35"
                >
                  {PRIORITY_OPTIONS.map(
                    (priority) => (
                      <option
                        key={priority}
                        value={priority}
                        className="bg-[#1B1F19] text-[#F4F0E6]"
                      >
                        {priority === "all"
                          ? "All priorities"
                          : formatStatus(priority)}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="h-10 rounded-lg border border-[#F5D98B]/[0.08] bg-[#151713] px-3 text-xs font-medium text-[#9A9D94] outline-none shadow-[inset_0_1px_0_rgba(245,217,139,0.02)] transition hover:border-[#E7B84B]/25 hover:bg-[#1B1F19] focus:border-[#E7B84B]/35"
                >
                  <option
                    value="name"
                    className="bg-[#1B1F19] text-[#F4F0E6]"
                  >
                    Sort: Name
                  </option>

                  <option
                    value="priority"
                    className="bg-[#1B1F19] text-[#F4F0E6]"
                  >
                    Sort: Priority
                  </option>

                  <option
                    value="status"
                    className="bg-[#1B1F19] text-[#F4F0E6]"
                  >
                    Sort: Status
                  </option>
                </select>

                {(search ||
                  statusFilter !== "all" ||
                  priorityFilter !== "all") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-10 rounded-lg px-3 text-xs font-medium text-[#777D70] transition hover:bg-[#F5D98B]/[0.035] hover:text-[#E7C86B]"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#64695F]">
                Showing{" "}
                <span className="font-semibold text-[#B7BAAF]">
                  {filteredLeads.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#B7BAAF]">
                  {leads.length}
                </span>{" "}
                leads
              </p>
            </div>
          </div>

          {/* =====================================================
              TABLE
              ===================================================== */}

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="relative h-16 animate-pulse overflow-hidden rounded-xl border border-[#F5D98B]/[0.035] bg-[#20241D]/70"
                  >
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#E7B84B]/[0.025] to-transparent" />
                  </div>
                )
              )}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.04] text-2xl text-[#E7B84B] shadow-[0_0_30px_rgba(231,184,75,0.04)]">

                <div className="absolute inset-0 rounded-2xl border border-[#E7B84B]/10" />

                ◎
              </div>

              <h3 className="mt-5 text-base font-semibold text-[#F4F0E6]">
                {leads.length === 0
                  ? "Your lead pipeline is empty"
                  : "No leads match your filters"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#777D70]">
                {leads.length === 0
                  ? "Add your first lead to start building your CRM pipeline."
                  : "Try changing your search or filters to find the leads you're looking for."}
              </p>

              {leads.length === 0 ? (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-5 rounded-xl bg-[#E7B84B] px-4 py-2.5 text-sm font-bold text-[#15130D] shadow-[0_8px_25px_rgba(231,184,75,0.08)] transition hover:bg-[#F0C85C] hover:shadow-[0_0_25px_rgba(231,184,75,0.2)]"
                >
                  ＋ Add your first lead
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D] px-4 py-2.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(245,217,139,0.02)] transition hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#E7C86B]"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-[#F5D98B]/[0.07] bg-[#151713]/55 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777D70]">

                    <th className="px-5 py-4">
                      Lead
                    </th>

                    <th className="px-5 py-4">
                      Company
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Priority
                    </th>

                    <th className="px-5 py-4">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map(
                    (lead) => (
                      <tr
                        key={lead.id}
                        className="group border-b border-[#F5D98B]/[0.045] transition-all duration-200 hover:bg-[#E7B84B]/[0.022]"
                      >

                        {/* Lead */}

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              setViewLead(lead)
                            }
                            className="flex items-center gap-3 text-left"
                          >

                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E7B84B]/15 bg-[#20241D] text-[11px] font-bold text-[#D9B95E] shadow-[inset_0_1px_0_rgba(245,217,139,0.035)] transition-all duration-300 group-hover:border-[#E7B84B]/30 group-hover:bg-[#252A22] group-hover:shadow-[0_0_20px_rgba(231,184,75,0.06)]">

                              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(231,184,75,0.08),transparent_55%)]" />

                              <span className="relative">
                                {getInitials(
                                  lead.name
                                )}
                              </span>
                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[190px] truncate text-sm font-semibold text-[#F4F0E6] transition-colors group-hover:text-[#F5D98B]">
                                {lead.name}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate font-mono text-[10px] text-[#777D70]">
                                {lead.email}
                              </p>
                            </div>
                          </button>
                        </td>

                        {/* Company */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-[#9A9D94]">
                            {lead.company ||
                              "Independent"}
                          </span>
                        </td>
                       
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1.5 text-[10px] font-semibold capitalize ${statusClasses(
                              lead.status
                            )}`}
                          >
                            {formatStatus(
                              lead.status
                            )}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1.5 text-[10px] font-semibold capitalize ${priorityClasses(
                              lead.priority
                            )}`}
                          >
                            {lead.priority}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            className="text-xs font-medium text-slate-500 transition hover:text-[#dcb34a]"
                          >
                            Email lead →
                          </a>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View lead"
                              onClick={() =>
                                setViewLead(lead)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white"
                            >
                              ↗
                            </button>

                            <button
                              type="button"
                              title="Edit lead"
                              onClick={() =>
                                openEditModal(
                                  lead
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-[#d4a72c]/15 hover:bg-[#d4a72c]/[0.05] hover:text-[#dcb34a]"
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              title="Delete lead"
                              onClick={() =>
                                setDeleteLeadId(
                                  lead.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-600 transition hover:border-red-400/15 hover:bg-red-400/[0.05] hover:text-red-400"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-5 flex flex-col items-center justify-between gap-2 px-1 text-[10px] text-slate-600 sm:flex-row">
          <span className="font-medium">
            NexaFlow AI · Lead Intelligence
          </span>

          <div className="flex items-center gap-3">
            <span>CRM</span>
            <span className="text-slate-700">
              •
            </span>
            <span>Automation</span>
            <span className="text-slate-700">
              •
            </span>
            <span>AI Workspace</span>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c0c0c] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="flex items-start justify-between border-b border-white/[0.07] p-5 sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#d4a72c] shadow-[0_0_8px_rgba(212,167,44,0.8)]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#cda43a]">
                    Lead CRM
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  {editingLead
                    ? "Edit lead"
                    : "Add new lead"}
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                  {editingLead
                    ? "Update the lead information below."
                    : "Add a lead to your intelligent sales pipeline."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setError("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-400"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                    Full name *
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Sarah Ahmed"
                    autoFocus
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#d4a72c]/35 focus:bg-[#d4a72c]/[0.025]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                    Email *
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="sarah@company.com"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#d4a72c]/35"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                    Company
                  </label>

                  <input
                    value={form.company}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        company:
                          event.target.value,
                      }))
                    }
                    placeholder="Company name"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#d4a72c]/35"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status:
                          event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3.5 text-sm text-white outline-none focus:border-[#d4a72c]/35"
                  >
                    {STATUS_OPTIONS.filter(
                      (status) =>
                        status !== "all"
                    ).map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        priority:
                          event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-3.5 text-sm text-white outline-none focus:border-[#d4a72c]/35"
                  >
                    {PRIORITY_OPTIONS.filter(
                      (priority) =>
                        priority !== "all"
                    ).map((priority) => (
                      <option
                        key={priority}
                        value={priority}
                      >
                        {formatStatus(priority)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/15 bg-red-400/[0.05] px-3 py-2.5 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setError("");
                  }}
                  className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-xl bg-[#d4a72c] px-5 text-sm font-bold text-[#100e08] transition hover:bg-[#e5be4b] hover:shadow-[0_0_25px_rgba(212,167,44,0.2)]"
                >
                  {editingLead
                    ? "Save changes"
                    : "Create lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW LEAD MODAL */}
      {viewLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c0c0c] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="border-b border-white/[0.07] p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4a72c]/20 bg-[#d4a72c]/[0.06] text-sm font-bold text-[#dcb34a]">
                    {getInitials(
                      viewLead.name
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">
                      {viewLead.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {viewLead.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setViewLead(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                    Company
                  </p>

                  <p className="mt-2 truncate text-sm font-medium text-slate-300">
                    {viewLead.company ||
                      "Independent"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                    Priority
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-2 py-1.5 text-[10px] font-semibold capitalize ${priorityClasses(
                      viewLead.priority
                    )}`}
                  >
                    {viewLead.priority}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                      Pipeline status
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Update the lead stage instantly.
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${statusClasses(
                      viewLead.status
                    )}`}
                  >
                    {formatStatus(
                      viewLead.status
                    )}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {[
                    "new",
                    "contacted",
                    "qualified",
                    "won",
                    "lost",
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        updateLeadStatus(
                          viewLead.id,
                          status
                        )
                      }
                      className={`rounded-lg border px-2 py-2.5 text-[10px] font-medium transition ${
                        viewLead.status ===
                        status
                          ? "border-[#d4a72c]/30 bg-[#d4a72c]/[0.08] text-[#dcb34a]"
                          : "border-white/[0.06] bg-white/[0.018] text-slate-500 hover:border-white/[0.12] hover:text-slate-300"
                      }`}
                    >
                      {formatStatus(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={`mailto:${viewLead.email}`}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#d4a72c] px-4 text-sm font-bold text-[#100e08] transition hover:bg-[#e5be4b] hover:shadow-[0_0_25px_rgba(212,167,44,0.18)]"
                >
                  ✉ Contact lead
                </a>

                <button
                  type="button"
                  onClick={() =>
                    openEditModal(viewLead)
                  }
                  className="flex h-10 flex-1 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm font-medium text-slate-400 transition hover:border-[#d4a72c]/25 hover:text-[#dcb34a]"
                >
                  ✎ Edit lead
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteLeadId(viewLead.id)
                }
                className="w-full text-center text-xs font-medium text-slate-600 transition hover:text-red-400"
              >
                Delete this lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteLeadId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-red-400/15 bg-[#0c0c0c] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.06] text-red-400">
              !
            </div>

            <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
              Delete this lead?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action will remove the lead from
              your current NexaFlow CRM workspace.
            </p>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteLeadId(null)
                }
                className="h-10 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-slate-500 transition hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="h-10 flex-1 rounded-xl bg-red-500/90 text-sm font-bold text-white transition hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.18)]"
              >
                Delete lead
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}