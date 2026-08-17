import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { extractTextFromPDF, parseCVText } from "@/lib/cv-parser";

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 });
  }

  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File PDF diperlukan" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Hanya file PDF yang didukung" },
      { status: 400 }
    );
  }

  if (file.size > MAX_PDF_SIZE) {
    return NextResponse.json(
      { error: "Ukuran file melebihi batas 10 MB" },
      { status: 400 }
    );
  }

  // Extract text from PDF
  let rawText: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    rawText = await extractTextFromPDF(buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengekstrak teks dari PDF";
    return NextResponse.json(
      { parsedData: null, rawText: null, fallback: true, error: msg },
      { status: 422 }
    );
  }

  // Parse with AI
  const result = await parseCVText(rawText);
  return NextResponse.json(result, { status: 200 });
}
