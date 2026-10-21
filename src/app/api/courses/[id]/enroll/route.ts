import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, enrollments, notifications, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

const bodySchema = z.object({ studentId: z.string().uuid().optional() });

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roster = await db
    .select({
      id: enrollments.id,
      status: enrollments.status,
      enrolledAt: enrollments.enrolledAt,
      studentId: users.id,
      studentName: users.name,
      studentEmail: users.email,
      avatarColor: users.avatarColor,
    })
    .from(enrollments)
    .innerJoin(users, eq(users.id, enrollments.studentId))
    .where(eq(enrollments.courseId, id));

  return NextResponse.json({ roster });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  const studentId = parsed.success && parsed.data.studentId ? parsed.data.studentId : session.sub;

  if (session.role === "student" && studentId !== session.sub) {
    return NextResponse.json({ error: "Students may only enroll themselves" }, { status: 403 });
  }
  if (session.role !== "student" && session.role !== "teacher" && session.role !== "admin") {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  const courseRows = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!courseRows[0]) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const existing = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.courseId, id), eq(enrollments.studentId, studentId)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
  }

  const inserted = await db
    .insert(enrollments)
    .values({ courseId: id, studentId })
    .returning();

  await db.insert(notifications).values({
    userId: studentId,
    title: "Course enrollment confirmed",
    message: `You are now enrolled in ${courseRows[0].title}.`,
    type: "system",
    link: "/dashboard/courses",
  });

  return NextResponse.json({ enrollment: inserted[0] }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId") || session.sub;

  if (session.role === "student" && studentId !== session.sub) {
    return NextResponse.json({ error: "Students may only unenroll themselves" }, { status: 403 });
  }

  await db.delete(enrollments).where(and(eq(enrollments.courseId, id), eq(enrollments.studentId, studentId)));
  return NextResponse.json({ ok: true });
}
