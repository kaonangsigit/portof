import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { readContent, writeContent } from "@/lib/cms-loader";
import type { ParsedCVData, WorkExperience, Education, SkillGroup, CVPersonalInfo } from "@/lib/cv-parser";

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

interface PersonalInfoFile {
  name?: string;
  title?: string;
  subtitle?: string;
  bio?: string;
  email?: string;
  location?: string;
  availability?: string;
  skills?: string[];
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { parsedData?: Partial<ParsedCVData>; mergeStrategy?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { parsedData, mergeStrategy } = body;

  if (!parsedData || typeof parsedData !== "object") {
    return NextResponse.json({ error: "parsedData is required" }, { status: 400 });
  }

  const hasWork = Array.isArray(parsedData.work_experience) && parsedData.work_experience.length > 0;
  const hasEdu = Array.isArray(parsedData.education) && parsedData.education.length > 0;
  const hasSkills = Array.isArray(parsedData.skills) && parsedData.skills.length > 0;
  const hasPersonal = parsedData.personal_info && typeof parsedData.personal_info === "object";

  if (!hasWork && !hasEdu && !hasSkills && !hasPersonal) {
    return NextResponse.json({ error: "At least one data field must be non-empty" }, { status: 400 });
  }

  // Validate WorkExperience
  if (hasWork) {
    for (const item of parsedData.work_experience!) {
      if (!item.company?.trim() || !item.role?.trim()) {
        return NextResponse.json(
          { error: `Work experience item requires non-empty company and role` },
          { status: 400 }
        );
      }
    }
  }

  // Validate Education
  if (hasEdu) {
    for (const item of parsedData.education!) {
      if (!item.institution?.trim() || !item.degree?.trim()) {
        return NextResponse.json(
          { error: `Education item requires non-empty institution and degree` },
          { status: 400 }
        );
      }
    }
  }

  const updatedFiles: string[] = [];
  const isReplace = mergeStrategy === "replace";

  try {
    // Work experience
    if (hasWork) {
      if (isReplace) {
        await writeContent("experience", parsedData.work_experience);
      } else {
        let existing: WorkExperience[] = [];
        try { existing = await readContent<WorkExperience[]>("experience"); } catch {}
        await writeContent("experience", [...existing, ...parsedData.work_experience!]);
      }
      updatedFiles.push("experience.json");
    }

    // Education
    if (hasEdu) {
      if (isReplace) {
        await writeContent("education", parsedData.education);
      } else {
        let existing: Education[] = [];
        try { existing = await readContent<Education[]>("education"); } catch {}
        await writeContent("education", [...existing, ...parsedData.education!]);
      }
      updatedFiles.push("education.json");
    }

    // Skills
    if (hasSkills) {
      if (isReplace) {
        await writeContent("skills", parsedData.skills);
      } else {
        let existing: SkillGroup[] = [];
        try { existing = await readContent<SkillGroup[]>("skills"); } catch {}
        const merged = [...existing];
        for (const newGroup of parsedData.skills!) {
          const idx = merged.findIndex(g => g.category === newGroup.category);
          if (idx >= 0) {
            const existingNames = new Set(merged[idx].items.map(i => i.name));
            merged[idx] = {
              ...merged[idx],
              items: [...merged[idx].items, ...newGroup.items.filter(i => !existingNames.has(i.name))],
            };
          } else {
            merged.push(newGroup);
          }
        }
        await writeContent("skills", merged);
      }
      updatedFiles.push("skills.json");
    }

    // Personal info (always partial merge)
    if (hasPersonal) {
      let existing: PersonalInfoFile = {};
      try { existing = await readContent<PersonalInfoFile>("personal"); } catch {}
      const info = parsedData.personal_info as CVPersonalInfo;
      const updated: PersonalInfoFile = { ...existing };
      if (info.name?.trim()) updated.name = info.name.trim();
      if (info.title?.trim()) updated.title = info.title.trim();
      if (info.email?.trim()) updated.email = info.email.trim();
      if (info.location?.trim()) updated.location = info.location.trim();
      if (info.phone?.trim()) (updated as Record<string, unknown>).phone = info.phone.trim();
      await writeContent("personal", updated);
      updatedFiles.push("personal.json");
    }

    return NextResponse.json({ success: true, updatedFiles });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Gagal menyimpan file: ${msg}` }, { status: 500 });
  }
}
