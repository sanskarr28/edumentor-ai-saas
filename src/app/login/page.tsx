"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";

function AuthBrand() {
  return <Link href="/" aria-label="EduMentor AI home" className="inline-flex items-center gap-2.5"><span className="flex size-10 items-center justify-center rounded-[14px] bg-[#173d3d] text-sm font-semibold text-white">E.</span><span className="text-[15px] font-semibold tracking-[-0.04em] text-[#172c30]">EduMentor<span className="text-[#52786e]"> AI</span></span></Link>;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        setError(data.error ?? "We could not sign you in. Check your details and try again.");
        setLoading(false);
        return;
      }
      router.push(params.get("next") ?? "/dashboard");
      router.refresh();
    } catch {
      setError("A connection issue interrupted sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8f5] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]">
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between"><AuthBrand /><Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71807a] transition-colors hover:text-[#173d3d]"><ArrowLeft aria-hidden="true" className="size-3.5" /> Home</Link></header>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <span className="mb-6 flex size-12 items-center justify-center rounded-[16px] border border-[#e3e9e2] bg-white text-[#527a68] shadow-[0_3px_12px_rgba(36,62,45,.04)]"><BookOpen aria-hidden="true" className="size-[19px]" /></span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#668272]">Your learning workspace</p>
          <h1 className="mt-2.5 text-[34px] font-medium leading-tight tracking-[-0.055em] text-[#172c30] sm:text-[38px]">Welcome back.</h1>
          <p className="mt-2 text-[14px] leading-6 text-[#74807c]">Sign in to pick up right where you left off.</p>

          {error && <div role="alert" className="mt-7 rounded-[13px] border border-[#ead1ca] bg-[#fff7f4] px-4 py-3 text-[12px] leading-5 text-[#9a493d]">{error}</div>}

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2"><label htmlFor="email-input" className="text-[12px] font-semibold text-[#33484a]">Email address</label><div className="relative"><Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8e9c95]" /><input id="email-input" type="email" name="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-[48px] w-full rounded-[12px] border border-[#dfe6df] bg-white pl-10 pr-4 text-[13px] text-[#203638] shadow-[0_1px_2px_rgba(25,50,38,.02)] outline-none transition focus:border-[#75a087] focus:ring-4 focus:ring-[#54836b]/10 placeholder:text-[#a3ada7]" /></div></div>
            <div className="flex flex-col gap-2"><label htmlFor="password-input" className="text-[12px] font-semibold text-[#33484a]">Password</label><div className="relative"><LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8e9c95]" /><input id="password-input" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-[48px] w-full rounded-[12px] border border-[#dfe6df] bg-white pl-10 pr-11 text-[13px] text-[#203638] shadow-[0_1px_2px_rgba(25,50,38,.02)] outline-none transition focus:border-[#75a087] focus:ring-4 focus:ring-[#54836b]/10 placeholder:text-[#a3ada7]" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8e9c95] transition-colors hover:text-[#345d4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54836b]">{showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}</button></div></div>
            <button type="submit" disabled={loading} className="mt-1 inline-flex h-[48px] items-center justify-center gap-2 rounded-[12px] bg-[#173d3d] px-5 text-[13px] font-semibold text-white shadow-[0_5px_12px_rgba(23,61,61,.12)] transition hover:bg-[#245653] disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Signing in…" : "Sign in"}{!loading && <ArrowRight aria-hidden="true" className="size-4" />}</button>
          </form>
          <p className="mt-6 text-center text-[12px] text-[#7b8781]">New to EduMentor? <Link href="/register" className="font-semibold text-[#3f705c] hover:text-[#173d3d]">Create an account</Link></p>
          <div className="mt-8 flex items-start gap-2.5 rounded-[12px] border border-[#e5eae4] bg-white/65 px-3.5 py-3"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#72927d]" /><p className="text-[10px] leading-[18px] text-[#7e8983]">Your account is protected by secure sign-in. Access to courses and student information is based on your role.</p></div>
        </div>
        <footer className="flex items-center justify-between gap-4 text-[10px] text-[#9aa39d]"><span>© {new Date().getFullYear()} EduMentor AI</span><span>Learning, thoughtfully connected.</span></footer>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#173d3d] px-10 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="absolute -right-32 -top-32 size-[470px] rounded-full border border-white/[0.08]" aria-hidden="true" /><div className="absolute -right-12 -top-12 size-[320px] rounded-full border border-white/[0.08]" aria-hidden="true" /><div className="absolute -bottom-40 -left-20 size-[380px] rounded-full bg-[#376b5b]/40 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-center justify-between"><span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#b5d2c1]">One connected learning space</span><Sparkles aria-hidden="true" className="size-4 text-[#c3ddca]" /></div>
        <div className="relative mx-auto my-12 w-full max-w-[510px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b4d3bf]">A clearer view of what matters</p>
          <h2 className="mt-4 max-w-[480px] text-[42px] font-medium leading-[1.08] tracking-[-0.055em] text-white xl:text-[52px]">A little more focus. A lot more room to grow.</h2>
          <p className="mt-5 max-w-[390px] text-[14px] leading-7 text-[#d0dfd7]">Coursework, progress, and personal support—ready when you are.</p>
          <div className="mt-10 overflow-hidden rounded-[18px] border border-white/[0.12] bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-[#c1ddc9]"><Sparkles aria-hidden="true" className="size-4" /></span><div><p className="text-[11px] font-semibold text-white">Your next step</p><p className="mt-0.5 text-[9px] text-[#b5cfc1]">A workspace that keeps you moving</p></div></div><span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-[#c7dcd0]">At your pace</span></div>
            <div className="mt-5 flex flex-col gap-2.5"><div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-3"><span className="flex size-7 items-center justify-center rounded-lg bg-[#d8e9d9]/10 text-[#c6dec9]"><BookOpen aria-hidden="true" className="size-3.5" /></span><span className="flex-1 text-[10px] text-[#e3ede6]">Stay close to your coursework</span><ArrowRight aria-hidden="true" className="size-3.5 text-[#a9c9b5]" /></div><div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-3"><span className="flex size-7 items-center justify-center rounded-lg bg-[#d8e9d9]/10 text-[#c6dec9]"><Sparkles aria-hidden="true" className="size-3.5" /></span><span className="flex-1 text-[10px] text-[#e3ede6]">Get support when a topic gets tricky</span><ArrowRight aria-hidden="true" className="size-3.5 text-[#a9c9b5]" /></div></div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] text-[#b5cfc1]"><ShieldCheck aria-hidden="true" className="size-3.5" /> A calmer, more connected school day.</div>
        </div>
        <div className="relative flex items-center justify-between text-[10px] text-[#a8c5b5]"><span>For students, educators, and families</span><span>EduMentor AI</span></div>
      </aside>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#f7f8f5] text-sm text-[#71807a]">Loading sign in…</main>}><LoginForm /></Suspense>;
}
