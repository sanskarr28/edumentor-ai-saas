"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, Input, Select } from "@/components/ui";

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
        setError(data.error ?? "Unable to create account");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] p-0 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-screen max-w-7xl overflow-hidden bg-white sm:min-h-[calc(100vh-2.5rem)] sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1fr]">
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <div className="absolute -left-28 -top-24 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="inline-flex w-fit items-center gap-3 text-[15px] font-semibold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold">E</span>
            EduMentor <span className="-ml-2 text-blue-300">AI</span>
          </Link>
          <div className="my-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">Start with a stronger connection</p>
          <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-[2.8rem]">
            One workspace. More room to grow.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Whether you teach, learn, or support a learner at home — EduMentor AI gives you the
            tools and context to move forward with confidence.
          </p>
          </div>
          <p className="text-xs text-slate-400">Made for students, faculty, families, and school leaders.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
        <Link href="/" className="mb-8 inline-flex items-center gap-3 text-[15px] font-semibold tracking-tight text-slate-950 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">E</span>
          EduMentor <span className="-ml-2 text-blue-700">AI</span>
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Get started</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Set up your EduMentor workspace in a few simple steps.</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <Field label="Full name">
            <Input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Doe" />
          </Field>
          <Field label="Email address">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@school.edu"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 6 characters"
            />
          </Field>
          <Field
            label="Choose your role"
            hint="Administrator accounts are provisioned by your institution to protect workspace access."
          >
            <Select value={form.role} onChange={(e) => update("role", e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Faculty</option>
              <option value="parent">Parent</option>
              <option value="admin" disabled>Administrator · Institution provisioned</option>
            </Select>
          </Field>
          {form.role === "student" && (
            <Field label="Grade level">
              <Input
                value={form.gradeLevel}
                onChange={(e) => update("gradeLevel", e.target.value)}
                placeholder="e.g. Grade 10"
              />
            </Field>
          )}
          {form.role === "teacher" && (
            <Field label="Primary subject">
              <Input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="e.g. Mathematics"
              />
            </Field>
          )}
          {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
        </div>
      </div>
      </div>
    </div>
  );
}
