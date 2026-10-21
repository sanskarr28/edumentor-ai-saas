import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { attendanceRecords, courses, notifications, parentLinks, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const date = searchParams.get("date");

  const conditions = [];
  if (courseId) conditions.push(eq(attendanceRecords.courseId, courseId));
  if (date) conditions.push(eq(attendanceRecords.date, date));

  if (session.role === "teacher") {
    const myCourses = await db.select({ id: courses.id }).from(courses).where(eq(courses.teacherId, session.sub));
    const ids = myCourses.map((c) => c.id);
    if (ids.length === 0) return NextResponse.json({ records: [] });
    conditions.push(inArray(attendanceRecords.courseId, ids));
  }
  if (session.role === "student") conditions.push(eq(attendanceRecords.studentId, session.sub));
  if (session.role === "parent") {
    const links = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
    const studentIds = links.map((l) => l.studentId);
    if (studentIds.length === 0) return NextResponse.json({ records: [] });
    conditions.push(inArray(attendanceRecords.studentId, studentIds));
  }

  const rows = await db
    .select({
      id: attendanceRecords.id,
      courseId: attendanceRecords.courseId,
      studentId: attendanceRecords.studentId,
      studentName: users.name,
      avatarColor: users.avatarColor,
      date: attendanceRecords.date,
      status: attendanceRecords.status,
      note: attendanceRecords.note,
      courseTitle: courses.title,
    })
    .from(attendanceRecords)
    .innerJoin(users, eq(users.id, attendanceRecords.studentId))
    .innerJoin(courses, eq(courses.id, attendanceRecords.courseId))
    .where(conditions.length ? and(...conditions) : undefined);

  return NextResponse.json({ records: rows });
}

const entrySchema = z.object({ studentId: z.string().uuid(), status: z.enum(["present", "absent", "late", "excused"]), note: z.string().max(300).optional() });
const createSchema = z.object({
  courseId: z.string().uuid(),
  date: z.string(),
  entries: z.array(entrySchema).min(1),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Only faculty can record attendance" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { courseId, date, entries } = parsed.data;

  const courseRows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const course = courseRows[0];
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (session.role === "teacher" && course.teacherId !== session.sub) {
    return NextResponse.json({ error: "You can only manage attendance for your own courses" }, { status: 403 });
  }

  const results = [];
  for (const entry of entries) {
    const existing = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.courseId, courseId),
          eq(attendanceRecords.studentId, entry.studentId),
          eq(attendanceRecords.date, date),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(attendanceRecords)
        .set({ status: entry.status, note: entry.note ?? null, markedById: session.sub })
        .where(eq(attendanceRecords.id, existing[0].id))
        .returning();
      results.push(updated[0]);
    } else {
      const inserted = await db
        .insert(attendanceRecords)
        .values({
          courseId,
          studentId: entry.studentId,
          date,
          status: entry.status,
          note: entry.note ?? null,
          markedById: session.sub,
        })
        .returning();
      results.push(inserted[0]);
    }

    if (entry.status === "absent") {
      await db.insert(notifications).values({
        userId: entry.studentId,
        title: `Marked absent in ${course.title}`,
        message: `You were marked absent on ${date}. Please follow up with your instructor if this is incorrect.`,
        type: "attendance",
        link: "/dashboard/attendance",
      });
    }
  }

  return NextResponse.json({ records: results }, { status: 201 });
}
