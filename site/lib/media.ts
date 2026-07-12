import manifest from "@/public/media/manifest.json";

export type ImageEntry = {
  category: string;
  name: string;
  width: number | null;
  height: number | null;
  blurDataURL: string;
  sizes: Record<string, string>;
  src: string;
};

type RawEntry = ImageEntry | { category: string; name: string; video: unknown };

const media = manifest as Record<string, RawEntry>;

const isImage = (entry: RawEntry | undefined): entry is ImageEntry =>
  Boolean(entry && "src" in entry);

/** Look up an optimized image by "<category>/<name>". Throws if missing. */
export const getImage = (id: string): ImageEntry => {
  const entry = media[id];
  if (!isImage(entry)) {
    throw new Error(`Media image not found in manifest: "${id}"`);
  }
  return entry;
};

/** True when an optimized image exists for the id. */
export const hasImage = (id: string): boolean => isImage(media[id]);
