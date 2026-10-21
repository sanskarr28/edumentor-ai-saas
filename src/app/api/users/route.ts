import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { getSession, hashPassword } from "@/lib/auth";
import { colorForString } from "@/lib/utils";

const SAFE_COLUMNS = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  avatarColor: users.avatarColor,
  phone: users.phone,
  bio: users.bio,
  gradeLevel: users.gradeLevel,
  subject: users.subject,
  status: users.status,
  createdAt: users.createdAt,
};

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search");

  const conditions = [];
  if (role) conditions.push(eq(users.role, role as "admin" | "teacher" | "student" | "parent"));
  if (search) {
    conditions.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)));
  }

  const rows = await db
    .select(SAFE_COLUMNS)
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(users.name));

  return NextResponse.json({ users: rows });
}

const createSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["admin", "teacher", "student", "parent"]),
  gradeLevel: z.string().max(40).optional().nullable(),
  subject: z.string().max(60).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Only administrators can create users" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await db.select().from(users).where(eq(users.email, data.email.toLowerCase())).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(data.password);
  const inserted = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      avatarColor: colorForString(data.email),
      gradeLevel: data.role === "student" ? data.gradeLevel || "Grade 9" : null,
      subject: data.role === "teacher" ? data.subject || "General Studies" : null,
      phone: data.phone ?? null,
    })
    .returning(SAFE_COLUMNS);

  await db.insert(notifications).values({
    userId: inserted[0].id,
    title: "Account created",
    message: `An administrator created your ${data.role} account on EduMentor AI.`,
    type: "system",
  });

  return NextResponse.json({ user: inserted[0] }, { status: 201 });
}
