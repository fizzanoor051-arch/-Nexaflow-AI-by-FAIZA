
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: string;
  steps?: unknown[];
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workflows")
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(data.workflows || []);
      })
      .catch(() => {
        setWorkflows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-400">Automation</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Workflows
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Build and manage AI-powered business automations.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          + Create workflow
        </button>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
              ⚡
            </div>
            <h2 className="text-lg font-semibold text-white">
              No workflows yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Create your first workflow to automate repetitive business
              operations with AI.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workflows.map((workflow) => (
            <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
              <Card
                variant="interactive"
                className="h-full transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
                    ⚡
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-400">
                    {workflow.status}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-semibold text-white">
                  {workflow.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                  {workflow.description ||
                    "AI-powered business automation workflow."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500">
                  <span>
                    {workflow.steps?.length ?? 0} automation steps
                  </span>
                  <span className="text-violet-400">Open →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
