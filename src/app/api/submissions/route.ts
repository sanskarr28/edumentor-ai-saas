import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { assignments, courses, notifications, parentLinks, submissions, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");

  const conditions = [];
  if (assignmentId) conditions.push(eq(submissions.assignmentId, assignmentId));

  if (session.role === "student") conditions.push(eq(submissions.studentId, session.sub));
  if (session.role === "parent") {
    const links = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
    const studentIds = links.map((l) => l.studentId);
    if (studentIds.length === 0) return NextResponse.json({ submissions: [] });
    conditions.push(inArray(submissions.studentId, studentIds));
  }
  if (session.role === "teacher" && assignmentId) {
    const rows = await db
      .select({ course: courses })
      .from(assignments)
      .innerJoin(courses, eq(courses.id, assignments.courseId))
      .where(eq(assignments.id, assignmentId))
      .limit(1);
    if (rows[0] && rows[0].course.teacherId !== session.sub) {
      return NextResponse.json({ error: "Not permitted" }, { status: 403 });
    }
  }

  const rows = await db
    .select({
      id: submissions.id,
      assignmentId: submissions.assignmentId,
      studentId: submissions.studentId,
      studentName: users.name,
      avatarColor: users.avatarColor,
      content: submissions.content,
      status: submissions.status,
      submittedAt: submissions.submittedAt,
      grade: submissions.grade,
      feedback: submissions.feedback,
      aiFeedback: submissions.aiFeedback,
      fileUrl: submissions.fileUrl,
      fileName: submissions.fileName,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.studentId))
    .where(conditions.length ? and(...conditions) : undefined);

  return NextResponse.json({ submissions: rows });
}

const createSchema = z.object({
  assignmentId: z.string().uuid(),
  content: z.string().max(8000).optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Only students can submit assignments" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { assignmentId, content, fileUrl, fileName } = parsed.data;

  // At least one of content or fileUrl must be present
  if (!content?.trim() && !fileUrl) {
    return NextResponse.json({ error: "Please provide a response or attach a file" }, { status: 400 });
  }

  const assignmentRows = await db
    .select({ assignment: assignments, course: courses })
    .from(assignments)
    .innerJoin(courses, eq(courses.id, assignments.courseId))
    .where(eq(assignments.id, assignmentId))
    .limit(1);
  const row = assignmentRows[0];
  if (!row) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  const isLate = new Date() > new Date(row.assignment.dueDate);
  const existing = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, session.sub)))
    .limit(1);

  let result;
  if (existing.length > 0) {
    result = await db
      .update(submissions)
      .set({ content, status: isLate ? "late" : "submitted", submittedAt: new Date(), updatedAt: new Date(), fileUrl, fileName })
      .where(eq(submissions.id, existing[0].id))
      .returning();
  } else {
    result = await db
      .insert(submissions)
      .values({
        assignmentId,
        studentId: session.sub,
        content,
        status: isLate ? "late" : "submitted",
        submittedAt: new Date(),
        fileUrl,
        fileName,
      })
      .returning();
  }

  if (row.course.teacherId) {
    await db.insert(notifications).values({
      userId: row.course.teacherId,
      title: "New submission received",
      message: `${session.name} submitted "${row.assignment.title}".`,
      type: "assignment",
      link: "/dashboard/assignments",
    });
  }

  return NextResponse.json({ submission: result[0] }, { status: 201 });
}
