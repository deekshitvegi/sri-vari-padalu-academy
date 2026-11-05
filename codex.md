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
- The owner supplied these motion/design references and said this is the level
  of interaction expected. Inspect the actual references before deciding the
  next art direction; the current editorial pass is a first iteration.
  - https://x.com/viktoroddy/status/2117959947204092218
  - https://x.com/AldegadWildKim/status/2118284067380834597
  - https://x.com/rosemoni18/status/2118118824625197379
  - https://x.com/spect3ral/status/2118265063790317712
  - https://x.com/I_am_Aiabir/status/2118180756698923263
- The owner specifically loves this navbar and wants its interaction style:
  https://x.com/Matthias_Oel/status/2117997366775288216 . The visible reference
  is a compact dark floating bar with a shared expanding panel, thumbnail rows,
  rounded active items, and smooth changes between menu sections. Adapt the
  morphing mega-menu interaction to the academy rather than copying its labels.

## Implementation checkpoint

The completed UI pass includes ten implementation/setup commits through
`2a2a444`, followed by a documentation and validation commit. Both the original
four local commits and the newer GitHub history are preserved. The finished
work is published by normal fast-forward push to `main`; `codex/ui-polish`
retains the working history. No hosting deployment is part of this request.

Implemented so far: editorial public styles separate from editor/builder styles;
new header/footer; real-photo dancer reveal with no idle animation loop; native
scroll entrances and limited desktop parallax; animated gallery filters and a
native keyboard-accessible lightbox; live timetable filters; program-aware
contact drafts; a persistent pause-animation control; and the reference-inspired
morphing mega navigation with class thumbnails, smooth panel resizing, hover,
click, Arrow Down and Escape. Local preview content
was refreshed only where saved values matched the previous defaults, with an
original-content backup in ignored `.codex-local/content-before-ui-refresh.json`.

Checks passed: lint, production builds and six existing tests; the existing
YouTube persistence/privacy/auth smoke check against localhost with restoration;
browser class filters including zero results; program preselection; email draft
generation without sending; portrait gallery filter, arrow keys, Escape and focus
restoration; mobile menu Tab containment/Escape; animation pause/resume.
Phone (390x844), tablet (768x1024) and desktop (1440x900) layouts were inspected.
All eight inner public routes have no horizontal overflow at phone and tablet
widths. Both editors were also loaded successfully on phone. The browser
reported no console errors during the final visitor/editor check. Current
screenshots and the local design evidence record are in ignored `.codex-local/qa`.

Fixed pre-existing TypeScript errors in the full editor's response JSON and
optional Worker image-binding callbacks. `npx tsc --noEmit` now passes.
Empty enquiry submissions were blocked by native validation, and generating
an email draft did not send a message. The local smoke check restores the
original content after exercising both save APIs and rejects non-local targets.

Reference posts were inspected in the in-app browser. Their text and poster
frames were available, but embedded X videos reported playback unavailable.
Do not claim frame-by-frame video analysis. The concrete navbar reference was
identified as a floating Morphing Mega Menu and adapted independently.

## Repository and local preview

- The actual Git root is the nested `Dance school site` directory inside the
  selected workspace. Run npm and Git commands from that inner directory.
- The starting local checkout had four commits and no Git remote. The GitHub
  repository has a separate history and newer YouTube features.
- Connected `origin` to the owner's repository and reconciled both histories,
  selecting the newer GitHub content where the same file differed. Preserve the
  YouTube performance, livestream, upload playlist, and draft privacy features.
- Finished working branch: `codex/ui-polish`; continue from the published `main`
  unless a later task explicitly chooses another branch.
- Local preview: `http://localhost:3000/`. The server must remain available for
  owner review. On this Windows PowerShell/npm combination the original command
  `npm run dev -- --port 9999` dropped `--port` and used Vite's default 3000.
  Use the tested default `npm run dev` and verify its printed Local URL.
- Never deploy the hosted Sites project merely because a GitHub push succeeds.
  This conversation currently asks for a local preview and GitHub changes.

## What the project contains

- React 19 and TypeScript with Next App Router conventions, running through
  Vinext/Vite on Cloudflare Workers. Tailwind 4 is installed. `app/globals.css`
  imports `app/public.css` and the retained editor/builder rules in `app/editors.css`.
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
  their own components. `site-motion.tsx` uses native Web Animations and
  IntersectionObserver for entrances; pointer updates run only on input.
  GSAP/Lenis remain installed from the previous implementation but are not used
  by the new public frame. `app/motion.ts` shares the reduced-motion gate.
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

Completed separate changes cover repository reconciliation, persistent memory,
style separation, the public visual system, homepage composition, gallery and
scroll motion, class filtering, enquiries, motion preferences, the selected
navbar interaction, type errors and documentation. Future iterations should
continue the same checked, focused commit-and-push workflow.

Applied design/editing guidance includes Unslop by Damir Sokolovsky
(https://heydamir.design/unslop, CC BY 4.0), ECC frontend design direction,
interface details and accessibility, plus anti-slop, anti-ai-slop-writing,
deslop and unslop-writing. Motion guidance was consulted while retaining native
browser animation rather than adding another framework.

## Verification so far

- The initial local site and all nine public routes responded with HTTP 200.
  Both editors and their read APIs also returned successfully on localhost.
- Initial lint passed. After importing the newer GitHub source, the production
  build and all six existing tests passed.
- The initial homepage had no browser console errors and no horizontal
  overflow at the first desktop review. The mobile menu opens and contains the
  public routes and admissions link.
- Existing tests include source/asset assertions and YouTube input validation.
  The redesigned layouts and interactions also passed the browser checks above.
