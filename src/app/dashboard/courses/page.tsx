"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button, Card, EmptyState, Field, Input, Modal, Select, Skeleton, Textarea, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

type Course = {
  id: string;
  title: string;
  subject: string;
  description: string;
  gradeLevel: string;
  schedule: string;
  color: string;
  capacity: number;
  teacherId: string | null;
  teacherName: string;
  enrolledCount: number;
};

type TeacherOption = { id: string; name: string };

const emptyForm = {
  title: "",
  subject: "",
  description: "",
  gradeLevel: "Grade 9",
  schedule: "Mon/Wed 10:00 AM",
  capacity: 30,
  teacherId: "",
};

export default function CoursesPage() {
  const user = useSession();
  const { push } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const canManage = user.role === "teacher" || user.role === "admin";
  const canBrowseAll = user.role === "admin" || user.role === "teacher" || user.role === "student";

  async function load() {
    setLoading(true);
    try {
      const url = canBrowseAll ? "/api/courses?browse=1" : "/api/courses";
      const res = await fetch(url);
      const data = await res.json();
      setCourses(data.courses ?? []);
      setEnrolledIds(data.enrolledCourseIds ?? []);
    } catch {
      push("Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    if (user.role === "admin") {
      fetch("/api/users?role=teacher")
        .then((r) => r.json())
        .then((d) => setTeachers(d.users ?? []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.teacherName.toLowerCase().includes(q),
    );
  }, [courses, search]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(course: Course) {
    setEditing(course);
    setForm({
      title: course.title,
      subject: course.subject,
      description: course.description,
      gradeLevel: course.gradeLevel,
      schedule: course.schedule,
      capacity: course.capacity,
      teacherId: course.teacherId ?? "",
    });
    setModalOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/courses/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCourses((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...data.course, teacherName: c.teacherName, enrolledCount: c.enrolledCount } : c)));
        push("Course updated", "success");
      } else {
        const optimisticId = `optimistic-${Date.now()}`;
        const optimistic: Course = {
          id: optimisticId,
          title: form.title,
          subject: form.subject,
          description: form.description,
          gradeLevel: form.gradeLevel,
          schedule: form.schedule,
          color: "#6366f1",
          capacity: Number(form.capacity),
          teacherId: form.teacherId || user.id,
          teacherName: user.role === "teacher" ? user.name : teachers.find((t) => t.id === form.teacherId)?.name ?? "Unassigned",
          enrolledCount: 0,
        };
        setCourses((prev) => [...prev, optimistic]);
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, capacity: Number(form.capacity), teacherId: form.teacherId || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setCourses((prev) => prev.filter((c) => c.id !== optimisticId));
          throw new Error(data.error);
        }
        setCourses((prev) => prev.map((c) => (c.id === optimisticId ? data.course : c)));
        push("Course created", "success");
      }
      setModalOpen(false);
    } catch (err) {
      push(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(course: Course) {
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    const prev = courses;
    setCourses((p) => p.filter((c) => c.id !== course.id));
    try {
      const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      push("Course deleted", "success");
    } catch {
      setCourses(prev);
      push("Failed to delete course", "error");
    }
  }

  async function toggleEnroll(course: Course) {
    setBusyId(course.id);
    const isEnrolled = enrolledIds.includes(course.id);
    setEnrolledIds((prev) => (isEnrolled ? prev.filter((id) => id !== course.id) : [...prev, course.id]));
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, enrolledCount: c.enrolledCount + (isEnrolled ? -1 : 1) } : c)),
    );
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: isEnrolled ? "DELETE" : "POST" });
      if (!res.ok) throw new Error("Failed");
      push(isEnrolled ? "Unenrolled from course" : "Enrolled successfully", "success");
    } catch {
      setEnrolledIds((prev) => (isEnrolled ? [...prev, course.id] : prev.filter((id) => id !== course.id)));
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, enrolledCount: c.enrolledCount + (isEnrolled ? 1 : -1) } : c)),
      );
      push("Action failed, please try again", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          <p className="text-sm text-slate-500">
            {user.role === "student" && "Browse and enroll in available courses."}
            {user.role === "teacher" && "Manage your courses and rosters."}
            {user.role === "admin" && "Oversee every course across the institution."}
            {user.role === "parent" && "Courses your children are enrolled in."}
          </p>
        </div>
        {canManage && (
          <Button onClick={openCreate}>+ New Course</Button>
        )}
      </div>

      <Input
        placeholder="Search by title, subject, or instructor…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses found"
          description={search ? "Try a different search term." : "There are no courses to show yet."}
          action={canManage ? <Button onClick={openCreate}>Create your first course</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const isOwner = user.role === "admin" || course.teacherId === user.id;
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <Card key={course.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span
                    className="rounded-lg px-2.5 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: course.color }}
                  >
                    {course.subject}
                  </span>
                  <span className="text-xs text-slate-400">{course.gradeLevel}</span>
                </div>
                <div>
                  <Link href={`/dashboard/courses/${course.id}`} className="text-base font-semibold text-slate-900 hover:text-indigo-600">
                    {course.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{course.description || "No description provided."}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>👨‍🏫 {course.teacherName}</span>
                  <span>🗓️ {course.schedule}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {course.enrolledCount}/{course.capacity} students
                  </span>
                  <Link href={`/dashboard/courses/${course.id}`} className="font-medium text-indigo-600 hover:underline">
                    View details →
                  </Link>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  {user.role === "student" && (
                    <Button
                      size="sm"
                      variant={isEnrolled ? "outline" : "primary"}
                      onClick={() => toggleEnroll(course)}
                      loading={busyId === course.id}
                      disabled={!isEnrolled && course.enrolledCount >= course.capacity}
                    >
                      {isEnrolled ? "Unenroll" : course.enrolledCount >= course.capacity ? "Full" : "Enroll"}
                    </Button>
                  )}
                  {isOwner && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => openEdit(course)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(course)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Course" : "Create Course"} wide>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Course Title">
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Subject">
            <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="Grade Level">
            <Input value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} />
          </Field>
          <Field label="Schedule">
            <Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
          </Field>
          <Field label="Capacity">
            <Input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </Field>
          {user.role === "admin" && (
            <Field label="Assign Faculty">
              <Select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
                <option value="">Unassigned</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
          <div className={cn("flex justify-end gap-2 sm:col-span-2")}>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create course"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
