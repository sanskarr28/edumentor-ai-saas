import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { announcements, courses, enrollments, notifications, parentLinks, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let visibleCourseIds: string[] | null = null;
  if (session.role === "teacher") {
    const rows = await db.select({ id: courses.id }).from(courses).where(eq(courses.teacherId, session.sub));
    visibleCourseIds = rows.map((r) => r.id);
  } else if (session.role === "student") {
    const rows = await db.select({ id: enrollments.courseId }).from(enrollments).where(eq(enrollments.studentId, session.sub));
    visibleCourseIds = rows.map((r) => r.id);
  } else if (session.role === "parent") {
    const links = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
    const studentIds = links.map((l) => l.studentId);
    const rows = studentIds.length
      ? await db.select({ id: enrollments.courseId }).from(enrollments).where(inArray(enrollments.studentId, studentIds))
      : [];
    visibleCourseIds = [...new Set(rows.map((r) => r.id))];
  }

  const rows = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      message: announcements.message,
      audience: announcements.audience,
      priority: announcements.priority,
      courseId: announcements.courseId,
      courseTitle: courses.title,
      authorName: users.name,
      authorId: announcements.authorId,
      createdAt: announcements.createdAt,
    })
    .from(announcements)
    .leftJoin(courses, eq(courses.id, announcements.courseId))
    .leftJoin(users, eq(users.id, announcements.authorId))
    .orderBy(desc(announcements.createdAt));

  const filtered = rows.filter((row) => {
    if (session.role === "admin") return true;
    if (row.audience === "all") {
      if (!row.courseId) return true;
      return visibleCourseIds?.includes(row.courseId) ?? false;
    }
    if (row.audience === session.role) return true;
    if (row.courseId) return visibleCourseIds?.includes(row.courseId) ?? false;
    return false;
  });

  return NextResponse.json({ announcements: filtered });
}

const createSchema = z.object({
  title: z.string().min(2).max(150),
  message: z.string().min(2).max(3000),
  audience: z.enum(["all", "teacher", "student", "parent"]).default("all"),
  courseId: z.string().uuid().optional().nullable(),
  priority: z.enum(["info", "warning", "urgent"]).default("info"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Only faculty or administrators can post announcements" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const inserted = await db
    .insert(announcements)
    .values({
      title: data.title,
      message: data.message,
      audience: data.audience,
      courseId: data.courseId ?? null,
      priority: data.priority,
      authorId: session.sub,
    })
    .returning();

  let targetUserIds: string[] = [];
  if (data.courseId) {
    const roster = await db
      .select({ studentId: enrollments.studentId })
      .from(enrollments)
      .where(eq(enrollments.courseId, data.courseId));
    targetUserIds = roster.map((r) => r.studentId);
  } else {
    const roleFilter = data.audience === "all" ? undefined : eq(users.role, data.audience);
    const rows = await db.select({ id: users.id }).from(users).where(roleFilter);
    targetUserIds = rows.map((r) => r.id).filter((id) => id !== session.sub);
  }

  if (targetUserIds.length > 0) {
    await db.insert(notifications).values(
      targetUserIds.map((userId) => ({
        userId,
        title: `📣 ${data.title}`,
        message: data.message.slice(0, 200),
        type: "announcement",
        link: "/dashboard/announcements",
      })),
    );
  }

  return NextResponse.json({ announcement: inserted[0] }, { status: 201 });
}
