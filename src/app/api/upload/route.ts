import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.fileName || !body?.contentType) {
    return NextResponse.json({ error: "fileName and contentType are required" }, { status: 400 });
  }

  const { fileName, contentType, context = "general" } = body as {
    fileName: string;
    contentType: string;
    context?: string;
  };

  // Sanitize filename
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${context}/${session.sub}/${randomUUID()}-${safeName}`;

  const { uploadUrl, fileUrl } = await getPresignedUploadUrl(key, contentType);
  return NextResponse.json({ uploadUrl, fileUrl, key });
}
