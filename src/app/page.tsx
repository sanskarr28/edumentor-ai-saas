import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Layers3,
  MoveUpRight,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getSession } from "@/lib/auth";

const features = [
  {
    icon: BookOpen,
    number: "01",
    title: "Coursework, in context",
    description: "Courses, assignments, materials, submissions, and feedback finally live in one organized place.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Progress you can act on",
    description: "See how learning is going with clear views of grades, attendance, and meaningful milestones.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "A more personal way to learn",
    description: "Explore ideas, practice difficult concepts, and build understanding with AI-powered study support.",
  },
];

const audiences = [
  { icon: GraduationCap, title: "Students", text: "Know what is next, stay on top of class, and make steady progress.", href: "/register" },
  { icon: UsersRound, title: "Educators", text: "Spend less time coordinating tools and more time supporting learners.", href: "/register" },
  { icon: HeartHandshake, title: "Families", text: "Stay thoughtfully connected to the learning journey as it happens.", href: "/register" },
];

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`flex size-10 items-center justify-center rounded-[14px] text-sm font-semibold tracking-tight ${inverse ? "bg-white text-[#183c3c]" : "bg-[#173d3d] text-white"}`} aria-hidden="true">E.</span>
      <span className={`text-[16px] font-semibold tracking-[-0.04em] ${inverse ? "text-white" : "text-[#172c30]"}`}>
        EduMentor<span className={inverse ? "text-[#a8d8c5]" : "text-[#52786e]"}> AI</span>
      </span>
    </span>
  );
}

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f5] text-[#172c30] selection:bg-[#d8eadf] selection:text-[#173d3d]">
      <header className="sticky top-0 z-40 border-b border-[#e7ebe6] bg-[#f7f8f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="EduMentor AI home"><Brand /></Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <a href="#platform" className="text-[13px] font-medium text-[#56666a] transition-colors hover:text-[#173d3d]">Platform</a>
            <a href="#how-it-works" className="text-[13px] font-medium text-[#56666a] transition-colors hover:text-[#173d3d]">How it works</a>
            <a href="#community" className="text-[13px] font-medium text-[#56666a] transition-colors hover:text-[#173d3d]">For your community</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full px-3 py-2 text-[13px] font-medium text-[#415257] transition-colors hover:text-[#173d3d] sm:px-4">Sign in</Link>
            <Link href="/register" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#173d3d] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#245653] sm:px-5">
              Get started <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[620px] max-w-[1240px] items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-16">
        <div className="relative z-10 max-w-[560px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dde7df] bg-white/80 px-3.5 py-2 text-[11px] font-medium tracking-[0.02em] text-[#46635a] shadow-[0_3px_12px_rgba(34,63,51,0.04)]">
            <span className="size-1.5 rounded-full bg-[#64a981]" /> A calmer way to stay connected to learning
          </div>
          <h1 className="mt-7 max-w-[650px] text-[clamp(2.75rem,4.25vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.065em] text-[#172c30]">
            Learning works better when everything <span className="font-serif italic font-normal text-[#47796a]">connects.</span>
          </h1>
          <p className="mt-6 max-w-[490px] text-[16px] leading-7 text-[#657276] sm:text-[17px] sm:leading-8">
            A thoughtful academic workspace for coursework, progress, and personalized support—bringing students, educators, and families onto the same page.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#173d3d] px-6 text-[13px] font-medium text-white shadow-[0_8px_20px_rgba(23,61,61,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#245653]">
              Create your account <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#platform" className="inline-flex h-12 items-center gap-2 rounded-full border border-[#dfe5df] bg-white/70 px-5 text-[13px] font-medium text-[#34484b] transition-colors hover:border-[#b8c9be] hover:bg-white">
              Explore the platform <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs text-[#728078]">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8f5] bg-[#d8e8db] text-[10px] font-semibold text-[#375b49]">ST</span>
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8f5] bg-[#ece1d2] text-[10px] font-semibold text-[#755c42]">ED</span>
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8f5] bg-[#dce4f1] text-[10px] font-semibold text-[#465b7a]">FM</span>
            </div>
            <span>Designed around the people who make learning happen</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[610px] lg:ml-auto">
          <div className="absolute -right-16 -top-12 size-64 rounded-full bg-[#dfeadf]/70 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-16 -left-14 size-56 rounded-full bg-[#e8e8d8]/75 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[24px] border border-[#e1e8e1] bg-white shadow-[0_28px_80px_-38px_rgba(22,47,39,0.25)]">
            <div className="flex items-center justify-between border-b border-[#edf0eb] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#edf4ed] text-[#4c7663]"><Layers3 aria-hidden="true" className="size-[17px]" /></span>
                <div><p className="text-[12px] font-semibold text-[#203639]">Learning overview</p><p className="mt-0.5 text-[10px] text-[#8a9791]">Your workspace preview</p></div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef6ef] px-2.5 py-1.5 text-[10px] font-medium text-[#4b7758]"><span className="size-1.5 rounded-full bg-[#74a780]" /> This week</span>
            </div>
            <div className="grid grid-cols-3 gap-3 px-5 py-5 sm:gap-4 sm:px-7 sm:py-6">
              <div className="rounded-[15px] bg-[#f7f8f5] p-3.5 sm:p-4"><p className="text-[10px] text-[#82908a]">Courses</p><p className="mt-2 text-[25px] font-medium leading-none tracking-[-0.05em] text-[#21383a]">06</p><p className="mt-2 text-[9px] text-[#73917a]">All up to date</p></div>
              <div className="rounded-[15px] bg-[#f7f8f5] p-3.5 sm:p-4"><p className="text-[10px] text-[#82908a]">To focus on</p><p className="mt-2 text-[25px] font-medium leading-none tracking-[-0.05em] text-[#21383a]">03</p><p className="mt-2 text-[9px] text-[#a37c4c]">Due this week</p></div>
              <div className="rounded-[15px] bg-[#f7f8f5] p-3.5 sm:p-4"><p className="text-[10px] text-[#82908a]">Attendance</p><p className="mt-2 text-[25px] font-medium leading-none tracking-[-0.05em] text-[#21383a]">98%</p><p className="mt-2 text-[9px] text-[#73917a]">On track</p></div>
            </div>
            <div className="px-5 pb-5 sm:px-7 sm:pb-7">
              <div className="rounded-[18px] border border-[#e9eee8] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-semibold text-[#2b4141]">Your learning rhythm</p><p className="mt-1 text-[10px] text-[#8b9791]">Progress across your courses</p></div><span className="rounded-full bg-[#f0f5ef] px-2.5 py-1 text-[10px] font-medium text-[#557c61]">Steady progress</span></div>
                <div className="mt-5 flex h-[110px] items-end gap-2 sm:h-[130px] sm:gap-3" aria-label="Illustrative weekly learning activity chart">
                  {[36, 56, 45, 78, 61, 92, 73, 100, 68, 84, 58, 76].map((height, index) => <span key={index} className={`min-w-0 flex-1 rounded-t-[5px] ${index === 7 ? "bg-[#518a73]" : "bg-[#e4ede3]"}`} style={{ height: `${height}%` }} />)}
                </div>
                <div className="mt-3 flex justify-between text-[9px] text-[#98a39d]"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[15px] bg-[#f5f7f3] px-4 py-3.5">
                <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-xl bg-white text-[#527a68]"><Sparkles aria-hidden="true" className="size-4" /></span><div><p className="text-[10px] font-semibold text-[#31464a]">A little momentum goes a long way</p><p className="mt-0.5 text-[9px] text-[#89958e]">Your next assignment is ready when you are.</p></div></div><ChevronRight aria-hidden="true" className="size-4 text-[#88948d]" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-5 hidden rounded-2xl border border-[#e3e9e2] bg-white px-4 py-3 shadow-[0_16px_40px_-20px_rgba(22,47,39,0.3)] sm:flex sm:items-center sm:gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#eaf3e9] text-[#5b8968]"><Check aria-hidden="true" className="size-4" /></span><div><p className="text-[10px] font-semibold text-[#2c4241]">One less thing to juggle</p><p className="mt-0.5 text-[9px] text-[#87938b]">Your learning space, all together.</p></div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-[#e7ebe6] bg-white/65 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#698476]">The platform</p><h2 className="mt-3 max-w-xl text-3xl font-medium leading-tight tracking-[-0.05em] text-[#1c3335] sm:text-[42px]">Less juggling. More meaningful progress.</h2></div>
            <p className="max-w-[370px] text-sm leading-6 text-[#75817e]">Everything your learning community needs, thoughtfully brought together in one place.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, number, title, description }) => <article key={number} className="group rounded-[20px] border border-[#e7ebe5] bg-[#fbfcfa] p-6 transition-all hover:-translate-y-1 hover:border-[#cbd9cc] hover:shadow-[0_16px_36px_-24px_rgba(30,62,45,.2)] sm:p-7"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-[14px] bg-[#edf4ed] text-[#527a68]"><Icon aria-hidden="true" className="size-[18px]" /></span><span className="text-[10px] font-medium tracking-[0.12em] text-[#a5aea6]">{number}</span></div><h3 className="mt-7 text-[17px] font-semibold tracking-[-0.025em] text-[#253b3d]">{title}</h3><p className="mt-2.5 text-[13px] leading-6 text-[#74817d]">{description}</p><a href="#how-it-works" className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#527a68] transition-colors group-hover:text-[#234e43]">See how it fits <MoveUpRight aria-hidden="true" className="size-3.5" /></a></article>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="max-w-md"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#698476]">Built around people</p><h2 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.05em] text-[#1c3335] sm:text-[42px]">A better rhythm for the whole community.</h2><p className="mt-4 text-sm leading-7 text-[#75817e]">Learning works best when everyone has the right context. EduMentor creates a shared, supportive space without adding another pile of disconnected tools.</p><Link href="/register" className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-[#376b5b] hover:text-[#173d3d]">Find your workspace <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
        <div id="community" className="grid gap-3 sm:grid-cols-3">{audiences.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group flex flex-col rounded-[18px] border border-[#e5eae4] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#c5d7c8] hover:shadow-[0_12px_30px_-22px_rgba(25,55,40,.25)] sm:p-6"><span className="flex size-10 items-center justify-center rounded-[14px] bg-[#f0f5ef] text-[#517866]"><Icon aria-hidden="true" className="size-[18px]" /></span><h3 className="mt-5 text-sm font-semibold text-[#2b4141]">{title}</h3><p className="mt-2 flex-1 text-xs leading-5 text-[#78847e]">{text}</p><span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#537967]">Explore workspace <ArrowRight aria-hidden="true" className="size-3 transition-transform group-hover:translate-x-0.5" /></span></Link>)}</div>
      </section>

      <section className="mx-5 mb-16 overflow-hidden rounded-[24px] bg-[#173d3d] sm:mx-8 sm:mb-20 lg:mx-auto lg:max-w-[1240px]">
        <div className="relative flex flex-col justify-between gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:px-14 lg:py-14"><div className="absolute -right-16 -top-36 size-80 rounded-full border border-white/[0.08]" aria-hidden="true" /><div className="absolute -right-5 -top-24 size-60 rounded-full border border-white/[0.08]" aria-hidden="true" /><div className="relative max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b0d4be]">A more connected school day</p><h2 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.05em] text-white sm:text-[38px]">Make room for the work that matters.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#d2dfd8]">Start with a workspace that helps your learning community move forward together.</p></div><Link href="/register" className="relative inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f7f8f5] px-6 text-[13px] font-semibold text-[#173d3d] transition-colors hover:bg-white">Get started <ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
      </section>

      <footer className="border-t border-[#e5eae4] bg-[#f7f8f5]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Link href="/" aria-label="EduMentor AI home"><Brand /></Link><p className="text-[11px] text-[#87928c]">A connected workspace for the people behind every learning journey.</p><div className="flex items-center gap-5 text-[11px] font-medium text-[#687773]"><Link href="/login" className="hover:text-[#173d3d]">Sign in</Link><Link href="/register" className="inline-flex items-center gap-1 hover:text-[#173d3d]">Create account <ArrowRight aria-hidden="true" className="size-3" /></Link></div></div>
      </footer>
    </main>
  );
}
