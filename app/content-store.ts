import { env } from "cloudflare:workers";
import { defaultSiteContent, type SiteContent } from "./data";

type RuntimeBindings = { DB?: D1Database; MEDIA?: R2Bucket };
const CONTENT_ID = "primary";

export function getBindings() {
  return env as typeof env & RuntimeBindings;
}

export async function ensureContentTables(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT NOT NULL DEFAULT 'local-admin'
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY NOT NULL,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT NOT NULL DEFAULT 'local-admin'
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON media_assets(created_at)"),
  ]);
}

export async function getSiteContent(): Promise<SiteContent> {
  const db = getBindings().DB;
  if (!db) return structuredClone(defaultSiteContent);
  try {
    await ensureContentTables(db);
    const row = await db.prepare("SELECT content FROM site_content WHERE id = ?").bind(CONTENT_ID).first<{ content: string }>();
    if (!row) return structuredClone(defaultSiteContent);
    return cleanEncoding(mergeContent(JSON.parse(row.content) as Partial<SiteContent>));
  } catch {
    return structuredClone(defaultSiteContent);
  }
}

function cleanEncoding<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replaceAll("â€™", "’")
      .replaceAll("â€“", "–")
      .replaceAll("â€”", "—")
      .replaceAll("Â·", "·")
      .replaceAll("Â©", "©")
      .replaceAll("Â", "") as T;
  }
  if (Array.isArray(value)) return value.map(cleanEncoding) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanEncoding(item)])) as T;
  }
  return value;
}

export async function saveSiteContent(content: SiteContent, updatedBy: string) {
  const db = getBindings().DB;
  if (!db) throw new Error("The content database is unavailable.");
  await ensureContentTables(db);
  await db.prepare(`INSERT INTO site_content (id, content, updated_at, updated_by)
    VALUES (?, ?, CURRENT_TIMESTAMP, ?)
    ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP, updated_by = excluded.updated_by`)
    .bind(CONTENT_ID, JSON.stringify(content), updatedBy).run();
}

function mergeContent(saved: Partial<SiteContent>): SiteContent {
  return {
    ...defaultSiteContent,
    ...saved,
    academy: { ...defaultSiteContent.academy, ...saved.academy },
    youtubeChannelId: typeof saved.youtubeChannelId === "string" ? saved.youtubeChannelId : "",
    videos: Array.isArray(saved.videos) ? saved.videos : [],
    navigation: Array.isArray(saved.navigation) ? saved.navigation : structuredClone(defaultSiteContent.navigation),
    header: { ...defaultSiteContent.header, ...saved.header },
    footer: { ...defaultSiteContent.footer, ...saved.footer },
    managedPages: Array.isArray(saved.managedPages) ? saved.managedPages : structuredClone(defaultSiteContent.managedPages),
    home: { ...defaultSiteContent.home, ...saved.home },
    pageHeroes: { ...defaultSiteContent.pageHeroes, ...saved.pageHeroes },
    about: { ...defaultSiteContent.about, ...saved.about },
    admissions: { ...defaultSiteContent.admissions, ...saved.admissions },
    contact: { ...defaultSiteContent.contact, ...saved.contact },
    cta: { ...defaultSiteContent.cta, ...saved.cta },
  };
}

/** Keep unpublished videos out of public RSC payloads, including dev metadata. */
export async function getPublicSiteContent(): Promise<SiteContent> {
  const content = await getSiteContent();
  return { ...content, videos: content.videos.filter((video) => video.published) };
}
