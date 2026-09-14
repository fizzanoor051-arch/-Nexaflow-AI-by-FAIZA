import type { ReactNode } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#151713] text-[#F4F0E6]">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Deep olive / graphite atmosphere */}
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.035] blur-[150px]" />

        <div className="absolute right-[-220px] top-[15%] h-[620px] w-[620px] rounded-full bg-[#F5D98B]/[0.025] blur-[170px]" />

        <div className="absolute bottom-[-260px] left-[25%] h-[580px] w-[580px] rounded-full bg-[#7B806E]/[0.035] blur-[160px]" />

        {/* Subtle center glow */}
        <div className="absolute left-[45%] top-[35%] h-[360px] w-[360px] rounded-full bg-[#E7B84B]/[0.012] blur-[130px]" />

        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,217,139,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.32) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_100%)]" />
      </div>

      {/* Fixed left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[248px] lg:block">
        <div className="h-full border-r border-[#F5D98B]/[0.07] bg-[#1B1F19]/90 shadow-[20px_0_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Main dashboard area */}
      <div className="min-h-screen lg:pl-[248px]">
        {/* Topbar */}
        <div className="sticky top-0 z-40 border-b border-[#F5D98B]/[0.06] bg-[#151713]/80 backdrop-blur-xl">
          <Topbar />
        </div>

        {/* Scrollable dashboard content */}
        <main className="relative min-h-[calc(100vh-72px)]">
          {/* Content atmosphere */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[15%] top-[10%] h-40 w-40 rounded-full bg-[#E7B84B]/[0.012] blur-[90px]" />
            <div className="absolute right-[10%] top-[45%] h-52 w-52 rounded-full bg-[#F5D98B]/[0.01] blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}