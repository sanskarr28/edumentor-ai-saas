"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { BarChart, Button, Card, DonutChart, EmptyState, Skeleton } from "@/components/ui";

type AdminOverview = {
  role: "admin";
  stats: {
    totalUsers: number;
    roleCounts: Record<string, number>;
    totalCourses: number;
    totalAssignments: number;
    totalSubmissions: number;
    avgGrade: number;
    attendanceRate: number;
    totalAnnouncements: number;
  };
  courseSubjectBreakdown: { subject: string; count: number }[];
};

type TeacherOverview = {
  role: "teacher";
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalAssignments: number;
    pendingGrading: number;
    avgGrade: number;
    attendanceRate: number;
  };
  courses: { id: string; title: string; students: number; color: string }[];
};

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const user = useSession();
  const [data, setData] = useState<AdminOverview | TeacherOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/overview")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (user.role !== "admin" && user.role !== "teacher") {
    return <EmptyState icon="🔒" title="Restricted" description="Reports are available to faculty and administrators." />;
  }

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports &amp; Analytics</h1>
          <p className="text-sm text-slate-500">Institution-wide performance, attendance, and engagement metrics.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (data?.role === "admin") {
              downloadCsv("edumentor-admin-report.csv", [
                ["Metric", "Value"],
                ["Total Users", data.stats.totalUsers],
                ["Total Courses", data.stats.totalCourses],
                ["Total Assignments", data.stats.totalAssignments],
                ["Total Submissions", data.stats.totalSubmissions],
                ["Average Grade %", data.stats.avgGrade],
                ["Attendance Rate %", data.stats.attendanceRate],
                ["Announcements Posted", data.stats.totalAnnouncements],
                ...Object.entries(data.stats.roleCounts).map(([role, count]) => [`${role} count`, count]),
              ]);
            } else if (data?.role === "teacher") {
              downloadCsv("edumentor-teacher-report.csv", [
                ["Course", "Students"],
                ...data.courses.map((c) => [c.title, c.students]),
              ]);
            }
          }}
        >
          ⬇ Export CSV
        </Button>
      </div>

      {data?.role === "admin" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-xs text-slate-500">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalUsers}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500">Active Courses</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalCourses}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500">Submissions</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalSubmissions}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500">Announcements</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalAnnouncements}</p>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Courses by Subject</h3>
              {data.courseSubjectBreakdown.length ? (
                <BarChart data={data.courseSubjectBreakdown.map((c) => ({ label: c.subject, value: c.count }))} />
              ) : (
                <p className="text-sm text-slate-400">No data yet.</p>
              )}
            </Card>
            <Card className="flex flex-col items-center gap-4">
              <h3 className="self-start text-sm font-semibold text-slate-700">Key Rates</h3>
              <div className="flex gap-6">
                <DonutChart value={data.stats.avgGrade} label="Avg Grade" color="#6366f1" />
                <DonutChart value={data.stats.attendanceRate} label="Attendance" color="#10b981" />
              </div>
            </Card>
          </div>
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-700">User Distribution</h3>
            <BarChart
              data={Object.entries(data.stats.roleCounts).map(([role, count]) => ({ label: role, value: count }))}
            />
          </Card>
        </>
      )}

      {data?.role === "teacher" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-xs text-slate-500">My Courses</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalCourses}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500">Total Students</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalStudents}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500">Pending Grading</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.pendingGrading}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500">Assignments Created</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{data.stats.totalAssignments}</p>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Enrollment by Course</h3>
              {data.courses.length ? (
                <BarChart data={data.courses.map((c) => ({ label: c.title, value: c.students, color: c.color }))} />
              ) : (
                <p className="text-sm text-slate-400">No courses yet.</p>
              )}
            </Card>
            <Card className="flex flex-col items-center gap-4">
              <h3 className="self-start text-sm font-semibold text-slate-700">Key Rates</h3>
              <div className="flex gap-6">
                <DonutChart value={data.stats.avgGrade} label="Avg Grade" color="#6366f1" />
                <DonutChart value={data.stats.attendanceRate} label="Attendance" color="#10b981" />
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
