import type { AcademyVideo } from "../data";
import { youtubeChannelId, youtubeVideoId } from "../youtube";
import { YouTubePlayer } from "./youtube-player";

export function VideoGallery({ videos, channelId = "" }: { videos: AcademyVideo[]; channelId?: string }) {
  const published = videos.filter((video) => video.published && youtubeVideoId(video.url));
  const channel = youtubeChannelId(channelId);
  if (!channel && published.length === 0) return null;
  return <section id="videos" className="video-section section-shell" aria-labelledby="videos-heading">
    <h2 id="videos-heading">Videos</h2>
    <p>Performances and livestreams from the academy’s YouTube channel.</p>
    {channel && <article className="video-card video-uploads">
      <YouTubePlayer url="" title="Latest videos from Sri Vari Padalu Academy" playlistId={`UU${channel.slice(2)}`} />
      <div className="video-card-copy"><h3>Latest uploads</h3><p>New videos from the academy’s channel appear here. Use the playlist menu in the player to choose one.</p><a href={`https://www.youtube.com/channel/${channel}/live`} target="_blank" rel="noreferrer">Live broadcasts on YouTube</a></div>
    </article>}
    <div className="video-grid">{published.map((video) => <article key={video.id} className="video-card">
      <YouTubePlayer url={video.url} title={video.title} />
      <div className="video-card-copy"><p className="kicker">{video.kind === "livestream" ? "Livestream" : "Performance"}</p>
        <h3>{video.title}</h3>{video.description && <p>{video.description}</p>}
        <a href={`https://www.youtube.com/watch?v=${youtubeVideoId(video.url)}`} target="_blank" rel="noreferrer">Watch on YouTube</a>
      </div>
    </article>)}</div>
    <p className="video-help">Livestreams start playing when the broadcast begins. If a video does not play here, use its Watch on YouTube link.</p>
  </section>;
}
