import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function assertOwnerOrAdmin(courseId: string, sub: string, role: string) {
  const rows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const course = rows[0];
  if (!course) return { error: "Course not found", status: 404 } as const;
  if (role !== "admin" && course.teacherId !== sub) {
    return { error: "You do not have permission to modify this course", status: 403 } as const;
  }
  return { course } as const;
}

const updateSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  subject: z.string().min(2).max(60).optional(),
  description: z.string().max(2000).optional(),
  gradeLevel: z.string().max(40).optional(),
  schedule: z.string().max(80).optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  teacherId: z.string().uuid().optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json({ course: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const check = await assertOwnerOrAdmin(id, session.sub, session.role);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const updated = await db
    .update(courses)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();

  return NextResponse.json({ course: updated[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const check = await assertOwnerOrAdmin(id, session.sub, session.role);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  await db.delete(courses).where(eq(courses.id, id));
  return NextResponse.json({ ok: true });
}
