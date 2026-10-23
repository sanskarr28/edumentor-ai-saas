"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  User,
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
  GraduationCap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    gradeLevel: "",
    subject: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to create account. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
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
        {/* LEFT COLUMN: REGISTRATION FORM CONTAINER                  */}
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
                Self-Serve Onboarding
              </span>
            </div>
          </div>

          {/* Form center body */}
          <div className="mx-auto my-auto w-full max-w-md py-8 sm:py-10">
            {/* Brand Logo & Heading */}
            <div className="mb-6">
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
                    Institutional Workspace
                  </p>
                </div>
              </Link>

              <div className="mt-6 space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  Create your workspace account
                </h1>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Select your role and enter your details to launch your academic dashboard.
                </p>
              </div>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200/90 bg-rose-50/90 p-4 text-xs leading-5 text-rose-800 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
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
                  <p className="font-semibold text-rose-900 dark:text-rose-200">Registration Error</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="you@institution.edu"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Primary Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "student", label: "Student", icon: GraduationCap },
                    { id: "teacher", label: "Faculty", icon: BookOpen },
                    { id: "parent", label: "Parent", icon: Users },
                  ].map((r) => {
                    const isSelected = form.role === r.id;
                    const IconC = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => update("role", r.id)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        }`}
                      >
                        <IconC className="h-3.5 w-3.5" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Role Details */}
              {form.role === "student" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Grade or Academic Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grade 11 / Undergraduate Year 2"
                    value={form.gradeLevel}
                    onChange={(e) => update("gradeLevel", e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100"
                  />
                </div>
              )}

              {form.role === "teacher" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Department or Primary Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Theoretical Physics / Applied Mathematics"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 hover:shadow-indigo-600/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span>Configuring workspace…</span>
                  </div>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Prompt */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
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
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: VALUE SHOWCASE PANEL                        */}
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

          {/* Top Status Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Instant Workspace Creation • Zero Setup Fee</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>SOC-2 Aligned</span>
            </div>
          </div>

          {/* Middle Body */}
          <div className="relative z-10 my-auto py-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Academic Engine</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-[1.15]">
                One workspace for your entire educational journey.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Join thousands of students and educators utilizing conversational Socratic debate pods, direct S3 assignment verification, and real-time attendance telemetry.
              </p>
            </div>

            {/* Feature Bento Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">Socratic AI Pods</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Elena, Alex, and Dr. Marcus evaluate defense arguments on a formal 100-point rubric.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 ring-1 ring-white/10">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">Verified Telemetry</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Longitudinal GPA metrics, attendance records, and one-click PDF transcript exports.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-white/10">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">AWS S3 Presigned</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Instant document uploads and syllabus downloads with zero proxy buffer lag.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 ring-1 ring-white/10">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">Collaborative Rooms</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Real-time peer chat with study pod invitation notifications and topic tagging.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security Card */}
          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Zero Student Data Training</p>
                  <p className="text-[11px] text-slate-400">Your academic work remains 100% confidential</p>
                </div>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}