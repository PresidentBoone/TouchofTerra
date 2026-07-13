import { cn } from "@/lib/cn";

type Props = {
  mp4: string;
  poster: string;
  className?: string;
};

/** Native, lazy-loaded video with a poster frame. Keyboard-accessible. */
export const VideoTestimonial = ({ mp4, poster, className }: Props) => (
  <video
    controls
    preload="none"
    poster={poster}
    playsInline
    className={cn(
      "w-full rounded-2xl bg-tot-ink shadow-[var(--tot-shadow-lg)]",
      className,
    )}
  >
    <source src={mp4} type="video/mp4" />
    Your browser doesn&apos;t support embedded video.
  </video>
);
