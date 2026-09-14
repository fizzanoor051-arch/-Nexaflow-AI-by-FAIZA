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
        <nav className="rounded-2xl border border-[#F5D98B]/[0.08] bg-[#121410]/[0.90] px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#E7B84B]/25 bg-[#252A22] shadow-[0_0_24px_rgba(231,184,75,0.08)]">
                <div className="absolute inset-0 bg-[#E7B84B]/[0.07] blur-xl" />

                <span className="relative text-sm font-black text-[#F5D98B]">
                  N
                </span>

                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.7)]" />
              </div>

              <div>
                <div className="text-sm font-bold tracking-tight text-[#F4F0E6]">
                  NexaFlow
                </div>

                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#BFAF7A]">
                  AI Automation
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-7 lg:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#9A9D94] transition-colors hover:text-[#F5D98B]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#9A9D94] transition-colors hover:text-[#F4F0E6]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-[#E7B84B]/25 bg-[#E7B84B]/[0.09] px-4 py-2.5 text-sm font-semibold text-[#F5D98B] shadow-lg shadow-black/20 transition-all hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/[0.15] hover:shadow-[0_0_24px_rgba(231,184,75,0.10)]"
              >
                Get started
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/70 text-[#D8D4C8] transition hover:border-[#E7B84B]/20 hover:bg-[#252A22] hover:text-[#F5D98B] lg:hidden"
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
            <div className="mt-4 border-t border-[#F5D98B]/[0.07] pt-4 lg:hidden">
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-[#9A9D94] transition hover:bg-[#F4F0E6]/[0.035] hover:text-[#F5D98B]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#F5D98B]/[0.07] pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/50 px-4 py-3 text-center text-sm font-medium text-[#D8D4C8] transition hover:border-[#E7B84B]/20 hover:bg-[#252A22] hover:text-[#F4F0E6]"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-[#E7B84B]/25 bg-[#E7B84B]/[0.12] px-4 py-3 text-center text-sm font-semibold text-[#F5D98B] transition hover:border-[#E7B84B]/40 hover:bg-[#E7B84B]/[0.18]"
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