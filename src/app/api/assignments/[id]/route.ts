import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { assignments, courses } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function assertOwnerOrAdmin(assignmentId: string, sub: string, role: string) {
  const rows = await db
    .select({ assignment: assignments, course: courses })
    .from(assignments)
    .innerJoin(courses, eq(courses.id, assignments.courseId))
    .where(eq(assignments.id, assignmentId))
    .limit(1);
  const row = rows[0];
  if (!row) return { error: "Assignment not found", status: 404 } as const;
  if (role !== "admin" && row.course.teacherId !== sub) {
    return { error: "You do not have permission to modify this assignment", status: 403 } as const;
  }
  return { row } as const;
}

const updateSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  description: z.string().max(3000).optional(),
  dueDate: z.string().optional(),
  totalMarks: z.number().int().min(1).max(1000).optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

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
  const { dueDate, ...rest } = parsed.data;
  const updated = await db
    .update(assignments)
    .set({ ...rest, ...(dueDate ? { dueDate: new Date(dueDate) } : {}), updatedAt: new Date() })
    .where(eq(assignments.id, id))
    .returning();

  return NextResponse.json({ assignment: updated[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const check = await assertOwnerOrAdmin(id, session.sub, session.role);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  await db.delete(assignments).where(eq(assignments.id, id));
  return NextResponse.json({ ok: true });
}
