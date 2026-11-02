import { getSiteContent, saveSiteContent } from "../../content-store";
import { requireAdminApi } from "../../admin-auth";
import { channelValidationError, videoValidationError, youtubeChannelId } from "../../youtube";
import type { SiteContent } from "../../data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminApi();
    return Response.json({ content: await getSiteContent() }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Unable to load content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdminApi();
    const payload = (await request.json()) as { content?: SiteContent };
    if (!payload.content || !payload.content.academy || !Array.isArray(payload.content.programs)) {
      return Response.json({ error: "Invalid website content." }, { status: 400 });
    }
    const channelError = channelValidationError(payload.content.youtubeChannelId ?? "");
    if (channelError) return Response.json({ error: channelError }, { status: 400 });
    const videoError = videoValidationError(payload.content.videos ?? []);
    if (videoError) return Response.json({ error: videoError }, { status: 400 });
    const current = await getSiteContent();
    const safeContent: SiteContent = {
      ...payload.content,
      youtubeChannelId: payload.content.youtubeChannelId === undefined ? current.youtubeChannelId : youtubeChannelId(payload.content.youtubeChannelId) ?? "",
      videos: payload.content.videos ?? current.videos,
      navigation: current.navigation,
      header: current.header,
      footer: current.footer,
      managedPages: current.managedPages,
    };
    await saveSiteContent(safeContent, admin.email);
    return Response.json({ content: safeContent });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save content." }, { status: 500 });
  }
}
