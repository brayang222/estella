import styles from "./WhatsAppFloat.module.css";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink(WA_GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      className={styles.float}
    >
      <span className={styles.dot} />
      Escríbenos
    </a>
  );
}
