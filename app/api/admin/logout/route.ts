import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    "admin_session=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/"
  );
  return response;
}
