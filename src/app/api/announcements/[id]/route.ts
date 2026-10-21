import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
  const item = rows[0];
  if (!item) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  if (session.role !== "admin" && item.authorId !== session.sub) {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  await db.delete(announcements).where(eq(announcements.id, id));
  return NextResponse.json({ ok: true });
}
