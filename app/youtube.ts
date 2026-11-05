/** Accept individual YouTube videos, including live-event and Shorts links. */
export function youtubeVideoId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === 'youtu.be') {
      if (url.pathname.split('/').length === 2) id = url.pathname.slice(1);
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (url.pathname === '/watch' && !host.endsWith('nocookie.com')) id = url.searchParams.get('v');
      else id = url.pathname.match(/^\/(?:embed|live|shorts)\/([\w-]{11})\/?$/)?.[1] ?? null;
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function videoValidationError(videos: unknown): string | null {
  if (!Array.isArray(videos)) return 'Videos must be a list.';
  const ids = new Set<string>();
  for (const [index, video] of videos.entries()) {
    const label = `Video ${index + 1}`;
    if (!video || typeof video !== 'object' || typeof video.id !== 'string' || !video.id.trim() || ids.has(video.id)) return `${label}: invalid or duplicate video ID.`;
    ids.add(video.id);
    if (typeof video.title !== 'string' || !video.title.trim()) return `${label}: add a title.`;
    if (typeof video.url !== 'string' || !youtubeVideoId(video.url)) return `${label}: paste a valid HTTPS YouTube video or livestream link.`;
    if (typeof video.description !== 'string' || !['performance', 'livestream'].includes(video.kind) || typeof video.published !== 'boolean') return `${label}: invalid video details.`;
  }
  return null;
}

export function youtubeChannelId(value: string): string | null {
  const input = value.trim();
  if (/^UC[\w-]{22}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.username || url.password || url.port || !["youtube.com", "www.youtube.com"].includes(url.hostname)) return null;
    return url.pathname.match(/^\/channel\/(UC[\w-]{22})\/?$/)?.[1] ?? null;
  } catch { return null; }
}

export function channelValidationError(value: unknown): string | null {
  return typeof value === "string" && (value === "" || youtubeChannelId(value)) ? null : "Use a YouTube channel ID (UC…) or its /channel/ link for automatic uploads.";
}
