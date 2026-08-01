import Image from "next/image";
import { imageUrl } from "@/lib/images";

type PlaceholderImageProps = {
  label: string;
  angle?: number;
  spacing?: number;
  tone?: 1 | 2 | 3;
  labelPosition?: "center" | "bottom";
  src?: string;
  alt?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Renders a real photo (next/image, fill) once `src` is set. Until then,
 * shows the striped placeholder + mono label from the design spec so every
 * product/lookbook slot is swappable one prop at a time as real webp photos
 * come in. Parent must be `position: relative`.
 */
export function PlaceholderImage({
  label,
  angle = 108,
  spacing = 11,
  tone = 1,
  labelPosition = "bottom",
  src,
  alt = "",
  sizes = "100vw",
  className,
  priority = false,
}: PlaceholderImageProps) {
  const resolvedSrc = imageUrl(src);
  if (resolvedSrc) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={{ objectFit: "cover" }}
        priority={priority}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0${className ? ` ${className}` : ""}`}
      style={{
        backgroundColor: `var(--color-img-${tone})`,
        backgroundImage: `repeating-linear-gradient(${angle}deg, rgba(20,18,15,.07) 0 1px, rgba(20,18,15,0) 1px ${spacing}px)`,
      }}
      aria-hidden="true"
    >
      <span
        className={
          labelPosition === "center"
            ? "absolute top-1/2 left-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2 text-center font-mono text-[9px] tracking-[0.16em] text-ink/40 uppercase"
            : "absolute bottom-3 left-3.5 font-mono text-[9px] tracking-[0.16em] text-ink/42 uppercase"
        }
      >
        [ {label} ]
      </span>
    </div>
  );
}
