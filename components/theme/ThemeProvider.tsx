"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "nexaflow-theme";

function applyTheme() {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const body = document.body;

  // Remove existing theme classes.
  root.classList.remove(
    "light",
    "dark",
    "normal",
    "theme-light",
    "theme-dark",
    "theme-normal",
  );

  // Normal theme.
  root.classList.add("normal");

  root.setAttribute("data-theme", "normal");
  body.setAttribute("data-theme", "normal");

  // Background colors.
  root.style.setProperty("--nf-bg", "#171914");
  root.style.setProperty("--nf-bg-soft", "#1B1F19");
  root.style.setProperty("--nf-bg-elevated", "#20241D");
  root.style.setProperty("--nf-bg-panel", "#252A22");

  root.style.setProperty("--nf-surface", "#1B1F19");
  root.style.setProperty("--nf-surface-strong", "#20241D");
  root.style.setProperty("--nf-surface-soft", "#181B16");

  // Text colors.
  root.style.setProperty("--nf-text", "#F4F0E6");
  root.style.setProperty("--nf-text-soft", "#D9D6CC");
  root.style.setProperty("--nf-text-muted", "#9A9D94");
  root.style.setProperty("--nf-text-faint", "#70736B");

  // NO BORDERS.
  root.style.setProperty("--nf-border", "transparent");
  root.style.setProperty("--nf-border-soft", "transparent");
  root.style.setProperty("--nf-border-strong", "transparent");

  // Gold accent colors.
  root.style.setProperty("--nf-fire-1", "#E7B84B");
  root.style.setProperty("--nf-fire-2", "#F5D98B");
  root.style.setProperty("--nf-fire-3", "#D6A63D");
  root.style.setProperty("--nf-fire-4", "#BD8F2F");
  root.style.setProperty("--nf-fire-5", "#9F7828");
  root.style.setProperty("--nf-fire-6", "#806020");
  root.style.setProperty("--nf-fire-7", "#624A19");

  root.style.setProperty("--nf-success", "#5ED6A0");
  root.style.setProperty("--nf-warning", "#E7B84B");
  root.style.setProperty("--nf-danger", "#E87575");

  // Gold glow.
  root.style.setProperty(
    "--nf-fire-glow",
    "rgba(231, 184, 75, 0.30)",
  );

  root.style.setProperty(
    "--nf-fire-glow-soft",
    "rgba(231, 184, 75, 0.14)",
  );

  root.style.setProperty(
    "--nf-fire-glow-strong",
    "rgba(245, 217, 139, 0.40)",
  );

  // Shadows.
  root.style.setProperty(
    "--nf-shadow-sm",
    "0 4px 14px rgba(0, 0, 0, 0.20)",
  );

  root.style.setProperty(
    "--nf-shadow-md",
    "0 10px 30px rgba(0, 0, 0, 0.28)",
  );

  root.style.setProperty(
    "--nf-shadow-lg",
    "0 20px 55px rgba(0, 0, 0, 0.36)",
  );

  // Card colors.
  root.style.setProperty("--nf-black", "#171914");
  root.style.setProperty("--nf-black-soft", "#1B1F19");
  root.style.setProperty("--nf-black-panel", "#20241D");
  root.style.setProperty("--nf-card", "#1B1F19");
  root.style.setProperty("--nf-card-hover", "#252A22");

  // Normal page background.
  root.style.setProperty("background-color", "#171914");
  body.style.setProperty("background-color", "#171914");
  body.style.setProperty("background", "#171914");

  /*
   * Remove borders globally from the theme layer.
   * This prevents the red debug border from appearing again.
   */
  root.style.setProperty("border", "none");
  body.style.setProperty("border", "none");

  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    "normal",
  );
}

export default function ThemeProvider() {
  useEffect(() => {
    applyTheme();
  }, []);

  return null;
}