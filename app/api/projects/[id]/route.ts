import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Project } from "@/lib/admin-auth";

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<Project>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const projects = await readContent<Project[]>("projects");
  const idx = projects.findIndex((p) => p.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  projects[idx] = { ...projects[idx], ...body, id: params.id };
  await writeContent("projects", projects);
  return NextResponse.json(projects[idx]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await readContent<Project[]>("projects");
  const updated = projects.filter((p) => p.id !== params.id);
  if (updated.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeContent("projects", updated);
  return NextResponse.json({ success: true });
}
