import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { colorForString } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["teacher", "student", "parent"]),
  gradeLevel: z.string().max(40).optional(),
  subject: z.string().max(60).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { name, email, password, role, gradeLevel, subject } = parsed.data;

  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const inserted = await db
    .insert(users)
    .values({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatarColor: colorForString(email),
      gradeLevel: role === "student" ? gradeLevel || "Grade 9" : null,
      subject: role === "teacher" ? subject || "General Studies" : null,
    })
    .returning();

  const user = inserted[0];

  await db.insert(notifications).values({
    userId: user.id,
    title: "Welcome to EduMentor AI 🎉",
    message: "Your account is ready. Explore your dashboard to get started.",
    type: "system",
  });

  await setSessionCookie({ sub: user.id, role: user.role, name: user.name, email: user.email });

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}
