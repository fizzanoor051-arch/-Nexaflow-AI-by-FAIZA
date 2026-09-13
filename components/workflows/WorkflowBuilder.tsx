
"use client";

import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import WorkflowStep, {
  WorkflowStepData,
} from "./WorkflowStep";

interface WorkflowBuilderProps {
  initialName?: string;
  initialDescription?: string;
  initialSteps?: WorkflowStepData[];
  onSave?: (workflow: {
    name: string;
    description: string;
    steps: WorkflowStepData[];
  }) => void;
}

const defaultSteps: WorkflowStepData[] = [
  {
    id: "step-1",
    type: "AI Analysis",
    name: "Analyze incoming request",
    description:
      "AI identifies the customer intent and extracts relevant information.",
    status: "pending",
  },
  {
    id: "step-2",
    type: "Lead",
    name: "Create or update lead",
    description:
      "Save customer details and assign a priority based on the request.",
    status: "pending",
  },
  {
    id: "step-3",
    type: "Email",
    name: "Generate response",
    description:
      "Create a personalized response using the analyzed request.",
    status: "pending",
  },
];

const stepTypes = [
  {
    type: "AI Analysis",
    description: "Analyze, classify or generate content with AI.",
  },
  {
    type: "Lead",
    description: "Create, update or organize customer information.",
  },
  {
    type: "Email",
    description: "Send or prepare an automated email response.",
  },
  {
    type: "Task",
    description: "Create a task for a team member or workflow.",
  },
];

export default function WorkflowBuilder({
  initialName = "",
  initialDescription = "",
  initialSteps,
  onSave,
}: WorkflowBuilderProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] =
    useState(initialDescription);

  const [steps, setSteps] = useState<WorkflowStepData[]>(
    initialSteps && initialSteps.length > 0
      ? initialSteps
      : defaultSteps
  );

  const [showAddStep, setShowAddStep] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSave = useMemo(() => {
    return name.trim().length >= 2 && steps.length > 0;
  }, [name, steps.length]);

  const addStep = (type: string) => {
    const descriptions: Record<string, string> = {
      "AI Analysis":
        "Use AI to analyze or transform incoming information.",
      Lead: "Create or update a customer or lead record.",
      Email: "Prepare an automated email response.",
      Task: "Create a task for the appropriate team member.",
    };

    const newStep: WorkflowStepData = {
      id: `step-${Date.now()}`,
      type,
      name: `New ${type} step`,
      description:
        descriptions[type] ||
        "Configure this workflow action.",
      status: "pending",
    };

    setSteps((current) => [...current, newStep]);
    setShowAddStep(false);
    setSaved(false);
  };

  const removeStep = (id: string) => {
    setSteps((current) =>
      current.filter((step, index) => {
        const stepId = step.id || String(index);
        return stepId !== id;
      })
    );

    setSaved(false);
  };

  const handleSave = () => {
    if (!canSave) return;

    const workflow = {
      name: name.trim(),
      description: description.trim(),
      steps,
    };

    onSave?.(workflow);
    setSaved(true);
  };

  return (
    <div className="space-y-5">
      {/* Basic information */}
      <section className="rounded-2xl border border-white/[0.07] bg-[#080d1b] p-5">
        <div className="mb-5">
          <p className="text-sm font-semibold text-white">
            Workflow details
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Define what this automation does and how it should
            be presented.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Workflow name"
            placeholder="e.g. Customer inquiry automation"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
            hint="Use a clear name that describes the business outcome."
          />

          <div>
            <label
              htmlFor="workflow-description"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Description
            </label>

            <textarea
              id="workflow-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setSaved(false);
              }}
              placeholder="Describe what this workflow should automate..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.035] focus:ring-2 focus:ring-violet-400/10"
            />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="rounded-2xl border border-white/[0.07] bg-[#080d1b] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">
              Workflow steps
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Arrange the actions NexaFlow should perform.
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-slate-500">
            {steps.length}{" "}
            {steps.length === 1 ? "step" : "steps"}
          </span>
        </div>

        <div>
          {steps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.08] px-5 py-8 text-center">
              <p className="text-xs font-medium text-slate-500">
                No workflow steps yet
              </p>
              <p className="mt-1 text-[10px] text-slate-700">
                Add an action to start building your automation.
              </p>
            </div>
          ) : (
            steps.map((step, index) => (
              <WorkflowStep
                key={step.id || index}
                step={step}
                index={index}
                total={steps.length}
                editable
                onRemove={removeStep}
              />
            ))
          )}
        </div>

        {/* Add step */}
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => setShowAddStep((value) => !value)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400/15 bg-violet-500/[0.03] px-4 py-3 text-xs font-medium text-violet-300 transition-all hover:border-violet-400/25 hover:bg-violet-500/[0.06]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add workflow step
          </button>

          {showAddStep && (
            <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1120] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                Choose an action
              </p>

              <div className="grid gap-1 sm:grid-cols-2">
                {stepTypes.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addStep(item.type)}
                    className="rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <p className="text-xs font-medium text-slate-300">
                      {item.type}
                    </p>
                    <p className="mt-1 text-[9px] leading-4 text-slate-700">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-slate-700">
          {saved
            ? "Workflow saved successfully."
            : "Review your steps before saving."}
        </p>

        <Button
          variant="primary"
          size="md"
          disabled={!canSave}
          onClick={handleSave}
        >
          {saved ? "Workflow saved" : "Save workflow"}
        </Button>
      </div>
    </div>
  );
}
