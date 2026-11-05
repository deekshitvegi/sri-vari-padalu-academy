"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeVideoId } from "../youtube";

export function YouTubePlayer({ url, title, playlistId }: { url: string; title: string; playlistId?: string }) {
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const id = playlistId && /^UU[\w-]{22}$/.test(playlistId) ? playlistId : youtubeVideoId(url);
  if (!id) return null;
  return <div className="youtube-player">
    {loadedId === id ? <iframe
      src={playlistId ? `https://www.youtube-nocookie.com/embed/videoseries?list=${id}&playsinline=1` : `https://www.youtube-nocookie.com/embed/${id}?playsinline=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    /> : <button type="button" onClick={() => setLoadedId(id)} aria-label={`Load YouTube player: ${title}`}>
      <Play aria-hidden="true" /><span>Play video</span><small>Loads the YouTube player</small>
    </button>}
  </div>;
}
