"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavigation: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="M8.5 6H14a4 4 0 0 1 4 4v5.5" />
        <path d="M15.5 18H10a4 4 0 0 1-4-4V8.5" />
      </svg>
    ),
  },
  {
    label: "Conversations",
    href: "/conversations",
    badge: "4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-4.5a7.5 7.5 0 1 1 16-5Z" />
        <path d="M8 11h8" />
        <path d="M8 14h5" />
      </svg>
    ),
  },
  {
    label: "Leads",
    href: "/leads",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <circle cx="17" cy="9" r="2.25" />
        <path d="M15 15.5a4.5 4.5 0 0 1 5 3.5" />
      </svg>
    ),
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="m8 8 1.5 1.5L12 7" />
        <path d="M13.5 9H17" />
        <path d="m8 14 1.5 1.5L12 13" />
        <path d="M13.5 15H17" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
        <path d="M15 6h3v3" />
      </svg>
    ),
  },
];

const secondaryNavigation: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4V19a2 2 0 0 1-4 0v-.1a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A2 2 0 0 0 1.6 11H1.5a2 2 0 0 1 0-4h.1A2 2 0 0 0 3 3.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A2 2 0 0 0 9.2 2V1.9a2 2 0 0 1 4 0V2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 20.8 7h.1a2 2 0 0 1 0 4h-.1a2 2 0 0 0-1.4 4Z" />
      </svg>
    ),
  },
];

function LogoMark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
      <div className="absolute h-4 w-4 rounded-full bg-violet-400/20 blur-md" />
      <svg
        className="relative h-5 w-5 text-violet-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
        <path d="m8 9.5 4-2.25 4 2.25L12 12 8 9.5Z" />
        <path d="M12 12v5" />
      </svg>
    </div>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();

  const active =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2.5",
        "text-sm font-medium transition-all duration-200",
        active
          ? "bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center",
          active ? "text-violet-300" : "text-slate-500 group-hover:text-slate-300",
        ].join(" ")}
      >
        <span className="h-[18px] w-[18px]">{item.icon}</span>
      </span>

      <span className="flex-1">{item.label}</span>

      {item.badge && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-white/[0.07] bg-[#070b16] lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.07] px-5">
        <LogoMark />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">
            NexaFlow
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
            AI Automation
          </p>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-4 pt-5">
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Workspace
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/10 text-xs font-bold text-violet-200">
            F
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-200">
              My Workspace
            </p>
            <p className="truncate text-[10px] text-slate-600">
              Free plan
            </p>
          </div>

          <svg
            className="h-3.5 w-3.5 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4">
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Main menu
        </div>

        <div className="space-y-1">
          {mainNavigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="my-5 h-px bg-white/[0.06]" />

        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          System
        </div>

        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Upgrade */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] to-indigo-500/[0.04] p-4">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
              </svg>
            </div>

            <p className="text-xs font-semibold text-white">
              Unlock more automation
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Build more workflows and unlock advanced AI features.
            </p>

            <Link
              href="/settings"
              className="mt-3 inline-flex text-[11px] font-semibold text-violet-300 transition-colors hover:text-violet-200"
            >
              Explore plans →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}