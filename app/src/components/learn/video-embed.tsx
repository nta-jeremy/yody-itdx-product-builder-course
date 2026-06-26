/**
 * VideoEmbed — Server Component rendering either:
 *   - YouTube URL (`youtube.com/embed/...` or `youtu.be/...`) → `<iframe>`
 *     with `loading="lazy"` for performance + privacy-preserving params.
 *   - Direct video file (mp4/webm/...) → `<video controls>` tag.
 *
 * Detection is by URL substring — no full URL parser. Provider list
 * limited to YouTube + direct files for Phase 5; Vimeo/Mux etc. is
 * Phase production work (see plan Phase 5 §Risk).
 *
 * YODY DS: token colors via Tailwind. No emoji. Width is full-bleed within
 * the prose column; aspect-video keeps 16:9 ratio for iframe.
 */

export interface VideoEmbedProps {
  url: string;
  duration: number;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function VideoEmbed({ url }: VideoEmbedProps) {
  const titleAttr = "Video pre-read";
  if (isYouTubeUrl(url)) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg border border-border">
        <iframe
          src={url}
          title={titleAttr}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <video
      src={url}
      title={titleAttr}
      controls
      preload="metadata"
      className="w-full rounded-lg border border-border"
    >
      Track phụ đề nếu có
    </video>
  );
}

export default VideoEmbed;
