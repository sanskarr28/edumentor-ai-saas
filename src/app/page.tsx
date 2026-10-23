import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Activity,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Users,
  Layers,
  FileText,
  Lock,
  ChevronRight,
  Award,
  Zap,
  MessageSquare,
  Compass,
} from "lucide-react";

const bentoFeatures = [
  {
    id: "pod",
    span: "lg:col-span-2",
    badge: "Flagship Feature",
    badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    title: "Multi-Agent AI Study Pods",
    description:
      "Engage with three distinct Socratic personas—Elena (The Visualizer), Alex (The Skeptic), and Dr. Marcus (The Formal Examiner). Defend your understanding under rigorous cross-examination, receive instant rubric evaluations (0–100%), and invite classmates to live peer chat.",
    icon: Sparkles,
    metrics: [
      { label: "AI Personas", value: "3 Agents" },
      { label: "Rubric Scoring", value: "0–100%" },
      { label: "Defense Synthesis", value: "Real-Time" },
    ],
  },
  {
    id: "courses",
    span: "lg:col-span-1",
    badge: "Core Architecture",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    title: "Dynamic Courses & Submissions",
    description:
      "Full syllabus management, S3-powered direct presigned document uploads, interactive lecture materials, and automated assignment submission verification.",
    icon: BookOpen,
    metrics: [
      { label: "File Uploads", value: "AWS S3" },
      { label: "Direct Transfer", value: "Presigned" },
    ],
  },
  {
    id: "analytics",
    span: "lg:col-span-1",
    badge: "Intelligence",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    title: "Longitudinal Progress & Gradebooks",
    description:
      "Real-time weighted grading calculations, automated GPA tracking, student attendance heatmaps, and downloadable verified PDF transcripts.",
    icon: TrendingUp,
    metrics: [
      { label: "Telemetry", value: "Sub-Second" },
      { label: "PDF Export", value: "One-Click" },
    ],
  },
  {
    id: "rbac",
    span: "lg:col-span-2",
    badge: "Security & RBAC",
    badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    title: "Role-Based Workspaces & Guardian Portal",
    description:
      "Granular role-based access control segregates access between Students, Faculty, Administrators, and Parents. Encrypted parent-student pairing enables families to track coursework and attendance without compromising institutional compliance.",
    icon: Users,
    metrics: [
      { label: "Portals", value: "4 Roles" },
      { label: "Session Security", value: "JWT + AES" },
      { label: "Parent Sync", value: "Encrypted" },
    ],
  },
];

const rolesList = [
  {
    role: "Students",
    badge: "Learner Workspace",
    headline: "Master complex concepts with conversational defense",
    points: [
      "Cross-examine theories in AI Study Pods with Elena & Alex",
      "Direct file submissions with instant confirmation",
      "Track attendance, GPA, and upcoming deliverables in one place",
    ],
  },
  {
    role: "Faculty",
    badge: "Academic Command",
    headline: "Streamline curriculum, assignments, and rubric grading",
    points: [
      "Distribute course materials via AWS S3 presigned storage",
      "One-click submission review with automated score calculation",
      "Broadcast institutional announcements to enrolled students",
    ],
  },
  {
    role: "Parents & Guardians",
    badge: "Guardian Oversight",
    headline: "Real-time visibility into academic growth and wellbeing",
    points: [
      "Follow child coursework completion and attendance milestones",
      "Review teacher feedback and longitudinal performance cards",
      "Direct alignment with school schedule and important deadlines",
    ],
  },
  {
    role: "Administrators",
    badge: "Institutional Governance",
    headline: "Campus-wide analytics, user lifecycle, and compliance",
    points: [
      "Unified directory of faculty, students, courses, and enrollments",
      "Campus-wide attendance telemetry and audit trails",
      "Fine-grained RBAC permission enforcement and secure session controls",
    ],
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20">
        <span className="text-base tracking-tight">E</span>
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
          EduMentor
        </span>
        <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          AI
        </span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#070B12] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* ========================================================= */}
      {/* 1. STICKY GLASSMORPHIC NAVBAR                            */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/75 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-[#070B12]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" aria-label="EduMentor AI home">
            <Brand />
          </Link>

          {/* Center Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#features"
              className="transition-colors hover:text-indigo-600 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#studypod"
              className="transition-colors hover:text-indigo-600 dark:hover:text-white flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>AI Study Pod</span>
            </a>
            <a
              href="#roles"
              className="transition-colors hover:text-indigo-600 dark:hover:text-white"
            >
              Solutions by Role
            </a>
            <a
              href="#security"
              className="transition-colors hover:text-indigo-600 dark:hover:text-white"
            >
              Security
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 hover:shadow-indigo-600/30"
            >
              <span>Get started</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="overflow-hidden">
        {/* ========================================================= */}
        {/* 2. HERO SECTION                                          */}
        {/* ========================================================= */}
        <section className="relative mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:px-10 lg:pt-24 lg:pb-32">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[36rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-purple-500/15 blur-[100px] dark:from-indigo-600/20 dark:via-blue-600/15 dark:to-purple-600/15" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
            {/* Left Column: Headline & CTA */}
            <div>
              {/* Refined Announcement Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-indigo-900 shadow-xs dark:border-indigo-900/60 dark:bg-slate-900/80 dark:text-indigo-300 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>EduMentor AI 2.0 — Intelligent Academic Workspace</span>
              </div>

              {/* High-impact Display Headline */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] dark:text-white">
                The intelligent workspace for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                  modern academic excellence.
                </span>
              </h1>

              {/* Crisp Subheadline */}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
                Orchestrate coursework, track longitudinal growth, and master difficult subjects
                through multi-agent Socratic debate pods. Built with fine-grained RBAC for students,
                faculty, parents, and administrators.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Start Free Workspace</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300/80 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  Explore Platform
                </Link>
              </div>

              {/* Clean Trust Bar */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-6 text-xs font-medium text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Built for modern institutions</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Role-based access control</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Real-time AI telemetry</span>
                </span>
              </div>
            </div>

            {/* Right Column: Multi-Layered Interactive SaaS UI Mockup */}
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              {/* Ambient Mockup Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-blue-500/15 to-purple-500/20 blur-2xl dark:from-indigo-600/30 dark:via-blue-600/20 dark:to-purple-600/20" />

              {/* Main Workspace Preview Window */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-indigo-950/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/60">
                {/* Window Title Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6 dark:border-slate-800/80 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                      app.edumentor.ai/dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>AI Cluster Connected</span>
                  </div>
                </div>

                {/* Dashboard Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800/80">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Academic Command Center
                    </p>
                    <p className="mt-0.5 text-base font-bold text-slate-950 dark:text-white">
                      Spring Term 2026 Overview
                    </p>
                  </div>
                  <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    GPA: 3.94
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Active Courses
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        06
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        100% Sync
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Assignments
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        02
                      </p>
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        Due in 4h
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Attendance
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        98.4%
                      </p>
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        +2.1%
                      </span>
                    </div>
                  </div>

                  {/* Progress multi-segment bar */}
                  <div className="col-span-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">
                        Term Competency Index
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        94% • Exemplary
                      </span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
                      <div className="h-full w-[45%] bg-blue-600" title="Coursework" />
                      <div className="h-full w-[30%] bg-indigo-600" title="Attendance" />
                      <div className="h-full w-[19%] bg-purple-600" title="Study Pod Defense" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-600" /> Coursework (84%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-600" /> Attendance (98%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-600" /> Socratic Pods (94%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating "AI Insight" Glassmorphic Toast Card */}
                <div className="border-t border-slate-100 bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-purple-50/90 px-5 py-3.5 sm:px-6 dark:border-slate-800 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-slate-900/90">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          AI Study Pod Defense Synthesized
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Score: 94/100
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        &quot;Alex &amp; Elena verified your critique of Bohr&apos;s quantization assumption. Formal rubric archived.&quot;
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Decorative Floating Badges */}
              <div className="absolute -left-5 -bottom-5 hidden sm:flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Verified Defense Transcript
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    PDF Export Available with Faculty Sign-off
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. BENTO GRID FEATURE SECTION                            */}
        {/* ========================================================= */}
        <section
          id="features"
          className="relative border-y border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            {/* Section Header */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Layers className="h-3.5 w-3.5" />
                <span>Enterprise Architecture</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Engineered for academic rigor. Built for modern scale.
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                EduMentor AI integrates day-to-day administrative operations with bleeding-edge
                Socratic intelligence to elevate the entire learning continuum.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
              {bentoFeatures.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <article
                    key={feat.id}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FAFAFA] p-7 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-[#0B101D] dark:hover:border-indigo-900/60 ${feat.span}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-xs dark:bg-slate-900 ring-1 ring-slate-200/70 dark:ring-slate-800 text-indigo-600 dark:text-indigo-400">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${feat.badgeColor}`}
                      >
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {feat.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {feat.description}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-slate-200/70 pt-5 dark:border-slate-800">
                      {feat.metrics.map((m) => (
                        <div key={m.label} className="min-w-[100px]">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {m.label}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-200">
                            {m.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. MULTI-AGENT STUDY POD DEEP DIVE                       */}
        {/* ========================================================= */}
        <section id="studypod" className="py-20 sm:py-28 bg-[#FAFAFA] dark:bg-[#070B12]">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 lg:p-16 dark:border-slate-800 dark:bg-slate-950 shadow-xl">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/50 dark:text-purple-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Socratic Multi-Agent Architecture</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    Don&apos;t just memorize. Defend your knowledge.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                    Traditional AI gives answers. EduMentor AI forces students to think critically.
                    Students initiate a topic, and three distinct AI personas unpack misconceptions
                    through lively cross-examination.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Elena — The Visualizer
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Transforms abstract mathematical formulations into tangible physical analogies and intuitive mental models.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Alex — The Skeptic
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Probes for hidden logical fallacies, edge cases, and unwarranted assumptions that fail under pressure.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Dr. Marcus — The Formal Examiner
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Demands academic precision, proper citation terminology, and scores your thesis on a formal 100-point rubric.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <span>Explore the Study Pod in your workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Visualizer Box */}
                <div className="relative rounded-2xl border border-slate-200/90 bg-[#FAFAFA] p-6 dark:border-slate-800 dark:bg-[#0D1322]">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                        SP
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Live Socratic Pod: Quantum Orbitals
                        </p>
                        <p className="text-[11px] text-slate-500">3 AI Agents • 2 Peer Classmates</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                      Active Defense
                    </span>
                  </div>

                  <div className="mt-5 space-y-3.5">
                    {/* Elena Message */}
                    <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          Elena (Visualizer)
                        </span>
                        <span className="text-[10px] text-slate-400">Agent Telemetry</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                        &quot;Think of the electron not as a billiard ball on a track, but as a standing sound wave around a guitar string. It can only vibrate at discrete harmonics!&quot;
                      </p>
                    </div>

                    {/* Alex Message */}
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                          Alex (Skeptic)
                        </span>
                        <span className="text-[10px] text-slate-400">Rebuttal</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                        &quot;Hold on. If it is purely a wave, why does the photoelectric effect prove localized particle-like energy packet exchange? How does your hypothesis reconcile both?&quot;
                      </p>
                    </div>

                    {/* Student Defense */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Your Synthesis Defense
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600">
                          Scored: 95%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 italic">
                        &quot;De Broglie&apos;s wavelength lambda = h/p proves duality. Electrons exhibit wave interference in Davisson-Germer, but exchange energy in discrete quanta h*nu when striking phosphor...&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. SOLUTIONS BY ROLE SECTION                             */}
        {/* ========================================================= */}
        <section
          id="roles"
          className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Tailored Perspectives
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                A unified platform. Purpose-built for every role.
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Each stakeholder receives the exact tools and telemetry they need, cleanly partitioned with strict RBAC.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rolesList.map((item, idx) => (
                <div
                  key={item.role}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-[#FAFAFA] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#0B101D] dark:hover:border-slate-700"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        0{idx + 1}
                      </span>
                      <span className="rounded-full bg-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.headline}
                    </p>
                    <ul className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      {item.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      <span>Join as {item.role}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. SECURITY & COMPLIANCE TRUST BAR                       */}
        {/* ========================================================= */}
        <section
          id="security"
          className="border-t border-slate-200/80 bg-[#FAFAFA] py-16 dark:border-slate-800/80 dark:bg-[#070B12]"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    End-to-End Encryption
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Direct presigned AWS S3 transfers keep sensitive files out of proxy buffers. All sessions secured with salted bcrypt and encrypted JWTs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Strict RBAC Separation
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Multi-tenant data isolation ensures students only see their enrollments, faculty control their rosters, and parents access verified child records.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Zero AI Training Retention
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Student responses submitted to Gemini models are never utilized to train foundation models. Academic privacy is preserved at all tiers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. PRE-FOOTER CALL TO ACTION                             */}
        {/* ========================================================= */}
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-12 text-white sm:px-12 sm:py-16 lg:px-16 border border-white/10 shadow-2xl">
            {/* Ambient mesh */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-300">
                  <Sparkles className="h-3 w-3" />
                  <span>Instant Institutional Onboarding</span>
                </span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Ready to upgrade your academic institution?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  Create your workspace in seconds. Deploy courses, run Socratic study pods, and track real-time attendance today.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 shadow-lg"
                >
                  <span>Start Free Workspace</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-slate-950" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* 8. MINIMAL ENTERPRISE FOOTER                             */}
      {/* ========================================================= */}
      <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <Brand />
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Next-generation intelligent academic workspace. Connecting students, faculty, and families through verified telemetry.
              </p>
            </div>

            {/* System Status Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>All systems operational</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-6 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} EduMentor AI, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition">
                Platform Login
              </Link>
              <Link href="/register" className="hover:text-slate-900 dark:hover:text-white transition">
                Institutional Access
              </Link>
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">
                Documentation
              </a>
              <a href="#security" className="hover:text-slate-900 dark:hover:text-white transition">
                Security &amp; Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}