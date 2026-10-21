"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, Select, Skeleton, Textarea, useToast } from "@/components/ui";
import { statusBadgeClasses, timeAgo } from "@/lib/utils";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: string;
  priority: "info" | "warning" | "urgent";
  courseTitle: string | null;
  authorName: string | null;
  authorId: string | null;
  createdAt: string;
};

type Course = { id: string; title: string };

const emptyForm = { title: "", message: "", audience: "all", courseId: "", priority: "info" as Announcement["priority"] };

export default function AnnouncementsPage() {
  const user = useSession();
  const { push } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const canPost = user.role === "teacher" || user.role === "admin";

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data.announcements ?? []);
    } catch {
      push("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    if (canPost) {
      fetch("/api/courses").then((r) => r.json()).then((d) => setCourses(d.courses ?? []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic: Announcement = {
      id: optimisticId,
      title: form.title,
      message: form.message,
      audience: form.audience,
      priority: form.priority,
      courseTitle: courses.find((c) => c.id === form.courseId)?.title ?? null,
      authorName: user.name,
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [optimistic, ...prev]);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseId: form.courseId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnnouncements((prev) => prev.map((a) => (a.id === optimisticId ? { ...optimistic, id: data.announcement.id } : a)));
      push("Announcement posted", "success");
      setModalOpen(false);
      setForm(emptyForm);
    } catch (err) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== optimisticId));
      push(err instanceof Error ? err.message : "Failed to post announcement", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(a: Announcement) {
    if (!confirm("Delete this announcement?")) return;
    const prev = announcements;
    setAnnouncements((p) => p.filter((x) => x.id !== a.id));
    try {
      const res = await fetch(`/api/announcements/${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      push("Announcement deleted", "success");
    } catch {
      setAnnouncements(prev);
      push("Failed to delete announcement", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500">Stay up to date with the latest school-wide and course updates.</p>
        </div>
        {canPost && <Button onClick={() => setModalOpen(true)}>+ New Announcement</Button>}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState icon="📣" title="No announcements yet" description="Check back later for updates." />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusBadgeClasses(a.priority)}>{a.priority}</Badge>
                    {a.courseTitle && <Badge className="bg-slate-100 text-slate-600">{a.courseTitle}</Badge>}
                    {!a.courseTitle && <Badge className="bg-slate-100 text-slate-600 capitalize">{a.audience}</Badge>}
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">{a.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{a.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {a.authorName ?? "System"} · {timeAgo(a.createdAt)}
                  </p>
                </div>
                {(user.role === "admin" || a.authorId === user.id) && (
                  <button onClick={() => onDelete(a)} className="shrink-0 text-xs font-medium text-rose-500 hover:underline">
                    Delete
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title">
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Message">
            <Textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Audience">
              <Select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                <option value="all">Everyone</option>
                <option value="student">Students</option>
                <option value="teacher">Faculty</option>
                <option value="parent">Parents</option>
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Announcement["priority"] })}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
              </Select>
            </Field>
          </div>
          <Field label="Course (optional)" hint="Leave blank to send to the selected audience institution-wide.">
            <Select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
              <option value="">No specific course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Post announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
