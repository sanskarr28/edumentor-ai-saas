import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession, hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().max(30).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  gradeLevel: z.string().max(40).optional().nullable(),
  subject: z.string().max(60).optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { currentPassword, newPassword, ...rest } = parsed.data;

  const updateValues: Record<string, unknown> = { ...rest, updatedAt: new Date() };

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
    }
    const rows = await db.select().from(users).where(eq(users.id, session.sub)).limit(1);
    const user = rows[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    updateValues.passwordHash = await hashPassword(newPassword);
  }

  const updated = await db.update(users).set(updateValues).where(eq(users.id, session.sub)).returning();
  const user = updated[0];

  if (rest.name) {
    await setSessionCookie({ sub: user.id, role: user.role, name: user.name, email: user.email });
  }

  const { passwordHash: _passwordHash, ...safe } = user;
  return NextResponse.json({ user: safe });
}
