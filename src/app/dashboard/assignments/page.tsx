"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/session-provider";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
  Skeleton,
  Textarea,
  useToast,
} from "@/components/ui";
import { formatDate, formatDateTime, statusBadgeClasses } from "@/lib/utils";
import { FileUpload, FileDownloadButton } from "@/components/file-upload";

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  courseId: string;
  courseTitle: string;
  courseColor: string;
  courseSubject: string;
  fileUrl: string | null;
  fileName: string | null;
  stats: { total: number; graded: number; submitted: number };
  mySubmission: {
    id: string;
    status: string;
    grade: number | null;
    feedback: string | null;
    aiFeedback: string | null;
    content: string | null;
    fileUrl: string | null;
    fileName: string | null;
  } | null;
};

type CourseOption = { id: string; title: string };

type Submission = {
  id: string;
  studentId: string;
  studentName: string;
  avatarColor: string;
  content: string | null;
  status: string;
  submittedAt: string | null;
  grade: number | null;
  feedback: string | null;
  fileUrl: string | null;
  fileName: string | null;
};

const emptyForm = { courseId: "", title: "", description: "", dueDate: "", totalMarks: 100, fileUrl: "", fileName: "" };

export default function AssignmentsPage() {
  const user = useSession();
  const { push } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState<{ url: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [gradeModal, setGradeModal] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, { grade: string; feedback: string }>>({});
  const [gradingId, setGradingId] = useState<string | null>(null);

  const canManage = user.role === "teacher" || user.role === "admin";

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignments(data.assignments ?? []);
    } catch {
      push("Failed to load assignments", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    if (canManage) {
      fetch("/api/courses").then((r) => r.json()).then((d) => setCourses(d.courses ?? []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return assignments;
    if (filter === "pending") return assignments.filter((a) => !a.mySubmission || a.mySubmission.status === "pending");
    if (filter === "submitted") return assignments.filter((a) => a.mySubmission && ["submitted", "late"].includes(a.mySubmission.status));
    if (filter === "graded") return assignments.filter((a) => a.mySubmission?.status === "graded");
    return assignments;
  }, [assignments, filter]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, courseId: courses[0]?.id ?? "" });
    setModalOpen(true);
  }

  function openEdit(a: Assignment) {
    setEditing(a);
    setForm({
      courseId: a.courseId,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate.slice(0, 16),
      totalMarks: a.totalMarks,
      fileUrl: a.fileUrl ?? "",
      fileName: a.fileName ?? "",
    });
    setModalOpen(true);
  }

  async function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/assignments/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, totalMarks: Number(form.totalMarks) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAssignments((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...data.assignment } : a)));
        push("Assignment updated", "success");
      } else {
        const res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, totalMarks: Number(form.totalMarks) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAssignments((prev) => [...prev, data.assignment]);
        push("Assignment created", "success");
      }
      setModalOpen(false);
    } catch (err) {
      push(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(a: Assignment) {
    if (!confirm(`Delete "${a.title}"?`)) return;
    const prev = assignments;
    setAssignments((p) => p.filter((x) => x.id !== a.id));
    try {
      const res = await fetch(`/api/assignments/${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      push("Assignment deleted", "success");
    } catch {
      setAssignments(prev);
      push("Failed to delete", "error");
    }
  }

  function openSubmit(a: Assignment) {
    setSubmitModal(a);
    setSubmissionText(a.mySubmission?.content ?? "");
    setSubmissionFile(
      a.mySubmission?.fileUrl && a.mySubmission?.fileName
        ? { url: a.mySubmission.fileUrl, name: a.mySubmission.fileName }
        : null,
    );
  }

  async function submitWork() {
    if (!submitModal) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: submitModal.id,
          content: submissionText || undefined,
          fileUrl: submissionFile?.url,
          fileName: submissionFile?.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAssignments((prev) =>
        prev.map((a) => (a.id === submitModal.id ? { ...a, mySubmission: data.submission } : a)),
      );
      push("Assignment submitted!", "success");
      setSubmitModal(null);
      setSubmissionFile(null);
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to submit", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function openGrading(a: Assignment) {
    setGradeModal(a);
    setLoadingSubs(true);
    try {
      const res = await fetch(`/api/submissions?assignmentId=${a.id}`);
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
      const drafts: Record<string, { grade: string; feedback: string }> = {};
      for (const s of data.submissions ?? []) {
        drafts[s.id] = { grade: s.grade?.toString() ?? "", feedback: s.feedback ?? "" };
      }
      setGradeDrafts(drafts);
    } catch {
      push("Failed to load submissions", "error");
    } finally {
      setLoadingSubs(false);
    }
  }

  async function saveGrade(sub: Submission) {
    if (!gradeModal) return;
    const draft = gradeDrafts[sub.id];
    if (!draft?.grade) return;
    setGradingId(sub.id);
    try {
      const res = await fetch(`/api/submissions/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: Number(draft.grade), feedback: draft.feedback }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, ...data.submission } : s)));
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === gradeModal.id
            ? { ...a, stats: { ...a.stats, graded: a.stats.graded + (sub.status !== "graded" ? 1 : 0) } }
            : a,
        ),
      );
      push("Grade saved", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to save grade", "error");
    } finally {
      setGradingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-sm text-slate-500">
            {canManage ? "Create, manage, and grade assignments across your courses." : "Track and submit your coursework."}
          </p>
        </div>
        {canManage && <Button onClick={openCreate}>+ New Assignment</Button>}
      </div>

      {!canManage && (
        <div className="flex gap-2">
          {["all", "pending", "submitted", "graded"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📝" title="No assignments found" description="Assignments will appear here once created." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded px-2 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: a.courseColor }}>
                    {a.courseTitle}
                  </span>
                  <p className="font-semibold text-slate-900">{a.title}</p>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">{a.description || "No description"}</p>
                {a.fileUrl && a.fileName && (
                  <div className="mt-1">
                    <FileDownloadButton fileUrl={a.fileUrl} fileName={a.fileName} variant="link" />
                  </div>
                )}
                <p className="mt-1 text-xs text-slate-400">Due {formatDateTime(a.dueDate)} · {a.totalMarks} points</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canManage ? (
                  <>
                    <Badge className="bg-slate-100 text-slate-600">
                      {a.stats.submitted}/{a.stats.total} submitted
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => openGrading(a)}>
                      Grade ({a.stats.total - a.stats.graded} left)
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(a)}>
                      Delete
                    </Button>
                  </>
                ) : user.role === "student" ? (
                  <>
                    {a.mySubmission?.status === "graded" ? (
                      <Badge className={statusBadgeClasses("graded")}>
                        Graded · {a.mySubmission.grade}/{a.totalMarks}
                      </Badge>
                    ) : (
                      <Badge className={statusBadgeClasses(a.mySubmission?.status ?? "pending")}>
                        {a.mySubmission?.status ?? "pending"}
                      </Badge>
                    )}
                    <Button size="sm" onClick={() => openSubmit(a)}>
                      {a.mySubmission ? "View / Edit" : "Submit"}
                    </Button>
                  </>
                ) : (
                  <Badge className="bg-slate-100 text-slate-600">Due {formatDate(a.dueDate)}</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Assignment" : "New Assignment"}>
        <form onSubmit={onSubmitForm} className="space-y-4">
          <Field label="Course">
            <Select required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Title">
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Assignment file (optional)">
            <FileUpload
              context="assignments"
              label="Attach PDF or document"
              existingFileName={form.fileName || null}
              onUpload={(url, name) => setForm((f) => ({ ...f, fileUrl: url, fileName: name }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Due Date">
              <Input
                type="datetime-local"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </Field>
            <Field label="Total Marks">
              <Input
                type="number"
                min={1}
                required
                value={form.totalMarks}
                onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create assignment"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submit work modal */}
      <Modal open={!!submitModal} onClose={() => { setSubmitModal(null); setSubmissionFile(null); }} title={submitModal?.title ?? "Submit Assignment"}>
        {submitModal && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">{submitModal.description}</p>
            <Field label="Your response" hint="Paste your answer, notes, or a link to your work.">
              <Textarea
                rows={6}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type your submission here…"
              />
            </Field>
            <Field label="Or attach a file (optional)">
              <FileUpload
                context="submissions"
                label="Upload your submission file"
                existingFileName={submissionFile?.name ?? null}
                onUpload={(url, name) => setSubmissionFile({ url, name })}
              />
            </Field>
            {submitModal.mySubmission?.status === "graded" && (
              <div className="rounded-lg bg-emerald-50 p-3 text-sm">
                <p className="font-semibold text-emerald-700">
                  Grade: {submitModal.mySubmission.grade}/{submitModal.totalMarks}
                </p>
                {submitModal.mySubmission.feedback && (
                  <p className="mt-1 text-xs text-emerald-700">Feedback: {submitModal.mySubmission.feedback}</p>
                )}
                {submitModal.mySubmission.aiFeedback && (
                  <p className="mt-1 text-xs text-emerald-600">✨ AI Coach: {submitModal.mySubmission.aiFeedback}</p>
                )}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setSubmitModal(null); setSubmissionFile(null); }}>
                Close
              </Button>
              <Button onClick={submitWork} loading={submitting} disabled={!submissionText.trim() && !submissionFile}>
                {submitModal.mySubmission ? "Update submission" : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Grading modal */}
      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title={`Grade: ${gradeModal?.title ?? ""}`} wide>
        {loadingSubs ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : submissions.length === 0 ? (
          <EmptyState icon="📭" title="No submissions yet" />
        ) : (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto">
            {submissions.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{s.studentName}</p>
                  <Badge className={statusBadgeClasses(s.status)}>{s.status}</Badge>
                </div>
                <p className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-2 text-xs text-slate-600">
                  {s.content || "No content submitted."}
                </p>
                {s.fileUrl && s.fileName && (
                  <div className="mt-1">
                    <FileDownloadButton fileUrl={s.fileUrl} fileName={s.fileName} variant="link" />
                  </div>
                )}
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input
                    type="number"
                    placeholder={`Grade / ${gradeModal?.totalMarks}`}
                    value={gradeDrafts[s.id]?.grade ?? ""}
                    onChange={(e) =>
                      setGradeDrafts((prev) => ({ ...prev, [s.id]: { ...prev[s.id], grade: e.target.value } }))
                    }
                  />
                  <Input
                    placeholder="Feedback (optional)"
                    className="sm:col-span-1"
                    value={gradeDrafts[s.id]?.feedback ?? ""}
                    onChange={(e) =>
                      setGradeDrafts((prev) => ({ ...prev, [s.id]: { ...prev[s.id], feedback: e.target.value } }))
                    }
                  />
                  <Button size="sm" onClick={() => saveGrade(s)} loading={gradingId === s.id}>
                    Save Grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
