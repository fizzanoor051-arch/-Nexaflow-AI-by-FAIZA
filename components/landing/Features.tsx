import AmbientParticles from "@/components/landing/AmbientParticles";

const features = [
  {
    number: "01",
    title: "AI understands the request",
    description:
      "Turn natural-language business requests into structured, actionable information using intelligent AI processing.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Build intelligent workflows",
    description:
      "Create repeatable workflows that connect AI decisions with practical business actions, tasks, leads, and follow-ups.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="4" width="7" height="6" rx="1.5" />
        <rect x="14" y="14" width="7" height="6" rx="1.5" />
        <path d="M10 7h3a2 2 0 0 1 2 2v5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Manage leads automatically",
    description:
      "Capture important customer information, classify leads, assign priorities, and keep every opportunity organized.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 11h5M18.5 8.5v5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Track tasks & outcomes",
    description:
      "Convert AI-generated actions into trackable tasks so your team always knows what needs attention next.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "See business analytics",
    description:
      "Understand workflow activity, AI usage, automation performance, and operational trends from one dashboard.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Designed for secure growth",
    description:
      "The architecture is prepared for authentication, validation, protected routes, secure APIs, and scalable data storage.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15" r="1" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#080806] py-24 sm:py-32"
    >
      {/* Animated mustard pearls */}
      <AmbientParticles />

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Main golden glow */}
        <div className="absolute left-1/2 top-[-240px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-amber-400/[0.055] blur-[160px]" />

        {/* Left soft glow */}
        <div className="absolute -left-60 top-[25%] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.018] blur-[150px]" />

        {/* Right soft glow */}
        <div className="absolute -right-60 bottom-[8%] h-[520px] w-[520px] rounded-full bg-amber-300/[0.02] blur-[150px]" />

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
        <div className="absolute left-1/2 top-[48%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-amber-200/[0.012] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/[0.12] bg-amber-300/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
            Platform
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything you need to automate
            <span className="ml-2 text-amber-300">
              repetitive work.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            NexaFlow combines AI reasoning with structured workflows, helping
            teams move from unstructured requests to measurable business
            actions.
          </p>
        </div>

        {/* Feature grid */}
        <div className="relative mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group relative bg-[#0b0b09]/95 p-7 transition-all duration-500 hover:bg-[#10100c]"
            >
              {/* Top golden light */}
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/0 to-transparent transition-all duration-500 group-hover:via-amber-300/35" />

              {/* Soft hover glow */}
              <div className="pointer-events-none absolute -inset-10 bg-amber-300/[0.018] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/[0.14] bg-amber-300/[0.045] text-amber-300 transition-all duration-300 group-hover:border-amber-300/30 group-hover:bg-amber-300/[0.08] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.08)]">
                    {feature.icon}
                  </div>

                  <span className="text-xs font-medium text-slate-700 transition-colors duration-300 group-hover:text-amber-300/45">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-base font-semibold text-white transition-colors duration-300 group-hover:text-amber-50">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>

                {/* Accent line */}
                <div className="mt-7 h-px w-10 bg-amber-300/30 transition-all duration-500 group-hover:w-20 group-hover:bg-amber-300/60" />

                {/* Bottom status */}
                <div className="mt-5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300/50 transition-all duration-300 group-hover:bg-amber-300 group-hover:shadow-[0_0_8px_rgba(252,211,77,0.7)]" />

                  <span className="text-[10px] text-slate-700 transition-colors duration-300 group-hover:text-slate-600">
                    AI-powered capability
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}