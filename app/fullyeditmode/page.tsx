import { redirect } from "next/navigation";
import { chatGPTSignInPath } from "../chatgpt-auth";
import { getAdminIdentity } from "../admin-auth";
import { FullEditMode } from "./visual-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Full Edit Mode", robots: { index: false, follow: false } };

export default async function FullEditModePage() {
  const admin = await getAdminIdentity();
  if (!admin) redirect(chatGPTSignInPath("/fullyeditmode"));
  return <FullEditMode adminName={admin.displayName} local={admin.local} />;
}
