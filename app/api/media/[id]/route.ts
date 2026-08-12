import { getBindings, ensureContentTables } from "../../../content-store";
import { requireAdminApi } from "../../../admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminApi();
    const { id } = await context.params;
    const bindings = getBindings();
    if (!bindings.DB || !bindings.MEDIA) return Response.json({ error: "Media storage is unavailable." }, { status: 503 });
    await ensureContentTables(bindings.DB);
    const asset = await bindings.DB.prepare("SELECT key FROM media_assets WHERE id = ?").bind(id).first<{ key: string }>();
    if (!asset) return Response.json({ error: "Media item not found." }, { status: 404 });
    await bindings.MEDIA.delete(asset.key);
    await bindings.DB.prepare("DELETE FROM media_assets WHERE id = ?").bind(id).run();
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Unable to delete media." }, { status: 500 });
  }
}
