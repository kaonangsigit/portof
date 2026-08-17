// lib/cv-parser.ts
// Server-side only — never import from client components

// --- Types ---

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or "present"
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface SkillGroup {
  category: string;
  items: { name: string; level: number }[];
}

export interface CVPersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  phone?: string;
}

export interface ParsedCVData {
  work_experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  personal_info: CVPersonalInfo;
}

// --- PDF Extraction ---

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  let text = "";

  // Strategy 1: pdf-parse v2 CJS via absolute path using process.cwd()
  try {
    const nodePath = await import("path");
    const { createRequire } = await import("module");
    const cjsPath = nodePath.join(
      process.cwd(),
      "node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs"
    );
    // createRequire needs a file URL or path to the caller
    const req = createRequire(cjsPath + "/../");
    const cjsMod = req("./index.cjs");
    const PDFParseClass = cjsMod?.PDFParse;
    if (PDFParseClass && typeof PDFParseClass === "function") {
      const parser = new PDFParseClass({ data: buffer });
      const result = await parser.getText();
      text = (result?.text ?? "").trim();
    }
  } catch (e1) {
    // strategy 1 failed
  }

  // Strategy 2: dynamic import, try all possible export shapes
  if (!text) {
    try {
      const mod = await import("pdf-parse");
      const m = mod as any;
      // v2 exports { PDFParse } at top level
      const Cls = m.PDFParse ?? m.default?.PDFParse;
      if (Cls && typeof Cls === "function") {
        const parser = new Cls({ data: buffer });
        const result = await parser.getText();
        text = (result?.text ?? "").trim();
      } else {
        // try as function (v1 style)
        const fn = typeof m.default === "function" ? m.default : typeof m === "function" ? m : null;
        if (fn) {
          const result = await fn(buffer);
          text = (result?.text ?? "").trim();
        }
      }
    } catch {
      // strategy 2 failed
    }
  }

  // Strategy 3: Node built-in require on the CJS file path
  if (!text) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nodePath = require("path");
      const cjsPath = nodePath.join(
        process.cwd(),
        "node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs"
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const cjsMod = require(cjsPath);
      const Cls = cjsMod?.PDFParse;
      if (Cls && typeof Cls === "function") {
        const parser = new Cls({ data: buffer });
        const result = await parser.getText();
        text = (result?.text ?? "").trim();
      }
    } catch {
      // strategy 3 failed
    }
  }

  if (!text || text.trim().length === 0) {
    throw new Error(
      "PDF tidak mengandung teks yang dapat diekstrak. Pastikan PDF bukan hasil scan/foto dan coba lagi."
    );
  }

  return text;
}

// --- AI Prompt ---

const CV_PROMPT = `You are a CV/Resume parser. Parse the CV text below and return ONLY valid JSON with this exact schema. Do not include markdown, explanation, or any text outside the JSON object.

Schema:
{
  "work_experience": [
    {
      "id": "uuid-here",
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or present",
      "description": "Brief description of role and responsibilities",
      "achievements": ["Achievement 1", "Achievement 2"],
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "education": [
    {
      "id": "uuid-here",
      "institution": "University Name",
      "degree": "Bachelor of Computer Science",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "Brief description",
      "achievements": ["GPA: 3.8", "Dean's List"]
    }
  ],
  "skills": [
    {
      "category": "Frontend",
      "items": [{ "name": "React", "level": 85 }]
    }
  ],
  "personal_info": {
    "name": "Full Name",
    "title": "Professional Title / Headline",
    "email": "email@example.com",
    "location": "City, Country",
    "phone": "+62xxx (optional)"
  }
}

Rules:
- Generate a unique UUID for each work_experience and education item
- If a field is not found in the CV, use empty string "" or empty array []
- Skill level should be estimated (0-100) based on years of experience and prominence
- Group skills by logical categories (Frontend, Backend, Database, DevOps, etc.)
- For dates, use YYYY-MM format; if only year is given, use YYYY-01
- For current jobs, use "present" as endDate

CV Text to parse:
`;

// --- Validation ---

export function validateParsedCV(jsonString: string): ParsedCVData {
  // Strip markdown code fences if AI returned them
  const cleaned = jsonString
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  const parsed = JSON.parse(cleaned); // throws SyntaxError if invalid

  if (!Array.isArray(parsed.work_experience)) {
    throw new Error("Missing or invalid work_experience array");
  }
  if (!Array.isArray(parsed.education)) {
    throw new Error("Missing or invalid education array");
  }
  if (!Array.isArray(parsed.skills)) {
    throw new Error("Missing or invalid skills array");
  }
  if (
    typeof parsed.personal_info !== "object" ||
    parsed.personal_info === null
  ) {
    throw new Error("Missing or invalid personal_info object");
  }

  return parsed as ParsedCVData;
}

// --- AI Parsers ---

export async function parseWithOpenAI(
  rawText: string,
  apiKey: string
): Promise<ParsedCVData> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: `${CV_PROMPT}${rawText}` }],
      temperature: 0,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI API error ${res.status}: ${err.slice(0, 200)}`);
  }

  const json = await res.json();
  const content: string = json.choices?.[0]?.message?.content ?? "";
  return validateParsedCV(content);
}

export async function parseWithGemini(
  rawText: string,
  apiKey: string
): Promise<ParsedCVData> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${CV_PROMPT}${rawText}` }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 4000 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${err.slice(0, 200)}`);
  }

  const json = await res.json();
  const content: string =
    json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return validateParsedCV(content);
}

// --- Main Entry Point ---

export type CVParseResult =
  | { parsedData: ParsedCVData; rawText: string; fallback: false }
  | { parsedData: null; rawText: string; fallback: true; error?: string };

export async function parseCVText(rawText: string): Promise<CVParseResult> {
  // Try OpenAI first
  try {
    const { getApiKey } = await import("./api-key-store");
    const openaiKey = await getApiKey("openai_api_key");
    if (openaiKey) {
      try {
        const parsedData = await parseWithOpenAI(rawText, openaiKey);
        return { parsedData, rawText, fallback: false };
      } catch (e) {
        console.warn("[CV Parser] OpenAI failed, trying Gemini:", e);
      }
    }

    // Fallback: Gemini
    const geminiKey = await getApiKey("gemini_api_key");
    if (geminiKey) {
      try {
        const parsedData = await parseWithGemini(rawText, geminiKey);
        return { parsedData, rawText, fallback: false };
      } catch (e) {
        console.warn("[CV Parser] Gemini failed:", e);
        return {
          parsedData: null,
          rawText,
          fallback: true,
          error: e instanceof Error ? e.message : "AI parsing gagal",
        };
      }
    }
  } catch (e) {
    console.error("[CV Parser] Error:", e);
  }

  // No AI keys available
  return {
    parsedData: null,
    rawText,
    fallback: true,
    error:
      "Tidak ada AI API key yang dikonfigurasi. Tambahkan OpenAI atau Gemini key di Settings.",
  };
}
