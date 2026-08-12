import { headers } from "next/headers";
import { getChatGPTUser } from "./chatgpt-auth";

export type AdminIdentity = { id: string; email: string; displayName: string; local: boolean };

function allowedEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host)) {
    return { id: "local-admin", email: "localhost", displayName: "Local administrator", local: true };
  }

  const user = await getChatGPTUser();
  if (!user) return null;
  const allowlist = allowedEmails();
  if (allowlist.length > 0 && !allowlist.includes(user.email.toLowerCase())) return null;
  return { id: user.userId, email: user.email, displayName: user.displayName, local: false };
}

export async function requireAdminApi() {
  const admin = await getAdminIdentity();
  if (!admin) throw new Response("Unauthorized", { status: 401 });
  return admin;
}
