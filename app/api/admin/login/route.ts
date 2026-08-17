import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionToken, buildSessionCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("[Admin] ADMIN_PASSWORD environment variable is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const inputHash = hashPassword(body.password ?? "");
  const expectedHash = hashPassword(adminPassword);

  if (inputHash !== expectedHash) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.headers.set("Set-Cookie", buildSessionCookie(token));
  return response;
}
