import Image, { type ImageProps, type StaticImageData } from "next/image";

type FigureProps = Pick<ImageProps, "src" | "width" | "height" | "unoptimized" | "priority"> & {
  /** Says what the image shows and why it matters, not "screenshot". */
  alt: string;
  caption: React.ReactNode;
  /** Optional dark-theme version (e.g. a diagram drawn for dark backgrounds). */
  darkSrc?: string | StaticImageData;
};

const imageClasses = "h-auto w-full rounded-control border border-rule bg-surface";

export function Figure({ caption, alt, darkSrc, ...image }: FigureProps) {
  const sizes = "(min-width: 1024px) 48rem, 100vw";
  return (
    <figure className="grid gap-2">
      <Image
        {...image}
        alt={alt}
        sizes={sizes}
        className={darkSrc ? `${imageClasses} dark:hidden` : imageClasses}
      />
      {darkSrc && (
        <Image
          {...image}
          src={darkSrc}
          alt={alt}
          sizes={sizes}
          className={`${imageClasses} hidden dark:block`}
        />
      )}
      <figcaption className="text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}

/** Stands in for a screenshot that hasn't been taken yet. Must be replaced before launch. */
export function FigurePlaceholder({ label }: { label: string }) {
  return (
    <figure className="grid gap-2">
      <div className="flex aspect-video items-center justify-center rounded-control border border-dashed border-rule-strong p-6 text-center text-sm text-muted">
        {label}
      </div>
    </figure>
  );
}
