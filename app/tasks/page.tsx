"use client";

import {
FormEvent,
useEffect,
useMemo,
useState,
} from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface Task {
id: string;
title: string;
description?: string;
status: string;
priority: string;
leadId?: string;
workflowId?: string;
dueDate?: string;
}

interface Lead {
id: string;
name: string;
company?: string;
}

interface Workflow {
id: string;
name: string;
}

type TaskForm = {
title: string;
description: string;
status: string;
priority: string;
};

const LOCAL_STORAGE_KEY = "nexaflow-local-tasks";

const EMPTY_FORM: TaskForm = {
title: "",
description: "",
status: "pending",
priority: "medium",
};

const STATUS_OPTIONS = [
"all",
"pending",
"in_progress",
"completed",
];

const PRIORITY_OPTIONS = [
"all",
"high",
"medium",
"low",
];

function formatStatus(status: string) {
return status
.replaceAll("_", " ")
.replace(/\b\w/g, (letter) =>
letter.toUpperCase()
);
}

function statusClasses(status: string) {
switch (status.toLowerCase()) {
case "completed":
return "border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.07] text-[#79E0B1]";


case "in_progress":
  return "border-[#E7B84B]/20 bg-[#E7B84B]/[0.07] text-[#F1CF75]";

case "pending":
  return "border-[#E7B84B]/20 bg-[#E7B84B]/[0.055] text-[#E7C65F]";

default:
  return "border-white/[0.08] bg-white/[0.03] text-[#A9ADA2]";


}
}

function priorityClasses(priority: string) {
switch (priority.toLowerCase()) {
case "high":
return "border-[#E87575]/20 bg-[#E87575]/[0.06] text-[#F09A9A]";


case "low":
  return "border-[#9A9D94]/15 bg-[#9A9D94]/[0.035] text-[#9A9D94]";

default:
  return "border-[#E7B84B]/20 bg-[#E7B84B]/[0.055] text-[#E7C65F]";


}
}

function statusDot(status: string) {
switch (status.toLowerCase()) {
case "completed":
return "bg-[#5ED6A0] shadow-[0_0_10px_rgba(94,214,160,0.8)]";


case "in_progress":
  return "bg-[#E7B84B] shadow-[0_0_10px_rgba(231,184,75,0.8)]";

default:
  return "bg-[#C8A23A] shadow-[0_0_9px_rgba(200,162,58,0.75)]";


}
}

export default function TasksPage() {
const [tasks, setTasks] = useState<Task[]>([]);
const [leads, setLeads] = useState<Lead[]>([]);
const [workflows, setWorkflows] = useState<Workflow[]>([]);

const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] =
useState(false);

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] =
useState("all");
const [priorityFilter, setPriorityFilter] =
useState("all");
const [sortBy, setSortBy] =
useState("newest");

const [modalOpen, setModalOpen] =
useState(false);

const [editingTask, setEditingTask] =
useState<Task | null>(null);

const [viewTask, setViewTask] =
useState<Task | null>(null);

const [deleteTaskId, setDeleteTaskId] =
useState<string | null>(null);

const [form, setForm] =
useState<TaskForm>(EMPTY_FORM);

const [error, setError] = useState("");
const [actionMessage, setActionMessage] =
useState("");

const [hydrated, setHydrated] =
useState(false);

const getLeadName = (leadId?: string) => {
if (!leadId) return null;


return (
  leads.find(
    (lead) => lead.id === leadId
  )?.name ?? null
);


};

const getWorkflowName = (
workflowId?: string
) => {
if (!workflowId) return null;


return (
  workflows.find(
    (workflow) =>
      workflow.id === workflowId
  )?.name ?? null
);


};

const loadTasks = async (
showRefresh = false
) => {
try {
if (showRefresh) {
setRefreshing(true);
} else {
setLoading(true);
}


  setError("");

  const [
    taskResponse,
    leadResponse,
    workflowResponse,
  ] = await Promise.all([
    fetch("/api/tasks", {
      cache: "no-store",
    }),
    fetch("/api/leads", {
      cache: "no-store",
    }),
    fetch("/api/workflows", {
      cache: "no-store",
    }),
  ]);

  if (!taskResponse.ok) {
    throw new Error(
      "Failed to load tasks"
    );
  }

  const taskData =
    await taskResponse.json();

  const leadData =
    leadResponse.ok
      ? await leadResponse.json()
      : null;

  const workflowData =
    workflowResponse.ok
      ? await workflowResponse.json()
      : null;

  const apiTasks: Task[] =
    Array.isArray(taskData.tasks)
      ? taskData.tasks
      : [];

  const apiLeads: Lead[] =
    Array.isArray(leadData?.leads)
      ? leadData.leads
      : [];

  const apiWorkflows: Workflow[] =
    Array.isArray(
      workflowData?.workflows
    )
      ? workflowData.workflows
      : [];

  setLeads(apiLeads);
  setWorkflows(apiWorkflows);

  let localTasks: Task[] = [];

  try {
    const saved =
      localStorage.getItem(
        LOCAL_STORAGE_KEY
      );

    if (saved) {
      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        localTasks = parsed;
      }
    }
  } catch {
    localTasks = [];
  }

  const merged = [
    ...localTasks,
  ];

  apiTasks.forEach(
    (apiTask) => {
      const exists =
        merged.some(
          (task) =>
            task.id === apiTask.id
        );

      if (!exists) {
        merged.push(apiTask);
      }
    }
  );

  setTasks(merged);
} catch {
  setError(
    "We couldn't load your tasks. Please try again."
  );
} finally {
  setLoading(false);
  setRefreshing(false);
  setHydrated(true);
}


};

useEffect(() => {
loadTasks();
}, []);

useEffect(() => {
if (!hydrated) return;


try {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(tasks)
  );
} catch {
  // Ignore storage errors.
}


}, [tasks, hydrated]);

useEffect(() => {
if (!actionMessage) return;


const timer =
  window.setTimeout(() => {
    setActionMessage("");
  }, 3000);

return () =>
  window.clearTimeout(timer);


}, [actionMessage]);

const filteredTasks = useMemo(() => {
const query = search
.trim()
.toLowerCase();


const result = tasks.filter(
  (task) => {
    const leadName =
      getLeadName(task.leadId) ??
      "";

    const workflowName =
      getWorkflowName(
        task.workflowId
      ) ?? "";

    const matchesSearch =
      !query ||
      task.title
        .toLowerCase()
        .includes(query) ||
      (task.description || "")
        .toLowerCase()
        .includes(query) ||
      task.status
        .toLowerCase()
        .includes(query) ||
      task.priority
        .toLowerCase()
        .includes(query) ||
      leadName
        .toLowerCase()
        .includes(query) ||
      workflowName
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority ===
        priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  }
);

return [...result].sort(
  (a, b) => {
    if (sortBy === "priority") {
      const rank: Record<
        string,
        number
      > = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return (
        (rank[a.priority] || 9) -
        (rank[b.priority] || 9)
      );
    }

    if (sortBy === "status") {
      return a.status.localeCompare(
        b.status
      );
    }

    if (sortBy === "title") {
      return a.title.localeCompare(
        b.title
      );
    }

    return b.id.localeCompare(
      a.id
    );
  }
);


}, [
tasks,
search,
statusFilter,
priorityFilter,
sortBy,
leads,
workflows,
]);

const completed = tasks.filter(
(task) =>
task.status === "completed"
).length;

const inProgress = tasks.filter(
(task) =>
task.status === "in_progress"
).length;

const pending = tasks.filter(
(task) =>
task.status === "pending"
).length;

const highPriority = tasks.filter(
(task) =>
task.priority === "high"
).length;

const completionRate =
tasks.length > 0
? Math.round(
(completed / tasks.length) *
100
)
: 0;

const openCreateModal = () => {
setEditingTask(null);
setForm(EMPTY_FORM);
setError("");
setModalOpen(true);
};

const openEditModal = (
task: Task
) => {
setEditingTask(task);


setForm({
  title: task.title,
  description:
    task.description || "",
  status: task.status,
  priority: task.priority,
});

setError("");
setViewTask(null);
setModalOpen(true);


};

const handleSubmit = (
event: FormEvent<HTMLFormElement>
) => {
event.preventDefault();


const title =
  form.title.trim();

const description =
  form.description.trim();

if (!title) {
  setError(
    "Task title is required."
  );
  return;
}

if (editingTask) {
  setTasks((current) =>
    current.map((task) =>
      task.id ===
      editingTask.id
        ? {
            ...task,
            title,
            description,
            status:
              form.status,
            priority:
              form.priority,
          }
        : task
    )
  );

  setActionMessage(
    "Task updated successfully."
  );
} else {
  const newTask: Task = {
    id: `local-${Date.now()}`,
    title,
    description,
    status: form.status,
    priority:
      form.priority,
  };

  setTasks((current) => [
    newTask,
    ...current,
  ]);

  setActionMessage(
    "Task created successfully."
  );
}

setModalOpen(false);
setEditingTask(null);
setForm(EMPTY_FORM);
setError("");


};

const handleDelete = () => {
if (!deleteTaskId) return;


setTasks((current) =>
  current.filter(
    (task) =>
      task.id !== deleteTaskId
  )
);

if (
  viewTask?.id ===
  deleteTaskId
) {
  setViewTask(null);
}

setDeleteTaskId(null);

setActionMessage(
  "Task deleted successfully."
);


};

const updateTaskStatus = (
taskId: string,
status: string
) => {
setTasks((current) =>
current.map((task) =>
task.id === taskId
? {
...task,
status,
}
: task
)
);


setViewTask((current) =>
  current?.id === taskId
    ? {
        ...current,
        status,
      }
    : current
);

setActionMessage(
  status === "completed"
    ? "Task marked as completed."
    : "Task status updated."
);


};

const handleExport = () => {
if (
filteredTasks.length === 0
) {
setActionMessage(
"There are no tasks to export."
);
return;
}


const headers = [
  "Title",
  "Description",
  "Status",
  "Priority",
  "Lead",
  "Workflow",
];

const rows =
  filteredTasks.map(
    (task) => [
      task.title,
      task.description || "",
      task.status,
      task.priority,
      getLeadName(task.leadId) ||
        "",
      getWorkflowName(
        task.workflowId
      ) || "",
    ]
  );

const csv = [
  headers,
  ...rows,
]
  .map((row) =>
    row
      .map(
        (value) =>
          `"${String(
            value
          ).replaceAll(
            '"',
            '""'
          )}"`
      )
      .join(",")
  )
  .join("\n");

const blob = new Blob(
  [csv],
  {
    type: "text/csv;charset=utf-8;",
  }
);

const url =
  URL.createObjectURL(blob);

const link =
  document.createElement("a");

link.href = url;
link.download =
  "nexaflow-tasks.csv";

document.body.appendChild(
  link
);
link.click();
link.remove();

URL.revokeObjectURL(url);

setActionMessage(
  "Tasks exported successfully."
);


};

const clearFilters = () => {
setSearch("");
setStatusFilter("all");
setPriorityFilter("all");
setSortBy("newest");
};

return ( <main className="relative min-h-screen overflow-hidden bg-[#151713] text-[#F4F0E6] selection:bg-[#E7B84B]/20 selection:text-[#F5D98B]"> <div className="pointer-events-none fixed inset-0 overflow-hidden"> <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(231,184,75,0.075),transparent_28%),radial-gradient(circle_at_90%_18%,rgba(126,138,108,0.055),transparent_30%),radial-gradient(circle_at_55%_100%,rgba(231,184,75,0.035),transparent_32%)]" />


    <div
      className="absolute inset-0 opacity-[0.22]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(231,184,75,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(231,184,75,0.035) 1px, transparent 1px)",
        backgroundSize:
          "72px 72px",
        maskImage:
          "linear-gradient(to bottom, black, transparent 92%)",
      }}
    />

    <div className="absolute left-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.035] blur-[150px]" />

    <div className="absolute right-[-180px] top-[28%] h-[480px] w-[480px] rounded-full bg-[#879079]/[0.025] blur-[150px]" />

    <div className="absolute bottom-[-240px] left-[38%] h-[500px] w-[500px] rounded-full bg-[#E7B84B]/[0.018] blur-[150px]" />

    <div className="absolute left-[16%] top-[30%] h-px w-[35%] bg-gradient-to-r from-transparent via-[#E7B84B]/10 to-transparent" />

    <div className="absolute right-[8%] top-[62%] h-px w-[28%] bg-gradient-to-r from-transparent via-[#E7B84B]/[0.07] to-transparent" />
  </div>

  <div className="relative mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8 xl:py-8">
    <header className="mb-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex shrink-0 flex-col gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9D3C4]/[0.09] bg-[#1B1F19]/80 px-3.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-all duration-300 hover:border-[#E7B84B]/35 hover:bg-[#E7B84B]/[0.055] hover:text-[#F5D98B]"
            >
              <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              <span className="hidden sm:inline">
                Dashboard
              </span>
            </Link>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.035] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_9px_rgba(231,184,75,0.75)]" />

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#CDA43B]">
                Operations
              </span>
            </div>
          </div>

          <div className="hidden h-[94px] w-px bg-gradient-to-b from-transparent via-[#E7B84B]/15 to-transparent sm:block" />

          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7B84B]/20 bg-[#E7B84B]/[0.055] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E0BA4D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.75)]" />
                Task Management
              </span>

              <span className="text-xs text-[#555A50]">
                /
              </span>

              <span className="font-mono text-xs font-medium text-[#777B72]">
                Operations Workspace
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[#F4F0E6] sm:text-4xl lg:text-[42px]">
                Tasks
              </h1>

              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.035] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#79D9A8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.7)]" />
                Live
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#9A9D94] sm:text-[15px]">
              Manage operational work
              created manually or
              automatically by your
              NexaFlow AI workflows.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-[#D9D3C4]/[0.08] bg-[#1B1F19]/80 px-3.5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#777B72] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.7)]" />
            Operations active
          </div>

          <button
            type="button"
            onClick={() =>
              loadTasks(true)
            }
            disabled={refreshing}
            title="Refresh tasks"
            className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9D3C4]/[0.09] bg-[#1B1F19]/80 px-3.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-all hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/[0.045] hover:text-[#F5D98B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={
                refreshing
                  ? "animate-spin text-[#E7B84B]"
                  : "text-[#9A9D94] transition-colors group-hover:text-[#E7B84B]"
              }
            >
              ↻
            </span>

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            title="Export tasks"
            className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9D3C4]/[0.09] bg-[#1B1F19]/80 px-3.5 text-sm font-medium text-[#9A9D94] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-all hover:border-[#E7B84B]/30 hover:bg-[#E7B84B]/[0.045] hover:text-[#F5D98B]"
          >
            <span className="text-[#9A9D94] transition-colors group-hover:text-[#E7B84B]">
              ↓
            </span>

            <span className="hidden sm:inline">
              Export
            </span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#E7B84B] px-4 text-sm font-bold text-[#15130C] shadow-[0_8px_25px_rgba(231,184,75,0.12)] transition-all hover:bg-[#F0C965] hover:shadow-[0_0_32px_rgba(231,184,75,0.2)] active:scale-[0.98]"
          >
            <span className="text-base">
              ＋
            </span>

            Create task
          </button>
        </div>
      </div>
    </header>

    {actionMessage && (
      <div className="fixed right-4 top-4 z-[160] sm:right-6 sm:top-6">
        <div className="flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-2xl border border-[#5ED6A0]/20 bg-[#151A16]/95 px-4 py-3 text-xs font-medium text-[#79D9A8] shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.07]">
            ✓
          </span>

          {actionMessage}
        </div>
      </div>
    )}

    {error && (
      <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-[#E87575]/15 bg-[#E87575]/[0.045] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E87575]/15 bg-[#E87575]/[0.07] text-[#F09A9A]">
            !
          </span>

          <p className="text-sm text-[#F09A9A]">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setError("")
          }
          className="text-xs font-medium text-[#C87979] transition hover:text-[#F09A9A]"
        >
          Dismiss
        </button>
      </div>
    )}

    <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {[
        {
          label: "Total tasks",
          value: tasks.length,
          icon: "◎",
          note: "All operational work",
        },
        {
          label: "Pending",
          value: pending,
          icon: "◷",
          note: "Waiting to start",
        },
        {
          label: "In progress",
          value: inProgress,
          icon: "◌",
          note: "Currently active",
        },
        {
          label: "Completed",
          value: completed,
          icon: "✓",
          note: "Successfully finished",
        },
        {
          label: "Completion",
          value: `${completionRate}%`,
          icon: "↗",
          note: `${highPriority} high priority`,
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-[#D9D3C4]/[0.075] bg-[#1B1F19]/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E7B84B]/20 hover:bg-[#20241D]"
        >
          <div className="absolute right-[-25px] top-[-25px] h-28 w-28 rounded-full bg-[#E7B84B]/[0.025] blur-3xl transition-all duration-500 group-hover:bg-[#E7B84B]/[0.055]" />

          <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/[0.08] to-transparent" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858980]">
                {stat.label}
              </p>

              <p className="mt-2 text-[28px] font-semibold tracking-[-0.035em] text-[#F4F0E6]">
                {stat.value}
              </p>

              <p className="mt-1.5 text-xs text-[#676C63]">
                {stat.note}
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.045] text-sm text-[#E7B84B] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              {stat.icon}
            </span>
          </div>
        </div>
      ))}
    </section>

    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#D9D3C4]/[0.075] bg-[#1B1F19]/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(231,184,75,0.045),transparent_28%)]" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.7)]" />

            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#858980]">
              Execution progress
            </p>
          </div>

          <h2 className="mt-1.5 text-base font-semibold text-[#F4F0E6]">
            Overall task completion
          </h2>
        </div>

        <span className="font-mono text-2xl font-semibold tracking-tight text-[#F5D98B]">
          {completionRate}%
        </span>
      </div>

      <div className="relative mt-5 h-2 overflow-hidden rounded-full border border-white/[0.035] bg-[#0E100D]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#9E7920] via-[#E7B84B] to-[#F5D98B] shadow-[0_0_14px_rgba(231,184,75,0.28)] transition-all duration-700"
          style={{
            width: `${completionRate}%`,
          }}
        />
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.06em] text-[#666B62]">
        <span>
          <span className="text-[#AEB2A7]">
            {pending}
          </span>{" "}
          pending
        </span>

        <span>
          <span className="text-[#AEB2A7]">
            {inProgress}
          </span>{" "}
          in progress
        </span>

        <span>
          <span className="text-[#79D9A8]">
            {completed}
          </span>{" "}
          completed
        </span>

        <span className="hidden sm:inline">
          <span className="text-[#F5D98B]">
            {tasks.length}
          </span>{" "}
          total
        </span>
      </div>
    </div>

    <Card className="overflow-hidden border-[#D9D3C4]/[0.075] bg-[#1B1F19]/95 p-0 shadow-[0_28px_90px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.025)]">
      <div className="border-b border-[#D9D3C4]/[0.065] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_9px_rgba(231,184,75,0.8)]" />

              <h2 className="text-[15px] font-semibold tracking-tight text-[#F4F0E6] sm:text-base">
                Task queue
              </h2>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.018] px-2 py-0.5 font-mono text-[10px] font-medium text-[#777B72]">
                {filteredTasks.length}
              </span>
            </div>

            <p className="mt-1.5 text-xs leading-5 text-[#6F746B]">
              Review, prioritize,
              and execute operational
              work from one workspace.
            </p>
          </div>

          <div className="relative w-full xl:max-w-sm">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#686D64]">
              ⌕
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search tasks, leads, workflows..."
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0F110E]/80 pl-9 pr-9 text-sm text-[#F4F0E6] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] placeholder:text-[#565B53] transition-all focus:border-[#E7B84B]/30 focus:bg-[#151813] focus:shadow-[0_0_0_3px_rgba(231,184,75,0.035)]"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#686D64] transition hover:text-[#F4F0E6]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="h-10 min-w-[130px] rounded-xl border border-white/[0.08] bg-[#11130F] px-3 text-xs font-medium text-[#9A9D94] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition hover:border-[#E7B84B]/22 hover:text-[#B9BDB3] focus:border-[#E7B84B]/30 focus:ring-1 focus:ring-[#E7B84B]/10"
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status ===
                    "all"
                      ? "All statuses"
                      : formatStatus(
                          status
                        )}
                  </option>
                )
              )}
            </select>

            <select
              value={
                priorityFilter
              }
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
              className="h-10 min-w-[130px] rounded-xl border border-white/[0.08] bg-[#11130F] px-3 text-xs font-medium text-[#9A9D94] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition hover:border-[#E7B84B]/22 hover:text-[#B9BDB3] focus:border-[#E7B84B]/30 focus:ring-1 focus:ring-[#E7B84B]/10"
            >
              {PRIORITY_OPTIONS.map(
                (priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority ===
                    "all"
                      ? "All priorities"
                      : formatStatus(
                          priority
                        )}
                  </option>
                )
              )}
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
              className="h-10 min-w-[125px] rounded-xl border border-white/[0.08] bg-[#11130F] px-3 text-xs font-medium text-[#9A9D94] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition hover:border-[#E7B84B]/22 hover:text-[#B9BDB3] focus:border-[#E7B84B]/30 focus:ring-1 focus:ring-[#E7B84B]/10"
            >
              <option value="newest">
                Sort: Newest
              </option>

              <option value="priority">
                Sort: Priority
              </option>

              <option value="status">
                Sort: Status
              </option>

              <option value="title">
                Sort: Title
              </option>
            </select>

            {(search ||
              statusFilter !==
                "all" ||
              priorityFilter !==
                "all") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-10 rounded-xl border border-transparent px-3 text-xs font-medium text-[#686D64] transition hover:border-[#E7B84B]/10 hover:bg-[#E7B84B]/[0.035] hover:text-[#E0BA4D]"
              >
                Clear filters
              </button>
            )}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.07em] text-[#62675F]">
            Showing{" "}
            <span className="font-semibold text-[#AEB2A7]">
              {
                filteredTasks.length
              }
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#AEB2A7]">
              {tasks.length}
            </span>{" "}
            tasks
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="space-y-3">
            {[
              1, 2, 3, 4, 5,
            ].map((item) => (
              <div
                key={item}
                className="relative h-[104px] overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.018]"
              >
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.025] to-transparent" />
              </div>
            ))}
          </div>
        ) : filteredTasks.length ===
          0 ? (
          <div className="flex min-h-[370px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07] bg-[#11130F]/40 px-5 py-12 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.04] text-2xl text-[#E7B84B] shadow-[0_0_35px_rgba(231,184,75,0.05)]">
              <span className="absolute inset-2 rounded-xl border border-[#E7B84B]/[0.06]" />
              ✓
            </div>

            <h3 className="mt-5 text-base font-semibold text-[#F4F0E6]">
              {tasks.length ===
              0
                ? "Your task queue is empty"
                : "No tasks match your filters"}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#6F746B]">
              {tasks.length ===
              0
                ? "Create your first task and start managing operational work from NexaFlow."
                : "Try changing your search or filters to find the tasks you need."}
            </p>

            {tasks.length ===
            0 ? (
              <button
                type="button"
                onClick={
                  openCreateModal
                }
                className="mt-5 rounded-xl bg-[#E7B84B] px-4 py-2.5 text-sm font-bold text-[#15130C] shadow-[0_8px_25px_rgba(231,184,75,0.1)] transition hover:bg-[#F0C965] hover:shadow-[0_0_28px_rgba(231,184,75,0.18)]"
              >
                ＋ Create your
                first task
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-[#858980] transition hover:border-[#E7B84B]/25 hover:bg-[#E7B84B]/[0.035] hover:text-[#E0BA4D]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(
              (task) => {
                const leadName =
                  getLeadName(
                    task.leadId
                  );

                const workflowName =
                  getWorkflowName(
                    task.workflowId
                  );

                return (
                  <div
                    key={task.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#D9D3C4]/[0.065] bg-[#20241D]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] transition-all duration-300 hover:-translate-y-[1px] hover:border-[#E7B84B]/18 hover:bg-[#20241D] hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-5"
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#E7B84B]/0 to-transparent transition-all duration-300 group-hover:via-[#E7B84B]/65" />

                    <div className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/0 to-transparent transition-all duration-300 group-hover:via-[#E7B84B]/12" />

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setViewTask(
                            task
                          )
                        }
                        className="flex min-w-0 flex-1 items-start gap-4 text-left"
                      >
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.065] bg-[#11130F] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${statusDot(
                              task.status
                            )}`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`truncate text-sm font-semibold sm:text-[15px] ${
                                task.status ===
                                "completed"
                                  ? "text-[#777B72] line-through decoration-[#4D514A]"
                                  : "text-[#F4F0E6]"
                              }`}
                            >
                              {
                                task.title
                              }
                            </h3>

                            {task.status ===
                              "completed" && (
                              <span className="rounded-full border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.045] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#79D9A8]">
                                Done
                              </span>
                            )}
                          </div>

                          <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm leading-6 text-[#747970]">
                            {task.description ||
                              "No description provided for this task."}
                          </p>

                          {(leadName ||
                            workflowName) && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {leadName && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.035] px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-[#79D9A8]">
                                  <span className="text-[11px]">
                                    ◉
                                  </span>
                                  Lead:{" "}
                                  <span className="normal-case tracking-normal text-[#B5DCC6]">
                                    {leadName}
                                  </span>
                                </span>
                              )}

                              {workflowName && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7B84B]/15 bg-[#E7B84B]/[0.035] px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-[#CDA43A]">
                                  <span className="text-[11px]">
                                    ◈
                                  </span>
                                  Workflow:{" "}
                                  <span className="normal-case tracking-normal text-[#E5C976]">
                                    {workflowName}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.09em] text-[#52574F]">
                            <span>
                              TASK
                            </span>

                            <span className="text-[#393D37]">
                              /
                            </span>

                            <span>
                              {task.id.slice(
                                0,
                                16
                              )}
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex flex-wrap items-center gap-2 pl-14 xl:justify-end xl:pl-0">
                        <span
                          className={`rounded-full border px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] ${priorityClasses(
                            task.priority
                          )}`}
                        >
                          {
                            task.priority
                          }{" "}
                          priority
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${statusClasses(
                            task.status
                          )}`}
                        >
                          {formatStatus(
                            task.status
                          )}
                        </span>

                        <button
                          type="button"
                          title="Mark complete"
                          onClick={() =>
                            updateTaskStatus(
                              task.id,
                              task.status ===
                                "completed"
                                ? "pending"
                                : "completed"
                            )
                          }
                          className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.065] bg-[#11130F]/60 px-3 text-xs font-medium text-[#747970] transition hover:border-[#5ED6A0]/20 hover:bg-[#5ED6A0]/[0.045] hover:text-[#79D9A8]"
                        >
                          {task.status ===
                          "completed"
                            ? "↶ Reopen"
                            : "✓ Complete"}
                        </button>

                        <button
                          type="button"
                          title="Edit task"
                          onClick={() =>
                            openEditModal(
                              task
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.065] bg-[#11130F]/60 text-[#686D64] transition hover:border-[#E7B84B]/20 hover:bg-[#E7B84B]/[0.045] hover:text-[#E0BA4D]"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          title="Delete task"
                          onClick={() =>
                            setDeleteTaskId(
                              task.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.065] bg-[#11130F]/60 text-[#5D625A] transition hover:border-[#E87575]/20 hover:bg-[#E87575]/[0.045] hover:text-[#E87575]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </Card>

    <div className="mt-5 flex flex-col items-center justify-between gap-2 px-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#50554D] sm:flex-row">
      <span className="font-medium">
        NexaFlow AI · Operations
      </span>

      <div className="flex items-center gap-3">
        <span>
          Tasks
        </span>

        <span className="text-[#343832]">
          •
        </span>

        <span>
          Workflows
        </span>

        <span className="text-[#343832]">
          •
        </span>

        <span>
          Automation
        </span>
      </div>
    </div>
  </div>

  {modalOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto overflow-hidden rounded-3xl border border-[#D9D3C4]/[0.1] bg-[#181B16] shadow-[0_35px_120px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,255,255,0.025)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(231,184,75,0.055),transparent_32%)]" />

        <div className="relative flex items-start justify-between border-b border-[#D9D3C4]/[0.065] p-5 sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_9px_rgba(231,184,75,0.8)]" />

              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#CDA43A]">
                Operations
              </p>
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#F4F0E6]">
              {editingTask
                ? "Edit task"
                : "Create new task"}
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-[#747970]">
              {editingTask
                ? "Update task details and execution status."
                : "Create a structured task for your operational workflow."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalOpen(
                false
              );
              setError("");
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[#686D64] transition hover:border-[#E87575]/20 hover:bg-[#E87575]/[0.05] hover:text-[#E87575]"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative space-y-4 p-5 sm:p-6"
        >
          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858980]">
              Task title *
            </label>

            <input
              value={form.title}
              onChange={(event) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    title:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="e.g. Follow up with qualified lead"
              autoFocus
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0F110E] px-3.5 text-sm text-[#F4F0E6] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] placeholder:text-[#555A52] transition focus:border-[#E7B84B]/30 focus:bg-[#151813] focus:ring-1 focus:ring-[#E7B84B]/10"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858980]">
              Description
            </label>

            <textarea
              value={
                form.description
              }
              onChange={(event) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    description:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="Describe what needs to be done..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0F110E] px-3.5 py-3 text-sm leading-6 text-[#F4F0E6] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] placeholder:text-[#555A52] transition focus:border-[#E7B84B]/30 focus:bg-[#151813] focus:ring-1 focus:ring-[#E7B84B]/10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858980]">
                Status
              </label>

              <select
                value={
                  form.status
                }
                onChange={(event) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      status:
                        event.target
                          .value,
                    })
                  )
                }
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0F110E] px-3.5 text-sm text-[#F4F0E6] outline-none transition focus:border-[#E7B84B]/30 focus:ring-1 focus:ring-[#E7B84B]/10"
              >
                {STATUS_OPTIONS.filter(
                  (status) =>
                    status !==
                    "all"
                ).map(
                  (status) => (
                    <option
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {formatStatus(
                        status
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858980]">
                Priority
              </label>

              <select
                value={
                  form.priority
                }
                onChange={(event) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      priority:
                        event.target
                          .value,
                    })
                  )
                }
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0F110E] px-3.5 text-sm text-[#F4F0E6] outline-none transition focus:border-[#E7B84B]/30 focus:ring-1 focus:ring-[#E7B84B]/10"
              >
                {PRIORITY_OPTIONS.filter(
                  (priority) =>
                    priority !==
                    "all"
                ).map(
                  (priority) => (
                    <option
                      key={
                        priority
                      }
                      value={
                        priority
                      }
                    >
                      {formatStatus(
                        priority
                      )}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-[#E87575]/15 bg-[#E87575]/[0.05] px-3 py-2.5 text-sm text-[#F09A9A]">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.065] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setModalOpen(
                  false
                );
                setError("");
              }}
              className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm font-medium text-[#777B72] transition hover:bg-white/[0.04] hover:text-[#F4F0E6]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 rounded-xl bg-[#E7B84B] px-5 text-sm font-bold text-[#15130C] transition hover:bg-[#F0C965] hover:shadow-[0_0_28px_rgba(231,184,75,0.18)]"
            >
              {editingTask
                ? "Save changes"
                : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {viewTask && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto overflow-hidden rounded-3xl border border-[#D9D3C4]/[0.1] bg-[#181B16] shadow-[0_35px_120px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,255,255,0.025)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(231,184,75,0.05),transparent_34%)]" />

        <div className="relative border-b border-[#D9D3C4]/[0.065] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.045]">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusDot(
                    viewTask.status
                  )}`}
                />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-xl font-semibold tracking-tight text-[#F4F0E6]">
                  {
                    viewTask.title
                  }
                </h2>

                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#62675F]">
                  Task details
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setViewTask(
                  null
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[#686D64] transition hover:border-[#E87575]/20 hover:bg-[#E87575]/[0.05] hover:text-[#E87575]"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative space-y-4 p-5 sm:p-6">
          <div className="rounded-2xl border border-white/[0.065] bg-[#11130F]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#62675F]">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-[#B0B4AA]">
              {viewTask.description ||
                "No description provided for this task."}
            </p>
          </div>

          {(getLeadName(
            viewTask.leadId
          ) ||
            getWorkflowName(
              viewTask.workflowId
            )) && (
            <div className="rounded-2xl border border-[#E7B84B]/10 bg-[#11130F]/60 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#62675F]">
                Automation context
              </p>

              <div className="mt-3 space-y-2">
                {getLeadName(
                  viewTask.leadId
                ) && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#5ED6A0]/10 bg-[#5ED6A0]/[0.025] px-3 py-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#62675F]">
                      Lead
                    </span>

                    <span className="text-sm font-medium text-[#B5DCC6]">
                      {getLeadName(
                        viewTask.leadId
                      )}
                    </span>
                  </div>
                )}

                {getWorkflowName(
                  viewTask.workflowId
                ) && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E7B84B]/10 bg-[#E7B84B]/[0.025] px-3 py-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#62675F]">
                      Workflow
                    </span>

                    <span className="text-right text-sm font-medium text-[#E5C976]">
                      {getWorkflowName(
                        viewTask.workflowId
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.065] bg-[#11130F]/60 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#62675F]">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${statusClasses(
                  viewTask.status
                )}`}
              >
                {formatStatus(
                  viewTask.status
                )}
              </span>
            </div>

            <div className="rounded-2xl border border-white/[0.065] bg-[#11130F]/60 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#62675F]">
                Priority
              </p>

              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${priorityClasses(
                  viewTask.priority
                )}`}
              >
                {formatStatus(
                  viewTask.priority
                )}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.065] bg-[#11130F]/60 p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#62675F]">
              Update status
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                "pending",
                "in_progress",
                "completed",
              ].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      updateTaskStatus(
                        viewTask.id,
                        status
                      )
                    }
                    className={`rounded-lg border px-2 py-2.5 text-[10px] font-medium transition ${
                      viewTask.status ===
                      status
                        ? "border-[#E7B84B]/30 bg-[#E7B84B]/[0.08] text-[#E0BA4D]"
                        : "border-white/[0.06] bg-white/[0.018] text-[#686D64] hover:border-white/[0.12] hover:text-[#AEB2A7]"
                    }`}
                  >
                    {formatStatus(
                      status
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                openEditModal(
                  viewTask
                )
              }
              className="flex h-10 flex-1 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-sm font-medium text-[#858980] transition hover:border-[#E7B84B]/25 hover:bg-[#E7B84B]/[0.035] hover:text-[#E0BA4D]"
            >
              ✎ Edit task
            </button>

            <button
              type="button"
              onClick={() =>
                updateTaskStatus(
                  viewTask.id,
                  viewTask.status ===
                    "completed"
                    ? "pending"
                    : "completed"
                )
              }
              className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#E7B84B] px-4 text-sm font-bold text-[#15130C] transition hover:bg-[#F0C965] hover:shadow-[0_0_28px_rgba(231,184,75,0.16)]"
            >
              {viewTask.status ===
              "completed"
                ? "↶ Reopen task"
                : "✓ Complete task"}
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setDeleteTaskId(
                viewTask.id
              )
            }
            className="w-full text-center font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#555A52] transition hover:text-[#E87575]"
          >
            Delete this task
          </button>
        </div>
      </div>
    </div>
  )}

  {deleteTaskId && (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl border border-[#E87575]/15 bg-[#181B16] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.78)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E87575]/15 bg-[#E87575]/[0.06] text-[#E87575]">
          !
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-tight text-[#F4F0E6]">
          Delete this task?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#70756C]">
          This action will
          permanently remove the
          task from your current
          NexaFlow workspace.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() =>
              setDeleteTaskId(
                null
              )
            }
            className="h-10 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-[#777B72] transition hover:bg-white/[0.04] hover:text-[#F4F0E6]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleDelete
            }
            className="h-10 flex-1 rounded-xl bg-[#B94D4D] text-sm font-bold text-white transition hover:bg-[#D05A5A] hover:shadow-[0_0_28px_rgba(208,90,90,0.18)]"
          >
            Delete task
          </button>
        </div>
      </div>
    </div>
  )}
</main>


);
}
