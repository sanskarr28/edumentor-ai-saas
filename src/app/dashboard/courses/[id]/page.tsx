"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Badge, Button, Card, EmptyState, PageLoader, Select, useToast } from "@/components/ui";
import { formatDate, initials } from "@/lib/utils";
import { FileUpload, FileDownloadButton } from "@/components/file-upload";

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
};

type RosterEntry = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatarColor: string;
  status: string;
  enrolledAt: string;
};

type AssignmentSummary = {
  id: string;
  title: string;
  dueDate: string;
  totalMarks: number;
  stats: { total: number; graded: number; submitted: number };
};

type StudentOption = { id: string; name: string; email: string };

type CourseFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploaderName: string | null;
  createdAt: string;
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useSession();
  const { push } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courseFilesList, setCourseFilesList] = useState<CourseFile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const isOwner = user.role === "admin" || course?.teacherId === user.id;

  async function load() {
    setLoading(true);
    try {
      const [courseRes, rosterRes, assignmentsRes, filesRes] = await Promise.all([
        fetch(`/api/courses/${id}`),
        fetch(`/api/courses/${id}/enroll`),
        fetch(`/api/assignments?courseId=${id}`),
        fetch(`/api/courses/${id}/files`),
      ]);
      const courseData = await courseRes.json();
      const rosterData = await rosterRes.json();
      const assignmentsData = await assignmentsRes.json();
      const filesData = await filesRes.json();
      setCourse(courseData.course ?? null);
      setRoster(rosterData.roster ?? []);
      setAssignments(assignmentsData.assignments ?? []);
      setCourseFilesList(filesData.files ?? []);
    } catch {
      push("Failed to load course", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    if (user.role === "teacher" || user.role === "admin") {
      fetch("/api/users?role=student")
        .then((r) => r.json())
        .then((d) => setStudents(d.users ?? []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function uploadCourseFile(fileUrl: string, fileName: string) {
    try {
      const res = await fetch(`/api/courses/${id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, fileName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourseFilesList((prev) => [...prev, data.file]);
      push("File uploaded", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Upload failed", "error");
    }
  }

  async function deleteCourseFile(fileId: string) {
    setCourseFilesList((prev) => prev.filter((f) => f.id !== fileId));
    try {
      await fetch(`/api/courses/${id}/files?fileId=${fileId}`, { method: "DELETE" });
      push("File removed", "success");
    } catch {
      push("Failed to remove file", "error");
    }
  }

  async function addStudent() {
    if (!selectedStudent) return;
    setAdding(true);
    const student = students.find((s) => s.id === selectedStudent);
    try {
      const res = await fetch(`/api/courses/${id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoster((prev) => [
        ...prev,
        {
          id: data.enrollment.id,
          studentId: selectedStudent,
          studentName: student?.name ?? "Student",
          studentEmail: student?.email ?? "",
          avatarColor: "#6366f1",
          status: "active",
          enrolledAt: new Date().toISOString(),
        },
      ]);
      setSelectedStudent("");
      push("Student added to roster", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to add student", "error");
    } finally {
      setAdding(false);
    }
  }

  async function removeStudent(entry: RosterEntry) {
    const prev = roster;
    setRoster((r) => r.filter((x) => x.id !== entry.id));
    try {
      const res = await fetch(`/api/courses/${id}/enroll?studentId=${entry.studentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      push("Student removed", "success");
    } catch {
      setRoster(prev);
      push("Failed to remove student", "error");
    }
  }

  if (loading) return <PageLoader label="Loading course…" />;
  if (!course) return <EmptyState icon="🔍" title="Course not found" description="This course may have been removed." />;

  const availableStudents = students.filter((s) => !roster.some((r) => r.studentId === s.id));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/courses" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to courses
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="rounded-lg px-3 py-1 text-sm font-semibold text-white" style={{ backgroundColor: course.color }}>
            {course.subject}
          </span>
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{course.description || "No description provided."}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>🎓 {course.gradeLevel}</span>
          <span>🗓️ {course.schedule}</span>
          <span>👥 {roster.length}/{course.capacity} students</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Assignments</h3>
            <Link href="/dashboard/assignments" className="text-xs font-medium text-indigo-600 hover:underline">
              Manage assignments →
            </Link>
          </div>
          {assignments.length === 0 ? (
            <EmptyState icon="📝" title="No assignments yet" description="Assignments created for this course will appear here." />
          ) : (
            <div className="space-y-2">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-400">Due {formatDate(a.dueDate)} · {a.totalMarks} pts</p>
                  </div>
                  <Badge className="bg-slate-100 text-slate-600">
                    {a.stats.submitted}/{a.stats.total || roster.length} submitted
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Roster ({roster.length})</h3>
          {isOwner && (
            <div className="mb-4 flex gap-2">
              <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="flex-1">
                <option value="">Add a student…</option>
                {availableStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <Button size="sm" onClick={addStudent} loading={adding} disabled={!selectedStudent}>
                Add
              </Button>
            </div>
          )}
          {roster.length === 0 ? (
            <EmptyState icon="🎓" title="No students enrolled" />
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {roster.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: r.avatarColor }}
                    >
                      {initials(r.studentName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{r.studentName}</p>
                      <p className="truncate text-xs text-slate-400">{r.studentEmail}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <button onClick={() => removeStudent(r)} className="shrink-0 text-xs font-medium text-rose-500 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Course Materials */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Course Materials</h3>
          {isOwner && (
            <FileUpload
              context="course-materials"
              label="Upload material"
              onUpload={uploadCourseFile}
            />
          )}
        </div>
        {courseFilesList.length === 0 ? (
          <EmptyState
            icon="📂"
            title="No materials uploaded"
            description={isOwner ? "Upload lecture notes, syllabi, or other files for your students." : "No materials have been uploaded for this course yet."}
          />
        ) : (
          <div className="space-y-2">
            {courseFilesList.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <FileDownloadButton fileUrl={f.fileUrl} fileName={f.fileName} variant="link" />
                  <p className="text-xs text-slate-400">
                    Uploaded by {f.uploaderName ?? "Unknown"} · {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => deleteCourseFile(f.id)}
                    className="ml-2 shrink-0 text-xs font-medium text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
