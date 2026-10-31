import { redirect } from "next/navigation";
import { chatGPTSignInPath } from "../chatgpt-auth";
import { getAdminIdentity } from "../admin-auth";
import { AdminEditor } from "./admin-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await getAdminIdentity();
  if (!admin) redirect(chatGPTSignInPath("/admin"));
  return <AdminEditor adminName={admin.displayName} local={admin.local} />;
}
