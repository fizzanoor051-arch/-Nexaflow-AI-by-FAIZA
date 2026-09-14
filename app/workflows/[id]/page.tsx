"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type {
  Workflow,
  WorkflowStatus,
  WorkflowStep,
  WorkflowStepType,
} from "@/types/workflow";

type ApiResponse = {
  success: boolean;
  workflow?: Workflow;
  error?: string;
};

const statusConfig = {
  draft: {
    label: "Draft",
    dot: "bg-[#8B9085]",
  },
  active: {
    label: "Active",
    dot: "bg-[#5ED6A0]",
  },
  paused: {
    label: "Paused",
    dot: "bg-[#E7B84B]",
  },
  archived: {
    label: "Archived",
    dot: "bg-[#62675E]",
  },
} satisfies Record<
  WorkflowStatus,
  {
    label: string;
    dot: string;
  }
>;

const stepTypeConfig = {
  trigger: {
    label: "Trigger",
    icon: "⚡",
    description: "Starts the workflow.",
  },
  ai: {
    label: "AI",
    icon: "✦",
    description: "Use AI to analyze or generate information.",
  },
  action: {
    label: "Action",
    icon: "→",
    description: "Perform an automated action.",
  },
  condition: {
    label: "Condition",
    icon: "◇",
    description: "Branch the workflow based on a condition.",
  },
  notification: {
    label: "Notification",
    icon: "◉",
    description: "Send a notification to a recipient.",
  },
  delay: {
    label: "Delay",
    icon: "◷",
    description: "Pause the workflow for a period of time.",
  },
} satisfies Record<
  WorkflowStepType,
  {
    label: string;
    icon: string;
    description: string;
  }
>;

function createStep(
  type: WorkflowStepType,
  order: number
): WorkflowStep {
  const config = stepTypeConfig[type];

  return {
    id: `step-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    title: `${config.label} step`,
    description: config.description,
    type,
    order,
  };
}

function normalizeSteps(steps: WorkflowStep[]) {
  return [...steps]
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({
      ...step,
      order: index,
    }));
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

export default function WorkflowDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const workflowId = params?.id;

  const [workflow, setWorkflow] =
    useState<Workflow | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<WorkflowStatus>("draft");

  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  const [selectedStepId, setSelectedStepId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  async function loadWorkflow() {
    if (!workflowId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/workflows/${workflowId}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data: ApiResponse = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.workflow
      ) {
        throw new Error(
          data.error || "Workflow not found."
        );
      }

      const loadedWorkflow = data.workflow;

      setWorkflow(loadedWorkflow);
      setName(loadedWorkflow.name);
      setDescription(
        loadedWorkflow.description ?? ""
      );
      setStatus(loadedWorkflow.status);

      const normalized = normalizeSteps(
        loadedWorkflow.steps
      );

      setSteps(normalized);
      setSelectedStepId(
        normalized[0]?.id ?? null
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load workflow."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkflow();
  }, [workflowId]);

  const selectedStep = useMemo(
    () =>
      steps.find(
        (step) => step.id === selectedStepId
      ) ?? null,
    [steps, selectedStepId]
  );

  function updateStep(
    stepId: string,
    updates: Partial<WorkflowStep>
  ) {
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId
          ? { ...step, ...updates }
          : step
      )
    );
  }

  function addStep(type: WorkflowStepType) {
    const newStep = createStep(
      type,
      steps.length
    );

    setSteps((current) =>
      normalizeSteps([
        ...current,
        newStep,
      ])
    );

    setSelectedStepId(newStep.id);
    setError("");
  }

  function deleteStep(stepId: string) {
    if (steps.length <= 1) {
      setError(
        "A workflow must contain at least one step."
      );
      return;
    }

    setSteps((current) => {
      const next = normalizeSteps(
        current.filter(
          (step) => step.id !== stepId
        )
      );

      setSelectedStepId(
        next[0]?.id ?? null
      );

      return next;
    });
  }

  function moveStep(
    stepId: string,
    direction: -1 | 1
  ) {
    setSteps((current) => {
      const sorted = normalizeSteps(current);

      const index = sorted.findIndex(
        (step) => step.id === stepId
      );

      const targetIndex =
        index + direction;

      if (
        index === -1 ||
        targetIndex < 0 ||
        targetIndex >= sorted.length
      ) {
        return sorted;
      }

      const next = [...sorted];

      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];

      return normalizeSteps(next);
    });
  }

  async function handleSave(
    event?: FormEvent
  ) {
    event?.preventDefault();

    if (!workflowId) return;

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    if (trimmedName.length < 2) {
      setError(
        "Workflow name must contain at least 2 characters."
      );
      return;
    }

    if (steps.length === 0) {
      setError(
        "A workflow must contain at least one step."
      );
      return;
    }

    const invalidStep = steps.find(
      (step) =>
        !step.title.trim() ||
        !step.description.trim()
    );

    if (invalidStep) {
      setError(
        "Every workflow step needs a title and description."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `/api/workflows/${workflowId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            description:
              trimmedDescription || undefined,
            status,
            steps: normalizeSteps(steps),
          }),
        }
      );

      const data: ApiResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.workflow
      ) {
        throw new Error(
          data.error ||
            "Unable to save workflow."
        );
      }

      setWorkflow(data.workflow);
      setName(data.workflow.name);
      setDescription(
        data.workflow.description ?? ""
      );
      setStatus(data.workflow.status);
      setSteps(
        normalizeSteps(
          data.workflow.steps
        )
      );

      setSuccessMessage(
        "Workflow saved successfully."
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save workflow."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!workflowId) return;

    const confirmed = window.confirm(
      "Delete this workflow permanently? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/workflows/${workflowId}`,
        {
          method: "DELETE",
        }
      );

      const data: ApiResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to delete workflow."
        );
      }

      router.push("/workflows");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete workflow."
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#151713] text-[#F4F0E6]">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#151713]">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5D642F]/[0.045] blur-[150px]" />
          <div className="absolute right-[-180px] top-[15%] h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.02] blur-[160px]" />
          <div className="absolute bottom-[-260px] left-[35%] h-[520px] w-[520px] rounded-full bg-[#252A22]/70 blur-[150px]" />

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
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="h-9 w-48 animate-pulse rounded-xl bg-[#F4F0E6]/[0.045]" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-[#F4F0E6]/[0.045]" />
          </div>

          <div className="mb-6 h-48 animate-pulse rounded-3xl border border-[#F5D98B]/[0.07] bg-[#20241D]/70" />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="h-[650px] animate-pulse rounded-3xl border border-[#F5D98B]/[0.07] bg-[#20241D]/70" />
            <div className="h-[550px] animate-pulse rounded-3xl border border-[#F5D98B]/[0.07] bg-[#20241D]/70" />
          </div>
        </div>
      </main>
    );
  }

  if (!workflow) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#151713] px-6 text-[#F4F0E6]">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#151713]">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5D642F]/[0.045] blur-[150px]" />
          <div className="absolute right-[-180px] top-[20%] h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.02] blur-[160px]" />
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#F5D98B]/[0.1] bg-[#20241D]/90 p-8 text-center shadow-[0_25px_90px_rgba(0,0,0,0.4)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E7B84B]/25 bg-[#E7B84B]/[0.07] text-2xl text-[#F5D98B] shadow-[0_0_35px_rgba(231,184,75,0.1)]">
            ◇
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B9922B]">
            Automation system
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#F4F0E6]">
            Workflow unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#9A9D94]">
            {error ||
              "This workflow could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/workflows")
            }
            className="mt-7 w-full rounded-xl bg-[#E7B84B] px-5 py-3 text-sm font-semibold text-[#151713] shadow-[0_0_25px_rgba(231,184,75,0.13)] transition hover:bg-[#F5D98B] hover:shadow-[0_0_35px_rgba(231,184,75,0.22)]"
          >
            Back to workflows
          </button>
        </div>
      </main>
    );
  }

  const currentStatus =
    statusConfig[status];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#151713] text-[#F4F0E6]">
      {/* Ambient workspace background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#151713]">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5D642F]/[0.045] blur-[150px]" />

        <div className="absolute right-[-180px] top-[12%] h-[540px] w-[540px] rounded-full bg-[#E7B84B]/[0.022] blur-[160px]" />

        <div className="absolute bottom-[-280px] left-[30%] h-[560px] w-[560px] rounded-full bg-[#252A22]/75 blur-[160px]" />

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

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Top navigation */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="group inline-flex items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/80 px-3.5 py-2.5 text-xs font-medium text-[#9A9D94] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F5D98B] hover:shadow-[0_0_22px_rgba(231,184,75,0.08)]"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">
                ⌂
              </span>
              Dashboard
            </button>

            <span className="px-1 text-[#555A51]">
              /
            </span>

            <button
              type="button"
              onClick={() =>
                router.push("/workflows")
              }
              className="group inline-flex items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/80 px-3.5 py-2.5 text-xs font-medium text-[#9A9D94] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F5D98B] hover:shadow-[0_0_22px_rgba(231,184,75,0.08)]"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">
                ←
              </span>
              Workflows
            </button>

            <span className="hidden px-1 text-[#555A51] sm:inline">
              /
            </span>

            <span className="hidden max-w-[220px] truncate font-mono text-[10px] uppercase tracking-wider text-[#686D63] sm:inline">
              {workflow.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {successMessage && (
              <span className="rounded-xl border border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.07] px-3 py-2 text-xs text-[#5ED6A0]">
                ✓ {successMessage}
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                void handleDelete()
              }
              disabled={deleting}
              className="rounded-xl border border-[#F4F0E6]/[0.08] bg-[#1B1F19]/70 px-4 py-2.5 text-xs font-medium text-[#777D70] transition hover:border-[#E87575]/30 hover:bg-[#E87575]/[0.07] hover:text-[#F0B0B0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

            <button
              type="button"
              onClick={() =>
                void handleSave()
              }
              disabled={saving}
              className="rounded-xl bg-[#E7B84B] px-5 py-2.5 text-xs font-bold text-[#151713] shadow-[0_0_25px_rgba(231,184,75,0.13)] transition hover:bg-[#F5D98B] hover:shadow-[0_0_35px_rgba(231,184,75,0.24)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="relative mb-6 flex items-start justify-between gap-4 overflow-hidden rounded-2xl border border-[#E87575]/20 bg-[#E87575]/[0.07] px-4 py-3.5 text-sm text-[#F0B0B0]">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-[#E87575]" />

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-[#F0B0B0] transition hover:text-[#F4F0E6]"
            >
              ×
            </button>
          </div>
        )}

        {/* Workflow header */}
        <section className="relative mb-7 overflow-hidden rounded-3xl border border-[#F5D98B]/[0.1] bg-[#20241D]/90 shadow-[0_25px_80px_rgba(0,0,0,0.22)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/40 to-transparent" />

          <div className="pointer-events-none absolute right-[-90px] top-[-110px] h-80 w-80 rounded-full bg-[#E7B84B]/[0.035] blur-[110px]" />

          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-72 bg-[#5D642F]/[0.04] blur-[70px]" />

          <div className="relative p-5 sm:p-7">
            <div className="relative flex flex-col gap-7 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/20 bg-[#E7B84B]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#F5D98B]">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                    />
                    {currentStatus.label}
                  </span>

                  <span className="rounded-full border border-[#F5D98B]/[0.07] bg-[#151713]/60 px-3 py-1.5 text-[11px] text-[#9A9D94]">
                    {steps.length}{" "}
                    {steps.length === 1
                      ? "step"
                      : "steps"}
                  </span>

                  <span className="max-w-full truncate rounded-full border border-[#F5D98B]/[0.06] bg-[#151713]/50 px-3 py-1.5 font-mono text-[10px] text-[#686D63] sm:max-w-[280px]">
                    ID: {workflow.id}
                  </span>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <span className="h-5 w-0.5 rounded-full bg-[#E7B84B]" />

                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#B9922B]">
                    Automation workspace
                  </p>
                </div>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  maxLength={100}
                  className="w-full max-w-4xl bg-transparent text-3xl font-bold tracking-[-0.035em] text-[#F4F0E6] outline-none placeholder:text-[#555A51] sm:text-4xl"
                  placeholder="Workflow name"
                />

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  maxLength={500}
                  rows={2}
                  placeholder="Add a description for this workflow..."
                  className="mt-3 w-full max-w-3xl resize-none bg-transparent text-sm leading-6 text-[#9A9D94] outline-none placeholder:text-[#555A51]"
                />

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-[#686D63]">
                  <span>
                    Last updated{" "}
                    {formatDate(
                      workflow.updatedAt
                    )}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#555A51]" />

                  <span>
                    Automation builder
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#555A51]" />

                  <span className="text-[#5ED6A0]">
                    System ready
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 xl:min-w-[390px]">
                <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.07] bg-[#151713]/75 p-4">
                  <div className="absolute left-0 top-0 h-px w-10 bg-[#E7B84B]/40" />

                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#686D63]">
                    Runs
                  </p>

                  <p className="mt-2 text-xl font-bold tracking-tight text-[#F4F0E6]">
                    {workflow.runs.toLocaleString()}
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.07] bg-[#151713]/75 p-4">
                  <div className="absolute left-0 top-0 h-px w-10 bg-[#F5D98B]/40" />

                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#686D63]">
                    Success
                  </p>

                  <p className="mt-2 text-xl font-bold tracking-tight text-[#F5D98B]">
                    {workflow.successRate}%
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.035] p-4">
                  <div className="absolute left-0 top-0 h-px w-12 bg-[#E7B84B]" />

                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#686D63]">
                    Status
                  </p>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target
                          .value as WorkflowStatus
                      )
                    }
                    className="mt-2 w-full bg-transparent text-xs font-bold text-[#F5D98B] outline-none"
                  >
                    <option
                      value="draft"
                      className="bg-[#1B1F19]"
                    >
                      Draft
                    </option>

                    <option
                      value="active"
                      className="bg-[#1B1F19]"
                    >
                      Active
                    </option>

                    <option
                      value="paused"
                      className="bg-[#1B1F19]"
                    >
                      Paused
                    </option>

                    <option
                      value="archived"
                      className="bg-[#1B1F19]"
                    >
                      Archived
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Builder */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* Steps */}
          <div className="relative overflow-hidden rounded-3xl border border-[#F5D98B]/[0.09] bg-[#20241D]/85 p-5 shadow-[0_25px_75px_rgba(0,0,0,0.2)] sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/35 to-transparent" />

            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-0.5 rounded-full bg-[#E7B84B]" />

                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#B9922B]">
                    Automation
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#F4F0E6]">
                  Workflow steps
                </h2>

                <p className="mt-1.5 text-sm text-[#777D70]">
                  Define the sequence your
                  automation should follow.
                </p>
              </div>

              <div className="rounded-lg border border-[#E7B84B]/15 bg-[#151713]/75 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#B9922B]">
                {steps.length}{" "}
                {steps.length === 1
                  ? "step"
                  : "steps"}
              </div>
            </div>

            <div className="relative">
              {steps.length > 1 && (
                <div className="absolute bottom-8 left-[23px] top-8 w-px bg-gradient-to-b from-[#E7B84B]/35 via-[#F5D98B]/[0.08] to-transparent" />
              )}

              <div className="space-y-3">
                {steps.map(
                  (step, index) => {
                    const config =
                      stepTypeConfig[
                        step.type
                      ];

                    const selected =
                      step.id ===
                      selectedStepId;

                    return (
                      <div
                        key={step.id}
                        className="relative flex gap-3"
                      >
                        {/* Step icon */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStepId(
                              step.id
                            )
                          }
                          className={`relative z-10 flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-2xl border text-sm transition duration-200 ${
                            selected
                              ? "border-[#E7B84B]/70 bg-[#E7B84B] text-[#151713] shadow-[0_0_28px_rgba(231,184,75,0.24)]"
                              : "border-[#F5D98B]/[0.08] bg-[#151713] text-[#777D70] hover:border-[#E7B84B]/35 hover:bg-[#E7B84B]/[0.07] hover:text-[#F5D98B] hover:shadow-[0_0_24px_rgba(231,184,75,0.1)]"
                          }`}
                          aria-label={`Select ${step.title}`}
                        >
                          {config.icon}
                        </button>

                        {/* Step card */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStepId(
                              step.id
                            )
                          }
                          className={`group relative min-w-0 flex-1 overflow-hidden rounded-2xl border p-4 text-left transition duration-200 ${
                            selected
                              ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.045] shadow-[0_0_30px_rgba(231,184,75,0.045)]"
                              : "border-[#F5D98B]/[0.06] bg-[#151713]/55 hover:border-[#E7B84B]/20 hover:bg-[#252A22]"
                          }`}
                        >
                          {selected && (
                            <span className="absolute bottom-0 left-0 top-0 w-0.5 bg-[#E7B84B]" />
                          )}

                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-sm font-semibold ${
                                    selected
                                      ? "text-[#F4F0E6]"
                                      : "text-[#D8D9D2]"
                                  }`}
                                >
                                  {step.title}
                                </span>

                                <span
                                  className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                                    selected
                                      ? "border-[#E7B84B]/20 bg-[#E7B84B]/[0.06] text-[#D9B64D]"
                                      : "border-[#F5D98B]/[0.07] bg-[#151713]/50 text-[#686D63]"
                                  }`}
                                >
                                  {config.label}
                                </span>
                              </div>

                              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#777D70]">
                                {step.description}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 font-mono text-[10px] ${
                                selected
                                  ? "text-[#B9922B]"
                                  : "text-[#555A51]"
                              }`}
                            >
                              {String(
                                index + 1
                              ).padStart(2, "0")}
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Add step */}
            <div className="mt-7 border-t border-[#F5D98B]/[0.07] pt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#9A9D94]">
                  Add step
                </p>

                <span className="font-mono text-[10px] uppercase tracking-wider text-[#555A51]">
                  Build your automation
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(
                  Object.keys(
                    stepTypeConfig
                  ) as WorkflowStepType[]
                ).map((type) => {
                  const config =
                    stepTypeConfig[type];

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        addStep(type)
                      }
                      className="group flex items-center gap-2.5 rounded-xl border border-[#F5D98B]/[0.07] bg-[#151713]/60 px-3 py-3 text-left transition hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/[0.045] hover:shadow-[0_0_22px_rgba(231,184,75,0.07)]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F5D98B]/[0.06] bg-[#20241D] text-xs text-[#777D70] transition group-hover:border-[#E7B84B]/20 group-hover:text-[#F5D98B]">
                        {config.icon}
                      </span>

                      <span className="text-xs font-semibold text-[#9A9D94] transition group-hover:text-[#F4F0E6]">
                        {config.label}
                      </span>

                      <span className="ml-auto text-[#555A51] transition group-hover:text-[#E7B84B]">
                        +
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Inspector */}
          <aside className="relative h-fit overflow-hidden rounded-3xl border border-[#F5D98B]/[0.09] bg-[#1B1F19]/95 p-5 shadow-[0_25px_75px_rgba(0,0,0,0.22)] lg:sticky lg:top-5 sm:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/40 to-transparent" />

            <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#E7B84B]/[0.025] blur-[100px]" />

            <div className="relative">
              {!selectedStep ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.05] text-xl text-[#B9922B]">
                    ◇
                  </div>

                  <h3 className="text-sm font-bold text-[#F4F0E6]">
                    Select a step
                  </h3>

                  <p className="mx-auto mt-2 max-w-[230px] text-xs leading-5 text-[#686D63]">
                    Select a workflow step to
                    edit its configuration.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9922B]">
                        Configuration
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-[#F4F0E6]">
                        {
                          stepTypeConfig[
                            selectedStep
                              .type
                          ].label
                        }
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteStep(
                          selectedStep.id
                        )
                      }
                      className="rounded-xl border border-transparent px-3 py-2 text-[11px] font-medium text-[#686D63] transition hover:border-[#E87575]/20 hover:bg-[#E87575]/[0.07] hover:text-[#F0B0B0]"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Type */}
                    <div>
                      <label
                        htmlFor="step-type"
                        className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#777D70]"
                      >
                        Step type
                      </label>

                      <select
                        id="step-type"
                        value={
                          selectedStep.type
                        }
                        onChange={(event) =>
                          updateStep(
                            selectedStep.id,
                            {
                              type: event
                                .target
                                .value as WorkflowStepType,
                            }
                          )
                        }
                        className="h-11 w-full rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] px-3 text-sm text-[#D8D9D2] outline-none transition focus:border-[#E7B84B]/40 focus:ring-1 focus:ring-[#E7B84B]/20"
                      >
                        {(
                          Object.keys(
                            stepTypeConfig
                          ) as WorkflowStepType[]
                        ).map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-[#1B1F19]"
                          >
                            {
                              stepTypeConfig[
                                type
                              ].label
                            }
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label
                        htmlFor="step-title"
                        className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#777D70]"
                      >
                        Title
                      </label>

                      <input
                        id="step-title"
                        value={
                          selectedStep.title
                        }
                        onChange={(event) =>
                          updateStep(
                            selectedStep.id,
                            {
                              title:
                                event.target
                                  .value,
                            }
                          )
                        }
                        maxLength={150}
                        className="h-11 w-full rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] px-3 text-sm text-[#F4F0E6] outline-none transition placeholder:text-[#555A51] focus:border-[#E7B84B]/40 focus:bg-[#E7B84B]/[0.025] focus:ring-1 focus:ring-[#E7B84B]/15"
                        placeholder="Step title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="step-description"
                        className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#777D70]"
                      >
                        Description
                      </label>

                      <textarea
                        id="step-description"
                        value={
                          selectedStep.description
                        }
                        onChange={(event) =>
                          updateStep(
                            selectedStep.id,
                            {
                              description:
                                event.target
                                  .value,
                            }
                          )
                        }
                        rows={5}
                        maxLength={500}
                        className="w-full resize-none rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713] px-3 py-3 text-sm leading-5 text-[#F4F0E6] outline-none transition placeholder:text-[#555A51] focus:border-[#E7B84B]/40 focus:bg-[#E7B84B]/[0.025] focus:ring-1 focus:ring-[#E7B84B]/15"
                        placeholder="Describe what this step does..."
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#777D70]">
                        Position
                      </p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={
                            selectedStep.order ===
                            0
                          }
                          onClick={() =>
                            moveStep(
                              selectedStep.id,
                              -1
                            )
                          }
                          className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713]/70 py-2.5 text-xs font-medium text-[#777D70] transition hover:border-[#E7B84B]/25 hover:bg-[#E7B84B]/[0.045] hover:text-[#F5D98B] hover:shadow-[0_0_20px_rgba(231,184,75,0.07)] disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <span className="transition-transform group-hover:-translate-y-0.5">
                            ↑
                          </span>
                          Move up
                        </button>

                        <button
                          type="button"
                          disabled={
                            selectedStep.order ===
                            steps.length - 1
                          }
                          onClick={() =>
                            moveStep(
                              selectedStep.id,
                              1
                            )
                          }
                          className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#151713]/70 py-2.5 text-xs font-medium text-[#777D70] transition hover:border-[#E7B84B]/25 hover:bg-[#E7B84B]/[0.045] hover:text-[#F5D98B] hover:shadow-[0_0_20px_rgba(231,184,75,0.07)] disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          Move down
                          <span className="transition-transform group-hover:translate-y-0.5">
                            ↓
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Type info */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#E7B84B]/10 bg-[#E7B84B]/[0.035] p-4">
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-[#E7B84B]/50" />

                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#151713] text-sm text-[#F5D98B]">
                          {
                            stepTypeConfig[
                              selectedStep
                                .type
                            ].icon
                          }
                        </span>

                        <div>
                          <p className="text-xs font-bold text-[#F5D98B]">
                            {
                              stepTypeConfig[
                                selectedStep
                                  .type
                              ].label
                            }
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#777D70]">
                            {
                              stepTypeConfig[
                                selectedStep
                                  .type
                              ].description
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Save */}
                    <button
                      type="button"
                      onClick={() =>
                        void handleSave()
                      }
                      disabled={saving}
                      className="group w-full rounded-xl bg-[#E7B84B] py-3.5 text-sm font-bold text-[#151713] shadow-[0_0_28px_rgba(231,184,75,0.13)] transition hover:bg-[#F5D98B] hover:shadow-[0_0_40px_rgba(231,184,75,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="inline-flex items-center gap-2">
                        {saving
                          ? "Saving..."
                          : "Save workflow"}

                        {!saving && (
                          <span className="transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </section>

        {/* ASK AI */}
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-[#E7B84B]/15 bg-[#20241D]/90 shadow-[0_20px_70px_rgba(0,0,0,0.16)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/45 to-transparent" />

          <div className="pointer-events-none absolute right-0 top-[-80px] h-52 w-52 rounded-full bg-[#E7B84B]/[0.055] blur-[90px]" />

          <div className="relative p-5 sm:p-6">
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E7B84B]/20 bg-[#151713] text-xl text-[#F5D98B] shadow-[0_0_25px_rgba(231,184,75,0.08)]">
                  <span className="absolute inset-0 rounded-2xl border border-[#E7B84B]/[0.08]" />
                  ✦
                </div>

                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9922B]">
                    NexaFlow AI
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#F4F0E6]">
                    Need help building this
                    workflow?
                  </h2>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-[#777D70]">
                    Ask AI to design steps,
                    improve your automation,
                    or suggest the best workflow
                    structure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/conversations"
                  )
                }
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E7B84B]/30 bg-[#E7B84B]/[0.07] px-5 py-3 text-xs font-bold text-[#F5D98B] transition hover:border-[#E7B84B]/60 hover:bg-[#E7B84B]/[0.13] hover:text-[#F5D98B] hover:shadow-[0_0_30px_rgba(231,184,75,0.15)]"
              >
                ASK AI
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-5 flex flex-col gap-3 border-t border-[#F5D98B]/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              router.push("/workflows")
            }
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#686D63] transition hover:text-[#F5D98B]"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to all workflows
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#686D63] transition hover:text-[#F5D98B]"
          >
            Dashboard
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}