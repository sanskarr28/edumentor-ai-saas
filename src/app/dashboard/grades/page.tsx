"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Badge, Card, EmptyState, Select, Skeleton } from "@/components/ui";
import { average, formatDate, initials, statusBadgeClasses } from "@/lib/utils";

type Assignment = {
  id: string;
  title: string;
  totalMarks: number;
  dueDate: string;
  courseId: string;
  courseTitle: string;
  courseColor: string;
  mySubmission: { grade: number | null; status: string; feedback: string | null; aiFeedback: string | null } | null;
};

type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  avatarColor: string;
  status: string;
  grade: number | null;
  feedback: string | null;
};

type Course = { id: string; title: string; color: string };

export default function GradesPage() {
  const user = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  const isStudent = user.role === "student";
  const isManager = user.role === "teacher" || user.role === "admin";
  const isParent = user.role === "parent";

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const assignmentsRes = await fetch("/api/assignments");
        const assignmentsData = await assignmentsRes.json();
        if (!active) return;
        setAssignments(assignmentsData.assignments ?? []);

        if (isManager) {
          const coursesRes = await fetch("/api/courses");
          const coursesData = await coursesRes.json();
          setCourses(coursesData.courses ?? []);
          if (coursesData.courses?.length) setSelectedCourse(coursesData.courses[0].id);
        }
        if (isParent) {
          const subsRes = await fetch("/api/submissions");
          const subsData = await subsRes.json();
          setSubmissions(subsData.submissions ?? []);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isManager || !selectedCourse) return;
    let active = true;
    async function loadCourseSubs() {
      const courseAssignments = assignments.filter((a) => a.courseId === selectedCourse);
      const results = await Promise.all(
        courseAssignments.map((a) => fetch(`/api/submissions?assignmentId=${a.id}`).then((r) => r.json())),
      );
      if (!active) return;
      setSubmissions(results.flatMap((r) => r.submissions ?? []));
    }
    loadCourseSubs();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, assignments.length]);

  const studentGraded = useMemo(() => {
    if (!isStudent) return [];
    return assignments.filter((a) => a.mySubmission?.status === "graded");
  }, [assignments, isStudent]);

  const overallAvg = useMemo(() => {
    if (!isStudent) return 0;
    const pcts = studentGraded.map((a) => ((a.mySubmission?.grade ?? 0) / a.totalMarks) * 100);
    return Math.round(average(pcts));
  }, [studentGraded, isStudent]);

  const courseAssignments = useMemo(
    () => assignments.filter((a) => a.courseId === selectedCourse),
    [assignments, selectedCourse],
  );

  const parentGroups = useMemo(() => {
    const groups = new Map<string, Submission[]>();
    for (const s of submissions) {
      const arr = groups.get(s.studentId) ?? [];
      arr.push(s);
      groups.set(s.studentId, arr);
    }
    return groups;
  }, [submissions]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gradebook</h1>
        <p className="text-sm text-slate-500">
          {isStudent && "Review your grades and instructor feedback."}
          {isManager && "Review student performance by course."}
          {isParent && "Track your children's academic performance."}
        </p>
      </div>

      {isStudent && (
        <>
          <Card className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-700">
              {overallAvg}%
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Overall Average</p>
              <p className="text-xs text-slate-500">Based on {studentGraded.length} graded assignments</p>
            </div>
          </Card>
          {assignments.length === 0 ? (
            <EmptyState icon="📊" title="No grades yet" description="Enroll in courses and complete assignments to see grades here." />
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                    <th className="pb-2">Assignment</th>
                    <th className="pb-2">Course</th>
                    <th className="pb-2">Due</th>
                    <th className="pb-2">Grade</th>
                    <th className="pb-2">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 font-medium text-slate-800">{a.title}</td>
                      <td className="py-2 text-slate-500">{a.courseTitle}</td>
                      <td className="py-2 text-slate-500">{formatDate(a.dueDate)}</td>
                      <td className="py-2">
                        {a.mySubmission?.status === "graded" ? (
                          <Badge className={statusBadgeClasses("graded")}>
                            {a.mySubmission.grade}/{a.totalMarks}
                          </Badge>
                        ) : (
                          <Badge className={statusBadgeClasses(a.mySubmission?.status ?? "pending")}>
                            {a.mySubmission?.status ?? "pending"}
                          </Badge>
                        )}
                      </td>
                      <td className="max-w-xs truncate py-2 text-xs text-slate-500">
                        {a.mySubmission?.feedback || a.mySubmission?.aiFeedback || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      {isManager && (
        <>
          <div className="w-64">
            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
          {courseAssignments.length === 0 ? (
            <EmptyState icon="📊" title="No assignments in this course yet" />
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                    <th className="pb-2">Student</th>
                    {courseAssignments.map((a) => (
                      <th key={a.id} className="pb-2">
                        {a.title}
                      </th>
                    ))}
                    <th className="pb-2">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {[...new Map(submissions.map((s) => [s.studentId, s])).values()].map((student) => {
                    const rows = courseAssignments.map((a) => {
                      const sub = submissions.find((s) => s.assignmentId === a.id && s.studentId === student.studentId);
                      return { assignment: a, sub };
                    });
                    const pcts = rows
                      .filter((r) => r.sub?.grade !== null && r.sub?.grade !== undefined)
                      .map((r) => ((r.sub?.grade ?? 0) / r.assignment.totalMarks) * 100);
                    return (
                      <tr key={student.studentId} className="border-b border-slate-50 last:border-0">
                        <td className="whitespace-nowrap py-2 font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                              style={{ backgroundColor: student.avatarColor }}
                            >
                              {initials(student.studentName)}
                            </div>
                            {student.studentName}
                          </div>
                        </td>
                        {rows.map((r) => (
                          <td key={r.assignment.id} className="py-2 text-slate-600">
                            {r.sub?.grade !== null && r.sub?.grade !== undefined
                              ? `${r.sub.grade}/${r.assignment.totalMarks}`
                              : r.sub
                                ? "Ungraded"
                                : "—"}
                          </td>
                        ))}
                        <td className="py-2 font-semibold text-slate-800">
                          {pcts.length ? `${Math.round(average(pcts))}%` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      {isParent && (
        <>
          {parentGroups.size === 0 ? (
            <EmptyState icon="📊" title="No grades to show yet" />
          ) : (
            <div className="space-y-4">
              {[...parentGroups.entries()].map(([studentId, subs]) => {
                const graded = subs.filter((s) => s.grade !== null);
                return (
                  <Card key={studentId}>
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: subs[0].avatarColor }}
                      >
                        {initials(subs[0].studentName)}
                      </div>
                      <p className="font-semibold text-slate-800">{subs[0].studentName}</p>
                    </div>
                    <div className="space-y-1.5">
                      {graded.length === 0 ? (
                        <p className="text-sm text-slate-400">No graded assignments yet.</p>
                      ) : (
                        graded.map((s) => (
                          <div key={s.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                            <span className="text-slate-600">Assignment graded</span>
                            <Badge className={statusBadgeClasses("graded")}>{s.grade} pts</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
