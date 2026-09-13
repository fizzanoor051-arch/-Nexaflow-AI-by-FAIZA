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
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#06091a] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            How it works
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From request to
            <span className="text-violet-300"> action.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
            A simple workflow that turns everyday business problems into
            structured, actionable automation.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connector */}
          <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-violet-500/10 via-violet-400/30 to-indigo-500/10 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-400/15 bg-[#080c20] shadow-xl shadow-black/20">
                  <div className="absolute inset-2 rounded-xl border border-white/[0.05]" />

                  <span className="relative text-sm font-bold text-violet-300">
                    {step.number}
                  </span>
                </div>

                <div className="mt-7 text-center">
                  <h3 className="text-base font-semibold text-white">
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
        <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-violet-400">
                Example
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Customer inquiry automation
              </h3>
            </div>

            <span className="rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-400">
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
                <div className="rounded-xl border border-white/[0.06] bg-[#080c20] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                    {title}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {text}
                  </p>
                </div>

                {index < 3 && (
                  <div className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-slate-700 md:block">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}