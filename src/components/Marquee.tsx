import styles from "./Marquee.module.css";

const items = [
  "Series numeradas",
  "Envío asegurado a todo el país",
  "Asesoría 1 a 1 por WhatsApp",
  "Empaque de regalo incluido",
];

function Group() {
  return (
    <div className={styles.group}>
      {items.map((item) => (
        <span key={item}>
          {item} <span className={styles.dot}>◇</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        <Group />
        <Group />
      </div>
    </div>
  );
}
