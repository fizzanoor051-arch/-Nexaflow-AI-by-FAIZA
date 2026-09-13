
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-400">Operations</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Tasks</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage tasks created manually or automatically by AI workflows.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
        >
          + Create task
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-400">Total tasks</p>
          <p className="mt-2 text-2xl font-bold text-white">{tasks.length}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400">In progress</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {tasks.filter((task) => task.status === "in_progress").length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400">Completed</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {completed}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <h2 className="font-semibold text-white">Task queue</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your latest operational tasks.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-white/5"
              />
            ))
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No tasks found.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        task.status === "completed"
                          ? "bg-emerald-400"
                          : task.status === "in_progress"
                            ? "bg-violet-400"
                            : "bg-amber-400"
                      }`}
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {task.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-6 sm:pl-0">
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs capitalize text-slate-400">
                      {task.priority}
                    </span>

                    <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs capitalize text-violet-300">
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
