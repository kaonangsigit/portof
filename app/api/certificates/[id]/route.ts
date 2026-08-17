import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Certificate } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (!validateSession(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let certs: Certificate[] = [];
  try {
    certs = await readContent<Certificate[]>("certificates");
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const target = certs.find((c) => c.id === params.id);
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await unlink(path.join(process.cwd(), "public", target.image));
  } catch {
    // file may already be deleted — ignore
  }

  const updated = certs.filter((c) => c.id !== params.id);
  await writeContent("certificates", updated);

  return NextResponse.json({ success: true });
}
