import styles from "./Footer.module.css";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.wordmark}>Estella</span>
        <div className={styles.links}>
          <a href="#coleccion" className={styles.link}>
            Colección
          </a>
          <a href="#lookbook" className={styles.link}>
            Lookbook
          </a>
          <a href="#historia" className={styles.link}>
            Estudio
          </a>
          <a
            href={waLink(WA_GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener"
            className={styles.link}
          >
            Cuidado de tus joyas
          </a>
        </div>
      </div>
      <span className={styles.legal}>© 2026 Estella · Hecho con cuidado en Colombia</span>
    </footer>
  );
}
