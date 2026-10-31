import { getBindings, ensureContentTables } from "../../content-store";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const bindings = getBindings();
  if (!bindings.DB || !bindings.MEDIA) return new Response("Not found", { status: 404 });
  await ensureContentTables(bindings.DB);
  const asset = await bindings.DB.prepare("SELECT key, content_type AS contentType FROM media_assets WHERE id = ?").bind(id).first<{ key: string; contentType: string }>();
  if (!asset) return new Response("Not found", { status: 404 });
  const object = await bindings.MEDIA.get(asset.key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { headers: { "content-type": asset.contentType, "cache-control": "public, max-age=31536000, immutable" } });
}
