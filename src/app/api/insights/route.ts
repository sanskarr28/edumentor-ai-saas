import { NextRequest, NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  aiInsights,
  assignments,
  attendanceRecords,
  courses,
  enrollments,
  parentLinks,
  submissions,
  users,
} from "@/db/schema";
import { getSession } from "@/lib/auth";
import { generateInsightsForStudent, SubjectPerformance } from "@/lib/ai";
import { percentage } from "@/lib/utils";

async function computePerformance(studentId: string): Promise<{
  performances: SubjectPerformance[];
  overallAttendance: number | null;
}> {
  const myEnrollments = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId));
  const courseIds = myEnrollments.map((e) => e.courseId);

  if (courseIds.length === 0) return { performances: [], overallAttendance: null };

  const courseRows = await db.select().from(courses).where(inArray(courses.id, courseIds));
  const assignmentRows = await db.select().from(assignments).where(inArray(assignments.courseId, courseIds));
  const assignmentIds = assignmentRows.map((a) => a.id);
  const submissionRows = assignmentIds.length
    ? await db
        .select()
        .from(submissions)
        .where(inArray(submissions.assignmentId, assignmentIds))
    : [];
  const myAttendance = await db
    .select()
    .from(attendanceRecords)
    .where(inArray(attendanceRecords.courseId, courseIds));

  const performances: SubjectPerformance[] = courseRows.map((course) => {
    const courseAssignmentIds = assignmentRows.filter((a) => a.courseId === course.id).map((a) => a.id);
    const mySubs = submissionRows.filter(
      (s) => s.studentId === studentId && courseAssignmentIds.includes(s.assignmentId),
    );
    const graded = mySubs.filter((s) => s.grade !== null);
    const gradedPercentages = graded.map((s) => {
      const assignment = assignmentRows.find((a) => a.id === s.assignmentId);
      const total = assignment?.totalMarks ?? 100;
      return ((s.grade ?? 0) / total) * 100;
    });
    const avg = gradedPercentages.length
      ? gradedPercentages.reduce((a, b) => a + b, 0) / gradedPercentages.length
      : null;
    const missing = courseAssignmentIds.length - mySubs.length;

    const courseAttendance = myAttendance.filter(
      (a) => a.courseId === course.id && a.studentId === studentId,
    );
    const present = courseAttendance.filter((a) => a.status === "present" || a.status === "late").length;
    const attendanceRate = courseAttendance.length ? percentage(present, courseAttendance.length) : null;

    return {
      subject: course.subject,
      courseTitle: course.title,
      averageGrade: avg,
      submissionsGraded: graded.length,
      submissionsMissing: Math.max(0, missing),
      attendanceRate,
    };
  });

  const totalAttendance = myAttendance.filter((a) => a.studentId === studentId);
  const presentTotal = totalAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const overallAttendance = totalAttendance.length ? percentage(presentTotal, totalAttendance.length) : null;

  return { performances, overallAttendance };
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  let studentId = searchParams.get("studentId");

  if (session.role === "student") studentId = session.sub;
  if (session.role === "parent" && studentId) {
    const link = await db
      .select()
      .from(parentLinks)
      .where(eq(parentLinks.parentId, session.sub));
    if (!link.some((l) => l.studentId === studentId)) {
      return NextResponse.json({ error: "Not permitted" }, { status: 403 });
    }
  }

  if (!studentId) {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }

  const insights = await db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.studentId, studentId))
    .orderBy(desc(aiInsights.generatedAt))
    .limit(20);

  return NextResponse.json({ insights });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  let studentId: string | undefined = body?.studentId;

  if (session.role === "student") studentId = session.sub;
  if (session.role === "parent" && studentId) {
    const link = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
    if (!link.some((l) => l.studentId === studentId)) {
      return NextResponse.json({ error: "Not permitted" }, { status: 403 });
    }
  }
  if (session.role === "student" && body?.studentId && body.studentId !== session.sub) {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  if (!studentId) return NextResponse.json({ error: "studentId is required" }, { status: 400 });

  const studentRows = await db.select().from(users).where(eq(users.id, studentId)).limit(1);
  const student = studentRows[0];
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const { performances, overallAttendance } = await computePerformance(studentId);
  const generated = generateInsightsForStudent(student.name, performances, overallAttendance);

  const inserted = await db
    .insert(aiInsights)
    .values(
      generated.map((g) => ({
        studentId,
        category: g.category,
        title: g.title,
        content: g.content,
        metric: g.metric,
      })),
    )
    .returning();

  return NextResponse.json({ insights: inserted }, { status: 201 });
}
