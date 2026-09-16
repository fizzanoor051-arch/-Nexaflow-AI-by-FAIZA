"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import LightTheme from "@/components/theme/LightTheme";
import DarkTheme from "@/components/theme/DarkTheme";
import ThemeProvider from "@/components/theme/ThemeProvider";

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
  external?: boolean;
  icon:
    | "home"
    | "dashboard"
    | "workflow"
    | "chat"
    | "leads"
    | "tasks"
    | "analytics"
    | "settings"
    | "account"
    | "login"
    | "register"
    | "about"
    | "contact"
    | "portfolio"
    | "privacy"
    | "terms"
    | "security"
    | "email"
    | "github"
    | "linkedin";
};

type Theme = "light" | "dark" | "normal";

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

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" />
    </svg>
  );
}

function NormalThemeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" />
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

function AccountIcon() {
  return (
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
      <path d="M18 5h3M19.5 3.5v3" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M10 5H5v14h5" />
      <path d="M13 8l4 4-4 4" />
      <path d="M17 12H8" />
    </svg>
  );
}

function RegisterIcon() {
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
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M17 8v6M14 11h6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5v5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
      <path d="M3 11h18M10 11v2h4v-2" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5M10 12h5M10 16h5" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9 19c-4 .9-4-2-5-2m10 4v-3.5c0-1 .1-1.5-.5-2 1.9-.2 3.8-.9 3.8-4.2 0-.9-.3-1.6-.8-2.2.1-.2.4-1.1-.1-2.2 0 0-.7-.2-2.3.8a7.9 7.9 0 0 0-4.2 0c-1.6-1-2.3-.8-2.3-.8-.5 1.1-.2 2-.1 2.2-.5.6-.8 1.3-.8 2.2 0 3.3 1.9 4 3.8 4.2-.6.5-.6 1.1-.6 2V21" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10v6M8 8v.01M12 16v-3.2a2.2 2.2 0 0 1 4.4 0V16M12 10v6" />
    </svg>
  );
}

function SearchResultIcon({
  type,
}: {
  type: SearchItem["icon"];
}) {
  switch (type) {
    case "home":
      return <HomeIcon />;

    case "dashboard":
      return <DashboardIcon />;

    case "workflow":
      return <WorkflowIcon />;

    case "chat":
      return <ChatIcon />;

    case "leads":
      return <LeadsIcon />;

    case "tasks":
      return <TasksIcon />;

    case "analytics":
      return <AnalyticsIcon />;

    case "settings":
      return <SettingsIcon />;

    case "account":
      return <AccountIcon />;

    case "login":
      return <LoginIcon />;

    case "register":
      return <RegisterIcon />;

    case "about":
      return <InfoIcon />;

    case "contact":
      return <ContactIcon />;

    case "portfolio":
      return <PortfolioIcon />;

    case "privacy":
      return <DocumentIcon />;

    case "terms":
      return <DocumentIcon />;

    case "security":
      return <SecurityIcon />;

    case "email":
      return <MailIcon />;

    case "github":
      return <GithubIcon />;

    case "linkedin":
      return <LinkedinIcon />;

    default:
      return <SettingsIcon />;
  }
}

/* ============================================================
   GLOBAL SEARCH DATA
   Sidebar + Footer + External Links
   ============================================================ */

const SEARCH_ITEMS: SearchItem[] = [
  /* HOME */

  {
    title: "Home",
    description: "NexaFlow AI landing page and product overview.",
    href: "/",
    category: "Home",
    keywords:
      "home landing nexaflow ai product overview main website start",
    icon: "home",
  },

  /* WORKSPACE */

  {
    title: "Dashboard",
    description:
      "Overview of your workspace, activity and automation.",
    href: "/dashboard",
    category: "Workspace",
    keywords:
      "dashboard overview workspace activity automation analytics home",
    icon: "dashboard",
  },

  {
    title: "Workflows",
    description:
      "Create, manage and monitor your automations.",
    href: "/workflows",
    category: "Automation",
    keywords:
      "workflow workflows automation flow builder automations",
    icon: "workflow",
  },

  {
    title: "New Workflow",
    description:
      "Create a new automated workflow.",
    href: "/workflows/new",
    category: "Automation",
    keywords:
      "new workflow create automation workflow builder start",
    icon: "workflow",
  },

  {
    title: "AI Conversations",
    description:
      "Chat with NexaFlow AI and manage conversations.",
    href: "/conversations",
    category: "AI",
    keywords:
      "ai chat conversations assistant messages intelligence",
    icon: "chat",
  },

  {
    title: "Leads",
    description:
      "Manage, qualify and organize your leads.",
    href: "/leads",
    category: "CRM",
    keywords:
      "leads customers prospects crm contacts sales opportunities",
    icon: "leads",
  },

  {
    title: "Tasks",
    description:
      "Manage and prioritize your workspace tasks.",
    href: "/tasks",
    category: "Workspace",
    keywords:
      "tasks todo task management priority actions follow up",
    icon: "tasks",
  },

  {
    title: "Analytics",
    description:
      "View performance, activity and business metrics.",
    href: "/analytics",
    category: "Insights",
    keywords:
      "analytics metrics statistics performance reports insights data",
    icon: "analytics",
  },

  /* ACCOUNT / SYSTEM */

  {
    title: "Settings",
    description:
      "Manage account, workspace and automation settings.",
    href: "/settings",
    category: "System",
    keywords:
      "settings account preferences configuration workspace system",
    icon: "settings",
  },

  {
    title: "Account",
    description:
      "Manage your profile, subscription, billing and account details.",
    href: "/account",
    category: "System",
    keywords:
      "account profile user personal professional subscription billing payment security",
    icon: "account",
  },

  /* AUTH */

  {
    title: "Sign In",
    description:
      "Sign in to your NexaFlow workspace.",
    href: "/login",
    category: "Account",
    keywords:
      "login sign in signin authentication access account",
    icon: "login",
  },

  {
    title: "Create Account",
    description:
      "Create a new NexaFlow account.",
    href: "/register",
    category: "Account",
    keywords:
      "register signup sign up create account new user authentication",
    icon: "register",
  },

  /* PRODUCT / COMPANY */

  {
    title: "Features",
    description:
      "Explore NexaFlow AI automation features.",
    href: "/#features",
    category: "Product",
    keywords:
      "features product ai automation capabilities tools",
    icon: "dashboard",
  },

  {
    title: "How It Works",
    description:
      "Learn how NexaFlow AI turns requests into automation.",
    href: "/#how-it-works",
    category: "Product",
    keywords:
      "how it works process workflow automation ai explanation",
    icon: "workflow",
  },

  {
    title: "Use Cases",
    description:
      "Explore business use cases for NexaFlow AI.",
    href: "/#use-cases",
    category: "Product",
    keywords:
      "use cases business automation examples ai workflows",
    icon: "analytics",
  },

  {
    title: "Pricing",
    description:
      "View NexaFlow AI plans and pricing.",
    href: "/#pricing",
    category: "Product",
    keywords:
      "pricing plans starter growth scale payment subscription",
    icon: "account",
  },

  {
    title: "About",
    description:
      "Learn more about NexaFlow AI.",
    href: "/#about",
    category: "Company",
    keywords:
      "about company nexaflow information team product",
    icon: "about",
  },

  {
    title: "Contact",
    description:
      "Get in touch with Faiza Noor.",
    href: "https://faiza-noor10.vercel.app/",
    category: "Company",
    keywords:
      "contact faiza noor hire developer web development ai automation",
    external: true,
    icon: "contact",
  },

  {
    title: "Portfolio",
    description:
      "Open Faiza Noor's professional portfolio.",
    href: "https://faiza-noor10.vercel.app/",
    category: "Company",
    keywords:
      "portfolio faiza noor web developer full stack projects work",
    external: true,
    icon: "portfolio",
  },

  /* LEGAL / SECURITY */

  {
    title: "Privacy",
    description:
      "Read the NexaFlow privacy information.",
    href: "/privacy",
    category: "Legal",
    keywords:
      "privacy policy data personal information protection legal",
    icon: "privacy",
  },

  {
    title: "Terms",
    description:
      "Read the NexaFlow terms and conditions.",
    href: "/terms",
    category: "Legal",
    keywords:
      "terms conditions legal agreement usage rules",
    icon: "terms",
  },

  {
    title: "Security",
    description:
      "Learn about NexaFlow security practices.",
    href: "/security",
    category: "Legal",
    keywords:
      "security protection privacy secure authentication safety",
    icon: "security",
  },

  /* PERSONAL / EXTERNAL */

  {
    title: "Email Faiza",
    description:
      "Send an email to Faiza Noor.",
    href: "mailto:fizzanoor051@gmail.com",
    category: "Contact",
    keywords:
      "email mail gmail fizzanoor051 contact faiza message",
    external: true,
    icon: "email",
  },

  {
    title: "GitHub",
    description:
      "Open Faiza Noor's GitHub profile and repositories.",
    href: "https://github.com/fizzanoor051-arch",
    category: "Social",
    keywords:
      "github git repositories code developer source open source",
    external: true,
    icon: "github",
  },

  {
    title: "LinkedIn",
    description:
      "Open Faiza Noor's LinkedIn professional profile.",
    href: "https://www.linkedin.com/in/faiza-noor-b2711b42b",
    category: "Social",
    keywords:
      "linkedin professional profile career jobs recruiter networking",
    external: true,
    icon: "linkedin",
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

  const [theme, setTheme] = useState<Theme>("normal");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const searchContainerRef =
    useRef<HTMLDivElement>(null);

  const themeContainerRef =
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

  /* ============================================================
     SEARCH FILTER
     ============================================================ */

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

  /* ============================================================
     SEARCH RESULT ACTION
     ============================================================ */

  function handleResultClick(item: SearchItem) {
    closeSearch();

    if (item.external) {
      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
        return;
      }

      window.open(
        item.href,
        "_blank",
        "noopener,noreferrer",
      );

      return;
    }

    router.push(item.href);
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  }

  /* ============================================================
     THEME CONTROL
     ============================================================ */

  function applyTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    setThemeMenuOpen(false);

    window.localStorage.setItem(
      "nexaflow-theme",
      nextTheme,
    );
  }

  function getThemeLabel() {
    if (theme === "light") {
      return "Light";
    }

    if (theme === "dark") {
      return "Dark";
    }

    return "Normal";
  }

  /* ============================================================
     LOAD SAVED THEME
     ============================================================ */

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem("nexaflow-theme");

    const nextTheme: Theme =
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "normal"
        ? savedTheme
        : "normal";

    setTheme(nextTheme);
  }, []);

  /* ============================================================
     KEYBOARD SHORTCUTS
     ============================================================ */

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

      if (event.key === "Escape") {
        if (themeMenuOpen) {
          event.preventDefault();
          setThemeMenuOpen(false);
          return;
        }

        if (searchOpen) {
          event.preventDefault();
          closeSearch();
          return;
        }
      }

      if (!searchOpen) {
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
            : current + 1,
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
            : current - 1,
        );

        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const selected =
          filteredResults[selectedIndex];

        if (selected) {
          handleResultClick(selected);
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, [
    searchOpen,
    themeMenuOpen,
    filteredResults,
    selectedIndex,
  ]);

  /* ============================================================
     OUTSIDE CLICK
     ============================================================ */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        themeContainerRef.current &&
        !themeContainerRef.current.contains(target)
      ) {
        setThemeMenuOpen(false);
      }

      if (!searchOpen) {
        return;
      }

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        closeSearch();
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [searchOpen]);

  /* ============================================================
     KEEP SELECTED RESULT VALID
     ============================================================ */

  useEffect(() => {
    if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(0);
    }
  }, [filteredResults.length, selectedIndex]);

  return (
    <>
      {/* =====================================================
          THEME COMPONENT CONNECTIONS
          ===================================================== */}

      {theme === "light" && <LightTheme active />}

      {theme === "dark" && <DarkTheme />}

      {theme === "normal" && <ThemeProvider />}

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

          {/* =================================================
              GLOBAL SEARCH
              ================================================= */}

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
                  {/* SEARCH INPUT */}
                  <div className="flex h-10 w-[320px] items-center gap-2.5 rounded-xl border border-[#E7B84B]/35 bg-[#20241D] px-3 shadow-[0_12px_35px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(245,217,139,0.04)]">
                    <span className="shrink-0 text-[#E7B84B]">
                      <SearchIcon />
                    </span>

                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value,
                        )
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
                          setSelectedIndex(0);
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

                  {/* =================================================
                      SEARCH RESULTS
                      ================================================= */}

                  <div className="absolute right-0 top-[48px] w-[390px] overflow-hidden rounded-2xl border border-[#F5D98B]/[0.10] bg-[#20241D]/[0.98] shadow-[0_30px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
                    {/* RESULT HEADER */}
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

                    {/* RESULTS */}
                    {filteredResults.length > 0 ? (
                      <div className="max-h-[430px] overflow-y-auto p-2">
                        {filteredResults.map(
                          (item, index) => {
                            const isSelected =
                              index ===
                              selectedIndex;

                            return (
                              <button
                                key={`${item.title}-${item.href}`}
                                type="button"
                                onMouseEnter={() =>
                                  setSelectedIndex(
                                    index,
                                  )
                                }
                                onClick={() =>
                                  handleResultClick(
                                    item,
                                  )
                                }
                                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 ${
                                  isSelected
                                    ? "bg-[#E7B84B]/[0.09]"
                                    : "hover:bg-[#F4F0E6]/[0.025]"
                                }`}
                              >
                                {/* SELECTED INDICATOR */}
                                {isSelected && (
                                  <span className="absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-r-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.45)]" />
                                )}

                                {/* ICON */}
                                <span
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                                    isSelected
                                      ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.09] text-[#E7B84B]"
                                      : "border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70] group-hover:border-[#E7B84B]/15 group-hover:text-[#B6B9AE]"
                                  }`}
                                >
                                  <SearchResultIcon
                                    type={
                                      item.icon
                                    }
                                  />
                                </span>

                                {/* TEXT */}
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
                                    {
                                      item.description
                                    }
                                  </span>
                                </span>

                                {/* ACTION */}
                                <span
                                  className={`shrink-0 text-[12px] transition-all ${
                                    isSelected
                                      ? "translate-x-0 text-[#E7B84B] opacity-100"
                                      : "-translate-x-1 text-[#777D70] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                  }`}
                                >
                                  {item.external
                                    ? "↗"
                                    : "→"}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      /* NO RESULTS */
                      <div className="px-5 py-10 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70]">
                          <SearchIcon />
                        </div>

                        <p className="mt-3 text-[10px] font-semibold text-[#C4C6BE]">
                          No results found
                        </p>

                        <p className="mt-1 text-[8px] text-[#777D70]">
                          Try Dashboard,
                          Portfolio, GitHub,
                          LinkedIn or Settings.
                        </p>
                      </div>
                    )}

                    {/* SEARCH FOOTER */}
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

          {/* =================================================
              RIGHT SIDE
              ================================================= */}

          <div className="flex shrink-0 items-center gap-2">
            {/* THEME MENU */}
            <div
              ref={themeContainerRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setThemeMenuOpen(
                    (current) => !current,
                  )
                }
                aria-label="Choose theme"
                aria-haspopup="menu"
                aria-expanded={themeMenuOpen}
                title={`Theme: ${getThemeLabel()}`}
                className={`group flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                  themeMenuOpen
                    ? "border-[#E7B84B]/35 bg-[#E7B84B]/[0.10] text-[#F5D98B] shadow-[0_0_20px_rgba(231,184,75,0.10)]"
                    : "border-[#F5D98B]/[0.08] bg-[#20241D]/75 text-[#8F9389] shadow-[inset_0_1px_0_rgba(245,217,139,0.025)] hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F5D98B] hover:shadow-[0_0_18px_rgba(231,184,75,0.09)]"
                }`}
              >
                {theme === "light" ? (
                  <SunIcon />
                ) : theme === "dark" ? (
                  <MoonIcon />
                ) : (
                  <NormalThemeIcon />
                )}
              </button>

              {themeMenuOpen && (
                <div
                  role="menu"
                  aria-label="Theme options"
                  className="absolute right-0 top-[46px] w-[168px] overflow-hidden rounded-2xl border border-[#F5D98B]/[0.10] bg-[#20241D]/[0.98] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl"
                >
                  <div className="px-2.5 pb-1.5 pt-2">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#777D70]">
                      Appearance
                    </p>
                  </div>

                  {/* LIGHT */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      applyTheme("light")
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-all ${
                      theme === "light"
                        ? "bg-[#E7B84B]/[0.10] text-[#F5D98B]"
                        : "text-[#A5A89F] hover:bg-[#F4F0E6]/[0.035] hover:text-[#F4F0E6]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        theme === "light"
                          ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.10] text-[#E7B84B]"
                          : "border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70]"
                      }`}
                    >
                      <SunIcon />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold">
                        Light
                      </span>

                      <span className="mt-0.5 block text-[7px] text-[#777D70]">
                        Bright workspace
                      </span>
                    </span>

                    {theme === "light" && (
                      <span className="text-[10px] text-[#E7B84B]">
                        ✓
                      </span>
                    )}
                  </button>

                  {/* DARK */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      applyTheme("dark")
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-all ${
                      theme === "dark"
                        ? "bg-[#E7B84B]/[0.10] text-[#F5D98B]"
                        : "text-[#A5A89F] hover:bg-[#F4F0E6]/[0.035] hover:text-[#F4F0E6]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        theme === "dark"
                          ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.10] text-[#E7B84B]"
                          : "border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70]"
                      }`}
                    >
                      <MoonIcon />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold">
                        Dark
                      </span>

                      <span className="mt-0.5 block text-[7px] text-[#777D70]">
                        Deep dark workspace
                      </span>
                    </span>

                    {theme === "dark" && (
                      <span className="text-[10px] text-[#E7B84B]">
                        ✓
                      </span>
                    )}
                  </button>

                  {/* NORMAL */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      applyTheme("normal")
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-all ${
                      theme === "normal"
                        ? "bg-[#E7B84B]/[0.10] text-[#F5D98B]"
                        : "text-[#A5A89F] hover:bg-[#F4F0E6]/[0.035] hover:text-[#F4F0E6]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        theme === "normal"
                          ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.10] text-[#E7B84B]"
                          : "border-[#F5D98B]/[0.07] bg-[#151713]/60 text-[#777D70]"
                      }`}
                    >
                      <NormalThemeIcon />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold">
                        Normal
                      </span>

                      <span className="mt-0.5 block text-[7px] text-[#777D70]">
                        NexaFlow default
                      </span>
                    </span>

                    {theme === "normal" && (
                      <span className="text-[10px] text-[#E7B84B]">
                        ✓
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

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
                href="/account"
                aria-label="Open account"
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
                  Open account
                </span>

                <span className="text-[#777D70] transition-colors group-hover:text-[#F5D98B]">
                  <UserIcon />
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}