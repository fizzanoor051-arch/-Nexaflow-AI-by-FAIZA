export default function DashboardLoading() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#151713] text-[#F4F0E6]">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#E7B84B]/[0.035] blur-[120px]" />
        <div className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-[#F5D98B]/[0.025] blur-[140px]" />
        <div className="absolute bottom-[-180px] left-[30%] h-[420px] w-[420px] rounded-full bg-[#7B806E]/[0.035] blur-[140px]" />

        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,217,139,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.35) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative z-10 animate-pulse space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="h-3 w-24 rounded-full bg-[#E7B84B]/[0.12]" />

            <div className="mt-4 h-9 w-64 rounded-xl border border-[#F5D98B]/[0.06] bg-[#20241D] shadow-[inset_0_1px_0_rgba(245,217,139,0.04)] sm:w-80" />

            <div className="mt-3 h-3 w-80 max-w-full rounded-full bg-[#9A9D94]/[0.10]" />
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-28 rounded-xl border border-[#F5D98B]/[0.06] bg-[#20241D]" />
            <div className="h-10 w-36 rounded-xl border border-[#E7B84B]/[0.10] bg-[#252A22]" />
          </div>
        </section>

        {/* KPI cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
            >
              {/* Gold micro-line */}
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent" />

              {/* Inner glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#E7B84B]/[0.035] blur-2xl" />

              <div className="relative">
                <div className="h-2.5 w-24 rounded-full bg-[#F5D98B]/[0.10]" />

                <div className="mt-5 h-8 w-28 rounded-lg bg-[#F4F0E6]/[0.08]" />

                <div className="mt-5 flex items-center justify-between">
                  <div className="h-2.5 w-32 rounded-full bg-[#9A9D94]/[0.08]" />
                  <div className="h-9 w-9 rounded-xl border border-[#F5D98B]/[0.07] bg-[#252A22]" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Operational telemetry */}
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
          {/* Analytics / chart skeleton */}
          <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="h-3 w-28 rounded-full bg-[#F5D98B]/[0.10]" />
                <div className="mt-3 h-6 w-40 rounded-lg bg-[#F4F0E6]/[0.08]" />
              </div>

              <div className="h-9 w-24 rounded-xl border border-[#F5D98B]/[0.07] bg-[#252A22]" />
            </div>

            {/* Chart skeleton */}
            <div className="relative mt-8 h-[260px] overflow-hidden rounded-xl border border-[#F5D98B]/[0.045] bg-[#1B1F19]">
              {/* Chart grid */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(245,217,139,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(245,217,139,0.07) 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                }}
              />

              {/* Fake chart line */}
              <div className="absolute inset-x-5 bottom-7 top-8">
                <div className="absolute bottom-[18%] left-0 h-px w-[18%] rotate-[-8deg] bg-[#E7B84B]/20" />
                <div className="absolute bottom-[25%] left-[16%] h-px w-[18%] rotate-[12deg] bg-[#E7B84B]/20" />
                <div className="absolute bottom-[37%] left-[33%] h-px w-[17%] rotate-[-18deg] bg-[#E7B84B]/20" />
                <div className="absolute bottom-[31%] left-[49%] h-px w-[19%] rotate-[8deg] bg-[#E7B84B]/20" />
                <div className="absolute bottom-[48%] left-[67%] h-px w-[17%] rotate-[-12deg] bg-[#E7B84B]/20" />
              </div>

              {/* Chart bars */}
              <div className="absolute inset-x-6 bottom-5 flex h-32 items-end justify-between gap-2 opacity-50">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full rounded-t-sm bg-gradient-to-t from-[#E7B84B]/[0.05] to-[#F5D98B]/[0.12]"
                    style={{
                      height: `${25 + ((index * 17) % 65)}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-5">
              <div className="h-2.5 w-20 rounded-full bg-[#9A9D94]/[0.08]" />
              <div className="h-2.5 w-24 rounded-full bg-[#9A9D94]/[0.07]" />
              <div className="h-2.5 w-16 rounded-full bg-[#9A9D94]/[0.06]" />
            </div>
          </div>

          {/* Quick actions skeleton */}
          <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent" />

            <div className="h-3 w-28 rounded-full bg-[#F5D98B]/[0.10]" />

            <div className="mt-3 h-6 w-36 rounded-lg bg-[#F4F0E6]/[0.08]" />

            <div className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-[68px] items-center gap-3 rounded-xl border border-[#F5D98B]/[0.055] bg-[#1B1F19] px-3"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl border border-[#F5D98B]/[0.05] bg-[#252A22]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-28 rounded-full bg-[#F4F0E6]/[0.08]" />
                    <div className="mt-2 h-2 w-40 max-w-full rounded-full bg-[#9A9D94]/[0.06]" />
                  </div>

                  <div className="h-7 w-7 rounded-lg bg-[#F5D98B]/[0.05]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom sections */}
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          {/* Activity */}
          <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent" />

            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-24 rounded-full bg-[#F5D98B]/[0.10]" />
                <div className="mt-3 h-6 w-36 rounded-lg bg-[#F4F0E6]/[0.08]" />
              </div>

              <div className="h-8 w-16 rounded-lg bg-[#9A9D94]/[0.06]" />
            </div>

            <div className="mt-7 divide-y divide-[#F5D98B]/[0.05]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-4"
                >
                  <div className="h-9 w-9 shrink-0 rounded-xl border border-[#F5D98B]/[0.05] bg-[#252A22]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-48 max-w-[70%] rounded-full bg-[#F4F0E6]/[0.075]" />
                    <div className="mt-2 h-2 w-28 rounded-full bg-[#9A9D94]/[0.06]" />
                  </div>

                  <div className="h-2 w-12 rounded-full bg-[#9A9D94]/[0.05]" />
                </div>
              ))}
            </div>
          </div>

          {/* Workflow summary */}
          <div className="relative overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#20241D]/90 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/20 to-transparent" />

            <div className="h-3 w-28 rounded-full bg-[#F5D98B]/[0.10]" />

            <div className="mt-3 h-6 w-40 rounded-lg bg-[#F4F0E6]/[0.08]" />

            <div className="mt-7 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-2.5 w-28 rounded-full bg-[#F4F0E6]/[0.07]" />
                    <div className="h-2.5 w-10 rounded-full bg-[#9A9D94]/[0.06]" />
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#9A9D94]/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E7B84B]/20 to-[#F5D98B]/10"
                      style={{
                        width: `${35 + index * 15}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 h-10 w-full rounded-xl border border-[#F5D98B]/[0.05] bg-[#252A22]" />
          </div>
        </section>

        {/* Bottom operational indicator */}
        <div className="flex items-center justify-between border-t border-[#F5D98B]/[0.06] pt-5">
          <div className="h-2.5 w-40 rounded-full bg-[#9A9D94]/[0.06]" />

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#5ED6A0]/20" />
            <div className="h-2.5 w-24 rounded-full bg-[#9A9D94]/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}