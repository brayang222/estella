const items = [
  "Series numeradas",
  "Envío asegurado a todo el país",
  "Asesoría 1 a 1 por WhatsApp",
  "Empaque de regalo incluido",
];

function Group() {
  return (
    <div className="flex gap-11 pr-11 text-[10px] tracking-[0.28em] text-muted uppercase whitespace-nowrap">
      {items.map((item) => (
        <span key={item}>
          {item} <span className="text-gold">◇</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-ink/12 py-3.5">
      <div className="flex w-max animate-marquee will-change-transform">
        <Group />
        <Group />
      </div>
    </div>
  );
}
