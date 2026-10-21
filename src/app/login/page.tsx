"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, Field, Input } from "@/components/ui";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@edumentor.ai" },
  { role: "Faculty", email: "teacher@edumentor.ai" },
  { role: "Student", email: "student@edumentor.ai" },
  { role: "Parent", email: "parent@edumentor.ai" },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error ?? "Unable to sign in");
        setLoading(false);
        return;
      }
      router.push(params.get("next") ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("password123");
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] p-0 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-screen max-w-7xl overflow-hidden bg-white sm:min-h-[calc(100vh-2.5rem)] sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <Link href="/" className="mb-10 inline-flex w-fit items-center gap-3 text-[15px] font-semibold tracking-tight text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white shadow-lg shadow-blue-950/15">E</span>
          EduMentor <span className="-ml-2 text-blue-700">AI</span>
        </Link>
        <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Your learning workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your EduMentor workspace.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Email address">
            <Input
              type="email"
              required
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          {error && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
            Explore a demo workspace
          </p>
          <p className="mb-3 text-xs leading-5 text-slate-500">Select a role to fill in its demo credentials. Password: password123</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-xs transition hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="block font-semibold text-slate-800">{acc.role}</span>
                <span className="block truncate text-slate-400">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-blue-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            A connected learning community
          </div>
          <div className="my-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">Make progress visible</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-white xl:text-[2.8rem]">
            A clearer view of learning, for everyone.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Bring courses, progress, and helpful insights together in a workspace designed around your school community.
          </p>
          <div className="mt-9 grid max-w-lg grid-cols-2 gap-3">
            {[
              ["01", "Courses & assignments"],
              ["02", "Progress & reporting"],
              ["03", "Role-based workspaces"],
              ["04", "Personalized insights"],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <span className="text-[10px] font-semibold text-blue-300">{number}</span>
                <span className="text-xs font-medium text-slate-200">{label}</span>
              </div>
            ))}
          </div>
          </div>
          <p className="text-xs text-slate-400">Thoughtful tools for the people behind every success.</p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
