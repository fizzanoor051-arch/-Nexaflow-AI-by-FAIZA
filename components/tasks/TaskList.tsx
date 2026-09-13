
"use client";

import React, { useMemo, useState } from "react";
import TaskCard, { TaskData } from "./TaskCard";

interface TaskListProps {
  tasks: TaskData[];
  onComplete?: (task: TaskData) => void;
}

type Filter = "all" | "todo" | "in_progress" | "completed";

export default function TaskList({
  tasks,
  onComplete,
}: TaskListProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description
          ?.toLowerCase()
          .includes(normalizedQuery);

      const matchesFilter =
        filter === "all" ||
        (task.status || "todo").toLowerCase() ===
          filter;

      return matchesQuery && matchesFilter;
    });
  }, [tasks, filter, query]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#080d1b] p-1">
          {[
            ["all", "All"],
            ["todo", "To do"],
            ["in_progress", "In progress"],
            ["completed", "Completed"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setFilter(value as Filter)
              }
              className={[
                "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                filter === value
                  ? "bg-violet-500/10 text-violet-300"
                  : "text-slate-700 hover:text-slate-400",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-56">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search tasks..."
            className="h-8 w-full rounded-lg border border-white/[0.07] bg-[#080d1b] pl-9 pr-3 text-[10px] text-slate-300 outline-none placeholder:text-slate-700 focus:border-violet-400/20"
          />
        </div>
      </div>

      {/* Tasks */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#080d1b] px-5 py-12 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-slate-700">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="4" y="4" width="16" height="16" rx="3" />
              <path d="m8 12 2.5 2.5L16 9" />
            </svg>
          </div>

          <p className="mt-3 text-xs font-medium text-slate-600">
            No tasks found
          </p>

          <p className="mt-1 text-[10px] text-slate-700">
            Try changing your filter or search query.
          </p>
        </div>
      )}
    </div>
  );
}
