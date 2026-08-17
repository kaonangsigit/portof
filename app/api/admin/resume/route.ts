import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { readContent, writeContent } from "@/lib/cms-loader";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  if (!validateSession(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let form: FormData;
  try { form = await req.formData(); } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "File required" }, { status: 400 });
  if (file.type !== "application/pdf") return NextResponse.json({ error: "Hanya file PDF yang didukung" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Ukuran file melebihi 10 MB" }, { status: 400 });

  const filePath = path.join(process.cwd(), "public", "resume.pdf");
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  // Update personal.json resumeUrl
  let personal: Record<string, unknown> = {};
  try { personal = await readContent<Record<string, unknown>>("personal"); } catch {}
  personal.resumeUrl = "/resume.pdf";
  await writeContent("personal", personal);

  return NextResponse.json({ success: true, resumeUrl: "/resume.pdf" });
}
