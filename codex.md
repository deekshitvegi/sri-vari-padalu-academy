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

### Responsive layout and hero simplification, 2026-11-07

The owner said the site looked bad at some device ratios. While the audit was
running, the owner supplied a screenshot of the hero and explicitly said it was
congested with too many buttons. They also objected to inconsistent pictures:
the first photo appeared on the right while the next disciplines filled the
background. This latest feedback supersedes the automatic preview toolbar
described in the November 6 checkpoint.

The hero now has three text tabs and one main Find a class action. Removed its
pause/play toolbar, progress bar, drag hint, arrow buttons, second action, counter
and repeated large program title. There is no automatic rotation. All three
photographs use one stable frame with object-fit contain, preserving their
composition and position while switching. Click/tap, keyboard arrows/Home/End,
native horizontal drag/swipe, photo transitions and program-aware enquiries
remain. Phones stack the photo above the copy; wider layouts use two columns.
The floating enquiry launcher is hidden on the homepage, whose fixed header
already provides Enquire. Other photos and saved content were not replaced.

The responsive audit reproduced clipped program labels at 621–768 pixels and
an unnecessarily tall 820–928px hero in short phone landscape. The shared
`app/responsive.css` now supplies fluid gutters/spacing, safe-area insets,
content-sized grid tracks, earlier stacking of program/faculty/contact/schedule
layouts, readable full-width program cards on narrow screens, and compact
landscape enquiry/navigation controls. Inputs retain 16px text to avoid iOS
focus zoom. Short drawers scroll their body while the close and phone controls
remain visible. The hero's short-landscape height is now about 477px at 844×390,
with no overlapping copy or image.

Verification: 25 homepage viewports from 320×568 through 2560×1440, including
620/621, 700/701 and 960/961 boundary pairs, plus 667×375 and 844×390 landscape.
All eight interior routes were also checked at six sizes each (48 route/size
checks). These checks found no horizontal overflow, clipped tested containers,
or content beyond the viewport. The final observations are in ignored
`.codex-local/responsive-audit-2026-11-07.json`. Screenshots were inspected inline.
These viewport checks do not imply physical-device testing on every browser.

Native browser interactions confirmed Kuchipudi and Sangeetham preserve the
exact same 560×680 desktop frame; End selects Sangeetham and the class action
opens its enquiry. A native mouse drag changed the photo to Kuchipudi. At
667×375 the enquiry body scrolls within a 560×375 drawer, and the expanded
navigation stays within the screen with its list scrollable. Escape closes both.
No browser console errors were reported. Lint, production build, TypeScript and
all eight tests pass. Hero simplification is commit `4ea91a3`; responsive layout
fixes are `093e262`. Both were pushed normally to main. Keep the development
server available at localhost:3000.

### Further interaction revision, 2026-11-06

The owner again said the site did not feel interactive. Do not treat the earlier
discipline switcher and scroll entrances as acceptance of the overall result.
The work now gives each main homepage section an explicit action and visible
state change, while retaining the same supporting photography and saved content.

- `EnquiryProvider` supplies a native modal drawer on public routes. Header
  Enquire and the persistent Find your class action open it. Choose a discipline,
  a saved class time (or ask for help), then visitor details and an enquiry review.
  The final action opens an email draft; it never claims to send or book a class.
  No enquiry details are stored in localStorage, D1 or an external service.
- Class-option helpers filter by program/day and exclude independent practice
  from attendable class choices. Tests cover cross-program filtering, stable
  session IDs, missing schedules and safe email-draft encoding.
- The homepage program cards switch their description, training highlights,
  class count and enquiry in place. Faculty rows expand/collapse biographies.
  The original archive photo opens in a full-size native dialog. The schedule
  now filters by discipline/day; each time opens an enquiry with that exact batch.
- The hero choices are beside the introduction rather than at the bottom of a
  tall stage. It cycles every six seconds with visible pause/play and progress.
  Manual tab, arrow, swipe or keyboard choices stop cycling. Keyboard focus and
  modal focus stop it; leaving the viewport or hiding the tab suspends its timer.
  Reduced motion and the persistent global pause disable the preview controls.
  The selected Maps portrait remains the opening photo; no supporting photo
  defaults or saved database fields were changed in this revision.
- At 390×844, hero choices finish at about 526px and playback controls at 588px.
  The enquiry drawer fits the phone width and keeps its body independently
  scrollable. A mobile faculty selector clash was caught and fixed.

Verified with real browser clicks: program panel switch, teacher disclosure,
exact Kuchipudi batch carried into enquiry details, empty-name validation,
review and encoded email draft, archive photo open/close, Escape and focus return.
The hero advanced from Kuchipudi to Sangeetham after six seconds; pausing held
its selection. End selected Sangeetham and Arrow Right wrapped to Bharatanatyam.
Global Pause animations disabled the hero preview and showed Motion is paused.
Desktop 1440×900, tablet 768×1024 and phone 390×844 have no horizontal overflow.
All eight interior public routes were rechecked at phone width, with one enquiry
launcher per page and no overflow. No console errors were reported. Lint,
TypeScript, production build and eight tests pass. The enquiry, homepage and hero
commits are `42da6d8`, `71684e2` and `b3e6a14`. The first two were published by
normal Git push. Repeated local DNS failures blocked the last two pushes, so the
connected GitHub service published their trees and commits with normal
fast-forward ref updates and an expected-head check. Published tree hashes match
the tested files. The unpublished local commit versions are retained on
`codex/interactive-local-snapshot`; main is synchronized to the equivalent
published history using imported commit objects verified against GitHub's hashes.
No force push, remote change, or working-file reset was used.
The Chrome DevTools browser was used for this pass because the installed in-app
browser skill file was missing. Screenshots were inspected inline; that tool
denied file output paths, so no new saved screenshot files are claimed.

### Owner revision after the first UI pass

The owner rejected the large ivory brand card and said the result still felt
static. The owner also explicitly questioned showing both "Sri Vari Padalu"
and "SVP Academy". Show one full academy name in the header, without a repeated
monogram, subtitle, logo tile or separate brand card. The earlier visual pass
was not approved simply because its checks passed.

The narrow preview had hidden the morphing navigation behind a hamburger.
Replace that split layout with one unified expanding header at every width.
On phones the name and enquiry link occupy the first row; the three expanding
navigation controls stay visible on the second row. On desktop it is one row.
Click/tap must visibly open and close panels, with keyboard access retained.

The homepage revision added an explicit, visible program selector that
changes the image, program details and class links. The user should not have
to discover a subtle hover effect before the page feels interactive.

The owner supplied four Maps photographs as alternatives for the top image on
the homepage. Scope clarification: ONLY the opening hero picture should
change. Do not replace the archive, schedule, faculty or gallery photographs.
Two supporting images were temporarily replaced during exploration and were
restored immediately after the owner corrected the scope, in both code and the
local content database. Their unused public image files were removed.

Selected hero: the kneeling red-and-gold performance portrait from
https://maps.app.goo.gl/Vgq4BH88wBHeqqTm8 , saved unchanged as
`public/academy/hero/academy-maps-portrait.jpg`. Keep it editable through the
home editor's Opening stage portrait field. The user's other hero alternatives:

- https://maps.app.goo.gl/uW9rgZPdrFN17KQ79
- https://maps.app.goo.gl/EXw86c9Zv7CtqPiN7
- https://maps.app.goo.gl/EZuH5EvWz44xKBef6

The limited Maps viewer ignored photo IDs and displayed its default gallery
image for every link. That first candidate was wrong and is not used. Retrieve
the specific image URL encoded after `!6s` in each resolved Maps share URL and
visually verify the download. Only the hero photo is retained in public assets.
Home archive and schedule remain `/academy/gallery/gallery-13.webp` and
`/academy/hero/story-portrait.webp` respectively. The original local values
were restored from `.codex-local/content-before-maps-photo-set.json`.

Revision verification: lint, TypeScript, production build and all six existing
tests pass. In the browser, choosing Kuchipudi changed the active image and
program link; End selected Sangeetham; Next wrapped to Bharatanatyam; a real
mouse drag changed the program. At 390×844 the tabs end at 836px and the page
has no horizontal overflow. Desktop was inspected at 1440×900. The header has
one full name and its three menu controls remain visible at phone width.
A deep comparison with the pre-photo content backup found exactly one saved
content change: `home.realDancerImage`. The supporting photographs are restored.
Fresh screenshots are in `.codex-local/qa/revision`, and the design evidence
record passed the local checker. The revised header and interactive stage were
pushed as `0be8c6c` and `7c778b3`; the final photo/credit update follows them.

### Previous UI pass

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
- Shared frame: `app/components/site-frame.tsx`. Interactive program hero:
  `app/components/discipline-stage.tsx` (replaces the old lineage-growth file).
  Header styles are in `app/navigation.css` and hero styles in `app/stage.css`.
  Gallery and reusable page sections have
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
