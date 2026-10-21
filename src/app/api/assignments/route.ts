import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { assignments, courses, enrollments, notifications, parentLinks, submissions } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function courseIdsForTeacher(teacherId: string) {
  const rows = await db.select({ id: courses.id }).from(courses).where(eq(courses.teacherId, teacherId));
  return rows.map((r) => r.id);
}

async function courseIdsForStudent(studentId: string) {
  const rows = await db
    .select({ id: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId));
  return rows.map((r) => r.id);
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  let scopeCourseIds: string[] | null = null;
  if (session.role === "teacher") scopeCourseIds = await courseIdsForTeacher(session.sub);
  if (session.role === "student") scopeCourseIds = await courseIdsForStudent(session.sub);
  if (session.role === "parent") {
    const links = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
    const studentIds = links.map((l) => l.studentId);
    const sets = await Promise.all(studentIds.map((id) => courseIdsForStudent(id)));
    scopeCourseIds = [...new Set(sets.flat())];
  }

  const conditions = [];
  if (courseId) conditions.push(eq(assignments.courseId, courseId));
  if (scopeCourseIds) {
    if (scopeCourseIds.length === 0) return NextResponse.json({ assignments: [] });
    conditions.push(inArray(assignments.courseId, scopeCourseIds));
  }

  const rows = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      description: assignments.description,
      dueDate: assignments.dueDate,
      totalMarks: assignments.totalMarks,
      fileUrl: assignments.fileUrl,
      fileName: assignments.fileName,
      createdAt: assignments.createdAt,
      courseId: assignments.courseId,
      courseTitle: courses.title,
      courseColor: courses.color,
      courseSubject: courses.subject,
    })
    .from(assignments)
    .innerJoin(courses, eq(courses.id, assignments.courseId))
    .where(conditions.length ? and(...conditions) : undefined);

  const assignmentIds = rows.map((r) => r.id);
  const allSubmissions = assignmentIds.length
    ? await db.select().from(submissions).where(inArray(submissions.assignmentId, assignmentIds))
    : [];

  const enriched = rows.map((row) => {
    const subs = allSubmissions.filter((s) => s.assignmentId === row.id);
    const graded = subs.filter((s) => s.status === "graded").length;
    const submitted = subs.filter((s) => s.status === "submitted" || s.status === "graded" || s.status === "late").length;
    const mySubmission =
      session.role === "student" ? subs.find((s) => s.studentId === session.sub) ?? null : null;
    return {
      ...row,
      stats: { total: subs.length, graded, submitted },
      mySubmission,
    };
  });

  return NextResponse.json({ assignments: enriched.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate)) });
}

const createSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2).max(150),
  description: z.string().max(3000).optional(),
  dueDate: z.string(),
  totalMarks: z.number().int().min(1).max(1000).optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Only faculty or administrators can create assignments" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const courseRows = await db.select().from(courses).where(eq(courses.id, data.courseId)).limit(1);
  const course = courseRows[0];
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (session.role === "teacher" && course.teacherId !== session.sub) {
    return NextResponse.json({ error: "You can only add assignments to your own courses" }, { status: 403 });
  }

  const inserted = await db
    .insert(assignments)
    .values({
      courseId: data.courseId,
      title: data.title,
      description: data.description ?? "",
      dueDate: new Date(data.dueDate),
      totalMarks: data.totalMarks ?? 100,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
    })
    .returning();

  const roster = await db
    .select({ studentId: enrollments.studentId })
    .from(enrollments)
    .where(and(eq(enrollments.courseId, data.courseId), eq(enrollments.status, "active")));

  if (roster.length > 0) {
    await db.insert(notifications).values(
      roster.map((r) => ({
        userId: r.studentId,
        title: `New assignment: ${data.title}`,
        message: `${course.title} has a new assignment due ${new Date(data.dueDate).toLocaleDateString()}.`,
        type: "assignment",
        link: "/dashboard/assignments",
      })),
    );
  }

  return NextResponse.json({ assignment: { ...inserted[0], courseTitle: course.title, courseColor: course.color, courseSubject: course.subject, stats: { total: 0, graded: 0, submitted: 0 }, mySubmission: null } }, { status: 201 });
}
