
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("fizzanoor051@gmail.com");
  const [password, setPassword] = useState("Password123");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to sign in.");
        return;
      }

      localStorage.removeItem("nexaflow_guest");

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGuestContinue() {
    setError("");
    setGuestLoading(true);

    localStorage.setItem("nexaflow_guest", "true");

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 py-10 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 font-bold">
              N
            </div>

            <span className="text-xl font-bold">
              NexaFlow
            </span>
          </Link>

          <h1 className="mt-8 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to your AI automation workspace.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </span>

              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  Password
                </span>

                <span className="text-xs text-slate-600">
                  Demo authentication
                </span>
              </div>

              <input
                type="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
              />
            </label>

            <button
              type="submit"
              disabled={loading || guestLoading}
              className="w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Guest divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-600">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Continue as guest */}
          <button
            type="button"
            onClick={handleGuestContinue}
            disabled={loading || guestLoading}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guestLoading
              ? "Opening workspace..."
              : "Continue as guest"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
