"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Use cases", href: "#use-cases" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="rounded-2xl border border-white/[0.08] bg-[#070b1c]/80 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-indigo-500/10">
                <div className="absolute inset-0 bg-violet-500/10 blur-xl" />

                <span className="relative text-sm font-black text-violet-200">
                  N
                </span>
              </div>

              <div>
                <div className="text-sm font-bold tracking-tight text-white">
                  NexaFlow
                </div>
                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300/60">
                  AI Automation
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-7 lg:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 shadow-lg shadow-violet-950/20 transition-all hover:border-violet-300/30 hover:bg-violet-500/20"
              >
                Get started
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.06] lg:hidden"
            >
              {mobileOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-4 border-t border-white/[0.07] pt-4 lg:hidden">
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-white/[0.08] px-4 py-3 text-center text-sm font-medium text-slate-300"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}