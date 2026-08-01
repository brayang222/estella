import Link from "next/link";
import styles from "./Footer.module.css";
import { posts } from "@/lib/blog";

const careGuideSlug = posts.find((p) => p.slug === "cuidado-joyas-rodio")?.slug ?? posts[0].slug;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.wordmark}>Estella</span>
        <div className={styles.links}>
          <Link href="/#coleccion" className={styles.link}>
            Colección
          </Link>
          <Link href="/#lookbook" className={styles.link}>
            Lookbook
          </Link>
          <Link href="/#historia" className={styles.link}>
            Estudio
          </Link>
          <Link href="/blog" className={styles.link}>
            Blog
          </Link>
          <Link href={`/blog/${careGuideSlug}`} className={styles.link}>
            Cuidado de tus joyas
          </Link>
        </div>
      </div>
      <span className={styles.legal}>© 2026 Estella · Hecho con cuidado en Colombia</span>
    </footer>
  );
}
