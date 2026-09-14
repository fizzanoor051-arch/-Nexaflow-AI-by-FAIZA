"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
}

type SearchItem = {
  title: string;
  description: string;
  href: string;
  category: string;
  keywords: string;
  icon:
    | "dashboard"
    | "workflow"
    | "chat"
    | "leads"
    | "tasks"
    | "analytics"
    | "settings";
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[17px] w-[17px]"
      aria-hidden="true"
    >
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CommandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M18 8a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V5a3 3 0 1 0-3 3h12Z" />
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
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .35 1.98l.06.06a2.1 2.1 0 1 1-2.97 2.97l-.06-.06a1.8 1.8 0 0 0-1.98-.35 1.8 1.8 0 0 0-1.1 1.65V21.3a2.1 2.1 0 1 1-4.2 0v-.1A1.8 1.8 0 0 0 8.4 19.5a1.8 1.8 0 0 0-1.98.35l-.06.06a2.1 2.1 0 1 1-2.97-2.97l.06-.06A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.65-1.1H2.1a2.1 2.1 0 1 1 0-4.2h.1A1.8 1.8 0 0 0 3.8 8.6a1.8 1.8 0 0 0-.35-1.98l-.06-.06a2.1 2.1 0 1 1 2.97-2.97l.06.06A1.8 1.8 0 0 0 8.4 4a1.8 1.8 0 0 0 1.1-1.65v-.1a2.1 2.1 0 1 1 4.2 0v.1A1.8 1.8 0 0 0 14.8 4a1.8 1.8 0 0 0 1.98-.35l.06-.06a2.1 2.1 0 1 1 2.97 2.97l-.06.06A1.8 1.8 0 0 0 19.4 8.6a1.8 1.8 0 0 0 1.65 1.1h.1a2.1 2.1 0 1 1 0 4.2h-.1A1.8 1.8 0 0 0 19.4 15Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
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
      aria-hidden="true"
    >
      <rect x="3" y="4" width="6" height="5" rx="1.5" />
      <rect x="15" y="4" width="6" height="5" rx="1.5" />
      <rect x="9" y="15" width="6" height="5" rx="1.5" />
      <path d="M9 6.5h6M18 9v3.5c0 1.4-1.1 2.5-2.5 2.5H15M6 9v3.5c0 1.4 1.1 2.5 2.5 2.5H9" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-5.2A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M8 11h8M8 14h5" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 11h5M18.5 8.5v5" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8 9 1.5 1.5L12 8M8 15l1.5 1.5L12 14M14 10h3M14 16h3" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 19V5M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
    </svg>
  );
}

function SearchResultIcon({
  type,
}: {
  type: SearchItem["icon"];
}) {
  if (type === "dashboard") {
    return <DashboardIcon />;
  }

  if (type === "workflow") {
    return <WorkflowIcon />;
  }

  if (type === "chat") {
    return <ChatIcon />;
  }

  if (type === "leads") {
    return <LeadsIcon />;
  }

  if (type === "tasks") {
    return <TasksIcon />;
  }

  if (type === "analytics") {
    return <AnalyticsIcon />;
  }

  return <SettingsIcon />;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    title: "Dashboard",
    description:
      "Overview of your workspace, activity and automation.",
    href: "/dashboard",
    category: "Workspace",
    keywords:
      "home overview workspace dashboard activity automation",
    icon: "dashboard",
  },
  {
    title: "Workflows",
    description:
      "Create, manage and monitor your automations.",
    href: "/workflows",
    category: "Automation",
    keywords:
      "workflow workflows automation flow builder",
    icon: "workflow",
  },
  {
    title: "New Workflow",
    description:
      "Create a new automated workflow.",
    href: "/workflows/new",
    category: "Automation",
    keywords:
      "new workflow create automation workflow builder",
    icon: "workflow",
  },
  {
    title: "AI Conversations",
    description:
      "Chat with NexaFlow AI and manage conversations.",
    href: "/conversations",
    category: "AI",
    keywords:
      "ai chat conversations assistant messages",
    icon: "chat",
  },
  {
    title: "Leads",
    description:
      "Manage, qualify and organize your leads.",
    href: "/leads",
    category: "CRM",
    keywords:
      "leads customers prospects crm contacts",
    icon: "leads",
  },
  {
    title: "Tasks",
    description:
      "Manage and prioritize your workspace tasks.",
    href: "/tasks",
    category: "Workspace",
    keywords:
      "tasks todo task management priority",
    icon: "tasks",
  },
  {
    title: "Analytics",
    description:
      "View performance, activity and business metrics.",
    href: "/analytics",
    category: "Insights",
    keywords:
      "analytics metrics statistics performance reports",
    icon: "analytics",
  },
  {
    title: "Settings",
    description:
      "Manage account, workspace and automation settings.",
    href: "/settings",
    category: "Workspace",
    keywords:
      "settings account preferences configuration workspace",
    icon: "settings",
  },
];

export default function Topbar({
  title,
  subtitle,
  showBack = false,
  showSearch = true,
  showNotifications = true,
  showProfile = true,
}: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const searchContainerRef =
    useRef<HTMLDivElement>(null);

  const isDashboard = pathname === "/dashboard";

  const resolvedTitle =
    title ||
    (isDashboard
      ? "Overview"
      : "NexaFlow workspace");

  const resolvedSubtitle =
    subtitle ||
    (isDashboard
      ? "Monitor automation, activity and workspace performance."
      : "Manage your workspace and automation.");

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return SEARCH_ITEMS;
    }

    return SEARCH_ITEMS.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.category,
        item.keywords,
        item.href,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery]);

  function openSearch() {
    setSearchOpen(true);
    setSelectedIndex(0);

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 30);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  }

  function handleSearchClick() {
    if (!searchOpen) {
      openSearch();
    }
  }

  function handleResultClick(href: string) {
    closeSearch();
    router.push(href);
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  }

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();

        if (searchOpen) {
          searchInputRef.current?.focus();
        } else {
          openSearch();
        }

        return;
      }

      if (!searchOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        if (filteredResults.length === 0) {
          return;
        }

        setSelectedIndex((current) =>
          current >= filteredResults.length - 1
            ? 0
            : current + 1
        );

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        if (filteredResults.length === 0) {
          return;
        }

        setSelectedIndex((current) =>
          current <= 0
            ? filteredResults.length - 1
            : current - 1
        );

        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const selected =
          filteredResults[selectedIndex];

        if (selected) {
          handleResultClick(selected.href);
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    searchOpen,
    filteredResults,
    selectedIndex,
  ]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!searchOpen) {
        return;
      }

      const target = event.target as Node;

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        closeSearch();
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [searchOpen]);

  useEffect(() => {
    if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(0);
    }
  }, [filteredResults.length, selectedIndex]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#F5D98B]/[0.08] bg-[#1B1F19]/[0.94] text-[#F4F0E6] shadow-[0_12px_35px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
      {/* TOP GOLD MICRO-LINE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/45 to-transparent" />

      {/* ATMOSPHERIC GLOW */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_50%_-80%,rgba(231,184,75,0.08),transparent_65%)]" />

      {/* INNER BOTTOM LINE */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/[0.07] to-transparent" />

      <div className="relative flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT SIDE */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBack && !isDashboard && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F5D98B]/[0.09] bg-[#20241D]/80 text-[#9A9D94] shadow-[inset_0_1px_0_rgba(245,217,139,0.03)] transition-all duration-200 hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F5D98B] hover:shadow-[0_0_18px_rgba(231,184,75,0.08)]"
            >
              <ChevronLeftIcon />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-[#F4F0E6] sm:text-[16px]">
                {resolvedTitle}
              </h1>

              <span className="hidden items-center gap-1.5 rounded-full border border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.07] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#79DDAE] sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.7)]" />
                Live
              </span>
            </div>

            <p className="mt-0.5 hidden max-w-[520px] truncate text-[10px] font-medium text-[#9A9D94] sm:block">
              {resolvedSubtitle}
            </p>
          </div>
        </div>

        {/* GLOBAL SEARCH */}
        {showSearch && (
          <div
            ref={searchContainerRef}
            className="relative hidden items-center md:flex"
          >
            {!searchOpen ? (
              <button
                type="button"
                onClick={handleSearchClick}
                aria-label="Search workspace"
                className="group flex h-9 w-[190px] items-center gap-2.5 rounded-xl border border-[#F5D98B]/[0.09] bg-[#20241D]/75 px-3 text-left shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-200 hover:w-[230px] hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:shadow-[0_5px_22px_rgba(0,0,0,0.18)]"
              >
                <span className="text-[#777D70] transition-colors group-hover:text-[#E7B84B]">
                  <SearchIcon />
                </span>

                <span className="flex-1 text-[10px] font-medium text-[#8F9389] transition-colors group-hover:text-[#B6B9AE]">
                  Search workspace...
                </span>

                <span className="hidden items-center gap-1 rounded-md border border-[#F5D98B]/[0.08] bg-[#151713]/70 px-1.5 py-0.5 text-[8px] font-semibold text-[#777D70] lg:flex">
                  <CommandIcon />
                  K
                </span>
              </button>
            ) : (
              <>
                <div className="flex h-10 w-[320px] items-center gap-2.5 rounded-xl border border-[#E7B84B]/35 bg-[#20241D] px-3 shadow-[0_12px_35px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(245,217,139,0.04)]">
                  <span className="shrink-0 text-[#E7B84B]">
                    <SearchIcon />
                  </span>

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search workspace..."
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-[11px] font-medium text-[#F4F0E6] outline-none placeholder:text-[#777D70]"
                    aria-label="Search workspace"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#777D70] transition-colors hover:bg-[#F4F0E6]/[0.05] hover:text-[#F5D98B]"
                    >
                      <CloseIcon />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#777D70] transition-colors hover:bg-[#F4F0E6]/[0.05] hover:text-[#F5D98B] lg:flex"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* SEARCH RESULTS */}
                <div className="absolute right-0 top-[48px] w-[360px] overflow-hidden rounded-2xl border border-[#F5D98B]/[0.10] bg-[#20241D]/[0.98] shadow-[0_30px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-[#F5D98B]/[0.07] px-4 py-3">
                    <div>
                      <p className="text-[10px] font-semibold text-[#F4F0E6]">
                        {searchQuery
                          ? "Search results"
                          : "Quick navigation"}
                      </p>

                      <p className="mt-0.5 text-[8px] text-[#777D70]">
                        {filteredResults.length}{" "}
                        {filteredResults.length === 1
                          ? "result"
                          : "results"}
                      </p>
                    </div>

                    <div className="hidden items-center gap-1 text-[7px] text-[#777D70] sm:flex">
                      <span className="rounded border border-[#F5D98B]/[0.08] bg-[#151713] px-1.5 py-0.5">
                        ↑
                      </span>

                      <span className="rounded border border-[#F5D98B]/[0.08] bg-[#151713] px-1.5 py-0.5">
                        ↓
                      </span>

                      <span className="ml-1">
                        Navigate
                      </span>
                    </div>
                  </div>

                  {filteredResults.length > 0 ? (
                    <div className="max-h-[390px] overflow-y-auto p-2">
                      {filteredResults.map(
                        (item, index) => {
                          const isSelected =
                            index === selectedIndex;

                          return (
                            <button
                              key={item.href}
                              type="button"
                              onMouseEnter={() =>
                                setSelectedIndex(index)
                              }
                              onClick={() =>
                                handleResultClick(item.href)
                              }
                              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 ${
                                isSelected
                                  ? "bg-[#E7B84B]/[0.09]"
                                  : "hover:bg-[#F4F0E6]/[0.025]"
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-r-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.45)]" />
                              )}

                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                                  isSelected
                                    ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.09] text-[#E7B84B]"
                                    : "border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70] group-hover:border-[#E7B84B]/15 group-hover:text-[#B6B9AE]"
                                }`}
                              >
                                <SearchResultIcon
                                  type={item.icon}
                                />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`truncate text-[10px] font-semibold ${
                                      isSelected
                                        ? "text-[#F4F0E6]"
                                        : "text-[#C4C6BE]"
                                    }`}
                                  >
                                    {item.title}
                                  </span>

                                  <span className="shrink-0 rounded-full border border-[#F5D98B]/[0.07] bg-[#151713]/55 px-1.5 py-0.5 text-[7px] font-medium text-[#777D70]">
                                    {item.category}
                                  </span>
                                </span>

                                <span className="mt-1 block truncate text-[8px] leading-4 text-[#777D70]">
                                  {item.description}
                                </span>
                              </span>

                              <span
                                className={`shrink-0 text-[12px] transition-all ${
                                  isSelected
                                    ? "translate-x-0 text-[#E7B84B] opacity-100"
                                    : "-translate-x-1 text-[#777D70] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                }`}
                              >
                                →
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70]">
                        <SearchIcon />
                      </div>

                      <p className="mt-3 text-[10px] font-semibold text-[#C4C6BE]">
                        No results found
                      </p>

                      <p className="mt-1 text-[8px] text-[#777D70]">
                        Try Dashboard, Workflows, Leads
                        or Settings.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-[#F5D98B]/[0.07] px-4 py-2.5">
                    <span className="text-[7px] text-[#777D70]">
                      Press Enter to open
                    </span>

                    <button
                      type="button"
                      onClick={closeSearch}
                      className="text-[7px] font-medium text-[#8F9389] transition-colors hover:text-[#F5D98B]"
                    >
                      Esc to close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-2">
          {/* AI STATUS */}
          <div className="hidden items-center gap-2 rounded-xl border border-[#E7B84B]/20 bg-[#E7B84B]/[0.06] px-3 py-2 shadow-[inset_0_1px_0_rgba(245,217,139,0.03)] sm:flex">
            <span className="relative flex h-4 w-4 items-center justify-center text-[#E7B84B]">
              <span className="absolute h-2 w-2 animate-pulse rounded-full bg-[#E7B84B]/45 blur-[3px]" />
              <SparkIcon />
            </span>

            <span className="text-[9px] font-semibold tracking-wide text-[#DDB55A]">
              AI online
            </span>
          </div>

          {/* NOTIFICATIONS */}
          {showNotifications && (
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/75 text-[#8F9389] shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B] hover:shadow-[0_0_18px_rgba(231,184,75,0.07)]"
            >
              <BellIcon />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.7)]" />
            </button>
          )}

          {/* HOME BUTTON */}
          <Link
            href="/"
            aria-label="Go to Home"
            className="group flex h-9 items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/75 px-3 text-[#8F9389] shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B]"
          >
            <HomeIcon />

            <span className="hidden text-[10px] font-semibold sm:block">
              Home
            </span>
          </Link>

          {/* PROFILE */}
          {showProfile && (
            <Link
              href="/settings"
              aria-label="Open settings"
              className="group flex h-9 items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/75 px-2 shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#E7B84B]/25 bg-[#E7B84B]/[0.08] text-[9px] font-bold text-[#E7B84B]">
                F
              </span>

              <span className="hidden text-[10px] font-semibold text-[#A5A89F] transition-colors group-hover:text-[#F4F0E6] lg:block">
                Faiza
              </span>

              <span className="hidden text-[#777D70] transition-colors group-hover:text-[#D0D2C9] lg:block">
                <SettingsIcon />
              </span>

              <span className="sr-only">
                Open settings
              </span>

              <span className="text-[#777D70] transition-colors group-hover:text-[#F5D98B]">
                <UserIcon />
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}