"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SidebarProps = {
  desktopOpen?: boolean;
  onDesktopOpenChange?: (open: boolean) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
};

const mainNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon />,
  },
  {
    label: "Overview",
    href: "/dashboard",
    icon: <OverviewIcon />,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: <WorkflowIcon />,
  },
  {
    label: "Conversations",
    href: "/conversations",
    icon: <ConversationIcon />,
    badge: "",
  },
  {
    label: "Leads",
    href: "/leads",
    icon: <LeadsIcon />,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: <TasksIcon />,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <AnalyticsIcon />,
  },
];

const secondaryNavigation: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
  },
];

function AccountIcon({
  profileImage,
}: {
  profileImage: string | null;
}) {
  if (profileImage) {
    return (
      <div className="h-[18px] w-[18px] overflow-hidden rounded-full border border-[#E7B84B]/30">
        <img
          src={profileImage}
          alt="Account"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path
        d="M5 20a7 7 0 0 1 14 0"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoMark() {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-[#E7B84B]/25 bg-[#252A22] shadow-[0_0_24px_rgba(231,184,75,0.08)]">
      <div className="absolute inset-[5px] rounded-[9px] border border-[#F5D98B]/10" />

      <svg
        viewBox="0 0 24 24"
        className="relative h-5 w-5 text-[#F5D98B]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M7 17.5 12 5l5 12.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M9.2 13h5.6"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_10px_rgba(231,184,75,0.7)]" />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="m7.5 7 2.5 2.5L7.5 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M12 3.5 13.7 9l5.3 1.8-5.3 1.7L12 18l-1.7-5.5L5 10.8 10.3 9 12 3.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m18.5 15.5.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m6 6 8 8M14 6l-8 8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OverviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="6" cy="18" r="2" />

      <path
        d="M8 6h4a6 6 0 0 1 6 6M8 18h4a6 6 0 0 0 6-6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ConversationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4.2A2.5 2.5 0 0 1 5 13.5v-7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9 9h6M9 12h4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="9" cy="8" r="3" />

      <path
        d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7a3 3 0 1 1 0 6M16 15.5a4.5 4.5 0 0 1 4.5 3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />

      <path
        d="m8 12 2.5 2.5L16 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M5 19V10M12 19V5M19 19v-7"
        strokeLinecap="round"
      />

      <path
        d="M3.5 19.5h17"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="3" />

      <path
        d="M19 12a7 7 0 0 0-.1-1.1l1.7-1.3-1.8-3.1-2 .8a7 7 0 0 0-1.9-1.1L14.6 4h-3.2l-.3 2.2a7 7 0 0 0-1.9 1.1l-2-.8-1.8 3.1 1.7 1.3A7 7 0 0 0 7 12c0 .4 0 .7.1 1.1l-1.7 1.3 1.8 3.1 2-.8a7 7 0 0 0 1.9 1.1l.3 2.2h3.2l.3-2.2a7 7 0 0 0 1.9-1.1l2 .8 1.8-3.1-1.7-1.3c.1-.4.1-.7.1-1.1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidebarExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M9 5 4 12l5 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 5h5v14h-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" &&
      pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        "group relative flex h-[46px] items-center gap-3 rounded-[12px] px-3.5",
        "text-[13px] font-medium tracking-[-0.01em]",
        "transition-all duration-200",
        isActive
          ? "bg-[#E7B84B]/[0.10] text-[#F4F0E6]"
          : "text-[#9A9D94] hover:bg-[#F4F0E6]/[0.035] hover:text-[#F4F0E6]",
      ].join(" ")}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r-full bg-[#E7B84B] shadow-[0_0_12px_rgba(231,184,75,0.75)]" />
      )}

      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]",
          "transition-all duration-200",
          isActive
            ? "bg-[#E7B84B]/[0.10] text-[#F5D98B]"
            : "text-[#777B72] group-hover:bg-[#F4F0E6]/[0.035] group-hover:text-[#D8D4C8]",
        ].join(" ")}
      >
        {item.icon}
      </span>

      <span className="min-w-0 flex-1 truncate">
        {item.label}
      </span>

      {item.badge && (
        <span
          className={[
            "min-w-[22px] rounded-full border px-1.5 py-0.5 text-center",
            "font-mono text-[10px] leading-none",
            isActive
              ? "border-[#E7B84B]/25 bg-[#E7B84B]/10 text-[#F5D98B]"
              : "border-[#F5D98B]/10 bg-[#F4F0E6]/[0.035] text-[#9A9D94]",
          ].join(" ")}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
  desktopOpen: controlledDesktopOpen,
  onDesktopOpenChange,
}: SidebarProps) {
  const pathname = usePathname();

  const [showUpgradeCard, setShowUpgradeCard] =
    useState(true);

  const [internalDesktopOpen, setInternalDesktopOpen] =
    useState(true);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const desktopOpen =
    controlledDesktopOpen ?? internalDesktopOpen;

  const setDesktopOpen = (open: boolean) => {
    if (onDesktopOpenChange) {
      onDesktopOpenChange(open);
      return;
    }

    setInternalDesktopOpen(open);
  };

  const STORAGE_KEY =
    "nexaflow-upgrade-dismissed";

  const PROFILE_IMAGE_KEY =
    "nexaflow-profile-image";

  useEffect(() => {
    try {
      const dismissed =
        sessionStorage.getItem(STORAGE_KEY);

      if (dismissed === "true") {
        setShowUpgradeCard(false);
      }
    } catch {
      // Ignore storage errors.
    }
  }, []);

  useEffect(() => {
    try {
      const storedImage =
        localStorage.getItem(PROFILE_IMAGE_KEY);

      if (storedImage) {
        setProfileImage(storedImage);
      }
    } catch {
      // Ignore storage errors.
    }
  }, [pathname]);

  useEffect(() => {
    const handleProfileImageUpdate = () => {
      try {
        const storedImage =
          localStorage.getItem(PROFILE_IMAGE_KEY);

        setProfileImage(storedImage);
      } catch {
        // Ignore storage errors.
      }
    };

    window.addEventListener(
      "nexaflow-profile-image-updated",
      handleProfileImageUpdate
    );

    return () => {
      window.removeEventListener(
        "nexaflow-profile-image-updated",
        handleProfileImageUpdate
      );
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const handleCloseUpgrade = () => {
    setShowUpgradeCard(false);

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        "true"
      );
    } catch {
      // Ignore storage errors.
    }
  };

  const navigation = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Workspace */}
      <div className="px-4 pb-5">
        <div className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#777B72]">
          Workspace
        </div>

        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-[13px] border border-[#F5D98B]/[0.08] bg-[#20241D]/55 px-3 py-2.5 text-left transition-all duration-200 hover:border-[#E7B84B]/20 hover:bg-[#252A22]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#E7B84B]/15 bg-[#E7B84B]/[0.07] font-mono text-[11px] font-semibold text-[#F5D98B]">
            FN
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold text-[#F4F0E6]">
              Faiza Noor
            </span>

            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-[#777B72]">
              AI Operations
            </span>
          </span>

          <span className="text-[#777B72] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#F5D98B]">
            <ChevronIcon />
          </span>
        </button>
      </div>

      {/* Main navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#777B72]">
          Control Center
        </div>

        <nav className="space-y-1">
          {mainNavigation.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={() =>
                setMobileOpen(false)
              }
            />
          ))}
        </nav>

        <div className="my-5 h-px bg-[#F5D98B]/[0.055]" />

        <div className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#777B72]">
          System
        </div>

        <nav className="space-y-1">
          {secondaryNavigation.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={() =>
                setMobileOpen(false)
              }
            />
          ))}

          {/* Account */}
          <NavLink
            item={{
              label: "Account",
              href: "/account",
              icon: (
                <AccountIcon
                  profileImage={profileImage}
                />
              ),
            }}
            pathname={pathname}
            onClick={() =>
              setMobileOpen(false)
            }
          />
        </nav>
      </div>

      {/* Upgrade */}
      {showUpgradeCard && (
        <div className="relative mx-3 mb-3 overflow-hidden rounded-[15px] border border-[#E7B84B]/15 bg-[#20241D]">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#E7B84B]/[0.08] blur-3xl" />

          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#E7B84B]/40 to-transparent" />

          <button
            type="button"
            onClick={handleCloseUpgrade}
            aria-label="Dismiss upgrade card"
            className="absolute right-2.5 top-2.5 z-50 flex h-6 w-6 items-center justify-center rounded-lg text-[#777B72] transition-colors hover:bg-[#F4F0E6]/[0.05] hover:text-[#F4F0E6]"
          >
            <CloseIcon />
          </button>

          <div className="relative p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E7B84B]/20 bg-[#E7B84B]/[0.08] text-[#F5D98B]">
              <SparkIcon />
            </div>

            <div className="pr-5">
              <p className="text-[12px] font-semibold text-[#F4F0E6]">
                Unlock more automation
              </p>

              <p className="mt-1.5 text-[10px] leading-4 text-[#9A9D94]">
                Run more workflows and unlock advanced AI operations.
              </p>
            </div>

            <Link
              href="/settings"
              onClick={() =>
                setMobileOpen(false)
              }
              className="mt-4 flex h-8 items-center justify-center rounded-[9px] border border-[#E7B84B]/25 bg-[#E7B84B]/[0.09] text-[10px] font-semibold text-[#F5D98B] transition-all duration-200 hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/[0.15]"
            >
              Upgrade workspace
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar footer */}
      <div className="border-t border-[#F5D98B]/[0.055] px-4 py-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.5)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#777B72]">
              Systems online
            </span>
          </div>

          <span className="font-mono text-[9px] text-[#555A52]">
            v1.0
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      {desktopOpen && (
        <aside className="relative hidden h-screen w-[248px] flex-col overflow-hidden border-r border-[#F5D98B]/[0.07] bg-[#121410] lg:flex">
          {/* Subtle sidebar atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#E7B84B]/[0.035] blur-[90px]" />

            <div className="absolute bottom-20 right-[-90px] h-72 w-72 rounded-full bg-[#5ED6A0]/[0.018] blur-[100px]" />

            <div
              className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(245,217,139,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.7) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
          </div>

          {/* Brand */}
          <div className="relative z-10 border-b border-[#F5D98B]/[0.055] px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="group flex min-w-0 items-center gap-3"
              >
                <LogoMark />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#F4F0E6]">
                      NexaFlow
                    </span>

                    <span className="rounded-full border border-[#E7B84B]/15 bg-[#E7B84B]/[0.06] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[#BFAF7A]">
                      AI
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.55)]" />

                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#777B72]">
                      Operational
                    </span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() =>
                  setDesktopOpen(false)
                }
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#F5D98B]/10 bg-[#20241D]/45 text-[#777B72] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#E7B84B]/[0.07] hover:text-[#F5D98B]"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            {navigation}
          </div>
        </aside>
      )}

      {/* Desktop collapsed trigger */}
      {!desktopOpen && (
        <div className="fixed left-4 top-4 z-[60] hidden lg:block">
          <button
            type="button"
            onClick={() =>
              setDesktopOpen(true)
            }
            aria-label="Open sidebar"
            title="Open sidebar"
            className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-[#E7B84B]/20 bg-[#151713]/95 text-[#F5D98B] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:border-[#E7B84B]/35 hover:bg-[#20241D] hover:shadow-[0_0_24px_rgba(231,184,75,0.12)]"
          >
            <SidebarExpandIcon />
          </button>
        </div>
      )}

      {/* Mobile top trigger */}
      <div className="fixed left-4 top-4 z-[60] lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E7B84B]/20 bg-[#151713]/95 text-[#F5D98B] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors hover:bg-[#20241D]"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() =>
              setMobileOpen(false)
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
          />

          <aside className="relative flex h-full w-[280px] flex-col overflow-hidden border-r border-[#F5D98B]/10 bg-[#121410] shadow-[20px_0_60px_rgba(0,0,0,0.5)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 top-20 h-60 w-60 rounded-full bg-[#E7B84B]/[0.035] blur-[90px]" />

              <div
                className="absolute inset-0 opacity-[0.018]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(245,217,139,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.7) 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                }}
              />
            </div>

            {/* Mobile header */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#F5D98B]/[0.055] px-5 py-5">
              <Link
                href="/"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex items-center gap-3"
              >
                <LogoMark />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#F4F0E6]">
                      NexaFlow
                    </span>

                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#BFAF7A]">
                      AI
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0]" />

                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#777B72]">
                      Operational
                    </span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                aria-label="Close navigation"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F5D98B]/10 text-[#777B72] transition-colors hover:bg-[#F4F0E6]/[0.04] hover:text-[#F4F0E6]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              {navigation}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}