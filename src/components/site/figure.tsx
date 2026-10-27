import Image, { type ImageProps } from "next/image";

type FigureProps = Pick<ImageProps, "src" | "width" | "height" | "unoptimized" | "priority"> & {
  /** Says what the image shows and why it matters, not "screenshot". */
  alt: string;
  caption: React.ReactNode;
};

export function Figure({ caption, alt, ...image }: FigureProps) {
  return (
    <figure className="grid gap-2">
      <Image
        {...image}
        alt={alt}
        sizes="(min-width: 1024px) 60rem, 100vw"
        className="h-auto w-full rounded-control border border-rule bg-surface"
      />
      <figcaption className="text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}
