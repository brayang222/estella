import Link from "next/link";
import styles from "./BlogCard.module.css";
import { PlaceholderImage } from "./PlaceholderImage";
import type { BlogPost } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-date";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.media}>
        <PlaceholderImage
          label={post.coverLabel}
          angle={post.coverAngle}
          spacing={11}
          tone={post.coverTone}
          labelPosition="center"
          className={styles.mediaImage}
          alt={post.title}
        />
        <span className={styles.category}>{post.category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{post.title}</h3>
        <div className={styles.meta}>
          <span>{formatPostDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <span className={styles.readMore}>Leer artículo</span>
      </div>
    </Link>
  );
}
