import Image from "next/image";
import styles from "./PlaceholderImage.module.css";

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
}: PlaceholderImageProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      className={`${styles.placeholder}${className ? ` ${className}` : ""}`}
      style={
        {
          "--angle": `${angle}deg`,
          "--spacing": `${spacing}px`,
          "--tone": `var(--img-${tone})`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className={labelPosition === "center" ? styles.labelCenter : styles.labelBottom}>
        [ {label} ]
      </span>
    </div>
  );
}
