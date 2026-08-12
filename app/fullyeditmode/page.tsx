import { redirect } from "next/navigation";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { getOwnerIdentity } from "../admin-auth";
import { FullEditMode } from "./visual-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Full Edit Mode", robots: { index: false, follow: false } };

export default async function FullEditModePage() {
  const owner = await getOwnerIdentity();
  if (!owner) {
    const user = await getChatGPTUser();
    if (user) redirect("/admin");
    redirect(chatGPTSignInPath("/fullyeditmode"));
  }
  return <FullEditMode adminName={owner.displayName} local={owner.local} />;
}
