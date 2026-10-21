import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession, hashPassword } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  role: z.enum(["admin", "teacher", "student", "parent"]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  gradeLevel: z.string().max(40).optional().nullable(),
  subject: z.string().max(60).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  password: z.string().min(6).max(100).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Only administrators can update users" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { password, ...rest } = parsed.data;
  const updateValues: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (password) updateValues.passwordHash = await hashPassword(password);

  const updated = await db.update(users).set(updateValues).where(eq(users.id, id)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    status: users.status,
    gradeLevel: users.gradeLevel,
    subject: users.subject,
    phone: users.phone,
    avatarColor: users.avatarColor,
  });

  if (updated.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user: updated[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Only administrators can delete users" }, { status: 403 });
  }
  if (session.sub === id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}
