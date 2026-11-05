# Sri Vari Padalu Academy website

Multipage academy website with a durable content CMS, responsive visual page builder, D1 content storage, and R2 media storage.

## Local development

```bash
npm install
npm run dev -- --port 9999
```

Open:

- Website: `http://localhost:9999/`
- Content admin: `http://localhost:9999/admin`
- Owner-only full design mode: `http://localhost:9999/fullyeditmode`

Localhost automatically uses the local administrator identity, so no password is needed locally.

## Deployed admin login

1. Content editors visit `/admin` after the deployed domain.
2. The site redirects anonymous visitors to **Sign in with ChatGPT**.
3. After sign-in, it returns to the requested editor.

Restrict content-editor access with `ADMIN_EMAILS`. Keep unrestricted design access separate with `OWNER_EMAILS`:

```env
ADMIN_EMAILS=owner@example.com,manager@example.com
OWNER_EMAILS=owner@example.com
```

Do not leave this empty for a public production site: an empty allowlist permits any authenticated site user to edit.

## Editing model

- `/admin` is the safe day-to-day content editor. Its five areas cover academy details, home and page copy, programs, faculty, class schedules, events, stories, gallery images, admissions FAQs, contact text, calls to action, and uploaded media.
- `/fullyeditmode` is owner-only and is not linked anywhere in `/admin`. It can create/delete pages, publish/draft pages, switch built-in pages to a builder layout, add/reorder/hide/duplicate/delete sections, manage card and button collections, and add/reorder/hide/delete header links. Signed-in non-owners who manually enter this URL are returned to `/admin`.
- Use the standard layout for the handcrafted academy pages. Switch a built-in page to the builder layout only when you want to redesign it.
- Changes are drafts in the browser until **Save changes** or **Publish changes** is pressed.
- Image uploads are stored in R2. Website content and page layouts are stored in D1.

## Validation

```bash
npm run lint
npm test
```

The UI is designed for phone, tablet, laptop, desktop, reduced-motion, touch, and fine-pointer use.

## YouTube performances and livestreams

In `/admin`, choose **Media → YouTube videos**, then **Add YouTube video**.
Paste the video's HTTPS YouTube link (Watch, Share, Shorts, or live-event links
are supported), give it a title, and optionally add a description or broadcast
time. Choose Performance or Livestream and set Visibility to Published, then
**Save changes**. Published videos appear at `/gallery#videos`; drafts remain
hidden. Move up/down changes their order, and Delete removes the website entry
without deleting anything from YouTube. Older saved site content starts with
an empty video collection.

Create or schedule the broadcast on YouTube first, enable embedding, and use
its individual video link. The website does not start broadcasts or detect live
status. Public or unlisted embeddable videos work; YouTube privacy, age, regional,
and embedding restrictions still apply. Visitors load the privacy-enhanced
YouTube player on demand, then use its playback controls. A Watch on YouTube
link is available if embedded playback is unavailable. No YouTube API key is
required. Gallery feed blocks in the owner’s visual builder also show videos.

For automatic uploads, use **Connect academy YouTube channel** in the same admin
area, or paste its `UC…` channel ID, then save. The uploads playlist updates on
YouTube automatically without an API key. The handle lookup reads public channel
metadata and may require entering the channel ID manually if YouTube changes
its page format or blocks access. Automatic live-status detection is separate;
pin a scheduled broadcast using its individual video URL. Channel uploads
embedding remains subject to YouTube availability and permissions.

With the local development server running, `node tests/video-api-smoke.mjs`
checks video persistence, draft privacy, automatic playlist configuration, both
save APIs, and authentication. It uses temporary local records and restores the
original content afterward.
