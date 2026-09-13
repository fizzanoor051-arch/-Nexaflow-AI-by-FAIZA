import React from "react";
import Link from "next/link";

type ActivityType =
  | "workflow"
  | "lead"
  | "task"
  | "ai"
  | "system";

interface Activity {
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

const iconMap: Record<ActivityType, React.ReactNode> = {
  workflow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 4v16" />
      <path d="M18 4v16" />
      <path d="M6 7h12" />
      <path d="M6 17h12" />
      <circle cx="6" cy="4" r="2" />
      <circle cx="18" cy="20" r="2" />
    </svg>
  ),
  lead: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" />
    </svg>
  ),
};

const iconColors: Record<ActivityType, string> = {
  workflow: "bg-violet-500/10 text-violet-300",
  lead: "bg-sky-500/10 text-sky-300",
  task: "bg-amber-500/10 text-amber-300",
  ai: "bg-fuchsia-500/10 text-fuchsia-300",
  system: "bg-slate-500/10 text-slate-300",
};

export default function ActivityFeed({
  activities = defaultActivities,
  title = "Recent activity",
  viewAllHref = "/analytics",
}: ActivityFeedProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>
          <p className="mt-0.5 text-[10px] text-slate-600">
            Latest workspace events
          </p>
        </div>

        <Link
          href={viewAllHref}
          className="text-[11px] font-medium text-slate-500 transition-colors hover:text-white"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {activities.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-500">
              No activity yet.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="group flex gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]"
            >
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  iconColors[activity.type],
                ].join(" ")}
              >
                <span className="h-4 w-4">
                  {iconMap[activity.type]}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <p className="truncate text-xs font-medium text-slate-200">
                    {activity.title}
                  </p>

                  <span className="shrink-0 text-[10px] text-slate-600">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 truncate text-[11px] text-slate-500">
                  {activity.description}
                </p>

                {activity.status && (
                  <span className="mt-2 inline-flex rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-slate-500">
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}