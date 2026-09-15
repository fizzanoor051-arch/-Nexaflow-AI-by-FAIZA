"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VisualWorkflowBuilder from "@/components/workflows/VisualWorkflowBuilder";

import type {
  Workflow,
  WorkflowStatus,
  WorkflowStep,
} from "@/types/workflow";

type ApiResponse = {
  success: boolean;
  workflows?: Workflow[];
  workflow?: Workflow;
  error?: string;
};

const statusConfig = {
  draft: {
    label: "Draft",
    dot: "bg-[#777D70]",
    badge:
      "border-[#777D70]/20 bg-[#777D70]/[0.08] text-[#B7BBAF]",
  },
  active: {
    label: "Active",
    dot: "bg-[#5ED6A0]",
    badge:
      "border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.08] text-[#7CE3B3]",
  },
  paused: {
    label: "Paused",
    dot: "bg-[#E7B84B]",
    badge:
      "border-[#E7B84B]/20 bg-[#E7B84B]/[0.08] text-[#F5D98B]",
  },
  archived: {
    label: "Archived",
    dot: "bg-[#5E635B]",
    badge:
      "border-[#5E635B]/20 bg-[#5E635B]/[0.08] text-[#9A9D94]",
  },
} satisfies Record<
  WorkflowStatus,
  {
    label: string;
    dot: string;
    badge: string;
  }
>;

const stepTypeConfig = {
  trigger: {
    label: "Trigger",
    icon: "⚡",
  },
  ai: {
    label: "AI",
    icon: "✦",
  },
  action: {
    label: "Action",
    icon: "→",
  },
  condition: {
    label: "Condition",
    icon: "◇",
  },
  notification: {
    label: "Notification",
    icon: "◉",
  },
  delay: {
    label: "Delay",
    icon: "◷",
  },
} satisfies Record<
  WorkflowStep["type"],
  {
    label: string;
    icon: string;
  }
>;

function createDefaultStep(): WorkflowStep {
  return {
    id: `step-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    title: "Workflow trigger",
    description:
      "Start this workflow when the configured trigger occurs.",
    type: "trigger",
    order: 0,
  };
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const demoWorkflows = [
  {
    name: "AI Lead Qualification",
    description:
      "Automatically analyze new leads, score their intent, and notify the sales team when a qualified opportunity is detected.",
    steps: [
      {
        title: "New lead received",
        description:
          "Start the workflow when a new lead enters the system.",
        type: "trigger" as const,
        order: 0,
      },
      {
        title: "Analyze lead with AI",
        description:
          "Use AI to understand the lead profile, intent, and potential value.",
        type: "ai" as const,
        order: 1,
      },
      {
        title: "Check qualification",
        description:
          "Determine whether the lead meets the qualification criteria.",
        type: "condition" as const,
        order: 2,
      },
      {
        title: "Notify sales team",
        description:
          "Send a notification when a high-quality lead is identified.",
        type: "notification" as const,
        order: 3,
      },
    ],
  },
  {
    name: "Customer Onboarding",
    description:
      "Automate the first steps of customer onboarding with welcome messages, delayed follow-ups, and internal notifications.",
    steps: [
      {
        title: "Customer signup",
        description:
          "Start the workflow after a new customer completes signup.",
        type: "trigger" as const,
        order: 0,
      },
      {
        title: "Send welcome message",
        description:
          "Automatically send a personalized onboarding message.",
        type: "action" as const,
        order: 1,
      },
      {
        title: "Wait 24 hours",
        description:
          "Give the customer time to explore the product before the next step.",
        type: "delay" as const,
        order: 2,
      },
      {
        title: "AI onboarding check",
        description:
          "Use AI to identify customers who may need additional assistance.",
        type: "ai" as const,
        order: 3,
      },
    ],
  },
];

export default function WorkflowsPage() {
  const router = useRouter();

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );
  const [seeding, setSeeding] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | WorkflowStatus
  >("all");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadWorkflows() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/workflows", {
        method: "GET",
        cache: "no-store",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load workflows."
        );
      }

      const loaded = data.workflows ?? [];

      setWorkflows(loaded);

      if (loaded.length === 0) {
        await createStarterWorkflows();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load workflows."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createStarterWorkflows() {
    if (seeding) return;

    try {
      setSeeding(true);

      const created: Workflow[] = [];

      for (const demo of demoWorkflows) {
        const steps = demo.steps.map((step, index) => ({
          ...step,
          id: `step-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
        }));

        const response = await fetch("/api/workflows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: demo.name,
            description: demo.description,
            steps,
          }),
        });

        const data: ApiResponse = await response.json();

        if (response.ok && data.success && data.workflow) {
          created.push(data.workflow);
        }
      }

      if (created.length > 0) {
        setWorkflows(created);
      }
    } catch {
      // Starter workflows are optional.
    } finally {
      setSeeding(false);
    }
  }

  useEffect(() => {
    void loadWorkflows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 2) {
      setError(
        "Workflow name must contain at least 2 characters."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description:
            trimmedDescription || undefined,
          steps: [createDefaultStep()],
        }),
      });

      const data: ApiResponse = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.workflow
      ) {
        throw new Error(
          data.error || "Unable to create workflow."
        );
      }

      setWorkflows((current) => [
        data.workflow as Workflow,
        ...current,
      ]);

      setName("");
      setDescription("");
      setShowCreateModal(false);

      router.push(
        `/workflows/${data.workflow.id}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create workflow."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(
    event: React.MouseEvent,
    workflowId: string
  ) {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(workflowId);
      setError("");

      const response = await fetch(
        `/api/workflows/${workflowId}`,
        {
          method: "DELETE",
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to delete workflow."
        );
      }

      setWorkflows((current) =>
        current.filter(
          (workflow) => workflow.id !== workflowId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete workflow."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredWorkflows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return workflows.filter((workflow) => {
      const matchesSearch =
        !query ||
        workflow.name
          .toLowerCase()
          .includes(query) ||
        workflow.description
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        workflow.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workflows, search, statusFilter]);

  const stats = useMemo(() => {
    const totalRuns = workflows.reduce(
      (sum, workflow) => sum + workflow.runs,
      0
    );

    const active = workflows.filter(
      (workflow) => workflow.status === "active"
    ).length;

    const averageSuccess =
      workflows.length > 0
        ? Math.round(
            workflows.reduce(
              (sum, workflow) =>
                sum + workflow.successRate,
              0
            ) / workflows.length
          )
        : 0;

    return {
      total: workflows.length,
      active,
      runs: totalRuns,
      success: averageSuccess,
    };
  }, [workflows]);

  return (
    <main className="min-h-screen bg-[#151713] text-[#F4F0E6]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5D642F]/[0.035] blur-[150px]" />

        <div className="absolute right-[-180px] top-[14%] h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.018] blur-[160px]" />

        <div className="absolute bottom-[-260px] left-[32%] h-[520px] w-[520px] rounded-full bg-[#252A22]/60 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.014]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #F5D98B 1px, transparent 1px),
              linear-gradient(to bottom, #F5D98B 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#151713_82%)]" />
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* TOP NAVIGATION */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D] px-3.5 py-2.5 text-sm text-[#9A9D94] shadow-[0_8px_25px_rgba(0,0,0,0.14)] transition duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F4F0E6]"
          >
            <span className="text-base transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-[#E7B84B]">
              ←
            </span>

            <span>Dashboard</span>
          </button>

          <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#5E635B] sm:flex">
            <span>Workspace</span>
            <span className="text-[#454A43]">/</span>
            <span className="text-[#9A9D94]">
              Workflows
            </span>
          </div>
        </div>

        {/* HEADER */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#F5D98B]/[0.08] bg-[#20241D] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/35 to-transparent" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E7B84B]/[0.025] blur-[110px]" />

          <div className="pointer-events-none absolute -left-20 bottom-[-100px] h-56 w-56 rounded-full bg-[#5D642F]/[0.025] blur-[100px]" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/15 bg-[#151713] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#F5D98B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_10px_rgba(94,214,160,0.65)]" />

                  Automation workspace
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#F4F0E6] sm:text-4xl lg:text-5xl">
                  Workflow automation
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9A9D94] sm:text-base">
                  Build, manage, and monitor intelligent
                  automations that move your work forward
                  automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setName("");
                  setDescription("");
                  setShowCreateModal(true);
                }}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E7B84B]/30 bg-[#E7B84B] px-5 text-sm font-bold text-[#171105] shadow-[0_8px_30px_rgba(231,184,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F0C85D] hover:shadow-[0_12px_40px_rgba(231,184,75,0.22)] active:translate-y-0"
              >
                <span className="text-xl leading-none">
                  +
                </span>

                <span>New workflow</span>

                <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#E87575]/20 bg-[#E87575]/[0.08] px-4 py-3 text-sm text-[#F2A1A1]">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-[#E87575] transition hover:text-[#F4F0E6]"
            >
              ×
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total workflows",
              value: stats.total,
              icon: "◈",
            },
            {
              label: "Active",
              value: stats.active,
              icon: "●",
            },
            {
              label: "Total runs",
              value: stats.runs.toLocaleString(),
              icon: "↗",
            },
            {
              label: "Avg. success",
              value: `${stats.success}%`,
              icon: "✓",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.07] bg-[#20241D] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition duration-200 hover:-translate-y-0.5 hover:border-[#E7B84B]/20 hover:bg-[#252A22] sm:p-5"
            >
              <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.08] to-transparent" />

              <span className="pointer-events-none absolute inset-y-4 left-0 w-[2px] -translate-x-full rounded-r-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#777D70]">
                  {stat.label}
                </span>

                <span className="text-sm text-[#6F746B] transition group-hover:text-[#E7B84B]">
                  {stat.icon}
                </span>
              </div>

              <div className="text-2xl font-semibold tracking-tight text-[#F4F0E6] sm:text-3xl">
                {stat.value}
              </div>
            </div>
          ))}
        </section>
        
{/* VISUAL WORKFLOW BUILDER */}
<section className="mb-8">
  <VisualWorkflowBuilder />
</section>


        {/* TOOLBAR */}
        <section className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5E635B]">
              ⌕
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search workflows..."
              className="h-11 w-full rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D] pl-11 pr-4 text-sm text-[#F4F0E6] outline-none transition duration-200 placeholder:text-[#5E635B] focus:border-[#E7B84B]/30 focus:bg-[#252A22] focus:shadow-[0_0_25px_rgba(231,184,75,0.04)]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {(
              [
                "all",
                "active",
                "draft",
                "paused",
                "archived",
              ] as const
            ).map((status) => {
              const active =
                statusFilter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition duration-200 ${
                    active
                      ? "border border-[#E7B84B]/30 bg-[#E7B84B] text-[#171105] shadow-[0_0_22px_rgba(231,184,75,0.12)]"
                      : "border border-[#F5D98B]/[0.07] bg-[#20241D] text-[#9A9D94] hover:border-[#E7B84B]/20 hover:bg-[#252A22] hover:text-[#F5D98B]"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : statusConfig[status].label}
                </button>
              );
            })}
          </div>
        </section>

        {/* CONTENT */}
        {loading ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[280px] animate-pulse rounded-2xl border border-[#F5D98B]/[0.06] bg-[#20241D]"
                />
              )
            )}
          </section>
        ) : filteredWorkflows.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#F5D98B]/[0.1] bg-[#20241D] px-6 py-20 text-center shadow-[0_16px_45px_rgba(0,0,0,0.16)]">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7B84B]/15 bg-[#151713] text-2xl text-[#E7B84B]">
              ◇
            </div>

            <h2 className="text-lg font-semibold text-[#F4F0E6]">
              {workflows.length === 0
                ? "No workflows yet"
                : "No matching workflows"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777D70]">
              {workflows.length === 0
                ? "Create your first automation and start turning repetitive work into intelligent workflows."
                : "Try changing your search or status filter."}
            </p>

            {workflows.length === 0 && (
              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="mt-6 rounded-xl bg-[#E7B84B] px-5 py-2.5 text-sm font-bold text-[#171105] transition hover:bg-[#F0C85D] hover:shadow-[0_0_28px_rgba(231,184,75,0.18)]"
              >
                Create your first workflow
              </button>
            )}
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredWorkflows.map((workflow) => {
              const status =
                statusConfig[workflow.status];

              return (
                <article
                  key={workflow.id}
                  onClick={() =>
                    router.push(
                      `/workflows/${workflow.id}`
                    )
                  }
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#F5D98B]/[0.07] bg-[#20241D] p-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:shadow-[0_20px_55px_rgba(0,0,0,0.28)]"
                >
                  <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.08] to-transparent" />

                  <span className="pointer-events-none absolute inset-y-5 left-0 w-[2px] -translate-x-full rounded-r-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#E7B84B]/[0.025] blur-2xl transition group-hover:bg-[#E7B84B]/[0.055]" />

                  <div className="relative mb-5 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] text-sm text-[#9A9D94] transition duration-200 group-hover:border-[#E7B84B]/25 group-hover:bg-[#252A22] group-hover:text-[#F5D98B] group-hover:shadow-[0_0_22px_rgba(231,184,75,0.08)]">
                        {workflow.steps[0]
                          ? stepTypeConfig[
                              workflow.steps[0].type
                            ].icon
                          : "◇"}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-[#F4F0E6]">
                          {workflow.name}
                        </h2>

                        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#5E635B]">
                          Updated{" "}
                          {formatDate(
                            workflow.updatedAt
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        deletingId === workflow.id
                      }
                      onClick={(event) =>
                        void handleDelete(
                          event,
                          workflow.id
                        )
                      }
                      className="shrink-0 rounded-lg border border-transparent p-2 text-[#5E635B] opacity-0 transition duration-200 hover:border-[#E87575]/15 hover:bg-[#E87575]/[0.06] hover:text-[#E87575] group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Delete ${workflow.name}`}
                    >
                      {deletingId === workflow.id
                        ? "…"
                        : "⌫"}
                    </button>
                  </div>

                  <div className="relative mb-5">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                      />

                      {status.label}
                    </span>
                  </div>

                  <p className="relative mb-6 line-clamp-2 min-h-10 text-sm leading-5 text-[#777D70]">
                    {workflow.description ||
                      "No description added for this workflow."}
                  </p>

                  <div className="relative grid grid-cols-3 divide-x divide-[#F5D98B]/[0.06] border-t border-[#F5D98B]/[0.06] pt-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#5E635B]">
                        Steps
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#D9D7CE]">
                        {workflow.steps.length}
                      </p>
                    </div>

                    <div className="pl-4">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#5E635B]">
                        Runs
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#D9D7CE]">
                        {workflow.runs.toLocaleString()}
                      </p>
                    </div>

                    <div className="pl-4">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#5E635B]">
                        Success
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#D9D7CE]">
                        {workflow.successRate}%
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-5 flex items-center justify-between text-xs">
                    <span className="text-[#5E635B] transition group-hover:text-[#9A9D94]">
                      Open workflow
                    </span>

                    <span className="translate-x-0 text-[#6F746B] transition duration-200 group-hover:translate-x-1 group-hover:text-[#E7B84B]">
                      →
                    </span>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onMouseDown={() =>
              setShowCreateModal(false)
            }
          >
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#E7B84B]/15 bg-[#1B1F19] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/35 to-transparent" />

              <div className="border-b border-[#F5D98B]/[0.07] bg-[#20241D] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/15 bg-[#151713] px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#F5D98B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />

                      Workflow builder
                    </div>

                    <h2 className="text-xl font-semibold text-[#F4F0E6]">
                      Create a workflow
                    </h2>

                    <p className="mt-1 text-sm text-[#777D70]">
                      Start with a trigger. You can
                      configure the steps after creation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateModal(false)
                    }
                    className="rounded-lg px-2 py-1 text-lg text-[#6F746B] transition hover:bg-[#252A22] hover:text-[#F5D98B]"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleCreate}
                className="space-y-5 bg-[#1B1F19] p-6"
              >
                <div>
                  <label
                    htmlFor="workflow-name"
                    className="mb-2 block text-xs font-medium text-[#D9D7CE]"
                  >
                    Workflow name
                  </label>

                  <input
                    id="workflow-name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="e.g. New lead qualification"
                    maxLength={100}
                    autoFocus
                    className="h-12 w-full rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] px-4 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5E635B] focus:border-[#E7B84B]/35 focus:bg-[#20241D] focus:shadow-[0_0_25px_rgba(231,184,75,0.05)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="workflow-description"
                    className="mb-2 block text-xs font-medium text-[#D9D7CE]"
                  >
                    Description

                    <span className="ml-2 text-[#5E635B]">
                      optional
                    </span>
                  </label>

                  <textarea
                    id="workflow-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="What should this automation accomplish?"
                    maxLength={500}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] px-4 py-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#5E635B] focus:border-[#E7B84B]/35 focus:bg-[#20241D]"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-[#F5D98B]/[0.07] pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateModal(false)
                    }
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#9A9D94] transition hover:bg-[#252A22] hover:text-[#F4F0E6]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#E7B84B] px-5 py-2.5 text-sm font-bold text-[#171105] transition hover:bg-[#F0C85D] hover:shadow-[0_0_30px_rgba(231,184,75,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating
                      ? "Creating..."
                      : "Create workflow"}

                    {!creating && (
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ASK AI */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#E7B84B]/15 bg-[#20241D] p-6 shadow-[0_0_35px_rgba(231,184,75,0.04)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/25 to-transparent" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#E7B84B]/[0.025] blur-[100px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E7B84B]/20 bg-[#151713] text-xl text-[#F5D98B] shadow-[0_0_20px_rgba(231,184,75,0.06)]">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F5D98B]/[0.035] to-transparent" />

              <span className="relative">
                ✦
              </span>
            </div>

            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E7B84B]">
                ASK AI
              </p>

              <h3 className="mt-1 text-lg font-semibold text-[#F4F0E6]">
                Need help building a workflow?
              </h3>

              <p className="mt-1 max-w-xl text-sm leading-6 text-[#9A9D94]">
                Ask the AI assistant to create, improve,
                or explain your workflow steps.
              </p>
            </div>
          </div>

          <Link
            href="/conversations"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7B84B]/25 bg-[#151713] px-5 py-3 text-sm font-semibold text-[#F5D98B] transition-all duration-300 hover:border-[#E7B84B]/40 hover:bg-[#E7B84B] hover:text-[#171105] hover:shadow-[0_0_28px_rgba(231,184,75,0.2)]"
          >
            Open AI Assistant

            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}