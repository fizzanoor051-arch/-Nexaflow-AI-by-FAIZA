"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Footer from "@/components/landing/Footer";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen text-[var(--nf-text)]">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Primary atmosphere */}
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[var(--nf-gold)]/[0.035] blur-[150px]" />

        <div className="absolute right-[-220px] top-[15%] h-[620px] w-[620px] rounded-full bg-[var(--nf-gold-light)]/[0.025] blur-[170px]" />

        <div className="absolute bottom-[-260px] left-[25%] h-[580px] w-[580px] rounded-full bg-[var(--nf-muted)]/[0.035] blur-[160px]" />

        {/* Subtle center glow */}
        <div className="absolute left-[45%] top-[35%] h-[360px] w-[360px] rounded-full bg-[var(--nf-gold)]/[0.012] blur-[130px]" />

        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--nf-grid) 1px, transparent 1px), linear-gradient(90deg, var(--nf-grid) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--nf-vignette)_100%)]" />
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden overflow-hidden transition-[width] duration-300 ease-in-out lg:block ${
          sidebarOpen ? "w-[248px]" : "w-0"
        }`}
      >
        <div className="h-full w-[248px] border-r border-[var(--nf-border)] bg-[var(--nf-sidebar)] shadow-[var(--nf-sidebar-shadow)] backdrop-blur-xl">
          <Sidebar
            desktopOpen={sidebarOpen}
            onDesktopOpenChange={setSidebarOpen}
          />
        </div>
      </aside>

      {/* Desktop open-sidebar button */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          title="Open sidebar"
          className="fixed left-4 top-4 z-[60] hidden h-11 w-11 items-center justify-center rounded-[13px] border border-[var(--nf-gold-border)] bg-[var(--nf-panel)] text-[var(--nf-gold-light)] shadow-[var(--nf-button-shadow)] backdrop-blur-xl transition-all duration-200 hover:border-[var(--nf-gold-border-hover)] hover:bg-[var(--nf-panel-hover)] hover:shadow-[var(--nf-gold-shadow)] lg:flex"
        >
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
        </button>
      )}

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Main dashboard area */}
      <div
        className={`min-h-screen bg-[var(--nf-page)] transition-[padding-left] duration-300 ease-in-out ${
          sidebarOpen ? "lg:pl-[248px]" : "lg:pl-0"
        }`}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-40 border-b border-[var(--nf-border)] bg-[var(--nf-topbar)] backdrop-blur-xl">
          <Topbar />
        </div>

        {/* Scrollable dashboard content */}
        <main className="relative min-h-[calc(100vh-72px)]">
          {/* Content atmosphere */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[15%] top-[10%] h-40 w-40 rounded-full bg-[var(--nf-gold)]/[0.012] blur-[90px]" />

            <div className="absolute right-[10%] top-[45%] h-52 w-52 rounded-full bg-[var(--nf-gold-light)]/[0.01] blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
            {children}
          </div>
        </main>

        {/* Dashboard footer */}
        <Footer />
      </div>
    </div>
  );
}