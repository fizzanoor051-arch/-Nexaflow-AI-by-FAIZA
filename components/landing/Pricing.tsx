"use client";

import Link from "next/link";
import AmbientParticles from "@/components/landing/AmbientParticles";

const plans = [
  {
    name: "Starter",
    description: "For exploring AI-powered automation.",
    price: "$0",
    period: "forever",
    features: [
      "Basic AI assistance",
      "3 workflows",
      "100 AI actions / month",
      "Basic task management",
      "Workflow activity",
    ],
    button: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    description: "For businesses ready to automate more.",
    price: "$29",
    period: "per month",
    features: [
      "Advanced AI workflows",
      "Unlimited workflows",
      "1,000 AI actions / month",
      "Lead management",
      "Analytics dashboard",
      "Priority workflow execution",
    ],
    button: "Get started",
    featured: true,
  },
  {
    name: "Scale",
    description: "For teams with more complex automation needs.",
    price: "$79",
    period: "per month",
    features: [
      "Everything in Growth",
      "5,000 AI actions / month",
      "Advanced analytics",
      "Team workflows",
      "Custom automation logic",
      "Higher usage limits",
    ],
    button: "Contact sales",
    featured: false,
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 10 3 3 7-7" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#080806] py-24 sm:py-32"
    >
      {/* Animated mustard pearls */}
      <AmbientParticles />

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[-240px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-amber-400/[0.055] blur-[160px]" />

        <div className="absolute -left-60 top-[35%] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.018] blur-[150px]" />

        <div className="absolute -right-60 bottom-[5%] h-[520px] w-[520px] rounded-full bg-amber-300/[0.02] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="absolute left-1/2 top-[45%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-amber-200/[0.012] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/[0.12] bg-amber-300/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
            Pricing
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Start small.
            <span className="ml-2 text-amber-300">
              Scale when ready.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Simple plans for experimenting with AI automation and growing into
            more powerful workflows.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative rounded-2xl border p-6 transition-all duration-500 sm:p-7 ${
                plan.featured
                  ? "border-amber-300/[0.22] bg-amber-300/[0.035] shadow-[0_30px_90px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:border-amber-300/30 hover:bg-amber-300/[0.045]"
                  : "border-white/[0.075] bg-white/[0.018] hover:-translate-y-1 hover:border-amber-300/[0.16] hover:bg-white/[0.025]"
              }`}
            >
              {plan.featured && (
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-300/[0.08] via-transparent to-transparent opacity-80" />
              )}

              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />

              {plan.featured && (
                <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-amber-300/[0.18] bg-amber-300/[0.07] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
                  Popular
                </div>
              )}

              <div className="relative">
                <h3
                  className={`text-lg font-semibold ${
                    plan.featured ? "text-amber-50" : "text-white"
                  }`}
                >
                  {plan.name}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {plan.description}
                </p>
              </div>

              <div className="relative mt-7 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {plan.price}
                </span>

                <span className="ml-2 text-xs text-slate-600">
                  {plan.period}
                </span>
              </div>

              <Link
                href="/register"
                className={`relative mt-7 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  plan.featured
                    ? "border border-amber-200/20 bg-amber-300 text-[#17130a] shadow-[0_10px_30px_rgba(245,158,11,0.12)] hover:bg-amber-200 hover:shadow-[0_14px_40px_rgba(245,158,11,0.2)]"
                    : "border border-white/[0.09] bg-white/[0.025] text-slate-200 hover:border-amber-300/[0.2] hover:bg-amber-300/[0.05] hover:text-amber-100"
                }`}
              >
                {plan.button}
              </Link>

              <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              <p className="text-xs font-semibold text-slate-400">
                Includes:
              </p>

              <ul className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="group/item flex items-start gap-3 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-300"
                  >
                    <span
                      className={`mt-0.5 ${
                        plan.featured
                          ? "text-amber-300"
                          : "text-amber-300/60"
                      }`}
                    >
                      <CheckIcon />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center gap-2 border-t border-white/[0.045] pt-5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    plan.featured
                      ? "bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.7)]"
                      : "bg-slate-700"
                  }`}
                />

                <span className="text-[10px] text-slate-600">
                  Ready when you are
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-700">
          Pricing shown for product demonstration purposes.
        </p>
      </div>
    </section>
  );
}