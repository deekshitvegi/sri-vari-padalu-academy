import { getSiteContent, saveSiteContent } from "../../content-store";
import { requireOwnerApi } from "../../admin-auth";
import type { SiteContent } from "../../data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireOwnerApi();
    return Response.json({ content: await getSiteContent() }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Unable to load full edit content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const owner = await requireOwnerApi();
    const payload = (await request.json()) as { content?: SiteContent };
    if (!payload.content || !payload.content.academy || !Array.isArray(payload.content.managedPages) || !Array.isArray(payload.content.navigation)) {
      return Response.json({ error: "Invalid website structure." }, { status: 400 });
    }
    await saveSiteContent(payload.content, owner.email);
    return Response.json({ content: payload.content });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save full edit content." }, { status: 500 });
  }
}
