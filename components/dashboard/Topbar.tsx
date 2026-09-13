
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

interface TopbarProps {
  title?: string;
  description?: string;
  onMenuClick?: () => void;
}

export default function Topbar({
  title = "Dashboard",
  description = "Monitor your AI-powered business automation.",
  onMenuClick,
}: TopbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (title !== "Dashboard") return title;

    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/workflows")) return "Workflows";
    if (pathname.startsWith("/conversations")) return "Conversations";
    if (pathname.startsWith("/leads")) return "Leads";
    if (pathname.startsWith("/tasks")) return "Tasks";
    if (pathname.startsWith("/analytics")) return "Analytics";
    if (pathname.startsWith("/settings")) return "Settings";

    return title;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <span className="text-lg">☰</span>
            </button>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
              {getPageTitle()}
            </h1>

            <p className="hidden truncate text-sm text-slate-400 sm:block">
              {description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white sm:block"
          >
            View site
          </Link>

          <Link
            href="/dashboard"
            className="hidden rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 md:block"
          >
            AI Assistant
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <span className="text-base">🔔</span>

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 rounded-2xl border border-white/10 bg-[#0b1024] p-4 shadow-2xl shadow-black/40">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>

                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
                    3 new
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-sm font-medium text-white">
                      Workflow completed
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Customer Support Automation finished successfully.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-sm font-medium text-white">
                      New lead detected
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      A new qualified lead was added to your workspace.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-sm font-medium text-white">
                      AI automation ready
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Your latest workflow is ready to run.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Avatar name="Faiza Noor" size="sm" />
        </div>
      </div>
    </header>
  );
}
