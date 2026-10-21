import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { courses, enrollments, parentLinks, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { colorForString } from "@/lib/utils";

async function enrichCourses(courseRows: (typeof courses.$inferSelect)[]) {
  if (courseRows.length === 0) return [];
  const courseIds = courseRows.map((c) => c.id);
  const teacherIds = [...new Set(courseRows.map((c) => c.teacherId).filter(Boolean))] as string[];

  const [teachers, allEnrollments] = await Promise.all([
    teacherIds.length
      ? db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, teacherIds))
      : Promise.resolve([]),
    db.select().from(enrollments).where(inArray(enrollments.courseId, courseIds)),
  ]);

  const teacherMap = new Map(teachers.map((t) => [t.id, t.name]));
  const countMap = new Map<string, number>();
  for (const e of allEnrollments) {
    if (e.status !== "active") continue;
    countMap.set(e.courseId, (countMap.get(e.courseId) ?? 0) + 1);
  }

  return courseRows.map((c) => ({
    ...c,
    teacherName: c.teacherId ? teacherMap.get(c.teacherId) ?? "Unassigned" : "Unassigned",
    enrolledCount: countMap.get(c.id) ?? 0,
  }));
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const browse = searchParams.get("browse") === "1";

  let courseRows: (typeof courses.$inferSelect)[] = [];

  if (browse || session.role === "admin") {
    courseRows = await db.select().from(courses);
  } else if (session.role === "teacher") {
    courseRows = await db.select().from(courses).where(eq(courses.teacherId, session.sub));
  } else if (session.role === "student") {
    const myEnrollments = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.studentId, session.sub));
    const ids = myEnrollments.map((e) => e.courseId);
    courseRows = ids.length ? await db.select().from(courses).where(inArray(courses.id, ids)) : [];
  } else if (session.role === "parent") {
    const links = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
    const studentIds = links.map((l) => l.studentId);
    if (studentIds.length) {
      const childEnrollments = await db
        .select({ courseId: enrollments.courseId })
        .from(enrollments)
        .where(inArray(enrollments.studentId, studentIds));
      const ids = [...new Set(childEnrollments.map((e) => e.courseId))];
      courseRows = ids.length ? await db.select().from(courses).where(inArray(courses.id, ids)) : [];
    }
  }

  const enriched = await enrichCourses(courseRows);
  let enrolledIds: string[] = [];
  if (session.role === "student") {
    const myEnrollments = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.studentId, session.sub));
    enrolledIds = myEnrollments.map((e) => e.courseId);
  }

  return NextResponse.json({
    courses: enriched.sort((a, b) => a.title.localeCompare(b.title)),
    enrolledCourseIds: enrolledIds,
  });
}

const createSchema = z.object({
  title: z.string().min(2).max(120),
  subject: z.string().min(2).max(60),
  description: z.string().max(2000).optional(),
  gradeLevel: z.string().max(40).optional(),
  schedule: z.string().max(80).optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  teacherId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Only faculty or administrators can create courses" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;
  const teacherId = session.role === "teacher" ? session.sub : data.teacherId ?? null;

  const inserted = await db
    .insert(courses)
    .values({
      title: data.title,
      subject: data.subject,
      description: data.description ?? "",
      gradeLevel: data.gradeLevel || "Grade 9",
      schedule: data.schedule || "Flexible",
      capacity: data.capacity ?? 30,
      teacherId,
      color: colorForString(data.title + data.subject),
    })
    .returning();

  const [enriched] = await enrichCourses(inserted);
  return NextResponse.json({ course: enriched }, { status: 201 });
}
