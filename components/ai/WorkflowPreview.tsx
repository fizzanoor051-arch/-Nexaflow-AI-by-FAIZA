"use client";

import React, { useState } from "react";

interface WorkflowStep {
  id?: string;
  type?: string;
  name?: string;
  title?: string;
  description?: string;
  action?: string;
}

interface WorkflowData {
  name?: string;
  title?: string;
  description?: string;
  steps?: WorkflowStep[];
  status?: string;
}

interface WorkflowPreviewProps {
  workflow: unknown;
  onCreate?: (workflow: WorkflowData) => void;
}

function normalizeWorkflow(
  workflow: unknown
): WorkflowData {
  if (!workflow || typeof workflow !== "object") {
    return {
      name: "AI Generated Workflow",
      description:
        "A workflow generated from your business request.",
      steps: [],
    };
  }

  const data = workflow as Record<string, unknown>;

  const rawSteps = Array.isArray(data.steps)
    ? data.steps
    : [];

  const steps: WorkflowStep[] = rawSteps.map(
    (step, index) => {
      if (!step || typeof step !== "object") {
        return {
          id: String(index + 1),
          name: `Step ${index + 1}`,
          description: "Workflow action",
        };
      }

      const item = step as Record<string, unknown>;

      return {
        id: String(item.id || index + 1),
        type:
          typeof item.type === "string"
            ? item.type
            : undefined,
        name:
          typeof item.name === "string"
            ? item.name
            : typeof item.title === "string"
              ? item.title
              : `Step ${index + 1}`,
        title:
          typeof item.title === "string"
            ? item.title
            : undefined,
        description:
          typeof item.description === "string"
            ? item.description
            : typeof item.action === "string"
              ? item.action
              : "Workflow action",
        action:
          typeof item.action === "string"
            ? item.action
            : undefined,
      };
    }
  );

  return {
    name:
      typeof data.name === "string"
        ? data.name
        : typeof data.title === "string"
          ? data.title
          : "AI Generated Workflow",
    title:
      typeof data.title === "string"
        ? data.title
        : undefined,
    description:
      typeof data.description === "string"
        ? data.description
        : "A workflow generated from your request.",
    steps,
    status:
      typeof data.status === "string"
        ? data.status
        : "Draft",
  };
}

function StepIcon({
  type,
}: {
  type?: string;
}) {
  const normalized = type?.toLowerCase();

  if (
    normalized?.includes("email") ||
    normalized?.includes("message")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (
    normalized?.includes("lead") ||
    normalized?.includes("customer")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (
    normalized?.includes("ai") ||
    normalized?.includes("analy")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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

export default function WorkflowPreview({
  workflow,
  onCreate,
}: WorkflowPreviewProps) {
  const [expanded, setExpanded] = useState(true);
  const [created, setCreated] = useState(false);

  const normalizedWorkflow =
    normalizeWorkflow(workflow);

  const steps = normalizedWorkflow.steps || [];

  const handleCreate = () => {
    if (onCreate) {
      onCreate(normalizedWorkflow);
    }

    setCreated(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-400/10 bg-[#0a0f1f] shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 3v18" />
            <path d="M5 7h14" />
            <path d="M5 17h14" />
            <circle cx="5" cy="7" r="2" />
            <circle cx="19" cy="17" r="2" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white">
            {normalizedWorkflow.name}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-600">
            AI-generated workflow
          </p>
        </div>

        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-300">
          {created ? "Created" : normalizedWorkflow.status}
        </span>
      </div>

      {/* Description */}
      {normalizedWorkflow.description && (
        <div className="border-b border-white/[0.06] px-4 py-3">
          <p className="text-xs leading-5 text-slate-500">
            {normalizedWorkflow.description}
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mb-3 flex w-full items-center justify-between text-left"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            Workflow steps
          </span>

          <svg
            className={[
              "h-4 w-4 text-slate-600 transition-transform",
              expanded ? "rotate-180" : "",
            ].join(" ")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {expanded && (
          <div className="space-y-0">
            {steps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-5 text-center">
                <p className="text-xs text-slate-600">
                  No workflow steps were returned.
                </p>
              </div>
            ) : (
              steps.map((step, index) => (
                <div
                  key={step.id || index}
                  className="relative flex gap-3 pb-4 last:pb-0"
                >
                  {index < steps.length - 1 && (
                    <span className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-white/[0.07]" />
                  )}

                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#0d1424] text-slate-400">
                    <span className="h-4 w-4">
                      <StepIcon type={step.type} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-slate-300">
                        {step.name}
                      </p>

                      <span className="shrink-0 text-[9px] text-slate-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] leading-4 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-white/[0.015] px-4 py-3">
        <p className="text-[9px] text-slate-700">
          Review before execution
        </p>

        <button
          type="button"
          onClick={handleCreate}
          disabled={created}
          className="rounded-lg bg-violet-500 px-3 py-2 text-[10px] font-semibold text-white transition-all hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-50"
        >
          {created ? "Workflow created" : "Create workflow"}
        </button>
      </div>
    </div>
  );
}