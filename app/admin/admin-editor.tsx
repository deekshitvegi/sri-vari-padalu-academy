"use client";

import { channelValidationError, videoValidationError, youtubeChannelId, youtubeVideoId } from "../youtube";
import { YouTubePlayer } from "../components/youtube-player";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ExternalLink, ImagePlus, LoaderCircle, LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { defaultSiteContent, type SiteContent } from "../data";

type Section = "overview" | "home" | "pages" | "supporting" | "programs" | "faculty" | "schedule" | "events" | "stories" | "gallery" | "videos" | "media";
type AdminGroup = "site" | "learning" | "calendar" | "stories" | "media";
type MediaAsset = { id: string; name: string; contentType: string; size: number; createdAt?: string; src?: string };
const sections: { id: Section; label: string; group: AdminGroup }[] = [
  { id: "overview", label: "Academy details", group: "site" }, { id: "home", label: "Home page", group: "site" }, { id: "pages", label: "Page heroes", group: "site" }, { id: "supporting", label: "More page copy", group: "site" },
  { id: "programs", label: "Programs", group: "learning" }, { id: "faculty", label: "Faculty", group: "learning" },
  { id: "schedule", label: "Class schedule", group: "calendar" }, { id: "events", label: "Events", group: "calendar" },
  { id: "stories", label: "Student stories", group: "stories" }, { id: "gallery", label: "Gallery", group: "stories" }, { id: "videos", label: "YouTube videos", group: "media" }, { id: "media", label: "Media library", group: "media" },
];
const groups: { id: AdminGroup; label: string; description: string }[] = [
  { id: "site", label: "Site", description: "Identity and page copy" },
  { id: "learning", label: "Learning", description: "Programs and faculty" },
  { id: "calendar", label: "Calendar", description: "Classes and events" },
  { id: "stories", label: "Stories", description: "Stories and gallery" },
  { id: "media", label: "Media", description: "Videos and uploaded images" },
];

const uid = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
const cloneDefaults = () => structuredClone(defaultSiteContent);

export function AdminEditor({ adminName, local }: { adminName: string; local: boolean }) {
  const [content, setContent] = useState<SiteContent>(cloneDefaults);
  const [section, setSection] = useState<Section>("overview");
  const activeGroup = sections.find((item) => item.id === section)?.group ?? "site";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [contentResponse, mediaResponse] = await Promise.all([fetch("/api/content", { cache: "no-store" }), fetch("/api/media", { cache: "no-store" })]);
      if (!contentResponse.ok) throw new Error("Could not load website content.");
      const contentPayload = await contentResponse.json() as { content: SiteContent };
      setContent(contentPayload.content);
      if (mediaResponse.ok) {
        const mediaPayload = await mediaResponse.json() as { assets: MediaAsset[] };
        setAssets(mediaPayload.assets.map((asset) => ({ ...asset, src: `/media/${asset.id}` })));
      }
      setDirty(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not load the admin."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(recipe: (draft: SiteContent) => void) {
    setContent((previous) => { const next = structuredClone(previous); recipe(next); return next; });
    setDirty(true); setMessage("");
  }

  async function save() {
    const videoError = channelValidationError(content.youtubeChannelId) ?? videoValidationError(content.videos);
    if (videoError) { setMessage(videoError); return; }
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not save changes.");
      setDirty(false); setMessage("All website changes are live.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setSaving(false); }
  }

  async function upload(file: File) {
    const form = new FormData(); form.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body: form });
    const payload = await response.json() as { asset?: MediaAsset & { src: string }; error?: string };
    if (!response.ok || !payload.asset) throw new Error(payload.error ?? "Upload failed.");
    setAssets((items) => [payload.asset!, ...items]);
    return payload.asset.src;
  }

  async function deleteAsset(id: string) {
    if (!window.confirm("Delete this uploaded image? Existing pages using it will show a broken image until replaced.")) return;
    const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (!response.ok) { setMessage("The image could not be deleted."); return; }
    setAssets((items) => items.filter((item) => item.id !== id));
  }

  if (loading) return <div className="admin-loading"><LoaderCircle /> Loading website content…</div>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>SVP</span><div><strong>Website admin</strong><small>{adminName}</small></div></div>
        <nav aria-label="Admin areas">{groups.map((group) => <button key={group.id} className={activeGroup === group.id ? "active" : ""} onClick={() => setSection(sections.find((item) => item.group === group.id)!.id)}><strong>{group.label}</strong><small>{group.description}</small></button>)}</nav>
        <div className="admin-sidebar-links"><Link href="/"><ArrowLeft /> View website</Link>{!local && <Link href="/signout-with-chatgpt?return_to=/"><LogOut /> Sign out</Link>}</div>
      </aside>
      <main className="admin-main">
        <header className="admin-toolbar">
          <div><p>Content management</p><h1>{sections.find((item) => item.id === section)?.label}</h1></div>
          <div className="admin-toolbar-actions"><a href="/" target="_blank" rel="noreferrer">Preview <ExternalLink /></a><button className="admin-save" disabled={!dirty || saving} onClick={() => void save()}>{saving ? <LoaderCircle /> : dirty ? <Save /> : <Check />}{saving ? "Saving…" : dirty ? "Save changes" : "Saved"}</button></div>
        </header>
        <nav className="admin-subtabs" aria-label="Current admin area">{sections.filter((item) => item.group === activeGroup).map((item) => <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => setSection(item.id)}>{item.label}</button>)}</nav>
        {message && <p className={`admin-message ${dirty ? "error" : ""}`} role="status">{message}</p>}
        {local && <p className="admin-local-note">Local admin mode is active. The deployed admin is protected by sign-in and can be restricted with <strong>ADMIN_EMAILS</strong>.</p>}
        {section === "overview" && <AdminSection title="Academy identity and contact" copy="These details appear throughout the site, including the header, footer, contact page, and call-to-action links.">
          <FieldGrid>
            <Field label="Academy name" value={content.academy.name} onChange={(value) => update((draft) => { draft.academy.name = value; })} />
            <Field label="Short name" value={content.academy.shortName} onChange={(value) => update((draft) => { draft.academy.shortName = value; })} />
            <Field label="Tagline" value={content.academy.tagline} onChange={(value) => update((draft) => { draft.academy.tagline = value; })} />
            <Field label="Subtitle" value={content.academy.subtitle} onChange={(value) => update((draft) => { draft.academy.subtitle = value; })} />
            <Field wide multiline label="Description" value={content.academy.description} onChange={(value) => update((draft) => { draft.academy.description = value; })} />
            <Field label="Phone display" value={content.academy.phone} onChange={(value) => update((draft) => { draft.academy.phone = value; })} />
            <Field label="Phone link" value={content.academy.phoneHref} onChange={(value) => update((draft) => { draft.academy.phoneHref = value; })} />
            <Field label="Email" type="email" value={content.academy.email} onChange={(value) => update((draft) => { draft.academy.email = value; })} />
            <Field wide multiline label="Address" value={content.academy.address} onChange={(value) => update((draft) => { draft.academy.address = value; })} />
            <Field label="Instagram URL" value={content.academy.instagram} onChange={(value) => update((draft) => { draft.academy.instagram = value; })} />
            <Field label="YouTube URL" value={content.academy.youtube} onChange={(value) => update((draft) => { draft.academy.youtube = value; })} />
          </FieldGrid>
        </AdminSection>}

        {section === "home" && <>
          <AdminSection title="Interactive hero" copy="The sculpture is the default image. Moving over it reveals the real dancer through a soft circular lens."><FieldGrid>
            <Field label="Eyebrow" value={content.home.heroEyebrow} onChange={(value) => update((d) => { d.home.heroEyebrow = value; })} />
            <Field label="Main title" value={content.home.heroTitle} onChange={(value) => update((d) => { d.home.heroTitle = value; })} />
            <Field label="Accent title" value={content.home.heroAccent} onChange={(value) => update((d) => { d.home.heroAccent = value; })} />
            <Field wide multiline label="Hero copy" value={content.home.heroCopy} onChange={(value) => update((d) => { d.home.heroCopy = value; })} />
            <ImageField label="Real dancer image" value={content.home.realDancerImage} onChange={(value) => update((d) => { d.home.realDancerImage = value; })} upload={upload} />
            <ImageField label="Sculpture image" value={content.home.sculptureImage} onChange={(value) => update((d) => { d.home.sculptureImage = value; })} upload={upload} />
          </FieldGrid></AdminSection>
          <AdminSection title="Home page sections"><FieldGrid>
            {(["manifestoEyebrow","manifestoTitle","manifestoAccent","manifestoCopy","programsEyebrow","programsTitle","programsCopy","archiveEyebrow","archiveTitle","scheduleEyebrow","scheduleTitle","scheduleCopy"] as const).map((key) => <Field key={key} wide={key.toLowerCase().includes("copy")} multiline={key.toLowerCase().includes("copy")} label={humanize(key)} value={content.home[key]} onChange={(value) => update((d) => { d.home[key] = value; })} />)}
            <ImageField label="Archive image" value={content.home.archiveImage} onChange={(value) => update((d) => { d.home.archiveImage = value; })} upload={upload} />
            <ImageField label="Schedule image" value={content.home.scheduleImage} onChange={(value) => update((d) => { d.home.scheduleImage = value; })} upload={upload} />
          </FieldGrid></AdminSection>
        </>}

        {section === "pages" && <AdminSection title="Page hero content" copy="Edit the first image and headline visitors see on every page."><div className="admin-record-list">
          {Object.entries(content.pageHeroes).map(([key, hero]) => <RecordCard key={key} title={humanize(key)}><FieldGrid>
            <Field label="Eyebrow" value={hero.eyebrow} onChange={(value) => update((d) => { d.pageHeroes[key].eyebrow = value; })} />
            <Field label="Title" value={hero.title} onChange={(value) => update((d) => { d.pageHeroes[key].title = value; })} />
            <Field wide multiline label="Copy" value={hero.copy} onChange={(value) => update((d) => { d.pageHeroes[key].copy = value; })} />
            <ImageField label="Image" value={hero.image} onChange={(value) => update((d) => { d.pageHeroes[key].image = value; })} upload={upload} />
            <Field label="Image description" value={hero.imageAlt} onChange={(value) => update((d) => { d.pageHeroes[key].imageAlt = value; })} />
          </FieldGrid></RecordCard>)}
        </div></AdminSection>}

        {section === "supporting" && <>
          <AdminSection title="About page"><FieldGrid><Field wide multiline label="Opening statement" value={content.about.statement} onChange={(v) => update((d) => { d.about.statement = v; })} /><Field wide label="Statement accent" value={content.about.statementAccent} onChange={(v) => update((d) => { d.about.statementAccent = v; })} /><Field wide multiline label="Purpose" value={content.about.purpose} onChange={(v) => update((d) => { d.about.purpose = v; })} /><ImageField label="About image" value={content.about.image} onChange={(v) => update((d) => { d.about.image = v; })} upload={upload} /><Field label="Image label" value={content.about.imageLabel} onChange={(v) => update((d) => { d.about.imageLabel = v; })} /></FieldGrid></AdminSection>
          <AdminSection title="Contact and global call to action"><FieldGrid><Field label="Contact heading" value={content.contact.introTitle} onChange={(v) => update((d) => { d.contact.introTitle = v; })} /><Field wide multiline label="Contact introduction" value={content.contact.introCopy} onChange={(v) => update((d) => { d.contact.introCopy = v; })} /><Field label="CTA eyebrow" value={content.cta.eyebrow} onChange={(v) => update((d) => { d.cta.eyebrow = v; })} /><Field label="CTA title" value={content.cta.title} onChange={(v) => update((d) => { d.cta.title = v; })} /><Field wide multiline label="CTA copy" value={content.cta.copy} onChange={(v) => update((d) => { d.cta.copy = v; })} /><Field label="CTA button label" value={content.cta.label} onChange={(v) => update((d) => { d.cta.label = v; })} /><Field label="CTA button link" value={content.cta.href} onChange={(v) => update((d) => { d.cta.href = v; })} /></FieldGrid></AdminSection>
          <Collection title="Admissions FAQs" addLabel="Add question" onAdd={() => update((d) => d.admissions.faqs.push({ id: uid("faq"), question: "New question", answer: "Add the answer here." }))}>
            <Field wide multiline label="Admissions introduction" value={content.admissions.intro} onChange={(v) => update((d) => { d.admissions.intro = v; })} />
            {content.admissions.faqs.map((faq, index) => <RecordCard key={faq.id} title={faq.question} onDelete={() => confirmDelete("FAQ", () => update((d) => d.admissions.faqs.splice(index, 1)))}><FieldGrid><Field wide label="Question" value={faq.question} onChange={(v) => update((d) => { d.admissions.faqs[index].question = v; })} /><Field wide multiline label="Answer" value={faq.answer} onChange={(v) => update((d) => { d.admissions.faqs[index].answer = v; })} /></FieldGrid></RecordCard>)}
          </Collection>
        </>}

        {section === "programs" && <Collection title="Programs" addLabel="Add program" onAdd={() => update((d) => d.programs.push({ id: uid("program"), slug: "new-program", name: "New program", eyebrow: "", description: "", history: "", highlights: [], image: "/academy/programs/bharatnatyam.webp" }))}>
          {content.programs.map((item, index) => <RecordCard key={item.id} title={item.name} onDelete={() => confirmDelete("program", () => update((d) => d.programs.splice(index, 1)))}><FieldGrid>
            <Field label="Name" value={item.name} onChange={(v) => update((d) => { d.programs[index].name = v; })} /><Field label="URL slug" value={item.slug} onChange={(v) => update((d) => { d.programs[index].slug = slugify(v); })} />
            <Field label="Eyebrow" value={item.eyebrow} onChange={(v) => update((d) => { d.programs[index].eyebrow = v; })} /><ImageField label="Image" value={item.image} onChange={(v) => update((d) => { d.programs[index].image = v; })} upload={upload} />
            <Field wide multiline label="Description" value={item.description} onChange={(v) => update((d) => { d.programs[index].description = v; })} /><Field wide multiline label="History" value={item.history} onChange={(v) => update((d) => { d.programs[index].history = v; })} />
            <Field wide multiline label="Highlights (one per line)" value={item.highlights.join("\n")} onChange={(v) => update((d) => { d.programs[index].highlights = lines(v); })} />
          </FieldGrid></RecordCard>)}
        </Collection>}

        {section === "faculty" && <Collection title="Faculty" addLabel="Add faculty member" onAdd={() => update((d) => d.faculty.push({ id: uid("faculty"), name: "New faculty member", role: "Instructor", specialty: "", experience: "", description: "", image: "/academy/faculty/rama-devi.webp" }))}>
          {content.faculty.map((item, index) => <RecordCard key={item.id} title={item.name} onDelete={() => confirmDelete("faculty member", () => update((d) => d.faculty.splice(index, 1)))}><FieldGrid>
            <Field label="Name" value={item.name} onChange={(v) => update((d) => { d.faculty[index].name = v; })} /><Field label="Role" value={item.role} onChange={(v) => update((d) => { d.faculty[index].role = v; })} />
            <Field label="Specialty" value={item.specialty} onChange={(v) => update((d) => { d.faculty[index].specialty = v; })} /><Field label="Experience" value={item.experience} onChange={(v) => update((d) => { d.faculty[index].experience = v; })} />
            <Field wide multiline label="Description" value={item.description} onChange={(v) => update((d) => { d.faculty[index].description = v; })} /><ImageField label="Portrait" value={item.image} onChange={(v) => update((d) => { d.faculty[index].image = v; })} upload={upload} />
          </FieldGrid></RecordCard>)}
        </Collection>}

        {section === "schedule" && <Collection title="Class schedule" addLabel="Add schedule" onAdd={() => update((d) => d.classTimings.push({ id: uid("schedule"), days: "New day", sessions: [["Batch", "Time", "Program"]] }))}>
          {content.classTimings.map((item, index) => <RecordCard key={item.id} title={item.days} onDelete={() => confirmDelete("schedule", () => update((d) => d.classTimings.splice(index, 1)))}><FieldGrid>
            <Field wide label="Days" value={item.days} onChange={(v) => update((d) => { d.classTimings[index].days = v; })} /><Field wide multiline label="Sessions — Batch | Time | Program (one per line)" value={item.sessions.map((session) => session.join(" | ")).join("\n")} onChange={(v) => update((d) => { d.classTimings[index].sessions = sessionLines(v); })} />
          </FieldGrid></RecordCard>)}
        </Collection>}

        {section === "events" && <Collection title="Events" addLabel="Add event" onAdd={() => update((d) => d.events.unshift({ id: uid("event"), title: "New event", date: "", time: "", venue: "", description: "", type: "Performance" }))}>
          {content.events.map((item, index) => <RecordCard key={item.id} title={item.title} onDelete={() => confirmDelete("event", () => update((d) => d.events.splice(index, 1)))}><FieldGrid>
            <Field label="Title" value={item.title} onChange={(v) => update((d) => { d.events[index].title = v; })} /><Field label="Type" value={item.type} onChange={(v) => update((d) => { d.events[index].type = v; })} /><Field label="Date" value={item.date} onChange={(v) => update((d) => { d.events[index].date = v; })} /><Field label="Time" value={item.time} onChange={(v) => update((d) => { d.events[index].time = v; })} /><Field wide label="Venue" value={item.venue} onChange={(v) => update((d) => { d.events[index].venue = v; })} /><Field wide multiline label="Description" value={item.description} onChange={(v) => update((d) => { d.events[index].description = v; })} />
          </FieldGrid></RecordCard>)}
        </Collection>}

        {section === "stories" && <Collection title="Student stories" addLabel="Add chapter" onAdd={() => update((d) => d.stories.push({ id: uid("story"), number: String(d.stories.length + 1).padStart(2,"0"), title: "New chapter", copy: "", image: "/academy/gallery/gallery-07.webp", icon: "sparkles" }))}>
          {content.stories.map((item, index) => <RecordCard key={item.id} title={item.title} onDelete={() => confirmDelete("story", () => update((d) => d.stories.splice(index, 1)))}><FieldGrid>
            <Field label="Number" value={item.number} onChange={(v) => update((d) => { d.stories[index].number = v; })} /><Field label="Title" value={item.title} onChange={(v) => update((d) => { d.stories[index].title = v; })} /><Field wide multiline label="Story copy" value={item.copy} onChange={(v) => update((d) => { d.stories[index].copy = v; })} /><ImageField label="Image" value={item.image} onChange={(v) => update((d) => { d.stories[index].image = v; })} upload={upload} /><SelectField label="Icon" value={item.icon} options={["footprints","music","sparkles"]} onChange={(v) => update((d) => { d.stories[index].icon = v as typeof item.icon; })} />
          </FieldGrid></RecordCard>)}
        </Collection>}

        {section === "gallery" && <Collection title="Gallery" addLabel="Add gallery image" onAdd={() => update((d) => d.galleryImages.unshift({ id: uid("gallery"), src: "/academy/gallery/gallery-01.webp", alt: "Academy performance", orientation: "landscape" }))}>
          <div className="admin-gallery-grid">{content.galleryImages.map((item, index) => <RecordCard key={item.id} title={item.alt} onDelete={() => confirmDelete("gallery item", () => update((d) => d.galleryImages.splice(index, 1)))}><div className="admin-image-preview"><Image src={item.src} alt="" fill sizes="260px" unoptimized /></div><FieldGrid><ImageField label="Image" value={item.src} onChange={(v) => update((d) => { d.galleryImages[index].src = v; })} upload={upload} /><Field label="Accessible description" value={item.alt} onChange={(v) => update((d) => { d.galleryImages[index].alt = v; })} /><SelectField label="Orientation" value={item.orientation} options={["landscape","portrait","square"]} onChange={(v) => update((d) => { d.galleryImages[index].orientation = v as typeof item.orientation; })} /></FieldGrid></RecordCard>)}</div>
        </Collection>}

        {section === "videos" && <>
          <AdminSection title="YouTube performances and livestreams" copy="Paste a YouTube video, Share, Shorts, or live-event link. Published videos appear on the Gallery page; drafts stay hidden. Enable embedding in YouTube Studio. Schedule livestreams on YouTube first, then paste the event’s video link here.">
            <a href="/gallery#videos" target="_blank" rel="noreferrer">View videos on the website <ExternalLink size={16} /></a>
          </AdminSection>
          <AdminSection title="Automatic channel uploads" copy="Connect the academy’s channel once. YouTube keeps the uploads playlist current automatically. This does not automatically detect live broadcasts; add a livestream entry below to pin one here.">
            <button type="button" className="admin-add" onClick={async () => {
              setMessage("Connecting to YouTube…");
              try {
                const response = await fetch(`/api/youtube-channel?url=${encodeURIComponent(content.academy.youtube)}`);
                const payload = await response.json() as { channelId?: string; error?: string };
                if (!response.ok || !payload.channelId) throw new Error(payload.error ?? "Could not connect channel.");
                update((d) => { d.youtubeChannelId = payload.channelId!; });
                setMessage("Channel connected. Save changes to publish automatic uploads.");
              } catch (error) { setMessage(error instanceof Error ? error.message : "Could not connect channel."); }
            }}>Connect academy YouTube channel</button>
            <Field label="YouTube channel ID or /channel/ URL" value={content.youtubeChannelId} onChange={(v) => update((d) => { d.youtubeChannelId = v; })} />
            <p>Find your channel ID in YouTube Studio → Settings → Channel → Advanced settings → Manage YouTube account → Advanced settings. Leave empty to hide automatic uploads.</p>
            {youtubeChannelId(content.youtubeChannelId) && <YouTubePlayer url="" title="Automatic uploads preview" playlistId={`UU${youtubeChannelId(content.youtubeChannelId)!.slice(2)}`} />}
          </AdminSection>
          <Collection title="Videos" addLabel="Add YouTube video" onAdd={() => update((d) => d.videos.unshift({ id: uid("video"), title: "New performance", url: "", description: "", kind: "performance", published: false }))}>
            {content.videos.length === 0 && <p>Add your first performance or livestream using its YouTube link.</p>}
            {content.videos.map((video, index) => <RecordCard key={video.id} title={video.title} onDelete={() => confirmDelete("video", () => update((d) => d.videos.splice(index, 1)))}>
              <FieldGrid>
                <Field label="Video title" value={video.title} onChange={(v) => update((d) => { d.videos[index].title = v; })} />
                <Field label="YouTube video or livestream URL" type="url" value={video.url} onChange={(v) => update((d) => { d.videos[index].url = v; })} />
                <Field wide multiline label="Description or broadcast time" value={video.description} onChange={(v) => update((d) => { d.videos[index].description = v; })} />
                <SelectField label="Video type" value={video.kind} options={["performance", "livestream"]} onChange={(v) => update((d) => { d.videos[index].kind = v as typeof video.kind; })} />
                <SelectField label="Visibility" value={video.published ? "published" : "draft"} options={["draft", "published"]} onChange={(v) => update((d) => { d.videos[index].published = v === "published"; })} />
              </FieldGrid>
              {youtubeVideoId(video.url) ? <YouTubePlayer url={video.url} title={video.title} /> : <p>Paste a complete HTTPS YouTube video link to preview the player.</p>}
              <div className="video-order-actions"><button type="button" disabled={index === 0} onClick={() => update((d) => { [d.videos[index - 1], d.videos[index]] = [d.videos[index], d.videos[index - 1]]; })}>Move up</button><button type="button" disabled={index === content.videos.length - 1} onClick={() => update((d) => { [d.videos[index + 1], d.videos[index]] = [d.videos[index], d.videos[index + 1]]; })}>Move down</button></div>
            </RecordCard>)}
          </Collection>
        </>}

        {section === "media" && <AdminSection title="Media library" copy="Upload high-quality images once, then copy their URL into any image field. Deleting an image does not automatically remove it from pages.">
          <label className="admin-upload"><UploadCloud /><strong>Upload image</strong><span>JPEG, PNG, WebP, or AVIF · maximum 12 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setMessage("Uploading image…"); try { await upload(file); setMessage("Image uploaded."); } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); } event.target.value = ""; }} /></label>
          <div className="admin-media-grid">{assets.length === 0 && <p>No uploaded images yet. Existing bundled academy images remain available.</p>}{assets.map((asset) => <article key={asset.id}><div><Image src={asset.src ?? `/media/${asset.id}`} alt="" fill sizes="240px" unoptimized /></div><strong>{asset.name}</strong><small>{formatBytes(asset.size)}</small><div><button onClick={() => void navigator.clipboard.writeText(asset.src ?? `/media/${asset.id}`)}>Copy URL</button><button className="danger" onClick={() => void deleteAsset(asset.id)}><Trash2 /> Delete</button></div></article>)}</div>
        </AdminSection>}
      </main>
    </div>
  );
}

function AdminSection({ title, copy, children }: { title: string; copy?: string; children: ReactNode }) { return <section className="admin-section"><div className="admin-section-heading"><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{children}</section>; }
function Collection({ title, addLabel, onAdd, children }: { title: string; addLabel: string; onAdd: () => void; children: ReactNode }) { return <AdminSection title={title}><button className="admin-add" onClick={onAdd}><Plus /> {addLabel}</button><div className="admin-record-list">{children}</div></AdminSection>; }
function RecordCard({ title, onDelete, children }: { title: string; onDelete?: () => void; children: ReactNode }) { return <details className="admin-record" open><summary><strong>{title}</strong><span>{onDelete && <button type="button" className="admin-delete" onClick={(event) => { event.preventDefault(); onDelete(); }}><Trash2 /> Delete</button>}<ChevronDown /></span></summary><div className="admin-record-body">{children}</div></details>; }
function FieldGrid({ children }: { children: ReactNode }) { return <div className="admin-field-grid">{children}</div>; }
function Field({ label, value, onChange, multiline = false, wide = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; wide?: boolean; type?: string }) { return <label className={`admin-field ${wide ? "wide" : ""}`}><span>{label}</span>{multiline ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} /> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />}</label>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="admin-field"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function ImageField({ label, value, onChange, upload }: { label: string; value: string; onChange: (value: string) => void; upload: (file: File) => Promise<string> }) { const [busy, setBusy] = useState(false); return <div className="admin-field admin-image-field"><span>{label}</span><div><input value={value} onChange={(e) => onChange(e.target.value)} /><label className="admin-upload-button">{busy ? <LoaderCircle /> : <ImagePlus />}<span>{busy ? "Uploading" : "Replace"}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); try { onChange(await upload(file)); } finally { setBusy(false); event.target.value = ""; } }} /></label></div></div>; }
function humanize(value: string) { return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, (letter) => letter.toUpperCase()); }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function lines(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
function sessionLines(value: string): [string,string,string][] { return lines(value).map((line) => { const [batch = "Batch", time = "Time", program = "Program"] = line.split("|").map((item) => item.trim()); return [batch,time,program]; }); }
function confirmDelete(label: string, remove: () => void) { if (window.confirm(`Delete this ${label}? The change becomes permanent after you save.`)) remove(); }
function formatBytes(value: number) { return value > 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(1)} MB` : `${Math.round(value / 1024)} KB`; }
