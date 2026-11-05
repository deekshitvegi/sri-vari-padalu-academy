import type { AcademyVideo } from "../data";
import { youtubeChannelId, youtubeVideoId } from "../youtube";
import { YouTubePlayer } from "./youtube-player";

export function VideoGallery({ videos, channelId = "" }: { videos: AcademyVideo[]; channelId?: string }) {
  const published = videos.filter((video) => video.published && youtubeVideoId(video.url));
  const channel = youtubeChannelId(channelId);
  if (!channel && published.length === 0) return null;
  return <section id="videos" className="video-section section-shell" aria-labelledby="videos-heading">
    <p className="kicker">Watch the academy</p>
    <h2 id="videos-heading">Performances & livestreams</h2>
    <p>Experience our dance performances and join our livestreams, right here.</p>
    {channel && <article className="video-card video-uploads">
      <YouTubePlayer url="" title="Latest videos from Sri Vari Padalu Academy" playlistId={`UU${channel.slice(2)}`} />
      <div className="video-card-copy"><p className="kicker">From our YouTube channel</p><h3>Latest from the academy</h3><p>New public uploads appear in this playlist automatically. Open the player’s playlist menu to choose a video.</p><a href={`https://www.youtube.com/channel/${channel}/live`} target="_blank" rel="noreferrer">Visit our channel for live broadcasts ↗</a></div>
    </article>}
    <div className="video-grid">{published.map((video) => <article key={video.id} className="video-card">
      <YouTubePlayer url={video.url} title={video.title} />
      <div className="video-card-copy"><p className="kicker">{video.kind === "livestream" ? "Livestream" : "Performance"}</p>
        <h3>{video.title}</h3>{video.description && <p>{video.description}</p>}
        <a href={`https://www.youtube.com/watch?v=${youtubeVideoId(video.url)}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
      </div>
    </article>)}</div>
    <p className="video-help">Livestreams play when the broadcast begins. If a video is unavailable here, use “Watch on YouTube”.</p>
  </section>;
}
