import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className={styles.section}>
      <span className={styles.eyebrow}>Error 404</span>
      <h1 className={styles.heading}>Se perdió</h1>
      <p className={styles.text}>
        Esta página no existe o la pieza que buscabas ya no está disponible. Vuelve a la
        colección o escríbenos y te ayudamos a encontrarla.
      </p>
      <Link href="/" className={styles.link}>
        Volver al inicio
      </Link>
    </section>
  );
}
