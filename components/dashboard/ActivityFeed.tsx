"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type ActivityType =
  | "success"
  | "workflow"
  | "lead"
  | "ai"
  | "task"
  | "system";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  status?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "workflow",
    title: "Workflow completed",
    description: "Customer Support Automation",
    time: "2 min ago",
    status: "Completed",
  },
  {
    id: "2",
    type: "lead",
    title: "New lead captured",
    description: "Sarah from StyleHub",
    time: "18 min ago",
    status: "High priority",
  },
  {
    id: "3",
    type: "ai",
    title: "AI response generated",
    description: "Customer inquiry classified",
    time: "34 min ago",
  },
  {
    id: "4",
    type: "task",
    title: "Task created",
    description: "Follow up with new customer",
    time: "1 hr ago",
    status: "Pending",
  },
];

const activityIcons: Record<ActivityType, ReactNode> = {
  success: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),

  workflow: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M6 4v16" />
      <path d="M18 4v16" />
      <path d="M6 7h12" />
      <path d="M6 17h12" />
      <circle cx="6" cy="4" r="2" />
      <circle cx="18" cy="20" r="2" />
    </svg>
  ),

  lead: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  ),

  task: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  ),

  ai: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  ),

  system: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" />
    </svg>
  ),
};

const activityStyles: Record<
  ActivityType,
  {
    icon: string;
    dot: string;
    glow: string;
  }
> = {
  success: {
    icon: "border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.07] text-[#8AE6B9]",
    dot: "bg-[#5ED6A0]",
    glow: "group-hover:bg-[#5ED6A0]/20",
  },

  workflow: {
    icon: "border-[#E7B84B]/15 bg-[#E7B84B]/[0.07] text-[#F5D98B]",
    dot: "bg-[#E7B84B]",
    glow: "group-hover:bg-[#E7B84B]/20",
  },

  lead: {
    icon: "border-[#8EA8A0]/15 bg-[#8EA8A0]/[0.07] text-[#B7CCC4]",
    dot: "bg-[#8EA8A0]",
    glow: "group-hover:bg-[#8EA8A0]/20",
  },

  task: {
    icon: "border-[#E7B84B]/12 bg-[#E7B84B]/[0.05] text-[#DDBB68]",
    dot: "bg-[#DDBB68]",
    glow: "group-hover:bg-[#E7B84B]/15",
  },

  ai: {
    icon: "border-[#F5D98B]/15 bg-[#F5D98B]/[0.06] text-[#F5D98B]",
    dot: "bg-[#F5D98B]",
    glow: "group-hover:bg-[#F5D98B]/20",
  },

  system: {
    icon: "border-[#9A9D94]/15 bg-[#9A9D94]/[0.06] text-[#B7BAB1]",
    dot: "bg-[#9A9D94]",
    glow: "group-hover:bg-[#9A9D94]/15",
  },
};

function ActivityRow({ activity }: { activity: Activity }) {
  const style = activityStyles[activity.type];

  return (
    <div className="group relative flex gap-4 px-5 py-4 transition-all duration-300 hover:bg-[#252A22]/60 sm:px-6">
      {/* Active gold rail */}
      <div
        className={[
          "absolute bottom-0 left-0 top-0 w-px bg-transparent",
          "transition-all duration-300 group-hover:bg-[#E7B84B]/45",
        ].join(" ")}
      />

      {/* Soft row glow */}
      <div
        className={[
          "pointer-events-none absolute left-3 top-1/2 h-16 w-16 -translate-y-1/2",
          "rounded-full opacity-0 blur-2xl transition-opacity duration-300",
          style.glow,
          "group-hover:opacity-100",
        ].join(" ")}
      />

      {/* Icon */}
      <div
        className={[
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          "shadow-[inset_0_1px_0_rgba(245,217,139,0.04)]",
          "transition-all duration-300 group-hover:scale-105 group-hover:border-[#F5D98B]/20",
          style.icon,
        ].join(" ")}
      >
        {activityIcons[activity.type]}
      </div>

      {/* Content */}
      <div className="relative min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={[
                "h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_8px_currentColor]",
                style.dot,
              ].join(" ")}
            />

            <p className="truncate text-[13px] font-medium tracking-[-0.01em] text-[#F4F0E6] transition-colors duration-200 group-hover:text-white">
              {activity.title}
            </p>
          </div>

          <span className="shrink-0 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-[#777B71]">
            {activity.time}
          </span>
        </div>

        <p className="mt-1.5 truncate text-[11px] leading-5 text-[#9A9D94]">
          {activity.description}
        </p>

        {activity.status && (
          <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#F5D98B]/[0.07] bg-[#252A22] px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#9A9D94]">
            <span className="h-1 w-1 rounded-full bg-[#E7B84B]/70" />
            {activity.status}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ActivityFeed({
  activities = defaultActivities,
  title = "Recent activity",
  subtitle = "Latest workspace events",
  viewAllHref = "/analytics",
}: ActivityFeedProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      {/* Top champagne micro-line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F5D98B]/[0.06] px-5 py-[18px] sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_10px_rgba(94,214,160,0.55)]" />

            <h2 className="text-sm font-semibold tracking-tight text-[#F4F0E6]">
              {title}
            </h2>
          </div>

          <p className="mt-1.5 pl-3.5 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-[#777B71]">
            {subtitle}
          </p>
        </div>

        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 rounded-lg border border-[#F5D98B]/[0.07] bg-[#252A22] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#9A9D94] shadow-[inset_0_1px_0_rgba(245,217,139,0.04)] transition-all duration-300 hover:border-[#E7B84B]/20 hover:bg-[#E7B84B]/[0.06] hover:text-[#F5D98B]"
        >
          View all

          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      {/* Activity list */}
      <div className="divide-y divide-[#F5D98B]/[0.045]">
        {activities.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#F5D98B]/[0.07] bg-[#252A22] text-[#777B71] shadow-[inset_0_1px_0_rgba(245,217,139,0.04)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l2.5 2.5" />
              </svg>
            </div>

            <p className="text-sm font-medium text-[#B8BBB2]">
              No activity yet
            </p>

            <p className="mt-1 text-[10px] text-[#777B71]">
              Workspace events will appear here.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {/* Bottom status strip */}
      <div className="flex items-center justify-between border-t border-[#F5D98B]/[0.05] bg-[#1B1F19]/45 px-5 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.5)]" />
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#777B71]">
            Live activity stream
          </span>
        </div>

        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#5ED6A0]/70">
          Operational
        </span>
      </div>
    </section>
  );
}