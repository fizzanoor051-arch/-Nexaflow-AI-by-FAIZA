"use client";

import AmbientParticles from "@/components/landing/AmbientParticles";

const steps = [
  {
    number: "01",
    title: "Describe the problem",
    description:
      "Tell NexaFlow what your business needs in natural language. No complicated setup is required to start.",
  },
  {
    number: "02",
    title: "AI structures the request",
    description:
      "The AI identifies intent, extracts useful information, determines priority, and proposes the right actions.",
  },
  {
    number: "03",
    title: "Review the workflow",
    description:
      "See the generated workflow before execution. Understand exactly what actions will be taken.",
  },
  {
    number: "04",
    title: "Execute & track",
    description:
      "Turn the plan into organized tasks, leads, conversations, and measurable workflow activity.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#080806] py-24 sm:py-32"
    >
      {/* Animated mustard pearls */}
      <AmbientParticles />

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-amber-400/[0.055] blur-[150px]" />

        <div className="absolute -left-52 top-[28%] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.025] blur-[150px]" />

        <div className="absolute -right-52 bottom-[5%] h-[520px] w-[520px] rounded-full bg-amber-300/[0.025] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="absolute left-1/2 top-[38%] h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-amber-300/[0.018] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/[0.12] bg-amber-300/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
            How it works
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            From request to
            <span className="ml-2 text-amber-300">action.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            A simple workflow that turns everyday business problems into
            structured, actionable automation.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px lg:block">
            <div className="h-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="group relative">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] border border-amber-300/[0.14] bg-[#0d0d0a]/95 shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-amber-300/30 group-hover:shadow-[0_20px_60px_rgba(245,158,11,0.08)]">
                  <div className="pointer-events-none absolute -inset-3 rounded-[28px] bg-amber-300/[0.025] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute inset-2 rounded-[16px] border border-white/[0.045]" />

                  <div className="absolute right-2.5 top-2.5 h-1 w-1 rounded-full bg-amber-300/70 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />

                  <span className="relative text-sm font-bold tracking-wider text-amber-300">
                    {step.number}
                  </span>
                </div>

                <div className="mt-7 text-center">
                  <h3 className="text-base font-semibold text-white transition-colors duration-300 group-hover:text-amber-100">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example workflow */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="pointer-events-none absolute -inset-6 rounded-[30px] bg-amber-400/[0.025] blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0b0b09]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300/75">
                  Example
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  Customer inquiry automation
                </h3>
              </div>

              <span className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/[0.07] px-3 py-1.5 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                Workflow ready
              </span>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-4">
              {[
                ["Message", "Customer asks a question"],
                ["AI", "Intent is classified"],
                ["Action", "Lead + task created"],
                ["Result", "Response is prepared"],
              ].map(([title, text], index) => (
                <div key={title} className="relative">
                  <div className="group rounded-xl border border-white/[0.06] bg-[#0f0f0c]/90 p-4 transition-all duration-300 hover:border-amber-300/[0.18] hover:bg-amber-300/[0.025]">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70 shadow-[0_0_7px_rgba(252,211,77,0.6)]" />

                      <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-300/75">
                        {title}
                      </div>
                    </div>

                    <p className="text-xs leading-5 text-slate-400">
                      {text}
                    </p>
                  </div>

                  {index < 3 && (
                    <div className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-amber-300/30 md:block">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.05] pt-5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_9px_rgba(252,211,77,0.8)]" />

              <span className="text-[10px] text-slate-600">
                AI workflow pipeline ready for execution
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}