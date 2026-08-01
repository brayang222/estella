import type { Metadata } from "next";
import styles from "./page.module.css";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import { staggerDelay } from "@/lib/stagger";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Cuidado de joyería en rodio, guías de estilo y todo lo que pasa detrás de cada serie de Estella.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog · Estella",
    description:
      "Cuidado de joyería en rodio, guías de estilo y todo lo que pasa detrás de cada serie de Estella.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.header}>
        <span className={styles.eyebrow}>Journal</span>
        <h1 className={styles.heading}>El diario de Estella</h1>
        <p className={styles.intro}>
          Cuidado de tus piezas, guías de estilo y todo lo que pasa detrás de cada serie. Sin
          relleno, directo al punto.
        </p>
      </Reveal>
      <div className={styles.grid}>
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={staggerDelay(index)}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
