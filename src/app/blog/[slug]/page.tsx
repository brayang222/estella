import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Curtain, Reveal } from "@/components/Reveal";
import { BlogPostingJsonLd } from "@/components/JsonLd";
import { getPostBySlug, posts } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-date";
import { staggerDelay } from "@/lib/stagger";
import { WA_GENERAL_MESSAGE, waLink } from "@/lib/whatsapp";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className={styles.article}>
      <BlogPostingJsonLd post={post} />

      <Reveal className={styles.header}>
        <Link href="/blog" className={styles.back}>
          ← Volver al diario
        </Link>
        <span className={styles.eyebrow}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>{formatPostDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime} de lectura</span>
        </div>
      </Reveal>

      <Curtain className={styles.cover}>
        <PlaceholderImage
          label={post.coverLabel}
          angle={post.coverAngle}
          spacing={11}
          tone={post.coverTone}
          labelPosition="bottom"
          alt={post.title}
        />
      </Curtain>

      <div className={styles.body}>
        {post.content.map((paragraph, index) => (
          <Reveal key={index} delay={staggerDelay(index)}>
            <p className={styles.paragraph}>{paragraph}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.cta}>
        <span className={styles.ctaEyebrow}>¿Tienes preguntas?</span>
        <h2 className={styles.ctaHeading}>Hablemos por WhatsApp</h2>
        <a
          href={waLink(WA_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener"
          className={styles.ctaButton}
        >
          Escribir por WhatsApp
        </a>
      </Reveal>
    </article>
  );
}
