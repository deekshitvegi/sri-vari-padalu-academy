# Project collaboration

This is the Sri Vari Padalu Academy website: public academy pages, a content
admin interface, and an owner-only visual design editor.

## Git workflow

- The owner wants frequent, small commits. For each completed, meaningful
  change, run relevant checks, create a descriptive commit, and push to this
  GitHub repository without asking for permission again.
- Keep commits focused. Do not create empty commits, fabricate activity,
  backdate commits, or split incomplete work solely to inflate commit counts.
- Preserve unrelated user changes. Never commit credentials, local database
  state, generated build outputs, or dependency caches.
- Use normal pushes. Never force-push or overwrite remote work. Reconcile
  remote changes safely and report permission or branch protection blockers.
- Report what changed, relevant checks, and the commit that was pushed.

## Development and feedback

- Use the existing checkout; create a worktree only if requested.
- Use Node.js >=22.13.0 and install locked dependencies with npm ci.
- Start development with npm run dev and verify the printed Local URL (normally
  http://localhost:3000/). This includes local
  Cloudflare D1/R2 emulation and local administrator/owner identities.
- Run npm run lint and npm test for applicable application changes.
- Help the owner review visual changes using an available supported preview.
  Verify accessibility before sharing addresses. Cloud localhost is internal
  and is separate from localhost on the owner's computer.
