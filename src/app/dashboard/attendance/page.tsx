"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Badge, Button, Card, EmptyState, Select, Skeleton, useToast } from "@/components/ui";
import { formatDate, initials, percentage, statusBadgeClasses } from "@/lib/utils";

type Course = { id: string; title: string; color: string };
type RosterEntry = { studentId: string; studentName: string; avatarColor: string };
type AttendanceRecord = {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  avatarColor: string;
  date: string;
  status: string;
  courseTitle: string;
};

const STATUS_OPTIONS = ["present", "absent", "late", "excused"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const user = useSession();
  const { push } = useToast();
  const canManage = user.role === "teacher" || user.role === "admin";

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(todayISO());
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [historyRecords, setHistoryRecords] = useState<AttendanceRecord[]>([]);

  async function loadCourses() {
    const res = await fetch(canManage ? "/api/courses" : "/api/courses");
    const data = await res.json();
    setCourses(data.courses ?? []);
    if (data.courses?.length) setSelectedCourse((prev) => prev || data.courses[0].id);
  }

  async function loadRoster(courseId: string, forDate: string) {
    if (!courseId) return;
    setLoading(true);
    try {
      const [rosterRes, attendanceRes] = await Promise.all([
        fetch(`/api/courses/${courseId}/enroll`),
        fetch(`/api/attendance?courseId=${courseId}&date=${forDate}`),
      ]);
      const rosterData = await rosterRes.json();
      const attendanceData = await attendanceRes.json();
      const list: RosterEntry[] = (rosterData.roster ?? []).map(
        (r: { studentId: string; studentName: string; avatarColor: string }) => ({
          studentId: r.studentId,
          studentName: r.studentName,
          avatarColor: r.avatarColor,
        }),
      );
      setRoster(list);
      const nextDraft: Record<string, string> = {};
      for (const s of list) nextDraft[s.studentId] = "present";
      for (const rec of attendanceData.records ?? []) nextDraft[rec.studentId] = rec.status;
      setDraft(nextDraft);
    } catch {
      push("Failed to load roster", "error");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      setHistoryRecords(data.records ?? []);
    } catch {
      push("Failed to load attendance", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManage) loadCourses();
    else loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (canManage && selectedCourse) loadRoster(selectedCourse, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, date]);

  async function saveAttendance() {
    if (!selectedCourse) return;
    setSaving(true);
    try {
      const entries = roster.map((r) => ({ studentId: r.studentId, status: draft[r.studentId] ?? "present" }));
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse, date, entries }),
      });
      if (!res.ok) throw new Error();
      push("Attendance saved", "success");
    } catch {
      push("Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  }

  function markAll(status: string) {
    setDraft((prev) => {
      const next = { ...prev };
      for (const r of roster) next[r.studentId] = status;
      return next;
    });
  }

  const groupedByStudent = useMemo(() => {
    const groups = new Map<string, AttendanceRecord[]>();
    for (const rec of historyRecords) {
      const arr = groups.get(rec.studentId) ?? [];
      arr.push(rec);
      groups.set(rec.studentId, arr);
    }
    return groups;
  }, [historyRecords]);

  if (canManage) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">Mark and review attendance for your courses.</p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <label className="mb-1 block text-xs font-medium text-slate-600">Course</label>
            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-48">
            <label className="mb-1 block text-xs font-medium text-slate-600">Date</label>
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => markAll("present")}>
              Mark all present
            </Button>
            <Button size="sm" variant="outline" onClick={() => markAll("absent")}>
              Mark all absent
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : roster.length === 0 ? (
          <EmptyState icon="🗓️" title="No students enrolled" description="Add students to this course to take attendance." />
        ) : (
          <Card>
            <div className="space-y-2">
              {roster.map((r) => (
                <div key={r.studentId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: r.avatarColor }}
                    >
                      {initials(r.studentName)}
                    </div>
                    <p className="text-sm font-medium text-slate-800">{r.studentName}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => setDraft((prev) => ({ ...prev, [r.studentId]: status }))}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                          draft[r.studentId] === status
                            ? statusBadgeClasses(status) + " ring-2 ring-offset-1 ring-indigo-400"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
              <Button onClick={saveAttendance} loading={saving}>
                Save attendance for {formatDate(date)}
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Student / Parent view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500">
          {user.role === "student" ? "Your attendance history across all courses." : "Attendance history for your children."}
        </p>
      </div>
      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : historyRecords.length === 0 ? (
        <EmptyState icon="🗓️" title="No attendance records yet" />
      ) : (
        <div className="space-y-6">
          {[...groupedByStudent.entries()].map(([studentId, records]) => {
            const present = records.filter((r) => r.status === "present" || r.status === "late").length;
            const rate = percentage(present, records.length);
            return (
              <Card key={studentId}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: records[0].avatarColor }}
                    >
                      {initials(records[0].studentName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{records[0].studentName}</p>
                      <p className="text-xs text-slate-400">{records.length} records</p>
                    </div>
                  </div>
                  <Badge className={rate >= 85 ? statusBadgeClasses("present") : statusBadgeClasses("absent")}>
                    {rate}% attendance
                  </Badge>
                </div>
                <div className="max-h-72 space-y-1.5 overflow-y-auto">
                  {records
                    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
                    .map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <span className="text-slate-600">
                          {formatDate(r.date)} · {r.courseTitle}
                        </span>
                        <Badge className={statusBadgeClasses(r.status)}>{r.status}</Badge>
                      </div>
                    ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
