import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const features = [
  {
    number: "01",
    title: "Learning that adapts",
    description:
      "Turn grades, attendance, and coursework into thoughtful next steps that help every learner move forward.",
  },
  {
    number: "02",
    title: "One connected workspace",
    description:
      "Give students, families, faculty, and administrators a clear view of the work that matters to them.",
  },
  {
    number: "03",
    title: "Progress you can act on",
    description:
      "Bring course performance, attendance, and assignment progress together in timely, easy-to-read reports.",
  },
  {
    number: "04",
    title: "The everyday essentials",
    description:
      "Keep courses, assignments, gradebooks, and announcements organized in one dependable place.",
  },
  {
    number: "05",
    title: "A better way to stay in sync",
    description:
      "Share the right updates with the right people, and make important changes easier to follow.",
  },
  {
    number: "06",
    title: "Built with care",
    description:
      "Role-based access and secure authentication help keep each school community's information protected.",
  },
];

const roles = [
  { title: "Students", detail: "Stay on top of coursework and see how you're progressing." },
  { title: "Faculty", detail: "Manage classes, review work, and keep learners informed." },
  { title: "Families", detail: "Follow a learner's progress and stay connected to school." },
  { title: "Administrators", detail: "Coordinate your community with a clear view of activity." },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${light ? "text-white" : "text-slate-950"}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold tracking-tight text-white shadow-lg shadow-blue-950/15">
        E
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        EduMentor <span className={light ? "text-blue-200" : "text-blue-700"}>AI</span>
      </span>
    </span>
  );
}

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="overflow-hidden bg-[#f7f8fb] text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="EduMentor AI home">
          <Brand />
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-offset-4"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute -left-48 top-12 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-blue-800 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            A more connected learning experience
          </div>
          <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
            Help every learner find their next step.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            EduMentor brings learning, progress, and people together—so students can grow and
            school communities can move forward with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Create your account
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Explore your workspace
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Demo accounts are available on the sign-in page.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-6 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-600">✓</span> Designed around each role
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-600">✓</span> One connected platform
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-100/80 via-indigo-50 to-slate-100 blur-xl" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_28px_80px_-38px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Learning overview</p>
                  <p className="mt-0.5 text-xs text-slate-500">Your progress, in one place</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">On track</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5 sm:gap-4 sm:p-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">Courses</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">06</p>
                <p className="mt-1 text-[11px] text-slate-500">Your learning plan</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-xs font-medium text-slate-500">Assignments</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">03</p>
                <p className="mt-1 text-[11px] text-slate-500">Ready for your attention</p>
              </div>
              <div className="col-span-2 rounded-xl border border-slate-100 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Learning progress</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">A steady term so far</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">78%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-700 to-indigo-500" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span>Coursework</span>
                  <span>Attendance</span>
                  <span>Study goals</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:px-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">AI</span>
              <p className="text-xs leading-5 text-slate-600">
                Helpful insights make it easier to decide what to focus on next.
              </p>
            </div>
          </div>
          <div className="absolute -right-3 -top-4 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Built for your community</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">One shared view</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">One community, many perspectives</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">A workspace for everyone involved.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Each person gets the tools and information that make their part of learning easier.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role, index) => (
              <div key={role.title} className="rounded-xl border border-slate-200/80 bg-[#fbfcfe] p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md">
                <span className="text-xs font-semibold tabular-nums text-blue-700">0{index + 1}</span>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{role.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{role.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Thoughtfully connected</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Everything you need to keep learning in motion.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Clear tools for everyday school life, with useful context when it matters.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.number} className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.04]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">{feature.number}</span>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-11 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">Make room for progress</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Ready to bring your learning community together?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Create an account to get started, or sign in to continue where you left off.</p>
          </div>
          <Link href="/register" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">
            Get started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <Link href="/" aria-label="EduMentor AI home"><Brand /></Link>
          <p>© {new Date().getFullYear()} EduMentor AI. Learning moves forward together.</p>
        </div>
      </footer>
    </main>
  );
}
