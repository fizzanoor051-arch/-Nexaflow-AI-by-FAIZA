"use client";

import { useMemo, useState } from "react";

type NodeType = "trigger" | "ai" | "condition" | "action";

type WorkflowNode = {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
};

const workflowNodes: WorkflowNode[] = [
  {
    id: "new-lead",
    type: "trigger",
    title: "NEW LEAD",
    subtitle: "Lead captured",
    icon: "✦",
    accent: "cyan",
  },
  {
    id: "ai-analyze",
    type: "ai",
    title: "AI ANALYZE",
    subtitle: "Understand lead intent",
    icon: "✧",
    accent: "violet",
  },
  {
    id: "qualify",
    type: "condition",
    title: "QUALIFY LEAD",
    subtitle: "Score > 70?",
    icon: "◇",
    accent: "amber",
  },
  {
    id: "sales",
    type: "action",
    title: "SALES",
    subtitle: "Route to sales",
    icon: "↗",
    accent: "emerald",
  },
  {
    id: "follow-up",
    type: "action",
    title: "FOLLOW-UP",
    subtitle: "Create follow-up task",
    icon: "✓",
    accent: "blue",
  },
  {
    id: "nurture",
    type: "action",
    title: "NURTURE",
    subtitle: "Add to nurture flow",
    icon: "◌",
    accent: "pink",
  },
  {
    id: "email",
    type: "action",
    title: "EMAIL",
    subtitle: "Send nurture email",
    icon: "✉",
    accent: "orange",
  },
];

function getNode(id: string) {
  return workflowNodes.find((node) => node.id === id);
}

function NodeCard({
  node,
  selected,
  onClick,
}: {
  node: WorkflowNode;
  selected: boolean;
  onClick: () => void;
}) {
  const accentClasses: Record<string, string> = {
    cyan: "border-cyan-400/40 bg-cyan-400/[0.07] shadow-cyan-500/10",
    violet:
      "border-violet-400/40 bg-violet-400/[0.07] shadow-violet-500/10",
    amber: "border-amber-400/40 bg-amber-400/[0.07] shadow-amber-500/10",
    emerald:
      "border-emerald-400/40 bg-emerald-400/[0.07] shadow-emerald-500/10",
    blue: "border-blue-400/40 bg-blue-400/[0.07] shadow-blue-500/10",
    pink: "border-pink-400/40 bg-pink-400/[0.07] shadow-pink-500/10",
    orange:
      "border-orange-400/40 bg-orange-400/[0.07] shadow-orange-500/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-[220px] rounded-2xl border p-4 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        accentClasses[node.accent]
      } ${
        selected
          ? "ring-2 ring-white/30 shadow-2xl"
          : "shadow-xl"
      }`}
    >
      <span className="absolute inset-x-5 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-lg text-white">
          {node.icon}
        </span>

        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-white/45">
            {node.type}
          </div>

          <div className="mt-1 truncate text-sm font-bold tracking-wide text-white">
            {node.title}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/45">
        {node.subtitle}
      </div>

      {node.type === "ai" && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
          <span className="text-[9px] font-semibold tracking-wider text-violet-200/70">
            AI
          </span>
        </div>
      )}
    </button>
  );
}

function Connector({
  label,
  direction = "down",
}: {
  label?: string;
  direction?: "down" | "right";
}) {
  if (direction === "right") {
    return (
      <div className="flex items-center px-3">
        <div className="relative h-px w-16 overflow-hidden bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[flow_2s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
        </div>

        <span className="ml-1 text-white/30">›</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-10 w-px overflow-hidden bg-white/10">
        <div className="absolute left-0 top-0 h-1/2 w-px animate-[flowVertical_2s_linear_infinite] bg-gradient-to-b from-transparent via-cyan-300 to-transparent" />
      </div>

      <span className="-mt-1 text-xs text-white/25">↓</span>

      {label && (
        <span className="mt-1 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/35">
          {label}
        </span>
      )}
    </div>
  );
}

export default function VisualWorkflowBuilder() {
  const [selectedId, setSelectedId] = useState("ai-analyze");
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [zoom, setZoom] = useState(100);

  const selectedNode = useMemo(
    () => getNode(selectedId),
    [selectedId]
  );

  async function runWorkflow() {
    if (isRunning) return;

    setIsRunning(true);
    setRunStatus("idle");

    try {
      const response = await fetch(
        "/api/workflows/workflow-2/run",
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Workflow execution failed."
        );
      }

      setRunStatus("success");

      window.dispatchEvent(
        new CustomEvent("nexaflow:workflow-run", {
          detail: {
            workflow: result.workflow,
            run: result.run,
          },
        })
      );
    } catch (error) {
      console.error("Workflow run error:", error);
      setRunStatus("error");
    } finally {
      window.setTimeout(() => {
        setIsRunning(false);
      }, 1200);
    }
  }

  function zoomIn() {
    setZoom((value) => Math.min(value + 10, 130));
  }

  function zoomOut() {
    setZoom((value) => Math.max(value - 10, 70));
  }

  function resetZoom() {
    setZoom(100);
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#06070d] shadow-2xl">
      <style jsx>{`
        @keyframes flow {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(220%);
          }
        }

        @keyframes flowVertical {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(220%);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300/80">
              Workflow Builder
            </span>
          </div>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
            Lead Qualification Automation
          </h2>

          <p className="mt-1 text-sm text-white/40">
            AI-powered lead routing and follow-up workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            −
          </button>

          <button
            type="button"
            onClick={resetZoom}
            className="h-9 min-w-14 rounded-xl border border-white/10 bg-white/[0.04] px-2 text-xs text-white/45 transition hover:bg-white/[0.08] hover:text-white"
          >
            {zoom}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            +
          </button>

          <button
            type="button"
            onClick={runWorkflow}
            disabled={isRunning}
            className={[
              "ml-1 rounded-xl border px-4 py-2 text-xs font-semibold transition",
              runStatus === "success"
                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                : runStatus === "error"
                  ? "border-red-300/25 bg-red-300/10 text-red-100"
                  : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15",
              "disabled:cursor-wait disabled:opacity-60",
            ].join(" ")}
          >
            {isRunning
              ? "Running..."
              : runStatus === "success"
                ? "✓ Workflow completed"
                : runStatus === "error"
                  ? "Run failed"
                  : "▶ Run workflow"}
          </button>
        </div>
      </div>

      {/* Builder area */}
      <div className="relative z-10 overflow-auto">
        <div
          className="mx-auto min-w-[760px] px-8 py-12 transition-transform duration-300"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Main vertical flow */}
          <div className="flex flex-col items-center">
            <NodeCard
              node={workflowNodes[0]}
              selected={selectedId === workflowNodes[0].id}
              onClick={() => setSelectedId(workflowNodes[0].id)}
            />

            <Connector />

            <NodeCard
              node={workflowNodes[1]}
              selected={selectedId === workflowNodes[1].id}
              onClick={() => setSelectedId(workflowNodes[1].id)}
            />

            <Connector />

            <NodeCard
              node={workflowNodes[2]}
              selected={selectedId === workflowNodes[2].id}
              onClick={() => setSelectedId(workflowNodes[2].id)}
            />

            {/* Branches */}
            <div className="relative mt-10 w-full">
              <div className="absolute left-1/2 top-0 h-px w-[48%] -translate-x-full bg-white/10" />
              <div className="absolute right-1/2 top-0 h-px w-[48%] translate-x-full bg-white/10" />

              <div className="grid grid-cols-2 gap-10">
                {/* YES */}
                <div className="flex flex-col items-end">
                  <span className="mb-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                    YES · Score &gt; 70
                  </span>

                  <div className="flex flex-col items-center">
                    <Connector />

                    <NodeCard
                      node={workflowNodes[3]}
                      selected={selectedId === workflowNodes[3].id}
                      onClick={() =>
                        setSelectedId(workflowNodes[3].id)
                      }
                    />

                    <Connector />

                    <NodeCard
                      node={workflowNodes[4]}
                      selected={selectedId === workflowNodes[4].id}
                      onClick={() =>
                        setSelectedId(workflowNodes[4].id)
                      }
                    />
                  </div>
                </div>

                {/* NO */}
                <div className="flex flex-col items-start">
                  <span className="mb-3 rounded-full border border-pink-400/20 bg-pink-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-pink-300">
                    NO · Score ≤ 70
                  </span>

                  <div className="flex flex-col items-center">
                    <Connector />

                    <NodeCard
                      node={workflowNodes[5]}
                      selected={selectedId === workflowNodes[5].id}
                      onClick={() =>
                        setSelectedId(workflowNodes[5].id)
                      }
                    />

                    <Connector />

                    <NodeCard
                      node={workflowNodes[6]}
                      selected={selectedId === workflowNodes[6].id}
                      onClick={() =>
                        setSelectedId(workflowNodes[6].id)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected node panel */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Selected node
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {selectedNode?.title}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/40">
                {selectedNode?.type}
              </span>
            </div>
          </div>

          <div className="text-xs text-white/35">
            Click any node to inspect it
          </div>
        </div>
      </div>
    </section>
  );
}