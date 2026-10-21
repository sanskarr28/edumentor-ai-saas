"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { BarChart, Card, DonutChart, Skeleton } from "@/components/ui";
import { initials } from "@/lib/utils";

type AdminStats = {
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

type TeacherStats = {
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

type StudentStats = {
  role: "student";
  stats: {
    totalCourses: number;
    totalAssignments: number;
    pendingAssignments: number;
    avgGrade: number;
    attendanceRate: number;
  };
  subjectGrades: { subject: string; value: number; color: string }[];
};

type ParentStats = {
  role: "parent";
  children: {
    id: string;
    name: string;
    avatarColor: string;
    gradeLevel: string | null;
    totalCourses: number;
    avgGrade: number;
    attendanceRate: number;
  }[];
};

type Overview = AdminStats | TeacherStats | StudentStats | ParentStats;

type MetricIcon = "users" | "courses" | "assignments" | "grades" | "students" | "teachers" | "parents" | "admins" | "pending";

const metricIconPaths: Record<MetricIcon, string> = {
  users: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 3a4 4 0 0 1 3 3.87V21m-1-17.9a4 4 0 0 1 0 7.75",
  courses: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Zm0 0V22m4-14h8m-8 4h8",
  assignments: "M8 4h8m-8 5h8m-8 5h5M5 2h14v20H5z",
  grades: "M4 19V5m0 14h17M8 15l3-4 3 2 5-7",
  students: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  teachers: "M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 7a7 7 0 0 1 14 0m-7-7v7m-4-4h8",
  parents: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  admins: "M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6zm-3 9 2 2 4-4",
  pending: "M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

function StatCard({ label, value, icon, hint }: { label: string; value: string | number; icon: MetricIcon; hint?: string }) {
  return (
    <Card className="flex min-h-[118px] items-start justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-700">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-[1.75rem] font-semibold leading-none tracking-tight text-slate-950 dark:text-white">{value}</p>
        {hint && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
          <path d={metricIconPaths[icon]} />
        </svg>
      </span>
    </Card>
  );
}

export default function OverviewPage() {
  const user = useSession();
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/reports/overview")
      .then((r) => r.json())
      .then((d) => active && setData(d))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            {user.role === "student" ? "Your learning" : user.role === "teacher" ? "Teaching workspace" : user.role === "parent" ? "Family overview" : "Institution overview"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">
            {user.role === "student" ? "Learning overview" : user.role === "teacher" ? "Teaching overview" : user.role === "parent" ? "Learner progress" : "Dashboard overview"}
          </h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Your key updates and progress, all in one place.
        </p>
      </div>

      {data?.role === "admin" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Users" value={data.stats.totalUsers} icon="users" />
            <StatCard label="Active Courses" value={data.stats.totalCourses} icon="courses" />
            <StatCard label="Assignments" value={data.stats.totalAssignments} icon="assignments" />
            <StatCard label="Avg. Grade" value={`${data.stats.avgGrade}%`} icon="grades" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Courses by Subject</h3>
              {data.courseSubjectBreakdown.length ? (
                <BarChart
                  data={data.courseSubjectBreakdown.map((c) => ({ label: c.subject, value: c.count }))}
                />
              ) : (
                <p className="text-sm text-slate-400">No course data yet.</p>
              )}
            </Card>
            <Card className="flex flex-col items-center justify-center gap-2">
              <h3 className="self-start text-sm font-semibold text-slate-900">Attendance Rate</h3>
              <DonutChart value={data.stats.attendanceRate} label="System-wide" />
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data.stats.roleCounts).map(([role, count]) => (
              <StatCard key={role} label={`${role}s`} value={count} icon={role === "student" ? "students" : role === "teacher" ? "teachers" : role === "parent" ? "parents" : "admins"} />
            ))}
          </div>
        </>
      )}

      {data?.role === "teacher" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="My Courses" value={data.stats.totalCourses} icon="courses" />
            <StatCard label="Students" value={data.stats.totalStudents} icon="students" />
            <StatCard label="Pending Grading" value={data.stats.pendingGrading} icon="pending" hint="Needs review" />
            <StatCard label="Avg. Grade" value={`${data.stats.avgGrade}%`} icon="grades" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Students per Course</h3>
              {data.courses.length ? (
                <BarChart data={data.courses.map((c) => ({ label: c.title, value: c.students, color: c.color }))} />
              ) : (
                <p className="text-sm text-slate-400">Create a course to get started.</p>
              )}
            </Card>
            <Card className="flex flex-col items-center justify-center gap-2">
              <h3 className="self-start text-sm font-semibold text-slate-700">Attendance Rate</h3>
              <DonutChart value={data.stats.attendanceRate} label="Your courses" />
            </Card>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/courses" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              + New course
            </Link>
            <Link href="/dashboard/assignments" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Grade submissions
            </Link>
          </div>
        </>
      )}

      {data?.role === "student" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Enrolled Courses" value={data.stats.totalCourses} icon="courses" />
            <StatCard label="Assignments" value={data.stats.totalAssignments} icon="assignments" />
            <StatCard label="Pending" value={data.stats.pendingAssignments} icon="pending" hint="Not yet submitted" />
            <StatCard label="Avg. Grade" value={`${data.stats.avgGrade}%`} icon="grades" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Grades by Subject</h3>
              {data.subjectGrades.length ? (
                <BarChart data={data.subjectGrades.map((s) => ({ label: s.subject, value: s.value, color: s.color }))} suffix="%" />
              ) : (
                <p className="text-sm text-slate-400">Enroll in a course to see performance here.</p>
              )}
            </Card>
            <Card className="flex flex-col items-center justify-center gap-2">
              <h3 className="self-start text-sm font-semibold text-slate-900">Attendance Rate</h3>
              <DonutChart value={data.stats.attendanceRate} label="This term" />
            </Card>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/insights" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-sm">
              View AI Insights
            </Link>
            <Link href="/dashboard/courses" className="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:hover:bg-slate-800">
              Browse Courses
            </Link>
          </div>
        </>
      )}

      {data?.role === "parent" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Your Children</h3>
          {data.children.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">
                No linked students yet. Ask an administrator to link your account to your child&apos;s profile.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.children.map((child) => (
                <Card key={child.id}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: child.avatarColor }}
                    >
                      {initials(child.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{child.name}</p>
                      <p className="text-xs text-slate-500">{child.gradeLevel ?? "—"}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-lg font-bold text-slate-800">{child.totalCourses}</p>
                      <p className="text-[10px] text-slate-500">Courses</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-lg font-bold text-slate-800">{child.avgGrade}%</p>
                      <p className="text-[10px] text-slate-500">Avg. Grade</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-lg font-bold text-slate-800">{child.attendanceRate}%</p>
                      <p className="text-[10px] text-slate-500">Attendance</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/insights" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              ✨ View AI insights
            </Link>
            <Link href="/dashboard/grades" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              View gradebook
            </Link>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Signed in as <span className="font-medium text-slate-600">{user.name}</span> · {user.email}
      </p>
    </div>
  );
}
