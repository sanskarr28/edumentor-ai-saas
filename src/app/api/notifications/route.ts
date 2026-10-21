import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 30);

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, session.sub))
    .orderBy(desc(notifications.createdAt))
    .limit(Math.min(100, Math.max(1, limit)));

  return NextResponse.json({ notifications: rows });
}
