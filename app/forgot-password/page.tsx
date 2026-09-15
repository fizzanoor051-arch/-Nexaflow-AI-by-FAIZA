"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to process your request.");
      }

      setSuccess(
        data.message ||
          "If an account exists for this email, reset instructions are ready."
      );
      setEmail("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#151713] px-4 py-10 text-[#F4F0E6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(231,184,75,0.12),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(94,214,160,0.05),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(231,184,75,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(231,184,75,0.25)_1px,transparent_1px)] [background-size:55px_55px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#9A9D94] transition-colors hover:text-[#F5D98B]"
          >
            <span>←</span>
            Back to sign in
          </Link>

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7B84B]/20 bg-[#20241D]/80 text-xl text-[#E7B84B] shadow-[0_0_35px_rgba(231,184,75,0.08)]">
            ✦
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#E7B84B]">
            NEXAFLOW / CONTROL
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Reset your password
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#9A9D94]">
            Enter the email associated with your NexaFlow account and we&apos;ll
            help you regain access.
          </p>
        </div>

        <div className="rounded-2xl border border-[#F5D98B]/10 bg-[#1B1F19]/90 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          {error ? (
            <div className="mb-5 rounded-xl border border-[#E87575]/20 bg-[#E87575]/[0.06] px-4 py-3 text-sm text-[#F3A5A5]">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-5 rounded-xl border border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.06] px-4 py-3 text-sm leading-6 text-[#9BE7BE]">
              <div className="mb-1 font-semibold">Request received</div>
              {success}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#D8D9D2]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full rounded-xl border border-[#F5D98B]/10 bg-[#20241D]/80 px-4 py-3 text-sm text-[#F4F0E6] outline-none transition-all placeholder:text-[#686C64] focus:border-[#E7B84B]/40 focus:ring-2 focus:ring-[#E7B84B]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-[#E7B84B] px-4 py-3.5 text-sm font-bold text-[#151713] transition-all duration-300 hover:bg-[#F5D98B] hover:shadow-[0_0_35px_rgba(231,184,75,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10">
                {loading ? "Processing request..." : "Continue"}
              </span>
            </button>
          </form>

          <div className="mt-6 border-t border-[#F5D98B]/[0.07] pt-5 text-center">
            <span className="text-sm text-[#73776F]">
              Remember your password?{" "}
            </span>

            <Link
              href="/login"
              className="text-sm font-semibold text-[#E7B84B] transition-colors hover:text-[#F5D98B]"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#62665E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.6)]" />
          Secure authentication layer
        </div>
      </div>
    </main>
  );
}