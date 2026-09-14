import AmbientParticles from "@/components/landing/AmbientParticles";

const useCases = [
  {
    category: "E-commerce",
    title: "Handle customer inquiries",
    description:
      "Automatically understand customer questions, classify intent, prepare responses, capture lead information, and create follow-up tasks.",
    tags: ["Lead capture", "AI replies", "Follow-ups"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 5h16v12H4z" />
        <path d="M8 21h8M12 17v4" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
  {
    category: "Sales",
    title: "Turn conversations into leads",
    description:
      "Extract useful customer information from conversations, assign priority, and organize prospects without manually entering every detail.",
    tags: ["Lead scoring", "Extraction", "Priorities"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6 1.6 0 3 .6 4.1 1.6" />
        <path d="M16 14h5M18.5 11.5v5" />
      </svg>
    ),
  },
  {
    category: "Operations",
    title: "Automate repetitive tasks",
    description:
      "Transform recurring business processes into structured workflows so your team can spend more time on work that actually needs human attention.",
    tags: ["Task automation", "Workflows", "Tracking"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
        <path d="M10 7h3a2 2 0 0 1 2 2v5" />
      </svg>
    ),
  },
  {
    category: "Support",
    title: "Keep customer support organized",
    description:
      "Analyze incoming requests, identify the right next action, and maintain a clear history of customer conversations and outcomes.",
    tags: ["Classification", "History", "Next actions"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 5h16v11H8l-4 4z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#080806] py-24 sm:py-32"
    >
      {/* Animated mustard pearls */}
      <AmbientParticles />

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Main golden glow */}
        <div className="absolute left-1/2 top-[-240px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-amber-400/[0.055] blur-[160px]" />

        {/* Left glow */}
        <div className="absolute -left-60 top-[28%] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.018] blur-[150px]" />

        {/* Right glow */}
        <div className="absolute -right-60 bottom-[5%] h-[520px] w-[520px] rounded-full bg-amber-300/[0.02] blur-[150px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Center atmosphere */}
        <div className="absolute left-1/2 top-[48%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-amber-200/[0.012] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/[0.12] bg-amber-300/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.04)]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
              Use cases
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Built around real
              <span className="ml-2 text-amber-300">
                business problems.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              NexaFlow is designed to connect AI reasoning with practical
              workflows that businesses can actually use.
            </p>
          </div>

          {/* Automation mindset */}
          <div className="hidden rounded-xl border border-amber-300/[0.10] bg-amber-300/[0.025] px-4 py-3 shadow-[0_0_30px_rgba(245,158,11,0.025)] lg:block">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Automation mindset
            </p>

            <p className="mt-1 text-sm font-medium text-slate-300">
              <span className="text-amber-300/80">Understand</span>
              <span className="mx-2 text-slate-700">→</span>
              <span className="text-amber-300/80">Decide</span>
              <span className="mx-2 text-slate-700">→</span>
              <span className="text-amber-300/80">Act</span>
            </p>
          </div>
        </div>

        {/* Use case cards */}
        <div className="relative mt-14 grid gap-4 md:grid-cols-2">
          {useCases.map((item) => (
            <article
              key={item.category}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0b0b09]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-300/[0.20] hover:bg-[#10100c] hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)] sm:p-7"
            >
              {/* Card corner glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/[0.025] blur-3xl transition-all duration-500 group-hover:bg-amber-300/[0.08]" />

              {/* Top highlight */}
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/0 to-transparent transition-all duration-500 group-hover:via-amber-300/35" />

              {/* Hover ambient glow */}
              <div className="pointer-events-none absolute -inset-10 bg-amber-300/[0.015] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between gap-5">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-300/[0.14] bg-amber-300/[0.045] text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.03)] transition-all duration-300 group-hover:border-amber-300/30 group-hover:bg-amber-300/[0.08] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]">
                  {item.icon}
                </div>

                {/* Category */}
                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-medium text-slate-500 transition-all duration-300 group-hover:border-amber-300/[0.12] group-hover:bg-amber-300/[0.035] group-hover:text-amber-300/70">
                  {item.category}
                </span>
              </div>

              <div className="relative mt-7">
                <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-50">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="relative mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-1.5 text-[10px] font-medium text-slate-500 transition-all duration-300 group-hover:border-amber-300/[0.08] group-hover:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom accent */}
              <div className="relative mt-7 h-px w-10 bg-amber-300/30 transition-all duration-500 group-hover:w-20 group-hover:bg-amber-300/60" />

              {/* Status */}
              <div className="relative mt-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300/45 transition-all duration-300 group-hover:bg-amber-300 group-hover:shadow-[0_0_8px_rgba(252,211,77,0.7)]" />

                <span className="text-[10px] text-slate-700 transition-colors duration-300 group-hover:text-slate-600">
                  Automation-ready use case
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}