import { requireAdminApi } from "../../admin-auth";
import { youtubeChannelId } from "../../youtube";

export async function GET(request: Request) {
  try {
    await requireAdminApi();
    const input = new URL(request.url).searchParams.get("url") ?? "";
    const knownId = youtubeChannelId(input);
    if (knownId) return Response.json({ channelId: knownId });
    let url: URL;
    try { url = new URL(input); } catch { return Response.json({ error: "Enter your YouTube channel URL in Academy details first." }, { status: 400 }); }
    if (url.protocol !== "https:" || url.username || url.password || url.port || !["youtube.com", "www.youtube.com"].includes(url.hostname) || !/^\/@[\w.-]+(?:\/(?:featured|videos|streams))?\/?$/.test(url.pathname)) {
      return Response.json({ error: "Use the channel’s youtube.com/@handle or /channel/ URL." }, { status: 400 });
    }
    // Resolve only a public YouTube handle on a fixed host, never arbitrary URLs.
    const path = url.pathname.split("/")[1];
    const response = await fetch(`https://www.youtube.com/${path}`, { redirect: "error", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Channel lookup unavailable.");
    const html = await response.text();
    const id = html.match(/"channelMetadataRenderer":\{[\s\S]*?"externalId":"(UC[\w-]{22})"/)?.[1]
      ?? html.match(/<meta\s+itemprop="channelId"\s+content="(UC[\w-]{22})"/)?.[1];
    if (!id) throw new Error("Channel ID not found.");
    return Response.json({ channelId: id });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Could not connect to YouTube. Try again when YouTube access is available, or paste the channel ID from YouTube’s advanced settings." }, { status: 502 });
  }
}
