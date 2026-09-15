"use client";

import { useEffect } from "react";

type LightThemeProps = {
  active?: boolean;
};

const STYLE_ID = "nexaflow-professional-light-theme";

export default function LightTheme({
  active = false,
}: LightThemeProps) {
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const body = document.body;

    const apply = () => {
      root.classList.remove(
        "dark",
        "normal",
        "theme-dark",
        "theme-normal",
      );

      root.classList.add("light");

      root.setAttribute("data-theme", "light");
      root.setAttribute("data-color-mode", "light");

      body.setAttribute("data-theme", "light");
      body.setAttribute("data-color-mode", "light");

      root.style.setProperty("color-scheme", "light");
      body.style.setProperty("color-scheme", "light");
    };

    apply();

    const observer = new MutationObserver(() => {
      if (
        !root.classList.contains("light") ||
        root.getAttribute("data-theme") !== "light" ||
        root.getAttribute("data-color-mode") !== "light"
      ) {
        apply();
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: [
        "class",
        "data-theme",
        "data-color-mode",
      ],
    });

    return () => {
      observer.disconnect();

      root.classList.remove("light");

      if (root.getAttribute("data-theme") === "light") {
        root.removeAttribute("data-theme");
      }

      if (root.getAttribute("data-color-mode") === "light") {
        root.removeAttribute("data-color-mode");
      }

      if (body.getAttribute("data-theme") === "light") {
        body.removeAttribute("data-theme");
      }

      if (body.getAttribute("data-color-mode") === "light") {
        body.removeAttribute("data-color-mode");
      }

      root.style.removeProperty("color-scheme");
      body.style.removeProperty("color-scheme");
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <style
      id={STYLE_ID}
      dangerouslySetInnerHTML={{
        __html: `
/* ============================================================
   NEXAFLOW AI
   COMPLETE PROFESSIONAL LIGHT MODE
   GLOBAL APPLICATION
   ============================================================ */

html.light {
  color-scheme: light !important;

  --nf-bg: #f5f6f8;
  --nf-bg-soft: #eef0f3;
  --nf-bg-elevated: #ffffff;
  --nf-bg-panel: #ffffff;

  --nf-surface: #ffffff;
  --nf-surface-soft: #f8f9fb;
  --nf-surface-strong: #ffffff;
  --nf-surface-hover: #f4f5f7;

  --nf-card: #ffffff;
  --nf-card-hover: #fbfbfc;

  --nf-text: #17191c;
  --nf-text-soft: #30343a;
  --nf-text-muted: #68707a;
  --nf-text-faint: #969da6;

  --nf-border: #e1e4e8;
  --nf-border-soft: #eceef1;
  --nf-border-strong: #cfd4da;

  --nf-gold: #c88a0a;
  --nf-gold-bright: #e3a91d;
  --nf-gold-light: #f3c75a;

  --nf-gold-soft: rgba(200, 138, 10, 0.10);
  --nf-gold-border: rgba(200, 138, 10, 0.24);
  --nf-gold-glow: rgba(200, 138, 10, 0.18);

  --nf-green: #16844a;
  --nf-green-soft: rgba(22, 132, 74, 0.10);

  --nf-red: #c94141;
  --nf-red-soft: rgba(201, 65, 65, 0.09);

  --nf-blue: #3b6ea8;
  --nf-blue-soft: rgba(59, 110, 168, 0.09);

  --nf-purple: #7655a8;
  --nf-purple-soft: rgba(118, 85, 168, 0.09);

  --nf-orange: #c87520;
  --nf-orange-soft: rgba(200, 117, 32, 0.09);

  --nf-chart-grid: #e1e5e9;
  --nf-chart-axis: #7a828c;
  --nf-chart-label: #59616b;
  --nf-chart-tooltip: #ffffff;
  --nf-chart-tooltip-border: #dfe3e8;

  --nf-shadow-xs:
    0 1px 3px rgba(20, 24, 30, 0.05);

  --nf-shadow-sm:
    0 5px 18px rgba(20, 24, 30, 0.06);

  --nf-shadow-md:
    0 14px 40px rgba(20, 24, 30, 0.09);

  --nf-shadow-lg:
    0 28px 80px rgba(20, 24, 30, 0.13);

  background: var(--nf-bg) !important;
  color: var(--nf-text) !important;
}


/* ============================================================
   GLOBAL DOCUMENT
   ============================================================ */

html.light,
html.light body {
  min-height: 100%;
  background: var(--nf-bg) !important;
  color: var(--nf-text) !important;
}

html.light body {
  background:
    radial-gradient(
      circle at 50% -20%,
      rgba(227, 169, 29, 0.10),
      transparent 34%
    ),
    linear-gradient(
      180deg,
      #fafbfc 0%,
      #f5f6f8 48%,
      #f2f4f6 100%
    ) !important;
}

html.light *,
html.light *::before,
html.light *::after {
  box-sizing: border-box;
}


/* ============================================================
   ALL MAIN PAGE CONTAINERS
   HOME
   DASHBOARD
   WORKFLOWS
   LEADS
   ANALYTICS
   TASKS
   CONVERSATIONS
   SETTINGS
   ============================================================ */

html.light main,
html.light [role="main"],
html.light section,
html.light article,
html.light aside,
html.light header,
html.light footer,
html.light nav,
html.light form,
html.light dialog {
  color: var(--nf-text);
}


/* ============================================================
   PAGE-SPECIFIC ROOTS
   ============================================================ */

html.light [class*="dashboard"],
html.light [class*="Dashboard"],
html.light [class*="workflow"],
html.light [class*="Workflow"],
html.light [class*="lead"],
html.light [class*="Lead"],
html.light [class*="analytic"],
html.light [class*="Analytic"],
html.light [class*="task"],
html.light [class*="Task"],
html.light [class*="conversation"],
html.light [class*="Conversation"],
html.light [class*="setting"],
html.light [class*="Setting"],
html.light [class*="chat"],
html.light [class*="Chat"] {
  color: var(--nf-text);
}


/* ============================================================
   DARK TAILWIND SURFACES
   ============================================================ */

html.light .bg-black,
html.light .bg-zinc-950,
html.light .bg-zinc-900,
html.light .bg-zinc-800,
html.light .bg-zinc-700,
html.light .bg-neutral-950,
html.light .bg-neutral-900,
html.light .bg-neutral-800,
html.light .bg-neutral-700,
html.light .bg-gray-950,
html.light .bg-gray-900,
html.light .bg-gray-800,
html.light .bg-gray-700,
html.light .bg-slate-950,
html.light .bg-slate-900,
html.light .bg-slate-800,
html.light .bg-slate-700 {
  background-color: var(--nf-surface) !important;
}


/* ============================================================
   DARK TRANSPARENT TAILWIND SURFACES
   ============================================================ */

html.light .bg-black\\/5,
html.light .bg-black\\/10,
html.light .bg-black\\/20,
html.light .bg-black\\/30,
html.light .bg-black\\/40,
html.light .bg-black\\/50,
html.light .bg-black\\/60,
html.light .bg-black\\/70,
html.light .bg-black\\/80,
html.light .bg-black\\/90,
html.light .bg-black\\/95 {
  background-color: rgba(255, 255, 255, 0.88) !important;
}


/* ============================================================
   NEXAFLOW ORIGINAL DARK ARBITRARY SURFACES
   ============================================================ */

html.light [class*="bg-[#000000]"],
html.light [class*="bg-[#060606]"],
html.light [class*="bg-[#070707]"],
html.light [class*="bg-[#080808]"],
html.light [class*="bg-[#090909]"],
html.light [class*="bg-[#0a0a09]"],
html.light [class*="bg-[#0b0b0b]"],
html.light [class*="bg-[#0e0e0e]"],
html.light [class*="bg-[#10100e]"],
html.light [class*="bg-[#111111]"],
html.light [class*="bg-[#151411]"],
html.light [class*="bg-[#151713]"],
html.light [class*="bg-[#1B1F19]"],
html.light [class*="bg-[#1b1f19]"],
html.light [class*="bg-[#20241D]"],
html.light [class*="bg-[#20241d]"],
html.light [class*="bg-[#252A22]"],
html.light [class*="bg-[#252a22]"] {
  background-color: var(--nf-surface) !important;
}


/* ============================================================
   DARK GRADIENTS
   ============================================================ */

html.light [class*="from-[#000000]"],
html.light [class*="from-[#060606]"],
html.light [class*="from-[#070707]"],
html.light [class*="from-[#080808]"],
html.light [class*="from-[#090909]"],
html.light [class*="from-[#10100e]"],
html.light [class*="from-[#151713]"],
html.light [class*="from-[#1B1F19]"],
html.light [class*="from-[#1b1f19]"],
html.light [class*="from-[#20241D]"],
html.light [class*="from-[#20241d]"],
html.light [class*="from-[#252A22]"],
html.light [class*="from-[#252a22]"] {
  --tw-gradient-from: #ffffff !important;
}

html.light [class*="via-[#000000]"],
html.light [class*="via-[#060606]"],
html.light [class*="via-[#070707]"],
html.light [class*="via-[#080808]"],
html.light [class*="via-[#090909]"],
html.light [class*="via-[#10100e]"],
html.light [class*="via-[#151713]"],
html.light [class*="via-[#1B1F19]"],
html.light [class*="via-[#1b1f19]"],
html.light [class*="via-[#20241D]"],
html.light [class*="via-[#20241d]"] {
  --tw-gradient-via: #f8f9fb !important;
}

html.light [class*="to-[#000000]"],
html.light [class*="to-[#060606]"],
html.light [class*="to-[#070707]"],
html.light [class*="to-[#080808]"],
html.light [class*="to-[#090909]"],
html.light [class*="to-[#10100e]"],
html.light [class*="to-[#151713]"],
html.light [class*="to-[#1B1F19]"],
html.light [class*="to-[#1b1f19]"],
html.light [class*="to-[#20241D]"],
html.light [class*="to-[#20241d]"],
html.light [class*="to-[#252A22]"],
html.light [class*="to-[#252a22]"] {
  --tw-gradient-to: #f5f6f8 !important;
}


/* ============================================================
   WHITE / TRANSPARENT DARK-STYLE SURFACES
   ============================================================ */

html.light [class*="bg-white\\/5"],
html.light [class*="bg-white\\/10"],
html.light [class*="bg-white\\/15"],
html.light [class*="bg-white\\/20"],
html.light [class*="bg-white\\/25"] {
  background-color: #ffffff !important;
}


/* ============================================================
   TEXT
   ============================================================ */

html.light .text-white,
html.light .text-white\\/95,
html.light .text-white\\/90,
html.light .text-white\\/85,
html.light .text-white\\/80,
html.light .text-white\\/75,
html.light .text-white\\/70,
html.light .text-white\\/65,
html.light .text-white\\/60,
html.light .text-white\\/55,
html.light .text-white\\/50 {
  color: var(--nf-text) !important;
}

html.light .text-gray-50,
html.light .text-gray-100,
html.light .text-gray-200,
html.light .text-gray-300,
html.light .text-zinc-50,
html.light .text-zinc-100,
html.light .text-zinc-200,
html.light .text-zinc-300,
html.light .text-neutral-50,
html.light .text-neutral-100,
html.light .text-neutral-200,
html.light .text-neutral-300,
html.light .text-slate-50,
html.light .text-slate-100,
html.light .text-slate-200,
html.light .text-slate-300 {
  color: var(--nf-text-soft) !important;
}

html.light .text-gray-400,
html.light .text-gray-500,
html.light .text-gray-600,
html.light .text-zinc-400,
html.light .text-zinc-500,
html.light .text-zinc-600,
html.light .text-neutral-400,
html.light .text-neutral-500,
html.light .text-neutral-600,
html.light .text-slate-400,
html.light .text-slate-500,
html.light .text-slate-600 {
  color: var(--nf-text-muted) !important;
}


/* ============================================================
   ORIGINAL NEXAFLOW TEXT COLORS
   ============================================================ */

html.light [class*="text-[#F4F0E6]"],
html.light [class*="text-[#f4f0e6]"] {
  color: var(--nf-text) !important;
}

html.light [class*="text-[#F5D98B]"],
html.light [class*="text-[#f5d98b]"] {
  color: #9b6900 !important;
}

html.light [class*="text-[#9A9D94]"],
html.light [class*="text-[#9a9d94]"] {
  color: var(--nf-text-muted) !important;
}

html.light [class*="text-[#E7B84B]"],
html.light [class*="text-[#e7b84b]"] {
  color: #a86f00 !important;
}


/* ============================================================
   BORDERS
   ============================================================ */

html.light [class*="border-white"],
html.light .border-white\\/5,
html.light .border-white\\/10,
html.light .border-white\\/20 {
  border-color: var(--nf-border) !important;
}

html.light .border-gray-700,
html.light .border-gray-800,
html.light .border-gray-900,
html.light .border-zinc-700,
html.light .border-zinc-800,
html.light .border-zinc-900,
html.light .border-neutral-700,
html.light .border-neutral-800,
html.light .border-neutral-900,
html.light .border-slate-700,
html.light .border-slate-800,
html.light .border-slate-900 {
  border-color: var(--nf-border) !important;
}


/* ============================================================
   ALL DARK ARBITRARY BORDERS
   ============================================================ */

html.light [class*="border-[#000000]"],
html.light [class*="border-[#060606]"],
html.light [class*="border-[#070707]"],
html.light [class*="border-[#080808]"],
html.light [class*="border-[#090909]"],
html.light [class*="border-[#10100e]"],
html.light [class*="border-[#151713]"],
html.light [class*="border-[#1B1F19]"],
html.light [class*="border-[#1b1f19]"],
html.light [class*="border-[#20241D]"],
html.light [class*="border-[#20241d]"],
html.light [class*="border-[#252A22]"],
html.light [class*="border-[#252a22]"] {
  border-color: var(--nf-border) !important;
}


/* ============================================================
   SIDEBAR
   ============================================================ */

html.light aside {
  background: rgba(255, 255, 255, 0.97) !important;
  color: var(--nf-text) !important;
  border-color: var(--nf-border) !important;

  box-shadow:
    8px 0 35px rgba(20, 24, 30, 0.055) !important;

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

html.light aside * {
  border-color: var(--nf-border);
}

html.light aside a,
html.light aside button {
  color: #59616a !important;
}

html.light aside a:hover,
html.light aside button:hover {
  color: var(--nf-text) !important;

  background:
    rgba(200, 138, 10, 0.075) !important;
}

html.light aside [aria-current="page"],
html.light aside .active,
html.light aside [data-active="true"] {
  color: #9b6900 !important;

  background:
    linear-gradient(
      90deg,
      rgba(200, 138, 10, 0.12),
      rgba(200, 138, 10, 0.035)
    ) !important;

  border-color:
    rgba(200, 138, 10, 0.18) !important;

  box-shadow:
    inset 3px 0 0 rgba(200, 138, 10, 0.80) !important;
}


/* ============================================================
   TOPBAR / HEADER
   ============================================================ */

html.light header {
  background:
    rgba(255, 255, 255, 0.94) !important;

  color: var(--nf-text) !important;

  border-color: var(--nf-border) !important;

  box-shadow:
    0 5px 24px rgba(20, 24, 30, 0.045) !important;

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

html.light header * {
  border-color: var(--nf-border);
}

html.light header button {
  color: #59616a !important;
}

html.light header button:hover {
  color: #9b6900 !important;

  background:
    rgba(200, 138, 10, 0.075) !important;
}


/* ============================================================
   CARDS / PANELS
   ============================================================ */

html.light [class*="rounded-xl"],
html.light [class*="rounded-2xl"],
html.light [class*="rounded-3xl"] {
  border-color: var(--nf-border);
}

html.light [class*="rounded-xl"][class*="border"],
html.light [class*="rounded-2xl"][class*="border"],
html.light [class*="rounded-3xl"][class*="border"] {
  background-color: var(--nf-card) !important;

  box-shadow:
    var(--nf-shadow-sm);
}


/* ============================================================
   GLASS
   ============================================================ */

html.light .nf-glass,
html.light .nf-glass-strong {
  background:
    rgba(255, 255, 255, 0.90) !important;

  color:
    var(--nf-text) !important;

  border-color:
    var(--nf-border) !important;

  box-shadow:
    var(--nf-shadow-md) !important;

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}


/* ============================================================
   FORMS
   ============================================================ */

html.light input,
html.light textarea,
html.light select {
  color: var(--nf-text) !important;

  background:
    #ffffff !important;

  border-color:
    var(--nf-border-strong) !important;

  caret-color:
    var(--nf-gold) !important;

  color-scheme:
    light !important;
}

html.light input::placeholder,
html.light textarea::placeholder {
  color:
    #9aa1aa !important;
}

html.light input:hover,
html.light textarea:hover,
html.light select:hover {
  border-color:
    #c4a14d !important;
}

html.light input:focus,
html.light textarea:focus,
html.light select:focus {
  border-color:
    rgba(200, 138, 10, 0.62) !important;

  outline:
    none !important;

  box-shadow:
    0 0 0 3px rgba(200, 138, 10, 0.09) !important;
}


/* ============================================================
   BUTTONS
   ============================================================ */

html.light button {
  color: var(--nf-text-soft);
}

html.light button[class*="bg-[#E7B84B]"],
html.light button[class*="bg-[#e7b84b]"],
html.light button[class*="bg-[#F5D98B]"],
html.light button[class*="bg-[#f5d98b]"] {
  color:
    #19160f !important;

  background:
    #e7b84b !important;

  border-color:
    #d09a24 !important;

  box-shadow:
    0 5px 18px rgba(200, 138, 10, 0.13) !important;
}

html.light button[class*="bg-[#E7B84B]"]:hover,
html.light button[class*="bg-[#e7b84b]"]:hover {
  background:
    #efc45c !important;

  box-shadow:
    0 9px 26px rgba(200, 138, 10, 0.20) !important;
}


/* ============================================================
   LINKS
   ============================================================ */

html.light a {
  color: inherit;
}

html.light a:hover {
  color: #9b6900;
}


/* ============================================================
   TABLES
   ============================================================ */

html.light table {
  color: var(--nf-text) !important;

  background:
    #ffffff !important;

  border-color:
    var(--nf-border) !important;
}

html.light thead {
  background:
    #f7f8fa !important;
}

html.light th {
  color:
    #68707a !important;

  background:
    #f7f8fa !important;

  border-color:
    var(--nf-border) !important;
}

html.light td {
  color:
    #343941 !important;

  border-color:
    var(--nf-border-soft) !important;
}

html.light tbody tr:hover {
  background:
    rgba(200, 138, 10, 0.035) !important;
}


/* ============================================================
   STATUS COLORS
   ============================================================ */

html.light [class*="bg-green-"] {
  background:
    var(--nf-green-soft) !important;
}

html.light [class*="text-green-"] {
  color:
    var(--nf-green) !important;
}

html.light [class*="bg-red-"] {
  background:
    var(--nf-red-soft) !important;
}

html.light [class*="text-red-"] {
  color:
    var(--nf-red) !important;
}

html.light [class*="bg-blue-"] {
  background:
    var(--nf-blue-soft) !important;
}

html.light [class*="text-blue-"] {
  color:
    var(--nf-blue) !important;
}

html.light [class*="bg-purple-"] {
  background:
    var(--nf-purple-soft) !important;
}

html.light [class*="text-purple-"] {
  color:
    var(--nf-purple) !important;
}

html.light [class*="bg-amber-"],
html.light [class*="bg-yellow-"] {
  background:
    var(--nf-gold-soft) !important;
}

html.light [class*="text-amber-"],
html.light [class*="text-yellow-"] {
  color:
    #a86f00 !important;
}


/* ============================================================
   HOME / DASHBOARD
   ============================================================ */

html.light [data-dashboard],
html.light [data-dashboard-card],
html.light .nf-depth,
html.light .nf-dashboard-3d {
  background:
    #ffffff !important;

  color:
    var(--nf-text) !important;

  border-color:
    var(--nf-border) !important;

  box-shadow:
    var(--nf-shadow-md) !important;
}


/* ============================================================
   WORKFLOWS
   ============================================================ */

html.light [class*="workflow"],
html.light [class*="Workflow"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="workflow"] canvas,
html.light [class*="Workflow"] canvas {
  background:
    #f8f9fb !important;
}


/* Workflow dark surfaces */

html.light [class*="workflow"] .bg-black,
html.light [class*="Workflow"] .bg-black,
html.light [class*="workflow"] .bg-zinc-950,
html.light [class*="Workflow"] .bg-zinc-950,
html.light [class*="workflow"] .bg-zinc-900,
html.light [class*="Workflow"] .bg-zinc-900 {
  background:
    #ffffff !important;
}


/* ============================================================
   LEADS
   ============================================================ */

html.light [class*="lead"],
html.light [class*="Lead"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="lead"] .bg-black,
html.light [class*="Lead"] .bg-black,
html.light [class*="lead"] .bg-zinc-950,
html.light [class*="Lead"] .bg-zinc-950,
html.light [class*="lead"] .bg-zinc-900,
html.light [class*="Lead"] .bg-zinc-900 {
  background:
    #ffffff !important;
}


/* ============================================================
   TASKS
   ============================================================ */

html.light [class*="task"],
html.light [class*="Task"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="task"] .bg-black,
html.light [class*="Task"] .bg-black,
html.light [class*="task"] .bg-zinc-950,
html.light [class*="Task"] .bg-zinc-950,
html.light [class*="task"] .bg-zinc-900,
html.light [class*="Task"] .bg-zinc-900 {
  background:
    #ffffff !important;
}


/* ============================================================
   ANALYTICS
   ============================================================ */

html.light [class*="analytic"],
html.light [class*="Analytic"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="analytic"] .bg-black,
html.light [class*="Analytic"] .bg-black,
html.light [class*="analytic"] .bg-zinc-950,
html.light [class*="Analytic"] .bg-zinc-950,
html.light [class*="analytic"] .bg-zinc-900,
html.light [class*="Analytic"] .bg-zinc-900 {
  background:
    #ffffff !important;
}


/* ============================================================
   CONVERSATIONS / AI
   ============================================================ */

html.light [class*="conversation"],
html.light [class*="Conversation"],
html.light [class*="chat"],
html.light [class*="Chat"],
html.light [class*="ai"],
html.light [class*="AI"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="conversation"] .bg-black,
html.light [class*="Conversation"] .bg-black,
html.light [class*="chat"] .bg-black,
html.light [class*="Chat"] .bg-black,
html.light [class*="ai"] .bg-black,
html.light [class*="AI"] .bg-black {
  background:
    #ffffff !important;
}

html.light [class*="conversation"] .bg-zinc-950,
html.light [class*="Conversation"] .bg-zinc-950,
html.light [class*="chat"] .bg-zinc-950,
html.light [class*="Chat"] .bg-zinc-950,
html.light [class*="ai"] .bg-zinc-950,
html.light [class*="AI"] .bg-zinc-950 {
  background:
    #ffffff !important;
}


/* ============================================================
   SETTINGS
   ============================================================ */

html.light [class*="settings"],
html.light [class*="Settings"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="settings"] .bg-black,
html.light [class*="Settings"] .bg-black,
html.light [class*="settings"] .bg-zinc-950,
html.light [class*="Settings"] .bg-zinc-950,
html.light [class*="settings"] .bg-zinc-900,
html.light [class*="Settings"] .bg-zinc-900 {
  background:
    #ffffff !important;
}


/* ============================================================
   ANALYTICS — RECHARTS
   ============================================================ */

html.light svg {
  color:
    var(--nf-chart-label);
}

html.light svg text {
  fill:
    var(--nf-chart-label) !important;
}

html.light svg line {
  stroke:
    var(--nf-chart-grid);
}

html.light [class*="recharts-cartesian-grid"] line {
  stroke:
    var(--nf-chart-grid) !important;
}

html.light [class*="recharts-cartesian-axis"] line {
  stroke:
    #cfd4da !important;
}

html.light [class*="recharts-cartesian-axis"] text {
  fill:
    var(--nf-chart-axis) !important;
}

html.light [class*="recharts-tooltip-wrapper"] {
  color:
    var(--nf-text) !important;
}

html.light [class*="recharts-default-tooltip"] {
  background:
    #ffffff !important;

  border:
    1px solid var(--nf-chart-tooltip-border) !important;

  box-shadow:
    var(--nf-shadow-md) !important;

  color:
    var(--nf-text) !important;
}

html.light [class*="chart-tooltip"],
html.light [class*="ChartTooltip"] {
  background:
    #ffffff !important;

  color:
    var(--nf-text) !important;

  border-color:
    var(--nf-border) !important;

  box-shadow:
    var(--nf-shadow-md) !important;
}


/* ============================================================
   SVG / GRAPH BACKGROUNDS
   ============================================================ */

html.light svg rect[class*="background"],
html.light svg rect[class*="Background"] {
  fill:
    #ffffff !important;
}

html.light svg .recharts-surface {
  background:
    transparent !important;
}


/* ============================================================
   MODALS
   ============================================================ */

html.light dialog,
html.light [role="dialog"],
html.light [data-radix-dialog-content],
html.light [data-radix-popover-content] {
  color:
    var(--nf-text) !important;

  background:
    #ffffff !important;

  border-color:
    var(--nf-border) !important;

  box-shadow:
    var(--nf-shadow-lg) !important;
}

html.light .nf-overlay {
  background:
    rgba(18, 22, 27, 0.34) !important;
}

html.light .nf-modal {
  color:
    var(--nf-text) !important;

  background:
    #ffffff !important;

  border-color:
    var(--nf-border) !important;

  box-shadow:
    var(--nf-shadow-lg) !important;
}


/* ============================================================
   DROPDOWNS
   ============================================================ */

html.light [role="menu"],
html.light [role="listbox"],
html.light [data-radix-menu-content],
html.light [data-radix-select-content],
html.light [data-radix-dropdown-menu-content] {
  color:
    var(--nf-text) !important;

  background:
    #ffffff !important;

  border-color:
    var(--nf-border) !important;

  box-shadow:
    var(--nf-shadow-md) !important;
}

html.light [role="option"] {
  color:
    var(--nf-text-soft) !important;

  background:
    #ffffff !important;
}

html.light [role="menuitem"] {
  color:
    var(--nf-text-soft) !important;
}

html.light [role="menuitem"]:hover,
html.light [role="option"]:hover {
  color:
    var(--nf-text) !important;

  background:
    var(--nf-gold-soft) !important;
}


/* ============================================================
   TABS
   ============================================================ */

html.light [role="tab"] {
  color:
    var(--nf-text-muted) !important;
}

html.light [role="tab"][aria-selected="true"] {
  color:
    #9b6900 !important;

  background:
    var(--nf-gold-soft) !important;
}


/* ============================================================
   FOOTER
   ============================================================ */

html.light footer {
  background:
    rgba(255, 255, 255, 0.92) !important;

  color:
    var(--nf-text-muted) !important;

  border-color:
    var(--nf-border) !important;
}

html.light footer * {
  border-color:
    var(--nf-border);
}

html.light footer a:hover {
  color:
    #9b6900 !important;
}


/* ============================================================
   NEXAFLOW SPECIAL SURFACES
   ============================================================ */

html.light .nf-black-surface {
  background:
    #ffffff !important;

  color:
    var(--nf-text) !important;

  border-color:
    var(--nf-border) !important;
}

html.light .nf-cinematic-bg {
  background:
    radial-gradient(
      ellipse at 50% 0%,
      rgba(227, 169, 29, 0.10),
      transparent 35%
    ),
    #f5f6f8 !important;
}

html.light .nf-grid-bg {
  background:
    #f5f6f8 !important;
}

html.light .nf-grid-bg::before {
  background-image:
    linear-gradient(
      rgba(50, 56, 64, 0.045) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(50, 56, 64, 0.045) 1px,
      transparent 1px
    ) !important;
}

html.light .nf-grid-bg::after {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(227, 169, 29, 0.10),
      transparent 34%
    ) !important;
}


/* ============================================================
   INLINE DARK STYLES
   ============================================================ */

html.light [style*="background:#000"],
html.light [style*="background: #000"],
html.light [style*="background-color:#000"],
html.light [style*="background-color: #000"],

html.light [style*="background:#060606"],
html.light [style*="background: #060606"],
html.light [style*="background:#070707"],
html.light [style*="background: #070707"],
html.light [style*="background:#080808"],
html.light [style*="background: #080808"],
html.light [style*="background:#090909"],
html.light [style*="background: #090909"],
html.light [style*="background:#0a0a09"],
html.light [style*="background: #0a0a09"],
html.light [style*="background:#10100e"],
html.light [style*="background: #10100e"],
html.light [style*="background:#151713"],
html.light [style*="background: #151713"],
html.light [style*="background:#1B1F19"],
html.light [style*="background: #1B1F19"],
html.light [style*="background:#20241D"],
html.light [style*="background: #20241D"],
html.light [style*="background:#252A22"],
html.light [style*="background: #252A22"] {
  background:
    #ffffff !important;
}


/* ============================================================
   PLACEHOLDER / FORM STATES
   ============================================================ */

html.light input::placeholder,
html.light textarea::placeholder {
  color:
    #9aa1aa !important;
}

html.light input:disabled,
html.light textarea:disabled,
html.light select:disabled,
html.light button:disabled {
  opacity:
    0.55 !important;

  cursor:
    not-allowed !important;
}


/* ============================================================
   AUTOFILL
   ============================================================ */

html.light input:-webkit-autofill,
html.light input:-webkit-autofill:hover,
html.light input:-webkit-autofill:focus,
html.light textarea:-webkit-autofill,
html.light select:-webkit-autofill {
  -webkit-text-fill-color:
    var(--nf-text) !important;

  -webkit-box-shadow:
    0 0 0 1000px #ffffff inset !important;

  transition:
    background-color 9999s ease-in-out 0s !important;
}


/* ============================================================
   HR / DIVIDERS
   ============================================================ */

html.light hr {
  border-color:
    var(--nf-border) !important;
}


/* ============================================================
   SKELETON
   ============================================================ */

html.light [class*="animate-pulse"] {
  background:
    #e9ebee !important;
}


/* ============================================================
   SCROLLBAR
   ============================================================ */

html.light {
  scrollbar-color:
    #c9cdd2 #eef0f3;
}

html.light ::-webkit-scrollbar {
  width:
    10px;

  height:
    10px;
}

html.light ::-webkit-scrollbar-track {
  background:
    #eef0f3;
}

html.light ::-webkit-scrollbar-thumb {
  background:
    #c5c9ce;

  border:
    3px solid #eef0f3;

  border-radius:
    999px;
}

html.light ::-webkit-scrollbar-thumb:hover {
  background:
    #a9afb7;
}


/* ============================================================
   SELECTION
   ============================================================ */

html.light ::selection {
  background:
    rgba(200, 138, 10, 0.22) !important;

  color:
    #17191c !important;
}


/* ============================================================
   FOCUS
   ============================================================ */

html.light button:focus-visible,
html.light a:focus-visible,
html.light input:focus-visible,
html.light textarea:focus-visible,
html.light select:focus-visible {
  outline:
    2px solid rgba(200, 138, 10, 0.52) !important;

  outline-offset:
    2px !important;
}


/* ============================================================
   MOBILE
   ============================================================ */

@media (max-width: 768px) {

  html.light body {
    background:
      linear-gradient(
        180deg,
        #fafbfc 0%,
        #f4f5f7 100%
      ) !important;
  }

  html.light aside {
    background:
      rgba(255, 255, 255, 0.985) !important;

    box-shadow:
      10px 0 40px rgba(20, 24, 30, 0.10) !important;
  }

  html.light .nf-glass,
  html.light .nf-glass-strong {
    backdrop-filter:
      blur(14px);

    -webkit-backdrop-filter:
      blur(14px);
  }
}


/* ============================================================
   REDUCED MOTION
   ============================================================ */

@media (prefers-reduced-motion: reduce) {

  html.light *,
  html.light *::before,
  html.light *::after {
    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      0.01ms !important;

    scroll-behavior:
      auto !important;
  }
}


/* ============================================================
   FINAL GLOBAL GUARANTEE
   ============================================================ */

html.light {
  background:
    var(--nf-bg) !important;

  color:
    var(--nf-text) !important;
}

html.light body {
  background-color:
    var(--nf-bg) !important;

  color:
    var(--nf-text) !important;
}

html.light main {
  background-color:
    transparent;
  
  color:
    var(--nf-text) !important;
}

html.light [hidden] {
  display:
    none !important;
}
`,
      }}
    />
  );
}