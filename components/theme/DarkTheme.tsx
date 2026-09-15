"use client";

import { useCallback, useEffect, useRef } from "react";

const THEME_STORAGE_KEY = "nexaflow-theme";

const DARK_THEME = {
  bg: "#000000",
  bgSoft: "#030303",
  bgElevated: "#050505",
  bgPanel: "#070707",

  surface: "#080808",
  surfaceSoft: "#0b0b0b",
  surfaceStrong: "#0e0e0e",
  surfaceHover: "#111111",

  card: "#090909",
  cardHover: "#0d0d0d",

  text: "#ffffff",
  textSoft: "#e7e7e7",
  textMuted: "#a1a1a1",
  textFaint: "#666666",

  border: "rgba(255,255,255,0.08)",
  borderSoft: "rgba(255,255,255,0.045)",
  borderStrong: "rgba(255,255,255,0.14)",

  gold: "#ffc83d",
  goldLight: "#ffe89a",
  goldStrong: "#f5b51b",

  success: "#4ade80",
  warning: "#f5b51b",
  danger: "#ff5c5c",

  shadowSmall: "0 10px 30px rgba(0,0,0,0.65)",
  shadowMedium: "0 20px 70px rgba(0,0,0,0.80)",
  shadowLarge: "0 40px 140px rgba(0,0,0,0.95)",
} as const;

function setVariable(
  root: HTMLElement,
  name: string,
  value: string,
) {
  root.style.setProperty(name, value);
}

function applyDarkVariables(root: HTMLElement) {
  /* =======================================================
     CORE BACKGROUNDS
     ======================================================= */

  setVariable(root, "--nf-bg", DARK_THEME.bg);
  setVariable(root, "--nf-bg-soft", DARK_THEME.bgSoft);
  setVariable(root, "--nf-bg-elevated", DARK_THEME.bgElevated);
  setVariable(root, "--nf-bg-panel", DARK_THEME.bgPanel);

  /* =======================================================
     SURFACES
     ======================================================= */

  setVariable(root, "--nf-surface", DARK_THEME.surface);
  setVariable(root, "--nf-surface-soft", DARK_THEME.surfaceSoft);
  setVariable(root, "--nf-surface-strong", DARK_THEME.surfaceStrong);

  /* =======================================================
     TEXT
     ======================================================= */

  setVariable(root, "--nf-text", DARK_THEME.text);
  setVariable(root, "--nf-text-soft", DARK_THEME.textSoft);
  setVariable(root, "--nf-text-muted", DARK_THEME.textMuted);
  setVariable(root, "--nf-text-faint", DARK_THEME.textFaint);

  /* =======================================================
     BORDERS
     ======================================================= */

  setVariable(root, "--nf-border", DARK_THEME.border);
  setVariable(root, "--nf-border-soft", DARK_THEME.borderSoft);
  setVariable(root, "--nf-border-strong", DARK_THEME.borderStrong);

  /* =======================================================
     FIRE / GOLD SYSTEM
     ======================================================= */

  setVariable(root, "--nf-fire-1", "#fff4c7");
  setVariable(root, "--nf-fire-2", "#ffe89a");
  setVariable(root, "--nf-fire-3", "#ffd96a");
  setVariable(root, "--nf-fire-4", DARK_THEME.gold);
  setVariable(root, "--nf-fire-5", DARK_THEME.goldStrong);
  setVariable(root, "--nf-fire-6", "#e58b0b");
  setVariable(root, "--nf-fire-7", DARK_THEME.danger);

  setVariable(root, "--nf-gold", DARK_THEME.gold);
  setVariable(root, "--nf-gold-light", DARK_THEME.goldLight);
  setVariable(root, "--nf-gold-strong", DARK_THEME.goldStrong);

  /* =======================================================
     STATUS
     ======================================================= */

  setVariable(root, "--nf-success", DARK_THEME.success);
  setVariable(root, "--nf-warning", DARK_THEME.warning);
  setVariable(root, "--nf-danger", DARK_THEME.danger);

  /* =======================================================
     GLOW
     ======================================================= */

  setVariable(
    root,
    "--nf-fire-glow",
    "rgba(255,200,61,0.12)",
  );

  setVariable(
    root,
    "--nf-fire-glow-soft",
    "rgba(255,200,61,0.045)",
  );

  setVariable(
    root,
    "--nf-fire-glow-strong",
    "rgba(255,180,20,0.18)",
  );

  /* =======================================================
     SHADOWS
     ======================================================= */

  setVariable(
    root,
    "--nf-shadow-sm",
    DARK_THEME.shadowSmall,
  );

  setVariable(
    root,
    "--nf-shadow-md",
    DARK_THEME.shadowMedium,
  );

  setVariable(
    root,
    "--nf-shadow-lg",
    DARK_THEME.shadowLarge,
  );

  /* =======================================================
     EXTRA DARK TOKENS
     ======================================================= */

  setVariable(root, "--nf-black", "#000000");
  setVariable(root, "--nf-black-soft", "#020202");
  setVariable(root, "--nf-black-panel", "#050505");

  setVariable(root, "--nf-card", DARK_THEME.card);
  setVariable(root, "--nf-card-hover", DARK_THEME.cardHover);
}

/* =========================================================
   FORCE DARK DOCUMENT
   ========================================================= */

function forceDarkDocument() {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const body = document.body;

  /* =======================================================
     DARK STATE ONLY
     ======================================================= */

  root.classList.remove(
    "light",
    "normal",
    "theme-light",
    "theme-normal",
  );

  root.classList.add("dark");
  root.classList.add("theme-dark");

  root.setAttribute("data-theme", "dark");
  root.setAttribute("data-color-mode", "dark");

  /* =======================================================
     BROWSER DARK UI
     ======================================================= */

  root.style.colorScheme = "dark";

  /* =======================================================
     DESIGN TOKENS
     ======================================================= */

  applyDarkVariables(root);

  /* =======================================================
     BODY
     ======================================================= */

  body.setAttribute("data-theme", "dark");
  body.setAttribute("data-color-mode", "dark");

  body.style.backgroundColor = "#000000";
  body.style.color = "#ffffff";
  body.style.colorScheme = "dark";

  /* =======================================================
     PERSIST
     ======================================================= */

  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    "dark",
  );
}

/* =========================================================
   GLOBAL DARK CSS
   ========================================================= */

function injectDarkOverrides() {
  if (typeof document === "undefined") {
    return;
  }

  const styleId = "nexaflow-true-dark-mode";

  let style = document.getElementById(styleId);

  if (!style) {
    style = document.createElement("style");
    style.id = styleId;

    style.textContent = `
/* =========================================================
   NEXAFLOW AI
   COMPLETE PROFESSIONAL DARK MODE
   ========================================================= */

html.dark,
html.theme-dark {
  color-scheme: dark !important;

  background:
    #000000 !important;

  color:
    #ffffff !important;
}

/* =========================================================
   HTML / BODY
   ========================================================= */

html.dark body,
html.theme-dark body {
  min-height: 100% !important;

  background:
    radial-gradient(
      circle at 50% -15%,
      rgba(255, 200, 61, 0.045),
      transparent 32%
    ),
    radial-gradient(
      circle at 0% 35%,
      rgba(255, 170, 30, 0.018),
      transparent 28%
    ),
    radial-gradient(
      circle at 100% 70%,
      rgba(255, 90, 20, 0.012),
      transparent 30%
    ),
    #000000 !important;

  color:
    #ffffff !important;
}

/* =========================================================
   PAGE ROOTS
   ========================================================= */

html.dark main,
html.theme-dark main {
  background:
    transparent !important;

  color:
    #ffffff !important;
}

html.dark section,
html.dark article,
html.theme-dark section,
html.theme-dark article {
  color:
    #ffffff !important;
}

/* =========================================================
   GLOBAL DARK SURFACES
   ========================================================= */

html.dark .bg-white,
html.dark .bg-gray-50,
html.dark .bg-gray-100,
html.dark .bg-gray-200,
html.dark .bg-zinc-50,
html.dark .bg-zinc-100,
html.dark .bg-zinc-200,
html.dark .bg-slate-50,
html.dark .bg-slate-100,
html.dark .bg-slate-200,
html.dark .bg-neutral-50,
html.dark .bg-neutral-100,
html.dark .bg-neutral-200,
html.dark .bg-stone-50,
html.dark .bg-stone-100,
html.dark .bg-stone-200,

html.theme-dark .bg-white,
html.theme-dark .bg-gray-50,
html.theme-dark .bg-gray-100,
html.theme-dark .bg-gray-200,
html.theme-dark .bg-zinc-50,
html.theme-dark .bg-zinc-100,
html.theme-dark .bg-zinc-200,
html.theme-dark .bg-slate-50,
html.theme-dark .bg-slate-100,
html.theme-dark .bg-slate-200,
html.theme-dark .bg-neutral-50,
html.theme-dark .bg-neutral-100,
html.theme-dark .bg-neutral-200,
html.theme-dark .bg-stone-50,
html.theme-dark .bg-stone-100,
html.theme-dark .bg-stone-200 {
  background-color:
    #050505 !important;
}

/* =========================================================
   DARK TAILWIND SURFACES
   ========================================================= */

html.dark [class*="bg-gray-9"],
html.dark [class*="bg-zinc-9"],
html.dark [class*="bg-neutral-9"],
html.dark [class*="bg-slate-9"],
html.dark [class*="bg-stone-9"],

html.theme-dark [class*="bg-gray-9"],
html.theme-dark [class*="bg-zinc-9"],
html.theme-dark [class*="bg-neutral-9"],
html.theme-dark [class*="bg-slate-9"],
html.theme-dark [class*="bg-stone-9"] {
  background-color:
    #050505 !important;
}

/* =========================================================
   NEXAFLOW CUSTOM SURFACES
   ========================================================= */

html.dark .bg-\\[\\#060606\\],
html.dark .bg-\\[\\#0a0a09\\],
html.dark .bg-\\[\\#10100e\\],
html.dark .bg-\\[\\#151411\\],
html.dark .bg-\\[\\#151713\\],
html.dark .bg-\\[\\#1B1F19\\],
html.dark .bg-\\[\\#1b1f19\\],
html.dark .bg-\\[\\#20241D\\],
html.dark .bg-\\[\\#20241d\\],
html.dark .bg-\\[\\#252A22\\],
html.dark .bg-\\[\\#252a22\\],

html.theme-dark .bg-\\[\\#060606\\],
html.theme-dark .bg-\\[\\#0a0a09\\],
html.theme-dark .bg-\\[\\#10100e\\],
html.theme-dark .bg-\\[\\#151411\\],
html.theme-dark .bg-\\[\\#151713\\],
html.theme-dark .bg-\\[\\#1B1F19\\],
html.theme-dark .bg-\\[\\#1b1f19\\],
html.theme-dark .bg-\\[\\#20241D\\],
html.theme-dark .bg-\\[\\#20241d\\],
html.theme-dark .bg-\\[\\#252A22\\],
html.theme-dark .bg-\\[\\#252a22\\] {
  background-color:
    #050505 !important;
}

/* =========================================================
   TEXT
   ========================================================= */

html.dark .text-black,
html.theme-dark .text-black {
  color:
    #ffffff !important;
}

html.dark .text-gray-900,
html.dark .text-gray-800,
html.dark .text-gray-700,

html.theme-dark .text-gray-900,
html.theme-dark .text-gray-800,
html.theme-dark .text-gray-700 {
  color:
    #f2f2f2 !important;
}

html.dark .text-gray-600,
html.dark .text-gray-500,
html.dark .text-zinc-600,
html.dark .text-zinc-500,
html.dark .text-neutral-600,
html.dark .text-neutral-500,

html.theme-dark .text-gray-600,
html.theme-dark .text-gray-500,
html.theme-dark .text-zinc-600,
html.theme-dark .text-zinc-500,
html.theme-dark .text-neutral-600,
html.theme-dark .text-neutral-500 {
  color:
    #a1a1a1 !important;
}

html.dark .text-\\[\\#181914\\],
html.dark .text-\\[\\#3f4038\\],
html.dark .text-\\[\\#6f7067\\],
html.dark .text-\\[\\#77786f\\],

html.theme-dark .text-\\[\\#181914\\],
html.theme-dark .text-\\[\\#3f4038\\],
html.theme-dark .text-\\[\\#6f7067\\],
html.theme-dark .text-\\[\\#77786f\\] {
  color:
    #ffffff !important;
}

/* =========================================================
   SIDEBAR
   ========================================================= */

html.dark aside,
html.theme-dark aside {
  background:
    #000000 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.07) !important;

  box-shadow:
    10px 0 45px rgba(0,0,0,0.55) !important;
}

html.dark aside a,
html.dark aside button,
html.theme-dark aside a,
html.theme-dark aside button {
  color:
    #a1a1a1 !important;
}

html.dark aside a:hover,
html.dark aside button:hover,
html.theme-dark aside a:hover,
html.theme-dark aside button:hover {
  color:
    #ffffff !important;

  background:
    rgba(255,200,61,0.055) !important;
}

html.dark aside [aria-current="page"],
html.dark aside .active,
html.theme-dark aside [aria-current="page"],
html.theme-dark aside .active {
  color:
    #ffc83d !important;

  background:
    linear-gradient(
      90deg,
      rgba(255,200,61,0.10),
      rgba(255,200,61,0.025)
    ) !important;

  border-color:
    rgba(255,200,61,0.16) !important;

  box-shadow:
    inset 3px 0 0 rgba(255,200,61,0.75) !important;
}

/* =========================================================
   TOPBAR
   ========================================================= */

html.dark header,
html.theme-dark header {
  background:
    rgba(0,0,0,0.92) !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.07) !important;

  box-shadow:
    0 8px 35px rgba(0,0,0,0.45) !important;
}

html.dark header button,
html.theme-dark header button {
  color:
    #a1a1a1 !important;
}

html.dark header button:hover,
html.theme-dark header button:hover {
  color:
    #ffc83d !important;

  background:
    rgba(255,200,61,0.055) !important;
}

/* =========================================================
   FOOTER
   ========================================================= */

html.dark footer,
html.theme-dark footer {
  background:
    #000000 !important;

  color:
    #a1a1a1 !important;

  border-color:
    rgba(255,255,255,0.07) !important;
}

html.dark footer *,
html.theme-dark footer * {
  color:
    inherit;
}

html.dark footer a:hover,
html.theme-dark footer a:hover {
  color:
    #ffc83d !important;
}

/* =========================================================
   CARDS
   ========================================================= */

html.dark .rounded-xl,
html.dark .rounded-2xl,
html.dark .rounded-3xl,

html.theme-dark .rounded-xl,
html.theme-dark .rounded-2xl,
html.theme-dark .rounded-3xl {
  border-color:
    rgba(255,255,255,0.07) !important;
}

/* =========================================================
   GLASS
   ========================================================= */

html.dark .nf-glass,
html.theme-dark .nf-glass {
  background:
    linear-gradient(
      135deg,
      rgba(14,14,14,0.94),
      rgba(5,5,5,0.84)
    ) !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.07) !important;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.025),
    0 20px 70px rgba(0,0,0,0.65) !important;
}

html.dark .nf-glass-strong,
html.theme-dark .nf-glass-strong {
  background:
    linear-gradient(
      135deg,
      rgba(12,12,12,0.98),
      rgba(3,3,3,0.96)
    ) !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.09) !important;

  box-shadow:
    0 30px 100px rgba(0,0,0,0.78) !important;
}

/* =========================================================
   INPUTS
   ========================================================= */

html.dark input,
html.dark textarea,
html.dark select,

html.theme-dark input,
html.theme-dark textarea,
html.theme-dark select {
  background:
    #050505 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.10) !important;

  color-scheme:
    dark !important;
}

html.dark input::placeholder,
html.dark textarea::placeholder,

html.theme-dark input::placeholder,
html.theme-dark textarea::placeholder {
  color:
    #666666 !important;
}

html.dark input:hover,
html.dark textarea:hover,
html.dark select:hover,

html.theme-dark input:hover,
html.theme-dark textarea:hover,
html.theme-dark select:hover {
  border-color:
    rgba(255,200,61,0.24) !important;
}

html.dark input:focus,
html.dark textarea:focus,
html.dark select:focus,

html.theme-dark input:focus,
html.theme-dark textarea:focus,
html.theme-dark select:focus {
  outline:
    none !important;

  border-color:
    rgba(255,200,61,0.55) !important;

  box-shadow:
    0 0 0 3px rgba(255,200,61,0.08) !important;
}

/* =========================================================
   AI / CHAT
   ========================================================= */

html.dark [class*="chat"],
html.dark [class*="Chat"],
html.theme-dark [class*="chat"],
html.theme-dark [class*="Chat"] {
  color:
    #ffffff !important;
}

html.dark .nf-input,
html.theme-dark .nf-input {
  background:
    #050505 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.10) !important;
}

html.dark .nf-input:focus,
html.theme-dark .nf-input:focus {
  border-color:
    rgba(255,200,61,0.55) !important;

  box-shadow:
    0 0 0 3px rgba(255,200,61,0.08) !important;
}

/* =========================================================
   WORKFLOWS
   ========================================================= */

html.dark [class*="workflow"],
html.dark [class*="Workflow"],
html.theme-dark [class*="workflow"],
html.theme-dark [class*="Workflow"] {
  color:
    #ffffff !important;

  --workflow-surface:
    #080808;

  --workflow-border:
    rgba(255,255,255,0.08);
}

/* =========================================================
   LEADS
   ========================================================= */

html.dark [class*="lead"],
html.dark [class*="Lead"],
html.theme-dark [class*="lead"],
html.theme-dark [class*="Lead"] {
  color:
    #ffffff !important;
}

/* =========================================================
   TASKS
   ========================================================= */

html.dark [class*="task"],
html.dark [class*="Task"],
html.theme-dark [class*="task"],
html.theme-dark [class*="Task"] {
  color:
    #ffffff !important;
}

/* =========================================================
   ANALYTICS
   ========================================================= */

html.dark [class*="analytics"],
html.dark [class*="Analytics"],
html.theme-dark [class*="analytics"],
html.theme-dark [class*="Analytics"] {
  color:
    #ffffff !important;
}

html.dark svg text,
html.theme-dark svg text {
  fill:
    #a1a1a1 !important;
}

/* =========================================================
   SETTINGS
   ========================================================= */

html.dark [class*="settings"],
html.dark [class*="Settings"],
html.theme-dark [class*="settings"],
html.theme-dark [class*="Settings"] {
  color:
    #ffffff !important;
}

/* =========================================================
   TABLES
   ========================================================= */

html.dark table,
html.theme-dark table {
  background:
    #050505 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.07) !important;
}

html.dark thead,
html.theme-dark thead {
  background:
    #080808 !important;
}

html.dark th,
html.theme-dark th {
  color:
    #a1a1a1 !important;

  border-color:
    rgba(255,255,255,0.07) !important;
}

html.dark td,
html.theme-dark td {
  color:
    #e7e7e7 !important;

  border-color:
    rgba(255,255,255,0.055) !important;
}

html.dark tbody tr:hover,
html.theme-dark tbody tr:hover {
  background:
    rgba(255,200,61,0.025) !important;
}

/* =========================================================
   MODALS
   ========================================================= */

html.dark dialog,
html.dark [role="dialog"],
html.theme-dark dialog,
html.theme-dark [role="dialog"] {
  background:
    #050505 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.10) !important;

  box-shadow:
    0 40px 120px rgba(0,0,0,0.85) !important;
}

html.dark .nf-modal,
html.theme-dark .nf-modal {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(255,200,61,0.055),
      transparent 42%
    ),
    #050505 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.10) !important;
}

/* =========================================================
   MODAL OVERLAY
   ========================================================= */

html.dark .nf-overlay,
html.theme-dark .nf-overlay {
  background:
    rgba(0,0,0,0.82) !important;
}

/* =========================================================
   DROPDOWNS
   ========================================================= */

html.dark [role="menu"],
html.dark [role="listbox"],
html.dark [data-radix-menu-content],
html.dark [data-radix-select-content],

html.theme-dark [role="menu"],
html.theme-dark [role="listbox"],
html.theme-dark [data-radix-menu-content],
html.theme-dark [data-radix-select-content] {
  background:
    #050505 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.10) !important;

  box-shadow:
    0 25px 80px rgba(0,0,0,0.80) !important;
}

html.dark [role="menuitem"],
html.dark [role="option"],
html.theme-dark [role="menuitem"],
html.theme-dark [role="option"] {
  color:
    #e7e7e7 !important;
}

html.dark [role="menuitem"]:hover,
html.dark [role="option"]:hover,
html.theme-dark [role="menuitem"]:hover,
html.theme-dark [role="option"]:hover {
  color:
    #ffffff !important;

  background:
    rgba(255,200,61,0.065) !important;
}

/* =========================================================
   LINKS
   ========================================================= */

html.dark a,
html.theme-dark a {
  color:
    inherit;
}

html.dark a:hover,
html.theme-dark a:hover {
  color:
    #ffc83d;
}

/* =========================================================
   BUTTONS
   ========================================================= */

html.dark button,
html.theme-dark button {
  color-scheme:
    dark;

  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

html.dark button[class*="bg-\\[\\#E7B84B\\]"],
html.dark button[class*="bg-\\[\\#e7b84b\\]"],
html.theme-dark button[class*="bg-\\[\\#E7B84B\\]"],
html.theme-dark button[class*="bg-\\[\\#e7b84b\\]"] {
  background:
    #ffc83d !important;

  color:
    #090806 !important;

  border-color:
    #f5b51b !important;
}

html.dark button[class*="bg-\\[\\#E7B84B\\]"]:hover,
html.dark button[class*="bg-\\[\\#e7b84b\\]"]:hover,
html.theme-dark button[class*="bg-\\[\\#E7B84B\\]"]:hover,
html.theme-dark button[class*="bg-\\[\\#e7b84b\\]"]:hover {
  background:
    #ffe06f !important;

  color:
    #050505 !important;

  box-shadow:
    0 12px 35px rgba(255,200,61,0.22),
    0 0 35px rgba(255,200,61,0.10) !important;
}

/* =========================================================
   BADGES / STATUS
   ========================================================= */

html.dark [class*="bg-green-"],
html.theme-dark [class*="bg-green-"] {
  background-color:
    rgba(74,222,128,0.10) !important;
}

html.dark [class*="text-green-"],
html.theme-dark [class*="text-green-"] {
  color:
    #4ade80 !important;
}

html.dark [class*="bg-red-"],
html.theme-dark [class*="bg-red-"] {
  background-color:
    rgba(255,92,92,0.10) !important;
}

html.dark [class*="text-red-"],
html.theme-dark [class*="text-red-"] {
  color:
    #ff6b6b !important;
}

html.dark [class*="bg-yellow-"],
html.dark [class*="bg-amber-"],
html.theme-dark [class*="bg-yellow-"],
html.theme-dark [class*="bg-amber-"] {
  background-color:
    rgba(255,200,61,0.10) !important;
}

html.dark [class*="text-yellow-"],
html.dark [class*="text-amber-"],
html.theme-dark [class*="text-yellow-"],
html.theme-dark [class*="text-amber-"] {
  color:
    #ffc83d !important;
}

/* =========================================================
   BLACK SURFACE
   ========================================================= */

html.dark .nf-black-surface,
html.theme-dark .nf-black-surface {
  background:
    #000000 !important;

  color:
    #ffffff !important;

  border-color:
    rgba(255,255,255,0.07) !important;
}

/* =========================================================
   CINEMATIC BACKGROUND
   ========================================================= */

html.dark .nf-cinematic-bg,
html.theme-dark .nf-cinematic-bg {
  background:
    radial-gradient(
      ellipse at 50% 10%,
      rgba(255,200,61,0.045),
      transparent 35%
    ),
    radial-gradient(
      ellipse at 12% 45%,
      rgba(255,180,30,0.015),
      transparent 30%
    ),
    #000000 !important;
}

/* =========================================================
   GRID
   ========================================================= */

html.dark .nf-grid-bg,
html.theme-dark .nf-grid-bg {
  background:
    #000000 !important;
}

html.dark .nf-grid-bg::before,
html.theme-dark .nf-grid-bg::before {
  background-image:
    linear-gradient(
      rgba(255,255,255,0.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,0.025) 1px,
      transparent 1px
    ) !important;
}

html.dark .nf-grid-bg::after,
html.theme-dark .nf-grid-bg::after {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(255,200,61,0.055),
      transparent 34%
    ),
    radial-gradient(
      circle at 0% 55%,
      rgba(255,180,30,0.018),
      transparent 30%
    ),
    radial-gradient(
      circle at 100% 55%,
      rgba(255,90,20,0.012),
      transparent 28%
    ) !important;
}

/* =========================================================
   DIVIDERS
   ========================================================= */

html.dark hr,
html.theme-dark hr {
  border-color:
    rgba(255,255,255,0.07) !important;
}

/* =========================================================
   IMAGES
   ========================================================= */

html.dark img,
html.theme-dark img {
  border-color:
    rgba(255,255,255,0.05);
}

/* =========================================================
   SHADOWS
   ========================================================= */

html.dark [class*="shadow"],
html.theme-dark [class*="shadow"] {
  --tw-shadow-color:
    rgba(0,0,0,0.78) !important;
}

/* =========================================================
   DISABLED
   ========================================================= */

html.dark button:disabled,
html.dark input:disabled,
html.dark textarea:disabled,
html.dark select:disabled,

html.theme-dark button:disabled,
html.theme-dark input:disabled,
html.theme-dark textarea:disabled,
html.theme-dark select:disabled {
  opacity:
    0.5;
}

/* =========================================================
   SELECTION
   ========================================================= */

html.dark ::selection,
html.theme-dark ::selection {
  background:
    rgba(255,200,61,0.28);

  color:
    #ffffff;
}

/* =========================================================
   AUTOFILL
   ========================================================= */

html.dark input:-webkit-autofill,
html.dark input:-webkit-autofill:hover,
html.dark input:-webkit-autofill:focus,

html.theme-dark input:-webkit-autofill,
html.theme-dark input:-webkit-autofill:hover,
html.theme-dark input:-webkit-autofill:focus {
  -webkit-text-fill-color:
    #ffffff !important;

  -webkit-box-shadow:
    0 0 0 1000px #050505 inset !important;

  box-shadow:
    0 0 0 1000px #050505 inset !important;
}

/* =========================================================
   SCROLLBAR
   ========================================================= */

html.dark,
html.theme-dark {
  scrollbar-color:
    #2a2a2a #000000;
}

html.dark ::-webkit-scrollbar,
html.theme-dark ::-webkit-scrollbar {
  width:
    9px;

  height:
    9px;
}

html.dark ::-webkit-scrollbar-track,
html.theme-dark ::-webkit-scrollbar-track {
  background:
    #000000;
}

html.dark ::-webkit-scrollbar-thumb,
html.theme-dark ::-webkit-scrollbar-thumb {
  background:
    linear-gradient(
      180deg,
      #333333,
      #171717
    );

  border:
    2px solid #000000;

  border-radius:
    999px;
}

html.dark ::-webkit-scrollbar-thumb:hover,
html.theme-dark ::-webkit-scrollbar-thumb:hover {
  background:
    linear-gradient(
      180deg,
      #555555,
      #292929
    );
}

/* =========================================================
   FOCUS ACCESSIBILITY
   ========================================================= */

html.dark button:focus-visible,
html.dark a:focus-visible,
html.dark input:focus-visible,
html.dark textarea:focus-visible,
html.dark select:focus-visible,

html.theme-dark button:focus-visible,
html.theme-dark a:focus-visible,
html.theme-dark input:focus-visible,
html.theme-dark textarea:focus-visible,
html.theme-dark select:focus-visible {
  outline:
    2px solid rgba(255,200,61,0.55) !important;

  outline-offset:
    2px;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 768px) {
  html.dark body,
  html.theme-dark body {
    background:
      radial-gradient(
        circle at 50% -10%,
        rgba(255,200,61,0.04),
        transparent 35%
      ),
      #000000 !important;
  }

  html.dark .nf-glass,
  html.dark .nf-glass-strong,
  html.theme-dark .nf-glass,
  html.theme-dark .nf-glass-strong {
    backdrop-filter:
      blur(16px);

    -webkit-backdrop-filter:
      blur(16px);
  }
}

/* =========================================================
   REDUCE MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  html.dark *,
  html.dark *::before,
  html.dark *::after,
  html.theme-dark *,
  html.theme-dark *::before,
  html.theme-dark *::after {
    scroll-behavior:
      auto !important;

    transition-duration:
      0.01ms !important;

    animation-duration:
      0.01ms !important;
  }
}
`;

    document.head.appendChild(style);
  }
}

/* =========================================================
   PROTECT ROOT DARK STATE
   ========================================================= */

function protectDarkTheme() {
  if (typeof document === "undefined") {
    return null;
  }

  const root = document.documentElement;

  const observer = new MutationObserver(() => {
    const isDark =
      root.classList.contains("dark") &&
      root.getAttribute("data-theme") === "dark";

    if (!isDark) {
      forceDarkDocument();
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

  return observer;
}

/* =========================================================
   PROTECT BODY DARK STATE
   ========================================================= */

function protectBodyTheme() {
  if (typeof document === "undefined") {
    return null;
  }

  const body = document.body;

  const observer = new MutationObserver(() => {
    if (
      body.dataset.theme !== "dark" ||
      body.dataset.colorMode !== "dark"
    ) {
      body.dataset.theme = "dark";
      body.dataset.colorMode = "dark";
    }

    if (
      body.style.backgroundColor !==
      "rgb(0, 0, 0)"
    ) {
      body.style.backgroundColor = "#000000";
    }

    if (
      body.style.color !==
      "rgb(255, 255, 255)"
    ) {
      body.style.color = "#ffffff";
    }

    if (
      body.style.colorScheme !== "dark"
    ) {
      body.style.colorScheme = "dark";
    }
  });

  observer.observe(body, {
    attributes: true,
    attributeFilter: [
      "data-theme",
      "data-color-mode",
      "style",
    ],
  });

  return observer;
}

/* =========================================================
   DARK THEME COMPONENT
   ========================================================= */

export default function DarkTheme() {
  const rootObserverRef =
    useRef<MutationObserver | null>(null);

  const bodyObserverRef =
    useRef<MutationObserver | null>(null);

  const activateDarkMode = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }

    forceDarkDocument();
    injectDarkOverrides();
  }, []);

  useEffect(() => {
    activateDarkMode();

    rootObserverRef.current =
      protectDarkTheme();

    bodyObserverRef.current =
      protectBodyTheme();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        activateDarkMode();
      }
    };

    const handleFocus = () => {
      activateDarkMode();
    };

    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key ===
        THEME_STORAGE_KEY
      ) {
        const value =
          window.localStorage.getItem(
            THEME_STORAGE_KEY,
          );

        if (value === "dark") {
          activateDarkMode();
        }
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    window.addEventListener(
      "focus",
      handleFocus,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      rootObserverRef.current?.disconnect();
      bodyObserverRef.current?.disconnect();

      rootObserverRef.current = null;
      bodyObserverRef.current = null;

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener(
        "focus",
        handleFocus,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, [activateDarkMode]);

  return null;
}