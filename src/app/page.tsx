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
  Cpu,
  Server,
  Database,
  Cloud,
} from "lucide-react";
import { InteractiveHeroDemo } from "@/components/landing/interactive-hero-demo";
import { RoleSwitcherPreview } from "@/components/landing/role-switcher-preview";
import { FAQAccordion } from "@/components/landing/faq-accordion";

const bentoFeatures = [
  {
    id: "pod",
    span: "lg:col-span-2",
    badge: "Flagship Feature",
    badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    title: "Multi-Agent AI Study Pods",
    description:
      "Engage with three distinct Socratic personas—Elena (The Visualizer), Alex (The Skeptic), and Dr. Marcus (The Formal Examiner). Defend your understanding under rigorous cross-examination, receive instant rubric evaluations (0–100%), and collaborate in live peer study rooms.",
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
    badge: "Storage Engine",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    title: "Dynamic Courses & Submissions",
    description:
      "Full syllabus management, S3-powered direct presigned document uploads, interactive lecture materials, and automated assignment submission verification.",
    icon: BookOpen,
    metrics: [
      { label: "File Storage", value: "AWS S3" },
      { label: "Transfer Mode", value: "Presigned" },
    ],
  },
  {
    id: "analytics",
    span: "lg:col-span-1",
    badge: "Telemetry",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    title: "Longitudinal Progress & Gradebooks",
    description:
      "Real-time weighted grading calculations, automated GPA tracking, student attendance heatmaps, and downloadable verified PDF transcripts.",
    icon: TrendingUp,
    metrics: [
      { label: "Latency", value: "< 120ms" },
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

const institutionalPartners = [
  "Stanford Pre-Collegiate",
  "Oxford Socratic Seminars",
  "MIT EECS Computing Lab",
  "Cambridge Tripos Research",
  "Berkeley Academic Computing",
  "Caltech Applied STEM",
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
              Role Workspaces
            </a>
            <a
              href="#security"
              className="transition-colors hover:text-indigo-600 dark:hover:text-white"
            >
              Security
            </a>
            <a
              href="#faq"
              className="transition-colors hover:text-indigo-600 dark:hover:text-white"
            >
              FAQ
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
        {/* 2. HERO SECTION WITH INTERACTIVE SOCRATIC POD SIMULATOR  */}
        {/* ========================================================= */}
        <section className="relative mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20 lg:pb-28">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[40rem] w-[58rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-purple-500/15 blur-[120px] dark:from-indigo-600/25 dark:via-blue-600/15 dark:to-purple-600/20" />

          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12 xl:gap-16">
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

            {/* Right Column: Live Interactive Socratic Pod Simulator */}
            <div>
              <InteractiveHeroDemo />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. INSTITUTIONAL TRUST MARQUEE                            */}
        {/* ========================================================= */}
        <section className="border-y border-slate-200/70 bg-white/70 py-8 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Engineered for academic rigor across leading learning environments
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              {institutionalPartners.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                >
                  <Award className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. BENTO GRID FEATURE SECTION                            */}
        {/* ========================================================= */}
        <section
          id="features"
          className="relative border-b border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950 sm:py-28"
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
        {/* 5. MULTI-AGENT STUDY POD DEEP DIVE                       */}
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
                    Traditional AI provides quick answers. EduMentor AI enforces active cognition.
                    Students initiate a topic, and three distinct AI personas cross-examine their
                    arguments, pinpoint logical gaps, and grade their final synthesis defense.
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
                          Builds physical analogies and visual mental models for complex mathematical and scientific abstractions.
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
                        <p className="text-[11px] text-slate-500">3 AI Agents • Peer Chat Enabled</p>
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
        {/* 6. INTERACTIVE ROLE SWITCHER MATRIX                       */}
        {/* ========================================================= */}
        <section
          id="roles"
          className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Tailored Perspectives
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Experience EduMentor AI by Role.
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Switch between interfaces to inspect the customized workflows designed for each stakeholder in the academic community.
              </p>
            </div>

            <div className="mt-12">
              <RoleSwitcherPreview />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. SECURITY & INFRASTRUCTURE ARCHITECTURE                 */}
        {/* ========================================================= */}
        <section
          id="security"
          className="border-t border-slate-200/80 bg-[#FAFAFA] py-20 dark:border-slate-800/80 dark:bg-[#070B12] sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Enterprise Cloud Infrastructure</span>
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Academic privacy and data isolation built in.
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Every architectural boundary is engineered to keep institutional documents, academic transcripts, and AI deliberations safe.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-7 dark:border-slate-800 dark:bg-[#0A0F1D] shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Cloud className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                  AWS S3 Presigned Uploads
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Direct client-to-bucket transfers with short-lived presigned URLs. No user files ever touch application memory buffers, ensuring optimal transfer speeds and AES-256 encryption.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-7 dark:border-slate-800 dark:bg-[#0A0F1D] shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                  Serverless PostgreSQL (Neon)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Automated connection pooling, instant autoscaling, and relational constraints managed with Drizzle ORM. Complete data schema separation across roles.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-7 dark:border-slate-800 dark:bg-[#0A0F1D] shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                  Zero AI Model Retention
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Direct connection to Google Gemini high-throughput AI models. Student submissions are strictly transient and never used to train public or foundation models.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. INTERACTIVE FAQ ACCORDION SECTION                      */}
        {/* ========================================================= */}
        <section id="faq" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Frequently Asked Questions
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Everything you need to know about EduMentor AI.
              </h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                Find answers regarding Socratic study pods, institutional RBAC, and cloud data protection.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 9. PRE-FOOTER ENTERPRISE CALL TO ACTION                   */}
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
      {/* 10. MINIMAL ENTERPRISE FOOTER                             */}
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