# Project memory

Read this file and `AGENTS.md` before continuing work. Update this record when
the owner changes direction, makes a decision, or requests new work. Record
decisions and outcomes without credentials or private runtime data.

## Owner requests, 2026-11-05

- Read and understand the entire project before making changes.
- Run the website first so the owner can review it and give visual feedback.
- This is the website for Sri Vari Padalu Academy, a classical dance and music
  academy in West Marredpally, Secunderabad.
- Improve the UI and UX using the installed design and anti-slop skills. The
  owner has authorized implementation, not just a design proposal.
- Use `https://github.com/deekshitvegi/sri-vari-padalu-academy` and push completed
  changes there. Make frequent, focused commits for meaningful improvements.
  Keep the existing history and use normal pushes.
- Maintain this `codex.md` file as conversation memory across context compaction
  and future sessions.
- Follow-up clarification: the owner explicitly wants a fully interactive,
  animated, dynamic site with a visually engaging interface. Do not interpret
  anti-slop as removing motion or producing a static-looking result. Keep the
  calmer visual foundation and add responsive interactions, scroll reveals,
  gallery transitions, and page entrances. Honor reduced-motion preferences.

## Repository and local preview

- The actual Git root is the nested `Dance school site` directory inside the
  selected workspace. Run npm and Git commands from that inner directory.
- The starting local checkout had four commits and no Git remote. The GitHub
  repository has a separate history and newer YouTube features.
- Connected `origin` to the owner's repository and reconciled both histories,
  selecting the newer GitHub content where the same file differed. Preserve the
  YouTube performance, livestream, upload playlist, and draft privacy features.
- Current working branch: `codex/ui-polish`.
- Local preview: `http://localhost:3000/`. The server must remain available for
  owner review. On this Windows PowerShell/npm combination the original command
  `npm run dev -- --port 9999` dropped `--port` and used Vite's default 3000.
  Use `npm run dev -- --port=3000` or invoke Vinext with an explicit port if a
  restart needs a fixed address; verify the printed URL.
- Never deploy the hosted Sites project merely because a GitHub push succeeds.
  This conversation currently asks for a local preview and GitHub changes.

## What the project contains

- React 19 and TypeScript with Next App Router conventions, running through
  Vinext/Vite on Cloudflare Workers. Tailwind 4 is installed; most styling lives
  in `app/globals.css`.
- Public pages: home, about, programs, faculty, gallery, events, student stories
  at `/testimonials`, contact, and admissions. Custom pages use `app/[slug]`.
- Programs: Bharatanatyam, Kuchipudi, and Sangeetham/Carnatic music.
- `app/data.ts` defines content types and defaults. `app/content-store.ts`
  reads/writes the D1 `site_content` record and merges saved content with defaults.
  Public reads remove unpublished videos.
- `/admin` edits content and media. `/fullyeditmode` is the separate owner-only
  page builder. Localhost supplies local admin/owner identities. Production
  relies on trusted Sites authentication headers and email allowlists.
- D1 binding `DB` stores content and media metadata; R2 binding `MEDIA` stores
  uploaded images. Local state is under ignored `.wrangler` files.
- Contact prepares a `mailto:` message; the website does not send email itself.
- YouTube players load on demand. Video links and channel IDs are validated.
  The site does not start broadcasts or detect live status automatically.
- Shared frame: `app/components/site-frame.tsx`. Interactive dancer hero:
  `app/components/lineage-growth.tsx`. Gallery and reusable page sections have
  their own components. GSAP/ScrollTrigger and Lenis manage motion.
- Existing photography and generated design experiments are already bundled.
  Keep source credits in `design-assets/SOURCE-CREDITS.md`.

## UI direction and work plan

The first review found oversized, tightly tracked uppercase headings, glass
surfaces on nearly every section, strong decorative effects, and vague calls to
action. Preserve the academy identity, burgundy/cream palette, dancer reveal,
real academy photographs, content editing, and all public routes.

The approved implementation request supports a warm editorial direction:
readable serif display type, calm paper surfaces, direct class information,
restrained burgundy accents, and clearer ways to explore classes or enquire.
Keep motion purposeful and respect reduced motion. Do not invent academy
claims, fees, reviews, events, or credentials.

Planned separate changes: repository reconciliation; persistent project memory;
navigation and visual foundation; homepage composition and copy; inner pages
and gallery interactions; accessibility and responsive fixes where verified.
Check each completed unit before committing and pushing. Update this section
with actual outcomes rather than leaving completed work marked as planned.

## Verification so far

- The initial local site and all nine public routes responded with HTTP 200.
  Both editors and their read APIs also returned successfully on localhost.
- Initial lint passed. After importing the newer GitHub source, the production
  build and all six existing tests passed.
- The initial homepage had no browser console errors and no horizontal
  overflow at the first desktop review. The mobile menu opens and contains the
  public routes and admissions link.
- Existing tests include source/asset assertions and YouTube input validation.
  Browser checks are still needed for redesigned layouts and interactions.
