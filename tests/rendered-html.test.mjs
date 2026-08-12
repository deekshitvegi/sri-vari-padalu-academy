import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("keeps navigation, motion, and imagery production-ready", async () => {
  const [frame, css, data] = await Promise.all([
    readFile(new URL("../app/components/site-frame.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(frame, /aria-label="Primary navigation"/);
  assert.match(frame, /aria-current=/);
  assert.match(frame, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width:\s*620px\)/);
  assert.match(css, /100dvh/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(data, /Bharatanatyam/);
  assert.match(data, /Kuchipudi/);
  assert.match(data, /Sangeetham/);

  await Promise.all([
    access(new URL("../public/academy/hero/single-dancer-charcoal-bronze-v3-tight.webp", import.meta.url)),
    access(new URL("../public/academy/hero/trio-dancer-1-real-dark-v3.webp", import.meta.url)),
    access(new URL("../public/academy/programs/bharatnatyam.webp", import.meta.url)),
    access(new URL("../public/academy/faculty/rama-devi.webp", import.meta.url)),
    access(new URL("../public/academy/gallery/gallery-25.webp", import.meta.url)),
  ]);
});

test("contains complete public routes and durable CRUD administration", async () => {
  const routeFiles = ["page.tsx", "about/page.tsx", "programs/page.tsx", "faculty/page.tsx", "gallery/page.tsx", "events/page.tsx", "testimonials/page.tsx", "contact/page.tsx", "admissions/page.tsx", "admin/page.tsx", "fullyeditmode/page.tsx", "[slug]/page.tsx"];
  await Promise.all(routeFiles.map((route) => access(new URL(`../app/${route}`, import.meta.url))));
  const [admin, visualEditor, contentApi, fullContentApi, mediaApi, schema, hosting] = await Promise.all([
    readFile(new URL("../app/admin/admin-editor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/fullyeditmode/visual-editor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/content/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/full-content/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/media/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(admin, /Add program/); assert.match(admin, /Delete/); assert.match(admin, /Replace/); assert.match(admin, /Save changes/);
  assert.doesNotMatch(admin, /Full design mode|Open full design mode|href="\/fullyeditmode"/);
  assert.match(visualEditor, /Add section/); assert.match(visualEditor, /Add link/); assert.match(visualEditor, /Delete page/); assert.match(visualEditor, /Publish changes/);
  assert.match(contentApi, /export async function PUT/); assert.match(contentApi, /managedPages: current\.managedPages/); assert.match(fullContentApi, /requireOwnerApi/); assert.match(mediaApi, /export async function POST/);
  assert.match(schema, /siteContent/); assert.match(schema, /mediaAssets/);
  assert.match(hosting, /"d1": "DB"/); assert.match(hosting, /"r2": "MEDIA"/);
});
