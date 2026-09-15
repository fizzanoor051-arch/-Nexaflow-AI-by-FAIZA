"use client";

import { useEffect } from "react";

/**
 * NexaFlow AI — Professional Light Theme
 *
 * This component is ONLY responsible for Light Mode.
 *
 * When active:
 * - Forces the complete application into Light Mode
 * - Applies light styling globally
 * - Covers dashboard, analytics, settings, leads, tasks,
 *   workflows, conversations, sidebar, topbar and footer
 * - Converts dark Tailwind surfaces into light surfaces
 * - Preserves NexaFlow gold / amber identity
 *
 * Usage:
 * <LightTheme active={true} />
 */

type LightThemeProps = {
  active?: boolean;
};

export default function LightTheme({
  active = false,
}: LightThemeProps) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (active) {
      root.classList.add("light");

      root.classList.remove(
        "dark",
        "normal",
        "theme-dark",
        "theme-normal",
      );

      root.setAttribute("data-theme", "light");
      root.setAttribute("data-color-mode", "light");

      body.setAttribute("data-theme", "light");
      body.setAttribute("data-color-mode", "light");

      root.style.colorScheme = "light";
      body.style.colorScheme = "light";
    }

    return () => {
      if (active) {
        root.classList.remove("light");
        root.removeAttribute("data-theme");
        root.removeAttribute("data-color-mode");

        body.removeAttribute("data-theme");
        body.removeAttribute("data-color-mode");

        root.style.removeProperty("color-scheme");
        body.style.removeProperty("color-scheme");
      }
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <style
      id="nexaflow-professional-light-theme"
      dangerouslySetInnerHTML={{
        __html: `
/* =========================================================
   NEXAFLOW AI
   COMPLETE PROFESSIONAL LIGHT MODE
   ========================================================= */

html.light {
  color-scheme: light;

  --nf-bg: #f6f4ee;
  --nf-bg-soft: #efede5;
  --nf-bg-elevated: #ffffff;
  --nf-bg-panel: #ffffff;

  --nf-surface: rgba(255, 255, 255, 0.82);
  --nf-surface-strong: rgba(255, 255, 255, 0.96);
  --nf-surface-soft: rgba(27, 31, 25, 0.035);

  --nf-border: rgba(31, 30, 24, 0.10);
  --nf-border-soft: rgba(31, 30, 24, 0.065);
  --nf-border-strong: rgba(31, 30, 24, 0.16);

  --nf-text: #181914;
  --nf-text-soft: #3f4038;
  --nf-text-muted: #6f7067;
  --nf-text-faint: #96978e;

  --nf-gold: #c98a08;
  --nf-gold-bright: #e0a51a;
  --nf-gold-soft: rgba(201, 138, 8, 0.10);
  --nf-gold-border: rgba(201, 138, 8, 0.22);

  --nf-green: #18864b;
  --nf-red: #c94a35;
  --nf-blue: #3d6fa8;

  --nf-shadow-sm:
    0 8px 28px rgba(38, 34, 20, 0.07);

  --nf-shadow-md:
    0 18px 55px rgba(38, 34, 20, 0.10);

  --nf-shadow-lg:
    0 35px 100px rgba(38, 34, 20, 0.15);

  background: #f6f4ee !important;
  color: #181914 !important;
}

/* =========================================================
   ROOT / BODY
   ========================================================= */

html.light,
html.light body {
  min-height: 100%;
  background: #f6f4ee !important;
  color: #181914 !important;
}

html.light body {
  background:
    radial-gradient(
      circle at 50% -15%,
      rgba(231, 184, 75, 0.16),
      transparent 34%
    ),
    radial-gradient(
      circle at 0% 30%,
      rgba(231, 184, 75, 0.055),
      transparent 27%
    ),
    radial-gradient(
      circle at 100% 70%,
      rgba(205, 148, 25, 0.045),
      transparent 28%
    ),
    #f6f4ee !important;
}

/* =========================================================
   GLOBAL APP CONTAINERS
   ========================================================= */

html.light main,
html.light section,
html.light article,
html.light footer,
html.light aside,
html.light header,
html.light nav {
  color: #181914;
}

/* =========================================================
   DARK BACKGROUNDS → LIGHT
   ========================================================= */

html.light .bg-\\[\\#060606\\],
html.light .bg-\\[\\#0a0a09\\],
html.light .bg-\\[\\#10100e\\],
html.light .bg-\\[\\#151411\\],
html.light .bg-\\[\\#151713\\],
html.light .bg-\\[\\#1B1F19\\],
html.light .bg-\\[\\#1b1f19\\],
html.light .bg-\\[\\#20241D\\],
html.light .bg-\\[\\#20241d\\],
html.light .bg-\\[\\#252A22\\],
html.light .bg-\\[\\#252a22\\],
html.light .bg-black,
html.light .bg-black\\/20,
html.light .bg-black\\/30,
html.light .bg-black\\/40,
html.light .bg-black\\/50,
html.light .bg-black\\/60,
html.light .bg-black\\/70,
html.light .bg-black\\/80,
html.light .bg-black\\/90,
html.light .bg-zinc-950,
html.light .bg-neutral-950,
html.light .bg-neutral-900,
html.light .bg-gray-950,
html.light .bg-slate-950 {
  background-color: #ffffff !important;
}

/* =========================================================
   GENERIC DARK SURFACES
   ========================================================= */

html.light [class*="bg-zinc-9"],
html.light [class*="bg-neutral-9"],
html.light [class*="bg-gray-9"],
html.light [class*="bg-slate-9"] {
  background-color: #ffffff !important;
}

html.light [class*="bg-zinc-8"],
html.light [class*="bg-neutral-8"],
html.light [class*="bg-gray-8"],
html.light [class*="bg-slate-8"] {
  background-color: #faf9f5 !important;
}

/* =========================================================
   TEXT — GLOBAL
   ========================================================= */

html.light .text-white,
html.light .text-white\\/90,
html.light .text-white\\/80,
html.light .text-white\\/70,
html.light .text-white\\/60,
html.light .text-white\\/50 {
  color: #181914 !important;
}

html.light .text-\\[\\#F4F0E6\\],
html.light .text-\\[\\#f4f0e6\\],
html.light .text-\\[\\#F5D98B\\],
html.light .text-\\[\\#f5d98b\\],
html.light .text-\\[\\#9A9D94\\],
html.light .text-\\[\\#9a9d94\\],
html.light .text-\\[\\#494d51\\],
html.light .text-\\[\\#62615c\\] {
  color: #181914 !important;
}

html.light .text-gray-100,
html.light .text-gray-200,
html.light .text-gray-300 {
  color: #3f4038 !important;
}

html.light .text-gray-400,
html.light .text-gray-500,
html.light .text-zinc-400,
html.light .text-zinc-500,
html.light .text-neutral-400,
html.light .text-neutral-500 {
  color: #6f7067 !important;
}

html.light .text-gray-600,
html.light .text-zinc-600,
html.light .text-neutral-600 {
  color: #77786f !important;
}

/* =========================================================
   SIDEBAR
   ========================================================= */

html.light aside {
  background: rgba(255, 255, 255, 0.96) !important;
  color: #181914 !important;

  border-color:
    rgba(31, 30, 24, 0.085) !important;

  box-shadow:
    10px 0 45px rgba(38, 34, 20, 0.055) !important;
}

html.light aside *,
html.light aside a,
html.light aside button {
  color: #55564e;
}

html.light aside a:hover,
html.light aside button:hover {
  color: #1b1c17 !important;

  background:
    rgba(201, 138, 8, 0.075) !important;
}

html.light aside [aria-current="page"],
html.light aside .active {
  color: #a86f00 !important;

  background:
    linear-gradient(
      90deg,
      rgba(201, 138, 8, 0.12),
      rgba(201, 138, 8, 0.045)
    ) !important;

  border-color:
    rgba(201, 138, 8, 0.16) !important;

  box-shadow:
    inset 3px 0 0 rgba(201, 138, 8, 0.75) !important;
}

/* Sidebar cards */

html.light aside [class*="bg-\\[\\#151713\\]"],
html.light aside [class*="bg-\\[\\#1B1F19\\]"],
html.light aside [class*="bg-\\[\\#1b1f19\\]"],
html.light aside [class*="bg-black"] {
  background:
    rgba(255, 255, 255, 0.94) !important;
}

/* =========================================================
   TOPBAR
   ========================================================= */

html.light header {
  background:
    rgba(255, 255, 255, 0.90) !important;

  color: #181914 !important;

  border-color:
    rgba(31, 30, 24, 0.085) !important;

  box-shadow:
    0 8px 35px rgba(38, 34, 20, 0.045) !important;
}

html.light header *,
html.light header button {
  color: #55564e;
}

html.light header button:hover {
  color: #a86f00 !important;

  background:
    rgba(201, 138, 8, 0.075) !important;
}

html.light header input {
  background:
    rgba(255, 255, 255, 0.94) !important;

  color: #181914 !important;
}

/* =========================================================
   FOOTER
   ========================================================= */

html.light footer {
  background:
    rgba(255, 255, 255, 0.82) !important;

  color: #55564e !important;

  border-color:
    rgba(31, 30, 24, 0.085) !important;
}

html.light footer *,
html.light footer p,
html.light footer span,
html.light footer a {
  color: #6f7067;
}

html.light footer a:hover {
  color: #a86f00 !important;
}

/* =========================================================
   GLASS CARDS
   ========================================================= */

html.light .nf-glass,
html.light .nf-glass-strong {
  color: #181914 !important;
}

html.light .nf-glass {
  border-color:
    rgba(31, 30, 24, 0.085) !important;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.94),
      rgba(255, 255, 255, 0.78)
    ),
    #ffffff !important;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 18px 55px rgba(38, 34, 20, 0.08) !important;
}

html.light .nf-glass-strong {
  border-color:
    rgba(31, 30, 24, 0.10) !important;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.99),
      rgba(250, 249, 244, 0.94)
    ),
    #ffffff !important;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    0 25px 80px rgba(38, 34, 20, 0.11) !important;
}

/* =========================================================
   ALL COMMON CARDS / PANELS
   ========================================================= */

html.light [class*="rounded-2xl"][class*="border"],
html.light [class*="rounded-xl"][class*="border"],
html.light [class*="rounded-lg"][class*="border"] {
  border-color:
    rgba(31, 30, 24, 0.085) !important;
}

/* =========================================================
   BORDERS
   ========================================================= */

html.light [class*="border-white"] {
  border-color:
    rgba(31, 30, 24, 0.085) !important;
}

html.light .border-white\\/5,
html.light .border-white\\/10,
html.light .border-white\\/\\[0\\.05\\],
html.light .border-white\\/\\[0\\.055\\],
html.light .border-white\\/\\[0\\.06\\],
html.light .border-white\\/\\[0\\.08\\],
html.light .border-white\\/\\[0\\.10\\] {
  border-color:
    rgba(31, 30, 24, 0.085) !important;
}

/* =========================================================
   INPUTS
   ========================================================= */

html.light input,
html.light textarea,
html.light select {
  color: #181914 !important;

  background:
    rgba(255, 255, 255, 0.94) !important;

  border-color:
    rgba(31, 30, 24, 0.13) !important;

  caret-color: #a86f00 !important;
}

html.light input::placeholder,
html.light textarea::placeholder {
  color: #999990 !important;
}

html.light input:hover,
html.light textarea:hover,
html.light select:hover {
  border-color:
    rgba(201, 138, 8, 0.28) !important;
}

html.light input:focus,
html.light textarea:focus,
html.light select:focus {
  border-color:
    rgba(201, 138, 8, 0.60) !important;

  outline: none !important;

  box-shadow:
    0 0 0 3px rgba(201, 138, 8, 0.075),
    0 8px 25px rgba(38, 34, 20, 0.055) !important;
}

/* =========================================================
   BUTTONS
   ========================================================= */

html.light button {
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

/* Gold buttons */

html.light button[class*="bg-\\[\\#E7B84B\\]"],
html.light button[class*="bg-\\[\\#e7b84b\\]"] {
  color: #17150f !important;

  background:
    #e7b84b !important;

  border-color:
    #d49d25 !important;
}

html.light button[class*="bg-\\[\\#E7B84B\\]"]:hover,
html.light button[class*="bg-\\[\\#e7b84b\\]"]:hover {
  color: #17150f !important;

  background:
    #f0c45b !important;

  box-shadow:
    0 10px 28px rgba(201, 138, 8, 0.20),
    0 0 30px rgba(201, 138, 8, 0.10) !important;
}

/* =========================================================
   LINKS
   ========================================================= */

html.light a {
  color: inherit;
}

html.light a:hover {
  color: #a86f00;
}

/* =========================================================
   TABLES
   ========================================================= */

html.light table {
  color: #292a24 !important;

  background:
    rgba(255, 255, 255, 0.70) !important;
}

html.light thead {
  background:
    rgba(31, 30, 24, 0.025) !important;
}

html.light th {
  color: #6f7067 !important;

  border-color:
    rgba(31, 30, 24, 0.075) !important;
}

html.light td {
  color: #3d3e37 !important;

  border-color:
    rgba(31, 30, 24, 0.065) !important;
}

html.light tbody tr:hover {
  background:
    rgba(201, 138, 8, 0.035) !important;
}

/* =========================================================
   BADGES / STATUS
   ========================================================= */

html.light [class*="bg-green-"] {
  background-color:
    rgba(24, 134, 75, 0.10) !important;
}

html.light [class*="bg-red-"] {
  background-color:
    rgba(201, 74, 53, 0.09) !important;
}

html.light [class*="bg-yellow-"],
html.light [class*="bg-amber-"] {
  background-color:
    rgba(201, 138, 8, 0.10) !important;
}

html.light [class*="text-green-"] {
  color: #18864b !important;
}

html.light [class*="text-red-"] {
  color: #c94a35 !important;
}

html.light [class*="text-yellow-"],
html.light [class*="text-amber-"] {
  color: #aa7200 !important;
}

/* =========================================================
   DASHBOARD
   ========================================================= */

html.light .nf-depth {
  background:
    rgba(255, 255, 255, 0.94) !important;

  color: #181914 !important;

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.95) inset,
    0 20px 45px rgba(38, 34, 20, 0.08),
    0 40px 100px rgba(38, 34, 20, 0.055) !important;
}

html.light .nf-dashboard-3d {
  background:
    rgba(255, 255, 255, 0.90) !important;

  box-shadow:
    30px 55px 110px rgba(38, 34, 20, 0.11),
    -10px 0 75px rgba(201, 138, 8, 0.035) !important;
}

/* =========================================================
   WORKFLOWS
   ========================================================= */

html.light [class*="workflow"],
html.light [class*="Workflow"] {
  --workflow-surface: #ffffff;
  --workflow-border: rgba(31, 30, 24, 0.10);
}

html.light [class*="workflow"] {
  color: #181914;
}

html.light [class*="workflow"] [class*="bg-black"],
html.light [class*="workflow"] [class*="bg-\\#"],
html.light [class*="Workflow"] [class*="bg-black"] {
  background:
    #ffffff !important;
}

/* =========================================================
   ANALYTICS / CHART AREAS
   ========================================================= */

html.light svg {
  color: currentColor;
}

html.light svg text {
  fill: #6f7067;
}

html.light [class*="chart"],
html.light [class*="Chart"],
html.light [class*="analytics"],
html.light [class*="Analytics"] {
  color: #181914;
}

/* =========================================================
   LEADS
   ========================================================= */

html.light [class*="lead"],
html.light [class*="Lead"] {
  color: #181914;
}

html.light [class*="lead"] [class*="bg-black"],
html.light [class*="Lead"] [class*="bg-black"] {
  background:
    #ffffff !important;
}

/* =========================================================
   TASKS
   ========================================================= */

html.light [class*="task"],
html.light [class*="Task"] {
  color: #181914;
}

html.light [class*="task"] [class*="bg-black"],
html.light [class*="Task"] [class*="bg-black"] {
  background:
    #ffffff !important;
}

/* =========================================================
   SETTINGS
   ========================================================= */

html.light [class*="settings"],
html.light [class*="Settings"] {
  color: #181914;
}

html.light [class*="settings"] [class*="bg-black"],
html.light [class*="Settings"] [class*="bg-black"] {
  background:
    #ffffff !important;
}

/* =========================================================
   CHAT / AI COMMAND CENTER
   ========================================================= */

html.light [class*="chat"],
html.light [class*="Chat"] {
  color: #24251f;
}

html.light .nf-input {
  border-color:
    rgba(31, 30, 24, 0.12) !important;

  background:
    rgba(255, 255, 255, 0.94) !important;

  color: #181914 !important;
}

html.light .nf-input:focus {
  border-color:
    rgba(201, 138, 8, 0.58) !important;
}

html.light [class*="chat"] [class*="bg-black"],
html.light [class*="Chat"] [class*="bg-black"] {
  background:
    #ffffff !important;
}

/* =========================================================
   SEARCH
   ========================================================= */

html.light [class*="search"] input,
html.light [class*="Search"] input {
  color: #181914 !important;

  background:
    rgba(255, 255, 255, 0.94) !important;
}

/* =========================================================
   MODALS
   ========================================================= */

html.light .nf-overlay {
  background:
    rgba(25, 24, 19, 0.38) !important;
}

html.light .nf-modal {
  color: #181914 !important;

  border-color:
    rgba(31, 30, 24, 0.10) !important;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(231, 184, 75, 0.10),
      transparent 42%
    ),
    rgba(255, 255, 252, 0.98) !important;

  box-shadow:
    0 45px 130px rgba(38, 34, 20, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.98) !important;
}

/* =========================================================
   DROPDOWNS
   ========================================================= */

html.light [role="menu"],
html.light [role="listbox"],
html.light [data-radix-menu-content],
html.light [data-radix-select-content] {
  color: #20211b !important;

  background:
    rgba(255, 255, 255, 0.99) !important;

  border-color:
    rgba(31, 30, 24, 0.10) !important;

  box-shadow:
    0 22px 70px rgba(38, 34, 20, 0.14) !important;
}

html.light [role="menuitem"],
html.light [role="option"] {
  color: #3f4038 !important;
}

html.light [role="menuitem"]:hover,
html.light [role="option"]:hover {
  color: #1b1c17 !important;

  background:
    rgba(201, 138, 8, 0.075) !important;
}

/* =========================================================
   TOOLTIP
   ========================================================= */

html.light .nf-tooltip::after {
  border-color:
    rgba(31, 30, 24, 0.10);

  background:
    rgba(29, 29, 25, 0.94);

  color:
    #fffdf5;

  box-shadow:
    0 12px 30px rgba(38, 34, 20, 0.16);
}

/* =========================================================
   ICONS
   ========================================================= */

html.light svg {
  color: currentColor;
}

html.light .text-\\[\\#F4F0E6\\] svg,
html.light .text-\\[\\#f4f0e6\\] svg {
  color: #3f4038 !important;
}

/* =========================================================
   DIVIDERS
   ========================================================= */

html.light hr {
  border-color:
    rgba(31, 30, 24, 0.075) !important;
}

/* =========================================================
   GRID BACKGROUND
   ========================================================= */

html.light .nf-cinematic-bg {
  background:
    radial-gradient(
      ellipse at 50% 12%,
      rgba(231, 184, 75, 0.13),
      transparent 36%
    ),
    radial-gradient(
      ellipse at 12% 45%,
      rgba(201, 138, 8, 0.035),
      transparent 30%
    ),
    #f6f4ee !important;
}

html.light .nf-grid-bg {
  background:
    #f6f4ee !important;
}

html.light .nf-grid-bg::before {
  background-image:
    linear-gradient(
      rgba(40, 37, 27, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(40, 37, 27, 0.035) 1px,
      transparent 1px
    ) !important;
}

html.light .nf-grid-bg::after {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(231, 184, 75, 0.13),
      transparent 33%
    ),
    radial-gradient(
      circle at 0% 55%,
      rgba(201, 138, 8, 0.035),
      transparent 30%
    ),
    radial-gradient(
      circle at 100% 55%,
      rgba(231, 184, 75, 0.03),
      transparent 28%
    ) !important;
}

/* =========================================================
   BLACK SURFACES
   ========================================================= */

html.light .nf-black-surface {
  background:
    rgba(255, 255, 255, 0.94) !important;

  color:
    #181914 !important;

  border-color:
    rgba(31, 30, 24, 0.085) !important;
}

/* =========================================================
   SOFT GOLD SURFACES
   ========================================================= */

html.light .nf-red-soft-bg {
  background:
    rgba(201, 138, 8, 0.075) !important;
}

html.light .nf-red-soft-border {
  border-color:
    rgba(201, 138, 8, 0.18) !important;
}

/* =========================================================
   SELECTION
   ========================================================= */

html.light ::selection {
  background:
    rgba(201, 138, 8, 0.22);

  color:
    #181914;
}

/* =========================================================
   FOCUS
   ========================================================= */

html.light button:focus-visible,
html.light a:focus-visible,
html.light input:focus-visible,
html.light textarea:focus-visible,
html.light select:focus-visible {
  outline:
    2px solid rgba(201, 138, 8, 0.55);

  outline-offset:
    2px;
}

/* =========================================================
   SCROLLBAR
   ========================================================= */

html.light {
  scrollbar-color:
    #d6ad55 #ebe8df;
}

html.light ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

html.light ::-webkit-scrollbar-track {
  background:
    #ebe8df;
}

html.light ::-webkit-scrollbar-thumb {
  background:
    linear-gradient(
      180deg,
      #d9b45e,
      #b98a27
    );

  border:
    3px solid #ebe8df;

  border-radius:
    999px;
}

html.light ::-webkit-scrollbar-thumb:hover {
  background:
    #a8750b;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 768px) {
  html.light body {
    background:
      radial-gradient(
        circle at 50% -10%,
        rgba(231, 184, 75, 0.13),
        transparent 35%
      ),
      #f6f4ee !important;
  }

  html.light .nf-glass,
  html.light .nf-glass-strong {
    backdrop-filter:
      blur(16px);

    -webkit-backdrop-filter:
      blur(16px);
  }

  html.light aside {
    background:
      rgba(255, 255, 255, 0.98) !important;
  }
}

/* =========================================================
   REDUCE MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  html.light *,
  html.light *::before,
  html.light *::after {
    scroll-behavior:
      auto !important;

    transition-duration:
      0.01ms !important;

    animation-duration:
      0.01ms !important;
  }
}

/* =========================================================
   FINAL LIGHT-MODE GUARANTEE
   ========================================================= */

html.light {
  background:
    #f6f4ee !important;

  color:
    #181914 !important;
}

html.light body {
  color:
    #181914 !important;
}

html.light main {
  color:
    #181914 !important;
}

html.light [style*="background: #060606"],
html.light [style*="background:#060606"],
html.light [style*="background-color: #060606"],
html.light [style*="background-color:#060606"] {
  background:
    #ffffff !important;
}

html.light [style*="background: #0a0a09"],
html.light [style*="background:#0a0a09"],
html.light [style*="background: #10100e"],
html.light [style*="background:#10100e"] {
  background:
    #ffffff !important;
}
`,
      }}
    />
  );
}