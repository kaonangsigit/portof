import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Project } from "@/lib/admin-auth";
import { randomUUID } from "crypto";

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const projects = await readContent<Project[]>("projects");
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.title || !body.description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  const newProject: Project = {
    id: randomUUID(),
    title: body.title as string,
    description: body.description as string,
    longDescription: body.longDescription as string | undefined,
    technologies: Array.isArray(body.technologies)
      ? (body.technologies as string[])
      : typeof body.technologies === "string"
      ? body.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [],
    githubUrl: body.githubUrl as string | undefined,
    liveUrl: body.liveUrl as string | undefined,
    image: body.image as string | undefined,
    featured: Boolean(body.featured),
    category: (body.category as string) ?? "Other",
  };

  let projects: Project[] = [];
  try {
    projects = await readContent<Project[]>("projects");
  } catch { /* start fresh */ }
  projects.push(newProject);
  await writeContent("projects", projects);

  return NextResponse.json(newProject, { status: 201 });
}
