const STAR_VALUES = [1, 2, 3, 4, 5] as const;

export function ReviewStars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span aria-label={`${rating} de 5 estrellas`} className={`text-gold ${className}`}>
      {STAR_VALUES.map((value) => (value <= rating ? "★" : "☆")).join("")}
    </span>
  );
}
