"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Badge, Button, Card, EmptyState, Select, Skeleton, useToast } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

type Insight = {
  id: string;
  category: "strength" | "weakness" | "recommendation" | "studyplan" | "alert";
  title: string;
  content: string;
  metric: string | null;
  generatedAt: string;
};

type StudentOption = { id: string; name: string };

const CATEGORY_META: Record<Insight["category"], { icon: string; color: string; label: string }> = {
  strength: { icon: "💪", color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Strength" },
  weakness: { icon: "🎯", color: "bg-amber-50 text-amber-700 border-amber-100", label: "Growth Area" },
  recommendation: { icon: "💡", color: "bg-sky-50 text-sky-700 border-sky-100", label: "Recommendation" },
  studyplan: { icon: "📘", color: "bg-indigo-50 text-indigo-700 border-indigo-100", label: "Study Plan" },
  alert: { icon: "⚠️", color: "bg-rose-50 text-rose-700 border-rose-100", label: "Alert" },
};

export default function InsightsPage() {
  const user = useSession();
  const { push } = useToast();
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const needsSelector = user.role !== "student";

  useEffect(() => {
    async function init() {
      if (user.role === "student") {
        setSelectedStudent(user.id);
        return;
      }
      if (user.role === "teacher" || user.role === "admin") {
        const res = await fetch("/api/users?role=student");
        const data = await res.json();
        setStudents(data.users ?? []);
        if (data.users?.length) setSelectedStudent(data.users[0].id);
      }
      if (user.role === "parent") {
        const res = await fetch("/api/reports/overview");
        const data = await res.json();
        const children = (data.children ?? []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));
        setStudents(children);
        if (children.length) setSelectedStudent(children[0].id);
        else setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/insights?studentId=${selectedStudent}`);
        const data = await res.json();
        if (active) setInsights(data.insights ?? []);
      } catch {
        push("Failed to load insights", "error");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent]);

  async function generate() {
    if (!selectedStudent) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInsights((prev) => [...data.insights, ...prev]);
      push("New AI insights generated ✨", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to generate insights", "error");
    } finally {
      setGenerating(false);
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Insight[]>();
    for (const i of insights) {
      const key = new Date(i.generatedAt).toDateString();
      const arr = map.get(key) ?? [];
      arr.push(i);
      map.set(key, arr);
    }
    return [...map.entries()];
  }, [insights]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">✨ AI Insights</h1>
          <p className="text-sm text-slate-500">
            Personalized, AI-generated learning recommendations based on grades, submissions, and attendance.
          </p>
        </div>
        <div className="flex items-end gap-2">
          {needsSelector && (
            <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-56">
              {students.length === 0 && <option value="">No students available</option>}
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          )}
          <Button onClick={generate} loading={generating} disabled={!selectedStudent}>
            {insights.length ? "Regenerate insights" : "Generate insights"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : !selectedStudent ? (
        <EmptyState icon="🎓" title="No student selected" description="Select a student to view or generate AI insights." />
      ) : insights.length === 0 ? (
        <EmptyState
          icon="✨"
          title="No insights yet"
          description="Generate the first batch of AI-powered recommendations based on current academic data."
          action={<Button onClick={generate} loading={generating}>Generate insights</Button>}
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, items]) => (
            <div key={date}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{date}</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {items.map((insight) => {
                  const meta = CATEGORY_META[insight.category];
                  return (
                    <Card key={insight.id} className={`border ${meta.color.split(" ").pop()}`}>
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{meta.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={meta.color}>{meta.label}</Badge>
                            {insight.metric && <span className="text-xs text-slate-400">{insight.metric}</span>}
                          </div>
                          <p className="mt-1.5 text-sm font-semibold text-slate-900">{insight.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{insight.content}</p>
                          <p className="mt-2 text-[11px] text-slate-400">{timeAgo(insight.generatedAt)}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
