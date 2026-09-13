"use client";

import Link from "next/link";

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
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#06091a] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Pricing
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start small.
            <span className="text-violet-300"> Scale when ready.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
            Simple plans for experimenting with AI automation and growing into
            more powerful workflows.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 sm:p-7 ${
                plan.featured
                  ? "border-violet-400/25 bg-violet-500/[0.06] shadow-2xl shadow-violet-950/20"
                  : "border-white/[0.08] bg-white/[0.025]"
              }`}
            >
              {plan.featured && (
                <div className="absolute right-5 top-5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-300">
                  Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {plan.description}
                </p>
              </div>

              <div className="mt-7">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {plan.price}
                </span>

                <span className="ml-2 text-xs text-slate-600">
                  {plan.period}
                </span>
              </div>

              <Link
                href="/register"
                className={`mt-7 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500"
                    : "border border-white/[0.09] bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]"
                }`}
              >
                {plan.button}
              </Link>

              <div className="my-7 h-px bg-white/[0.07]" />

              <p className="text-xs font-semibold text-slate-400">
                Includes:
              </p>

              <ul className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-500"
                  >
                    <span className="mt-0.5 text-violet-400">
                      <CheckIcon />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
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