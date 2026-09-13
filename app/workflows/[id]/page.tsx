
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";

interface WorkflowStep {
  id?: string;
  title: string;
  description?: string;
  type?: string;
  order?: number;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: string;
  steps?: WorkflowStep[];
}

export default function WorkflowDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/workflows/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkflow(data.workflow || null);
      })
      .catch(() => {
        setWorkflow(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <Card>
        <div className="py-16 text-center">
          <div className="text-4xl">⚠️</div>
          <h1 className="mt-4 text-xl font-semibold text-white">
            Workflow not found
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            The workflow you are looking for does not exist.
          </p>

          <Link
            href="/workflows"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Back to workflows
          </Link>
        </div>
      </Card>
    );
  }

  const steps = workflow.steps || [];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/workflows"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to workflows
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
                ⚡
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">
                  {workflow.name}
                </h1>
                <span className="text-xs capitalize text-emerald-400">
                  ● {workflow.status}
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              {workflow.description ||
                "AI-powered business automation workflow."}
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Run workflow
          </button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Workflow steps
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {steps.length} automation steps configured.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {steps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-sm text-slate-400">
                No steps have been added yet.
              </p>
            </div>
          ) : (
            steps.map((step, index) => (
              <div
                key={step.id || index}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 font-semibold text-violet-300">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {step.title}
                    </h3>

                    {step.type && (
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] capitalize text-slate-400">
                        {step.type}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {step.description || "Automation step."}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
