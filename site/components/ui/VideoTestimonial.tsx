"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  mp4: string;
  poster: string;
  /** Optional WebVTT captions file. */
  captionsSrc?: string;
  className?: string;
};

/**
 * Plays muted (no sound) while it's on screen; hover (or tap) restarts it with
 * sound. Under reduced motion it doesn't autoplay and shows native controls.
 */
export const VideoTestimonial = ({
  mp4,
  poster,
  captionsSrc,
  className,
}: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
            video.muted = true;
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  const playWithSound = () => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    void video.play().catch(() => {});
  };

  const mute = () => {
    const video = ref.current;
    if (video) video.muted = true;
  };

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    if (video.muted) playWithSound();
    else mute();
  };

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      controls={reduced}
      onMouseEnter={reduced ? undefined : playWithSound}
      onMouseLeave={reduced ? undefined : mute}
      onClick={reduced ? undefined : toggleSound}
      className={cn(
        "w-full cursor-pointer rounded-2xl bg-tot-ink shadow-[var(--tot-shadow-lg)]",
        className,
      )}
    >
      <source src={mp4} type="video/mp4" />
      {captionsSrc ? (
        <track
          kind="captions"
          src={captionsSrc}
          srcLang="en"
          label="English"
          default
        />
      ) : null}
      Your browser doesn&apos;t support embedded video.
    </video>
  );
};
