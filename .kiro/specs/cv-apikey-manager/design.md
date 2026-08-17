# Design Document: CV Upload & API Key Manager

## Overview

Dua fitur baru ditambahkan ke Admin Panel (`/admin`) portofolio Next.js 14: API Key Manager (tab "Settings") dan CV Upload & AI Parsing (tab "Import CV"). Keduanya diintegrasikan ke `AdminNav` yang sudah ada, di-lazy load via `next/dynamic`, dan menggunakan session cookie `admin_session` yang sudah ada sebagai mekanisme autentikasi.

---

## Architecture

### Layer Diagram

```
Browser (Admin Panel)
  └─ app/admin/page.tsx            (lazy-loads components)
       ├─ components/admin/AdminNav.tsx     (tab navigation)
       ├─ components/admin/ApiKeyManager.tsx
       └─ components/admin/CVUploader.tsx

Next.js API Routes (App Router, server-side)
  ├─ app/api/admin/api-keys/route.ts       (GET list, PUT save single key)
  ├─ app/api/admin/api-keys/test/route.ts  (GET ?key=xxx — connection test)
  ├─ app/api/admin/cv-parse/route.ts       (POST multipart — extract + AI parse)
  └─ app/api/admin/cv-save/route.ts        (POST — save parsed data to JSON files)

Server-side Libraries
  ├─ lib/api-key-store.ts    (AES-256-GCM encrypt/decrypt, CRUD)
  └─ lib/cv-parser.ts        (PDF extraction, AI prompt, response validation)

Content Store (filesystem)
  ├─ content/api-keys.json   (encrypted API key entries)
  ├─ content/experience.json (work experience — already exists)
  ├─ content/skills.json     (skills — already exists)
  ├─ content/personal.json   (personal info — already exists)
  └─ content/education.json  (new file, initially [])
```

### Auth Flow

Every API route under `/api/admin/` reads the `admin_session` cookie from the request headers and calls the existing `validateSession()` from `lib/admin-auth.ts`. If invalid, returns 401 immediately before any business logic runs.

---

## Feature 1: API Key Manager

### Data Model

**`content/api-keys.json`** — array of `EncryptedEntry`:

```typescript
interface EncryptedEntry {
  id: ApiKeyId;        // key identifier
  ciphertext: string;  // AES-256-GCM encrypted value, base64
  iv: string;          // 16-byte random IV per entry, base64
}

type ApiKeyId =
  | "github_token"
  | "google_analytics_id"
  | "openai_api_key"
  | "gemini_api_key"
  | "resend_api_key"
  | "sendgrid_api_key"
  | "custom_webhook_url";

const API_KEY_DEFINITIONS: Record<ApiKeyId, { label: string; placeholder: string }> = {
  github_token:        { label: "GitHub Token",         placeholder: "ghp_..." },
  google_analytics_id: { label: "Google Analytics ID",  placeholder: "G-XXXXXXXXXX" },
  openai_api_key:      { label: "OpenAI API Key",        placeholder: "sk-..." },
  gemini_api_key:      { label: "Gemini API Key",        placeholder: "AIza..." },
  resend_api_key:      { label: "Resend API Key",        placeholder: "re_..." },
  sendgrid_api_key:    { label: "SendGrid API Key",      placeholder: "SG...." },
  custom_webhook_url:  { label: "Custom Webhook URL",    placeholder: "https://..." },
};
```

### `lib/api-key-store.ts`

```typescript
import crypto from "crypto";
import fsPromises from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "content", "api-keys.json");

function getDerivedKey(): Buffer {
  const masterKey = process.env.MASTER_KEY;
  if (!masterKey) throw new Error("MASTER_KEY environment variable is not configured");
  return crypto.scryptSync(masterKey, "salt", 32);
}

export async function readApiKeys(): Promise<EncryptedEntry[]> {
  try {
    const raw = await fsPromises.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as EncryptedEntry[];
  } catch {
    return [];
  }
}

export async function writeApiKey(id: ApiKeyId, value: string): Promise<void> {
  const key = getDerivedKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // store ciphertext as authTag(16 bytes) + encrypted, all base64
  const ciphertext = Buffer.concat([authTag, encrypted]).toString("base64");
  const entries = await readApiKeys();
  const idx = entries.findIndex((e) => e.id === id);
  const entry: EncryptedEntry = { id, ciphertext, iv: iv.toString("base64") };
  if (idx >= 0) entries[idx] = entry;
  else entries.push(entry);
  await fsPromises.writeFile(STORE_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

export async function getApiKey(id: ApiKeyId): Promise<string | null> {
  const entries = await readApiKeys();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return null;
  const key = getDerivedKey();
  const iv = Buffer.from(entry.iv, "base64");
  const ciphertextBuf = Buffer.from(entry.ciphertext, "base64");
  const authTag = ciphertextBuf.slice(0, 16);
  const encrypted = ciphertextBuf.slice(16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

export async function deleteApiKey(id: ApiKeyId): Promise<void> {
  const entries = await readApiKeys();
  const filtered = entries.filter((e) => e.id !== id);
  await fsPromises.writeFile(STORE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
}
```

**Encryption details:**
- Algorithm: `aes-256-gcm`
- Key derivation: `crypto.scryptSync(MASTER_KEY, "salt", 32)` → 32-byte key
- IV: 16 random bytes per `writeApiKey()` call (stored as base64)
- Auth tag: 16 bytes, prepended to ciphertext before base64 encoding
- All values stored as base64 strings in JSON

### API Routes

#### `GET /api/admin/api-keys`

Returns a masked view of all configured keys.

```typescript
// Response shape
interface ApiKeyListResponse {
  keys: {
    id: ApiKeyId;
    label: string;
    configured: boolean; // true if entry exists in store
  }[];
}
```

Returns 401 if session invalid, 500 if MASTER_KEY missing.

#### `PUT /api/admin/api-keys`

Saves or updates a single API key.

```typescript
// Request body
interface SaveApiKeyRequest {
  id: ApiKeyId;
  value: string; // plaintext value to encrypt and store
}

// Response
interface SaveApiKeyResponse {
  success: boolean;
  id: ApiKeyId;
}
```

Returns 401 if session invalid, 400 if `id` or `value` missing, 500 if MASTER_KEY missing or write fails.

#### `GET /api/admin/api-keys/test?key={keyId}`

Tests the connection for a specific API key.

```typescript
interface TestApiKeyResponse {
  success: boolean;
  message: string; // e.g. "Connected as github_username" or error description
}
```

**Connection test logic per key:**

| Key ID | Test Method |
|---|---|
| `github_token` | `GET https://api.github.com/user` with `Authorization: Bearer {token}`, return login on success |
| `google_analytics_id` | Regex `^G-[A-Z0-9]+$` — no network call |
| `openai_api_key` | `GET https://api.openai.com/v1/models` with `Authorization: Bearer {key}` |
| `gemini_api_key` | `GET https://generativelanguage.googleapis.com/v1/models?key={key}` |
| `resend_api_key` | `GET https://api.resend.com/domains` with `Authorization: Bearer {key}` |
| `sendgrid_api_key` | `GET https://api.sendgrid.com/v3/user/profile` with `Authorization: Bearer {key}` |
| `custom_webhook_url` | `new URL(value)` constructor — no network call, validates URL format |

Returns 401 if session invalid, 400 if key not found in store, 200 with `success: false` if connection fails.

### `components/admin/ApiKeyManager.tsx`

**Component state:**

```typescript
interface FieldState {
  revealed: boolean;
  currentValue: string;    // empty string when masked
  dirty: boolean;          // true when value has been edited
  saving: boolean;
  testing: boolean;
  saveStatus: "idle" | "success" | "error";
  saveMessage: string;
  testStatus: "idle" | "success" | "error";
  testMessage: string;
}

type FieldStates = Record<ApiKeyId, FieldState>;
```

**Key behavior:**
1. On mount: `GET /api/admin/api-keys` to get `configured` status per key; initialize `FieldState` with `currentValue: ""` and `revealed: false` for all keys.
2. Reveal: `GET /api/admin/api-keys?reveal={id}` — calls a reveal variant (or we add a dedicated endpoint `GET /api/admin/api-keys/{id}` that returns the decrypted value). Set `revealed: true`, populate `currentValue`.
3. Hide: set `revealed: false`, clear `currentValue` back to `""`.
4. Save: `PUT /api/admin/api-keys` with `{ id, value: currentValue }`. On success: set `dirty: false`, `saveStatus: "success"`, auto-hide after 3s.
5. Test: `GET /api/admin/api-keys/test?key={id}`. Display result inline.

**Note on reveal endpoint:** `GET /api/admin/api-keys` returns only masked status. To reveal a single key, the `PUT` route handler can also accept a `GET` with query param `?reveal={id}`, returning `{ id, value: string }`. This avoids exposing all decrypted keys at once.

**Revised API for reveal:**

```
GET /api/admin/api-keys?reveal={keyId}
Response: { id: ApiKeyId, value: string }
```

Returns 404 if key not configured, 401 if session invalid.

---

## Feature 2: CV Upload & AI Parsing

### Data Models

```typescript
// Matches requirement schema exactly
interface WorkExperience {
  id: string;                        // uuid
  company: string;                   // required for save
  role: string;                      // required for save
  startDate: string;                 // YYYY-MM
  endDate: string;                   // YYYY-MM or "present"
  description: string;
  achievements: string[];
  technologies: string[];
}

interface Education {
  id: string;                        // uuid
  institution: string;               // required for save
  degree: string;                    // required for save
  startDate: string;                 // YYYY-MM
  endDate: string;                   // YYYY-MM
  description: string;
  achievements: string[];
}

interface SkillGroup {
  category: string;
  items: { name: string; level: number }[];
}

interface CVPersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  phone?: string;
}

interface ParsedCVData {
  work_experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  personal_info: CVPersonalInfo;
}
```

### `lib/cv-parser.ts`

```typescript
import { getApiKey } from "./api-key-store";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Uses pdf-parse: const pdfParse = require("pdf-parse")
  // Returns raw text string; throws on failure
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

const CV_PROMPT = `Parse this CV text and return ONLY valid JSON with this exact schema:
{
  "work_experience": [{ "id": "uuid", "company": "", "role": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM or present", "description": "", "achievements": [], "technologies": [] }],
  "education": [{ "id": "uuid", "institution": "", "degree": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "", "achievements": [] }],
  "skills": [{ "category": "", "items": [{ "name": "", "level": 80 }] }],
  "personal_info": { "name": "", "title": "", "email": "", "location": "", "phone": "" }
}
Fields not found in the CV should be empty strings or empty arrays. Do not include markdown, explanation, or any text outside the JSON object.`;

export async function parseWithOpenAI(rawText: string, apiKey: string): Promise<ParsedCVData> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: `${CV_PROMPT}\n\nCV Text:\n${rawText}` }],
      temperature: 0,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? "";
  return validateParsedCV(content);
}

export async function parseWithGemini(rawText: string, apiKey: string): Promise<ParsedCVData> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${CV_PROMPT}\n\nCV Text:\n${rawText}` }] }],
        generationConfig: { temperature: 0 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const json = await res.json();
  const content = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return validateParsedCV(content);
}

/** Validate and parse AI response JSON. Throws if schema is invalid. */
export function validateParsedCV(jsonString: string): ParsedCVData {
  // Strip markdown code blocks if present
  const cleaned = jsonString.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(cleaned); // throws SyntaxError if invalid JSON
  // Minimal structural validation
  if (!Array.isArray(parsed.work_experience)) throw new Error("Missing work_experience array");
  if (!Array.isArray(parsed.education)) throw new Error("Missing education array");
  if (!Array.isArray(parsed.skills)) throw new Error("Missing skills array");
  if (typeof parsed.personal_info !== "object") throw new Error("Missing personal_info object");
  return parsed as ParsedCVData;
}

export async function parseCVText(rawText: string): Promise<
  { parsedData: ParsedCVData; fallback: false } | { parsedData: null; rawText: string; fallback: true }
> {
  const openaiKey = await getApiKey("openai_api_key");
  if (openaiKey) {
    try { return { parsedData: await parseWithOpenAI(rawText, openaiKey), fallback: false }; }
    catch { /* fall through to Gemini */ }
  }
  const geminiKey = await getApiKey("gemini_api_key");
  if (geminiKey) {
    try { return { parsedData: await parseWithGemini(rawText, geminiKey), fallback: false }; }
    catch { /* fall through to manual */ }
  }
  return { parsedData: null, rawText, fallback: true };
}
```

### API Routes

#### `POST /api/admin/cv-parse`

Accepts multipart form data with a `file` field (PDF). Returns parsed CV data or raw text for manual editing.

```typescript
// Response shape
type CVParseResponse =
  | { parsedData: ParsedCVData; rawText: string; fallback: false }
  | { parsedData: null;         rawText: string; fallback: true; error?: string };
```

**Processing steps:**
1. Validate session → 401 if invalid
2. Parse multipart body, extract `file` buffer
3. Validate: MIME type must be `application/pdf`, size ≤ 10 MB → 400 if invalid
4. `extractTextFromPDF(buffer)` → 422 on failure
5. `parseCVText(rawText)` → returns `{ parsedData, fallback }`
6. Return 200 with response shape above

**Next.js 14 note:** Use `export const config = { api: { bodyParser: false } }` is not applicable in App Router. Instead, use `request.formData()` directly from the `Request` object, which handles multipart natively.

#### `POST /api/admin/cv-save`

Saves reviewed and edited parsed CV data to content JSON files.

```typescript
// Request body
interface CVSaveRequest {
  parsedData: Partial<ParsedCVData>;
  mergeStrategy: "replace" | "merge";
}

// Response
interface CVSaveResponse {
  success: boolean;
  updatedFiles: string[]; // e.g. ["experience.json", "skills.json"]
}
```

**Processing steps:**
1. Validate session → 401 if invalid
2. Parse JSON body
3. Validate payload: at least one non-empty field → 400 if all empty
4. Validate each WorkExperience: `company` and `role` non-empty → 400 on violation
5. Validate each Education: `institution` and `degree` non-empty → 400 on violation
6. For each data type present, apply merge strategy:
   - `"replace"`: overwrite entire file content
   - `"merge"`: read existing, concatenate new items (for arrays), merge object fields (for personal_info)
7. Write files atomically (write to temp then rename, or use `writeFile` which is atomic per-file on most OS)
8. Return 200 with list of updated files

**File mapping:**

| Payload field | Content file |
|---|---|
| `work_experience` | `content/experience.json` |
| `education` | `content/education.json` |
| `skills` | `content/skills.json` |
| `personal_info` | `content/personal.json` (merge partial fields only) |

**Personal info merge logic:** Read existing `personal.json`, spread existing fields, then overwrite only fields present in `personal_info` payload (`name`, `title`, `email`, `location`, and optionally `phone`). This preserves all other existing fields like `bio`, `availability`, `subtitle`, etc.

### `components/admin/CVUploader.tsx`

**Component state machine:**

```typescript
type UploaderPhase =
  | { phase: "upload" }
  | { phase: "loading"; message: string }
  | { phase: "review"; data: ParsedCVData; rawText: string }
  | { phase: "fallback"; rawText: string; error?: string }
  | { phase: "saving" }
  | { phase: "success" }
  | { phase: "error"; message: string };
```

**Key transitions:**
1. `upload` → user selects/drops PDF → validate type/size → show file preview
2. User clicks "Upload & Parse" → `loading` → `POST /api/admin/cv-parse`
3. On success with `parsedData`: → `review` (show CV Review Form)
4. On `fallback: true`: → `fallback` (show raw text textarea)
5. In `review`: user edits, selects merge strategy, clicks "Simpan" → `saving`
6. → `POST /api/admin/cv-save` → `success` then reset to `upload` after 3s
7. Any network error → `error` phase

---

## Updates to Existing Files

### `components/admin/AdminNav.tsx`

Extend the `Tab` type and `TABS` array:

```typescript
// New Tab type (extend existing union)
export type Tab =
  | "certificates" | "projects" | "personal" | "experience"
  | "achievements" | "skills" | "stats" | "testimonials"
  | "settings"    // NEW — API Key Manager
  | "import-cv";  // NEW — CV Upload & AI Parsing

// Add to TABS array:
{ id: "settings",   label: "Settings",   icon: "⚙️" },
{ id: "import-cv",  label: "Import CV",  icon: "📄" },
```

### `app/admin/page.tsx`

Add two new lazy-loaded components:

```typescript
const ApiKeyManager = dynamic(() => import("@/components/admin/ApiKeyManager"), { ssr: false });
const CVUploader = dynamic(() => import("@/components/admin/CVUploader"), { ssr: false });

// Add in the <main> section:
{activeTab === "settings"   && <ApiKeyManager />}
{activeTab === "import-cv"  && <CVUploader />}
```

---

## Dependencies to Install

```bash
npm install pdf-parse
npm install --save-dev @types/pdf-parse
```

No additional packages needed:
- `openai` npm package is **not** required — we use `node-fetch`/native `fetch` to call OpenAI REST API directly, matching the pattern already used in the codebase.
- `@google/generative-ai` is **not** required — we call the Gemini REST API directly via `fetch`.
- AES-256-GCM uses Node.js built-in `crypto` module (already used in `lib/admin-auth.ts`).

---

## Error Handling Summary

| Scenario | HTTP Status | Response |
|---|---|---|
| Missing/invalid session | 401 | `{ error: "Unauthorized" }` |
| MASTER_KEY not set | 500 | `{ error: "MASTER_KEY environment variable is not configured" }` |
| Invalid key ID | 400 | `{ error: "Invalid key ID" }` |
| PDF extraction failure | 422 | `{ parsedData: null, rawText: null, error: "Gagal mengekstrak teks dari PDF" }` |
| File too large / wrong type | 400 | `{ error: "..." }` |
| Both AI keys missing | 200 | `{ parsedData: null, rawText: "...", fallback: true }` |
| Validation failure on save | 400 | `{ error: "...", field: "..." }` |
| Filesystem write failure | 500 | `{ error: "Gagal menyimpan file: ..." }` |

---

## Security Considerations

1. **AES-256-GCM with auth tag**: Authenticated encryption prevents ciphertext tampering. The 16-byte auth tag is stored prepended to the ciphertext.
2. **IV per entry**: Each `writeApiKey()` generates a fresh random IV, preventing IV reuse attacks.
3. **Key derivation**: `scryptSync` with salt hardens against brute-force on the master key. The salt `"salt"` is a fixed string — acceptable for this use case since MASTER_KEY itself provides the entropy.
4. **Server-side only**: `lib/api-key-store.ts` and `lib/cv-parser.ts` are never imported from client components; they only run in API routes.
5. **No key logging**: API routes never log plaintext key values.
6. **Multipart size limit**: `POST /api/admin/cv-parse` validates file size before PDF extraction to prevent memory exhaustion.
7. **Filename is not trusted**: Uploaded PDF buffer is processed by content, not by filename; no path traversal risk.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property Reflection:** After prework analysis, the following redundancies were identified and resolved:
- "Reveal shows saved value" (1.3.9) and "Encryption round-trip" (1.2.4) both test the same underlying encrypt/decrypt logic; they are merged into Property 1 (round-trip) which subsumes both.
- "Auth rejection for cv-parse" and "Auth rejection for cv-save" and "Auth rejection for api-keys" are all instances of the same property; merged into Property 2.
- "Merge strategy superset" is a stronger statement than "replace strategy exact contents"; kept as separate properties (3 and 4) since they test different logic paths.
- WorkExperience validation and Education validation are combined into Property 6 since they test the same invariant (required fields must be non-empty).

### Property 1: AES-256-GCM Encryption Round-Trip

*For any* non-empty string value written via `writeApiKey(id, value)`, calling `getApiKey(id)` with the same MASTER_KEY environment variable SHALL return the exact original string value.

**Validates: Requirements 1.2.4, 1.3.9**

### Property 2: Unauthenticated Requests Are Always Rejected

*For any* HTTP request to `/api/admin/api-keys`, `/api/admin/cv-parse`, or `/api/admin/cv-save` that does not include a valid `admin_session` cookie, the response status SHALL be 401 regardless of request body or query parameters.

**Validates: Requirements 1.2.7, 2.2.9, 2.6.27**

### Property 3: Replace Strategy Produces Exact File Contents

*For any* valid `CVSaveRequest` with `mergeStrategy: "replace"` containing a non-empty `work_experience` array, after a successful call to `POST /api/admin/cv-save`, reading `content/experience.json` SHALL return exactly the items from the request payload, with no additional or missing items.

**Validates: Requirements 2.6.28**

### Property 4: Merge Strategy Preserves Existing Items

*For any* existing set of items in `content/experience.json` and any valid `CVSaveRequest` with `mergeStrategy: "merge"`, after a successful call to `POST /api/admin/cv-save`, reading `content/experience.json` SHALL contain all pre-existing items plus the new items from the payload (superset).

**Validates: Requirements 2.6.29**

### Property 5: Personal Info Merge Preserves Unrelated Fields

*For any* `content/personal.json` file with arbitrary fields and any `CVSaveRequest` containing a `personal_info` payload, after a successful `POST /api/admin/cv-save`, fields in `personal.json` that are NOT in `{ name, title, email, location, phone }` SHALL remain unchanged.

**Validates: Requirements 2.6.30**

### Property 6: Invalid Items Are Rejected Before Any Write

*For any* `CVSaveRequest` payload containing at least one `WorkExperience` item with an empty `company` or `role`, OR at least one `Education` item with an empty `institution` or `degree`, the endpoint `POST /api/admin/cv-save` SHALL return status 400 and SHALL NOT write any changes to the filesystem.

**Validates: Requirements 2.7.35, 2.7.36**

### Property 7: PDF Validator Rejects Non-PDF and Oversized Files

*For any* uploaded file with MIME type other than `application/pdf`, OR any file whose size exceeds 10 MB, the client-side validator in `CVUploader` SHALL reject the file and display an appropriate error message without sending any request to the server.

**Validates: Requirements 2.2.6, 2.2.7**

### Property 8: Regex-Based Key Validators Are Consistent

*For any* string matching the regex `^G-[A-Z0-9]+$`, the `google_analytics_id` format validator SHALL return "Valid format". *For any* string NOT matching that regex, it SHALL return a format error. Similarly, *for any* string parseable by `new URL()`, the `custom_webhook_url` validator SHALL return "Valid URL", and *for any* unparseable string it SHALL return "Format URL tidak valid".

**Validates: Requirements 1.4.15, 1.4.19**

### Property 9: AI Response Validation Guards Against Malformed JSON

*For any* string returned by an AI API call that is NOT valid JSON or does NOT contain the required top-level fields (`work_experience`, `education`, `skills`, `personal_info`), the `validateParsedCV()` function SHALL throw an error, causing `parseCVText()` to return `{ parsedData: null, fallback: true }` rather than propagating malformed data.

**Validates: Requirements 2.4.17, 2.4.18**
