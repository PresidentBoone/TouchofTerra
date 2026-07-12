import Image from "next/image";
import { getImage } from "@/lib/media";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Fill the parent (parent must be positioned). Default true. */
  fill?: boolean;
};

/**
 * next/image wrapper backed by the media manifest — responsive, with a
 * generated blur placeholder and no layout shift.
 */
export const SmartImage = ({
  id,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  fill = true,
}: Props) => {
  const img = getImage(id);

  if (fill) {
    return (
      <Image
        src={img.src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={img.blurDataURL}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={img.src}
      alt={alt}
      width={img.width ?? 1600}
      height={img.height ?? 1067}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={img.blurDataURL}
      priority={priority}
      className={className}
    />
  );
};
