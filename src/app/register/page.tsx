"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";

function AuthBrand({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" aria-label="EduMentor AI home" className="inline-flex items-center gap-2.5"><span className={`flex size-10 items-center justify-center rounded-[14px] text-sm font-semibold ${inverse ? "bg-white text-[#173d3d]" : "bg-[#173d3d] text-white"}`}>E.</span><span className={`text-[15px] font-semibold tracking-[-0.04em] ${inverse ? "text-white" : "text-[#172c30]"}`}>EduMentor<span className={inverse ? "text-[#b5d2c1]" : "text-[#52786e]"}> AI</span></span></Link>;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", gradeLevel: "", subject: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        setError(data.error ?? "We could not create your account. Please check your details and try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("A connection issue interrupted account creation. Please try again.");
      setLoading(false);
    }
  }

  const inputClass = "h-[46px] w-full rounded-[11px] border border-[#dfe6df] bg-white px-3.5 text-[12px] text-[#203638] outline-none transition focus:border-[#75a087] focus:ring-4 focus:ring-[#54836b]/10 placeholder:text-[#a3ada7]";
  const labelClass = "text-[11px] font-semibold text-[#33484a]";

  return (
    <main className="grid min-h-screen bg-[#f7f8f5] lg:grid-cols-[minmax(0,0.92fr)_minmax(500px,1.08fr)]">
      <aside className="relative hidden overflow-hidden bg-[#173d3d] px-10 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="absolute -right-32 -top-32 size-[470px] rounded-full border border-white/[0.08]" aria-hidden="true" /><div className="absolute -right-12 -top-12 size-[320px] rounded-full border border-white/[0.08]" aria-hidden="true" /><div className="absolute -bottom-40 -left-20 size-[380px] rounded-full bg-[#376b5b]/40 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-center justify-between"><AuthBrand inverse /><span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#b5d2c1]">A place to move forward</span></div>
        <div className="relative mx-auto my-12 w-full max-w-[510px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b4d3bf]">Start with a stronger connection</p>
          <h1 className="mt-4 max-w-[490px] text-[42px] font-medium leading-[1.08] tracking-[-0.055em] text-white xl:text-[52px]">One workspace. More room to grow.</h1>
          <p className="mt-5 max-w-[390px] text-[14px] leading-7 text-[#d0dfd7]">Bring your courses, progress, and learning support together—so you can spend less time juggling and more time moving ahead.</p>
          <div className="mt-9 flex flex-col gap-3">
            {[{ icon: BookOpen, title: "Everything for class, together", text: "Courses, materials, and assignments in one place." }, { icon: GraduationCap, title: "A view that fits your role", text: "A personal workspace for every learning journey." }, { icon: UsersRound, title: "Support that stays connected", text: "Keep students, educators, and families in sync." }].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-3.5 rounded-[14px] border border-white/[0.1] bg-white/[0.05] px-3.5 py-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.09] text-[#c3ddca]"><Icon aria-hidden="true" className="size-4" /></span><span><span className="block text-[11px] font-semibold text-white">{title}</span><span className="mt-1 block text-[10px] text-[#bad0c3]">{text}</span></span><Check aria-hidden="true" className="ml-auto size-3.5 shrink-0 text-[#a5c8b0]" /></div>)}
          </div>
        </div>
        <p className="relative text-[10px] text-[#a8c5b5]">For students, educators, and families.</p>
      </aside>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between"><span className="lg:hidden"><AuthBrand /></span><Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#71807a] transition-colors hover:text-[#173d3d]"><ArrowLeft aria-hidden="true" className="size-3.5" /> Home</Link></header>
        <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-center py-10 lg:py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#668272]">Create your workspace</p>
          <h2 className="mt-2.5 text-[32px] font-medium leading-tight tracking-[-0.055em] text-[#172c30] sm:text-[36px]">Let&apos;s get you started.</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#74807c]">A few details, and your learning space is ready.</p>
          {error && <div role="alert" className="mt-6 rounded-[12px] border border-[#ead1ca] bg-[#fff7f4] px-4 py-3 text-[12px] leading-5 text-[#9a493d]">{error}</div>}
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5"><label htmlFor="full-name" className={labelClass}>Full name</label><input id="full-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className={inputClass} /></div>
            <div className="flex flex-col gap-1.5"><label htmlFor="register-email" className={labelClass}>Email address</label><input id="register-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@school.edu" className={inputClass} /></div>
            <div className="flex flex-col gap-1.5"><label htmlFor="register-password" className={labelClass}>Create a password</label><input id="register-password" name="password" type="password" autoComplete="new-password" minLength={6} required value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 6 characters" className={inputClass} /><span className="text-[10px] text-[#8b9690]">Use at least 6 characters.</span></div>
            <div className="flex flex-col gap-1.5"><label htmlFor="account-role" className={labelClass}>I&apos;m joining as</label><select id="account-role" name="role" value={form.role} onChange={(e) => update("role", e.target.value)} className={`${inputClass} appearance-none`}><option value="student">Student</option><option value="teacher">Educator / faculty</option><option value="parent">Parent or guardian</option><option value="admin" disabled>Administrator · Institution provisioned</option></select><span className="text-[10px] leading-4 text-[#8b9690]">Administrator accounts are managed by your institution.</span></div>
            {form.role === "student" && <div className="flex flex-col gap-1.5"><label htmlFor="grade-level" className={labelClass}>Grade level <span className="font-normal text-[#8b9690]">(optional)</span></label><input id="grade-level" name="gradeLevel" value={form.gradeLevel} onChange={(e) => update("gradeLevel", e.target.value)} placeholder="e.g. Grade 10" className={inputClass} /></div>}
            {form.role === "teacher" && <div className="flex flex-col gap-1.5"><label htmlFor="primary-subject" className={labelClass}>Primary subject <span className="font-normal text-[#8b9690]">(optional)</span></label><input id="primary-subject" name="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="e.g. Mathematics" className={inputClass} /></div>}
            <button type="submit" disabled={loading} className="mt-1 inline-flex h-[47px] items-center justify-center gap-2 rounded-[11px] bg-[#173d3d] px-5 text-[12px] font-semibold text-white shadow-[0_5px_12px_rgba(23,61,61,.12)] transition hover:bg-[#245653] disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Creating your account…" : "Create account"}{!loading && <ArrowRight aria-hidden="true" className="size-4" />}</button>
          </form>
          <p className="mt-5 text-center text-[11px] text-[#7b8781]">Already have an account? <Link href="/login" className="font-semibold text-[#3f705c] hover:text-[#173d3d]">Sign in</Link></p>
          <div className="mt-5 flex items-start gap-2.5 rounded-[11px] border border-[#e5eae4] bg-white/65 px-3 py-2.5"><ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#72927d]" /><p className="text-[10px] leading-[17px] text-[#7e8983]">Your role shapes the courses and tools you can access in EduMentor.</p></div>
        </div>
        <footer className="flex justify-between gap-4 text-[10px] text-[#9aa39d]"><span>© {new Date().getFullYear()} EduMentor AI</span><span>Learning, thoughtfully connected.</span></footer>
      </section>
    </main>
  );
}
