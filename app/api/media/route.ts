import { randomUUID } from "node:crypto";
import { getBindings, ensureContentTables } from "../../content-store";
import { requireAdminApi } from "../../admin-auth";

export const dynamic = "force-dynamic";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 12 * 1024 * 1024;

export async function GET() {
  try {
    await requireAdminApi();
    const db = getBindings().DB;
    if (!db) return Response.json({ assets: [] });
    await ensureContentTables(db);
    const result = await db.prepare("SELECT id, key, name, content_type AS contentType, size, created_at AS createdAt FROM media_assets ORDER BY created_at DESC").all();
    return Response.json({ assets: result.results });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Unable to list media." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApi();
    const bindings = getBindings();
    if (!bindings.MEDIA || !bindings.DB) return Response.json({ error: "Media storage is unavailable." }, { status: 503 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose an image to upload." }, { status: 400 });
    if (!allowedTypes.has(file.type)) return Response.json({ error: "Use a JPEG, PNG, WebP, or AVIF image." }, { status: 415 });
    if (file.size > maxBytes) return Response.json({ error: "Images must be smaller than 12 MB." }, { status: 413 });

    const id = randomUUID();
    const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
    const key = `academy/${id}.${extension}`;
    await bindings.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    await ensureContentTables(bindings.DB);
    await bindings.DB.prepare("INSERT INTO media_assets (id, key, name, content_type, size, created_by) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(id, key, file.name, file.type, file.size, admin.email).run();
    return Response.json({ asset: { id, key, name: file.name, contentType: file.type, size: file.size, src: `/media/${id}` } }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}
