import { cn } from "@/lib/cn";

export type ClipSource = { webm: string; mp4: string; poster: string };

type ClipProps = {
  /** Names the recording for GA's `video_play` event. */
  id: string;
  light: ClipSource;
  dark?: ClipSource;
  /** Says what the recording shows, for screen readers. */
  label: string;
  caption?: React.ReactNode;
  width: number;
  height: number;
};

const videoClasses = "h-auto w-full rounded-control border border-rule bg-surface";

// Nothing downloads until play: preload="none" with a poster, so the page weight stays the same.
function Video({
  source,
  className,
  ...rest
}: Omit<ClipProps, "light" | "dark" | "caption"> & { source: ClipSource; className: string }) {
  return (
    <video
      controls
      muted
      loop
      playsInline
      preload="none"
      poster={source.poster}
      width={rest.width}
      height={rest.height}
      aria-label={rest.label}
      data-track-video={rest.id}
      className={cn(videoClasses, className)}
    >
      <source src={source.webm} type='video/webm; codecs="av01.0.09M.08"' />
      <source src={source.mp4} type="video/mp4" />
    </video>
  );
}

export function Clip({ light, dark, caption, ...props }: ClipProps) {
  return (
    <figure className="grid gap-2">
      <Video {...props} source={light} className={dark ? "dark:hidden" : ""} />
      {dark && <Video {...props} source={dark} className="hidden dark:block" />}
      {caption && <figcaption className="text-xs text-muted">{caption}</figcaption>}
    </figure>
  );
}
