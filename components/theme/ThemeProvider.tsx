"use client";

import { useCallback, useEffect } from "react";

const THEME_STORAGE_KEY = "nexaflow-theme";

function removeInjectedDarkStyles() {
  if (typeof document === "undefined") {
    return;
  }

  const darkStyle = document.getElementById(
    "nexaflow-true-dark-mode",
  );

  if (darkStyle) {
    darkStyle.remove();
  }
}

function removeThemeVariables(root: HTMLElement) {
  const variables = [
    "--nf-bg",
    "--nf-bg-soft",
    "--nf-bg-elevated",
    "--nf-bg-panel",

    "--nf-surface",
    "--nf-surface-strong",
    "--nf-surface-soft",

    "--nf-text",
    "--nf-text-soft",
    "--nf-text-muted",
    "--nf-text-faint",

    "--nf-border",
    "--nf-border-soft",
    "--nf-border-strong",

    "--nf-fire-1",
    "--nf-fire-2",
    "--nf-fire-3",
    "--nf-fire-4",
    "--nf-fire-5",
    "--nf-fire-6",
    "--nf-fire-7",

    "--nf-success",
    "--nf-warning",
    "--nf-danger",

    "--nf-fire-glow",
    "--nf-fire-glow-soft",
    "--nf-fire-glow-strong",

    "--nf-shadow-sm",
    "--nf-shadow-md",
    "--nf-shadow-lg",

    "--nf-black",
    "--nf-black-soft",
    "--nf-black-panel",
    "--nf-card",
    "--nf-card-hover",
  ];

  variables.forEach((variable) => {
    root.style.removeProperty(variable);
  });
}

function restoreOriginalTheme() {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const body = document.body;

  /*
   * Remove every custom theme state.
   */
  root.classList.remove(
    "light",
    "dark",
    "normal",
    "theme-light",
    "theme-dark",
    "theme-normal",
  );

  /*
   * Remove custom theme attributes.
   */
  root.removeAttribute("data-theme");
  root.removeAttribute("data-color-mode");

  body.removeAttribute("data-theme");
  body.removeAttribute("data-color-mode");

  /*
   * Remove inline theme variables.
   *
   * The original NexaFlow variables from globals.css
   * will become active again.
   */
  removeThemeVariables(root);

  /*
   * Remove inline styles injected by DarkTheme.
   */
  removeInjectedDarkStyles();

  /*
   * Remove theme-specific inline body styles.
   */
  body.style.removeProperty("background");
  body.style.removeProperty("background-color");
  body.style.removeProperty("color");
  body.style.removeProperty("color-scheme");

  /*
   * Restore browser rendering to the original document state.
   */
  root.style.removeProperty("color-scheme");

  /*
   * Normal is intentionally NOT a new visual theme.
   *
   * It means:
   * "Use NexaFlow exactly as originally designed."
   */
  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    "normal",
  );
}

export default function ThemeProvider() {
  const activateNormalTheme = useCallback(() => {
    restoreOriginalTheme();
  }, []);

  useEffect(() => {
    /*
     * Only restore the original NexaFlow theme
     * when Normal is selected.
     */
    const savedTheme =
      window.localStorage.getItem(
        THEME_STORAGE_KEY,
      );

    if (
      savedTheme === "normal" ||
      savedTheme === null
    ) {
      activateNormalTheme();
    }

    /*
     * If another theme is selected,
     * ThemeProvider does not interfere.
     */
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === THEME_STORAGE_KEY &&
        event.newValue === "normal"
      ) {
        activateNormalTheme();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, [activateNormalTheme]);

  return null;
}