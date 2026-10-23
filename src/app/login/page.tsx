"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid credentials. Please verify your email and password.");
        setLoading(false);
        return;
      }
      router.push(params.get("next") ?? "/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] dark:bg-[#070B12] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradient accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />
        <div className="absolute top-1/2 -right-32 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1520px] lg:grid-cols-[1.08fr_1fr]">
        {/* ========================================================= */}
        {/* LEFT COLUMN: AUTHENTICATION FORM CONTAINER               */}
        {/* ========================================================= */}
        <div className="flex flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to home</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Institutional SSO Ready
              </span>
            </div>
          </div>

          {/* Form center body */}
          <div className="mx-auto my-auto w-full max-w-md py-10 sm:py-12">
            {/* Brand Logo & Heading */}
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 transition-transform group-hover:scale-105">
                  <span className="text-lg tracking-tight">E</span>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                      EduMentor
                    </span>
                    <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      AI
                    </span>
                  </div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500 uppercase">
                    Enterprise Workspace
                  </p>
                </div>
              </Link>

              <div className="mt-8 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  Sign in to EduMentor AI
                </h1>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Enter your institutional or workspace credentials to access your dashboard.
                </p>
              </div>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200/90 bg-rose-50/90 p-4 text-xs leading-5 text-rose-800 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-rose-100 p-1 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-rose-900 dark:text-rose-200">Authentication Failed</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Institutional Email
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="name@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 transition focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Remember this device
                  </span>
                </label>
                <Link
                  href="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Need password help?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 hover:shadow-indigo-600/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Authenticating session…</span>
                  </div>
                ) : (
                  <>
                    <span>Sign in to Workspace</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register Prompt */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don&apos;t have an institutional account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline underline-offset-4"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Enterprise Security Footnote */}
            <div className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-slate-100/70 dark:bg-slate-900/60 px-3.5 py-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Protected by enterprise-grade role-based access control</span>
            </div>
          </div>

          {/* Left column footer */}
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span>© {new Date().getFullYear()} EduMentor AI, Inc.</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:underline">
                Terms
              </Link>
              <Link href="/" className="hover:underline">
                Privacy
              </Link>
              <Link href="/" className="hover:underline">
                Compliance
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: BRAND & VALUE SHOWCASE PANEL                */}
        {/* ========================================================= */}
        <div className="relative hidden overflow-hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-16 border-l border-white/10">
          {/* Ambient Lighting & Architectural Grid */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          {/* Top Panel Status Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>EduMentor Platform v2.0 • Active Cluster</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>SOC-2 Aligned</span>
            </div>
          </div>

          {/* Middle Body: Narrative & Feature Bento Stack */}
          <div className="relative z-10 my-auto py-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Academic Engine</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-[1.15]">
                A clearer, connected view of academic achievement.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Bring courseware, longitudinal telemetry, multi-agent AI study pods, and guardian transparency into one unified institutional operating system.
              </p>
            </div>

            {/* Bento Grid Features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Feature 1 */}
              <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 ring-1 ring-white/10">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">
                  Courses & Assignments
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  S3-integrated submissions, automated syllabus tracking, and rubric grading.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 ring-1 ring-white/10">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">
                  Progress & Reporting
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Longitudinal gradebooks, attendance heatmaps, and verified transcripts.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-white/10">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">
                  Role-Based Workspaces
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Dedicated interfaces for Students, Faculty, Parents, and Administrators.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">
                  Multi-Agent Study Pods
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Elena, Alex, and Dr. Marcus Socratic defense evaluations with peer chat.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Glass Telemetry Card */}
          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Institutional Telemetry</p>
                  <p className="text-[11px] text-slate-400">Zero data retention on student AI queries</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  99.98% Uptime SLA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#070B12]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}