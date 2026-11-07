# Sri Vari Padalu Academy website

Multipage academy website with a durable content CMS, responsive visual page builder, D1 content storage, and R2 media storage.

## Local development

```bash
npm ci
npm run dev
```

Open:

- Website: `http://localhost:3000/`
- Content admin: `http://localhost:3000/admin`
- Owner-only full design mode: `http://localhost:3000/fullyeditmode`

Use the Local URL printed by the development server if port 3000 is occupied.

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
npx tsc --noEmit
npm test
```

The UI supports phone, tablet, laptop, desktop, reduced-motion, touch, and fine-pointer use.

## Interactive visitor experience

One wordmark and the Programs, Academy, and Explore controls share the floating
navigation. Those controls remain visible on phones; there is no separate logo
card or hamburger-only version. It responds to hover, click, tap, Arrow Down and Escape.
Navigation labels, destinations and class thumbnails come from saved content.

The homepage opens with the owner's selected Maps portrait. A text selector
changes discipline, and **Find a class** is the single main action. Every slide
fills the same 16:9 photo frame, so changing discipline preserves the layout
without letterboxing. The opening portrait uses a crop focused on the dancer's
face and hands. Phones stack the image and introduction; tablets
and larger screens place them alongside each other. There is no automatic
carousel or preview toolbar. Click/tap, swiping the photograph, and keyboard
arrows, Home and End change the picture, caption and enquiry selection. These
changes animate when motion is enabled. The footer's **Pause animations** control
remembers the visitor's choice, while system reduced-motion preferences take
priority.

The homepage's program cards reveal descriptions, training highlights and class
counts in place. Teacher rows expand their biographies. The performance photograph
opens at full size. The timetable filters by program and day; selecting a class
passes that exact batch into the enquiry drawer. Existing supporting photographs
are preserved.

**Enquire** in the header and **Find your class** on interior public pages open a native
dialog with discipline, class-time and visitor-detail steps, followed by a review.
Program and timetable links can start at the relevant step. Listed times come
from saved content, excluding independent practice. The final action opens an
email draft for the visitor to send. It does not send mail or confirm a booking.
Visitor details stay in React memory and are not saved to browser storage or D1.

At `/programs#schedule`, visitors can filter the saved timetable by discipline
and day. Program enquiries open the same drawer with the discipline selected.
The standalone `/contact` form remains available, including program preselection
through its query string. It also prepares an email draft.

The photo gallery has animated orientation filters, result counts and a native
lightbox with focus containment, arrow-key navigation, Escape and focus return.

`app/globals.css` imports `app/public.css`, `app/navigation.css`, `app/stage.css`,
`app/enquiry.css`, `app/interactive.css`, `app/responsive.css` and `app/editors.css`. Public design
changes can therefore be made without restyling the content and design editors.
`codex.md` records owner preferences, design references, implementation decisions
and verification results for future sessions.

Responsive verification covers 25 homepage viewport sizes from 320 to 2560 pixels
wide, including 621/701/961-pixel breakpoint boundaries and 667×375 / 844×390 phone
landscape. All eight interior public routes were also checked at 320, 621, 768,
960, 1024 and 844 pixels wide. Check text clipping, photo-frame stability, open
navigation, enquiry scrolling and keyboard focus as well as page overflow.
These are browser viewport checks, not certification on every physical device.

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
original content afterward. It defaults to port 3000. For another local port,
set `SMOKE_BASE_URL` to the printed development-server URL. The script rejects
non-local targets.
