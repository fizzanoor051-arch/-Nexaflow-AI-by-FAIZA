
"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

export default function SettingsPage() {
  const [name, setName] = useState("Faiza Noor");
  const [email, setEmail] = useState("fizzanoor051@gmail.com");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-400">Workspace</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your profile and NexaFlow workspace preferences.
        </p>
      </div>

      <Card>
        <div className="border-b border-white/10 pb-5">
          <h2 className="font-semibold text-white">Profile</h2>
          <p className="mt-1 text-sm text-slate-400">
            Update your personal workspace information.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Full name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          {saved ? "✓ Changes saved" : "Save changes"}
        </button>
      </Card>

      <Card>
        <div className="border-b border-white/10 pb-5">
          <h2 className="font-semibold text-white">AI preferences</h2>
          <p className="mt-1 text-sm text-slate-400">
            Configure how NexaFlow handles AI-powered operations.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {[
            {
              title: "AI workflow suggestions",
              description:
                "Allow AI to suggest automation workflows from conversations.",
            },
            {
              title: "Automatic lead extraction",
              description:
                "Extract lead information from customer conversations.",
            },
            {
              title: "Task generation",
              description:
                "Automatically create actionable tasks from AI analysis.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </div>

              <div className="h-6 w-11 rounded-full bg-violet-600 p-1">
                <div className="ml-auto h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div>
          <h2 className="font-semibold text-white">Workspace plan</h2>
          <p className="mt-1 text-sm text-slate-400">
            You are currently using the NexaFlow demo workspace.
          </p>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-white">Growth</p>
            <p className="mt-1 text-sm text-slate-400">
              Designed for growing teams and automated workflows.
            </p>
          </div>

          <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
            Demo plan
          </span>
        </div>
      </Card>
    </div>
  );
}
