"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  accent: string;
  iconBackground: string;
}

interface QuickActionsProps {
  onCreateWorkflow?: () => void;
  onAddLead?: () => void;
  onCreateTask?: () => void;
  onOpenAssistant?: () => void;
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6H14a4 4 0 0 1 4 4v5.5" />
      <path d="M15.5 18H10a4 4 0 0 1-4-4V8.5" />
    </svg>
  );
}

function LeadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.25" />
      <path d="M15 15.5a4.5 4.5 0 0 1 5 3.5" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8 8 1.5 1.5L12 7" />
      <path d="M13.5 9H17" />
      <path d="m8 14 1.5 1.5L12 13" />
      <path d="M13.5 15H17" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

export default function QuickActions({
  onCreateWorkflow,
  onAddLead,
  onCreateTask,
  onOpenAssistant,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "workflow",
      title: "New workflow",
      description: "Automate a repetitive process",
      href: "/workflows",
      onClick: onCreateWorkflow,
      icon: <WorkflowIcon />,
      accent:
        "group-hover:text-[#F5D98B]",
      iconBackground:
        "border-[#E7B84B]/20 bg-[#E7B84B]/[0.07] text-[#D9AE4A] group-hover:border-[#E7B84B]/35 group-hover:bg-[#E7B84B]/[0.12]",
    },
    {
      id: "lead",
      title: "Add lead",
      description: "Capture a new opportunity",
      href: "/leads",
      onClick: onAddLead,
      icon: <LeadIcon />,
      accent:
        "group-hover:text-[#F5D98B]",
      iconBackground:
        "border-[#F5D98B]/15 bg-[#F5D98B]/[0.055] text-[#D8C487] group-hover:border-[#F5D98B]/30 group-hover:bg-[#F5D98B]/[0.09]",
    },
    {
      id: "task",
      title: "Create task",
      description: "Track your next action",
      href: "/tasks",
      onClick: onCreateTask,
      icon: <TaskIcon />,
      accent:
        "group-hover:text-[#F5D98B]",
      iconBackground:
        "border-[#E7B84B]/15 bg-[#E7B84B]/[0.055] text-[#C9A64D] group-hover:border-[#E7B84B]/30 group-hover:bg-[#E7B84B]/[0.10]",
    },
    {
      id: "assistant",
      title: "Ask AI",
      description: "Get help from NexaFlow AI",
      onClick: onOpenAssistant,
      icon: <SparkIcon />,
      accent:
        "group-hover:text-[#F5D98B]",
      iconBackground:
        "border-[#F5D98B]/20 bg-[#F5D98B]/[0.065] text-[#E2C77D] group-hover:border-[#F5D98B]/35 group-hover:bg-[#F5D98B]/[0.11]",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.20)] backdrop-blur-xl">
      {/* Subtle dashboard atmosphere */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#E7B84B]/[0.035] blur-[70px]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/25 to-transparent" />

      {/* HEADER */}
      <div className="relative z-10 mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-[#F4F0E6]">
              Quick actions
            </h2>

            <span className="hidden rounded-full border border-[#F5D98B]/[0.08] bg-[#151713]/60 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#777D70] sm:inline-flex">
              Actions
            </span>
          </div>

          <p className="mt-1 text-[10px] font-medium tracking-wide text-[#8F9389]">
            Start something useful
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F5D98B]/[0.08] bg-[#151713]/70 text-[#777D70] shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#E7B84B]">
          <PlusIcon />
        </div>
      </div>

      {/* ACTION GRID */}
      <div className="relative z-10 grid gap-2.5 sm:grid-cols-2">
        {actions.map((action) => {
          const content = (
            <>
              {/* ICON */}
              <div
                className={[
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                  "transition-all duration-200 group-hover:scale-105",
                  action.iconBackground,
                ].join(" ")}
              >
                {/* Icon inner highlight */}
                <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.035] to-transparent" />

                <span className="relative z-10">
                  {action.icon}
                </span>
              </div>

              {/* TEXT */}
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "text-xs font-semibold text-[#D7D9D1] transition-colors duration-200",
                    action.accent,
                  ].join(" ")}
                >
                  {action.title}
                </p>

                <p className="mt-1 truncate text-[10px] leading-4 text-[#777D70]">
                  {action.description}
                </p>
              </div>

              {/* ARROW */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-3.5 w-3.5 shrink-0 text-[#555B50] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#E7B84B]"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </>
          );

          if (action.href) {
            return (
              <Link
                key={action.id}
                href={action.href}
                onClick={action.onClick}
                className="group relative flex min-h-[72px] items-center gap-3 overflow-hidden rounded-xl border border-[#F5D98B]/[0.065] bg-[#151713]/45 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E7B84B]/25 hover:bg-[#252A22]/85 hover:shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
              >
                {/* Hover light sweep */}
                <span className="pointer-events-none absolute inset-y-0 left-0 w-[2px] -translate-x-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

                {/* Top inner highlight */}
                <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.08] to-transparent" />

                {content}
              </Link>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className="group relative flex min-h-[72px] w-full items-center gap-3 overflow-hidden rounded-xl border border-[#F5D98B]/[0.065] bg-[#151713]/45 p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E7B84B]/25 hover:bg-[#252A22]/85 hover:shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
            >
              {/* Hover light sweep */}
              <span className="pointer-events-none absolute inset-y-0 left-0 w-[2px] -translate-x-full bg-[#E7B84B] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

              {/* Top inner highlight */}
              <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.08] to-transparent" />

              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}