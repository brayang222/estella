import Link from "next/link";
import { PlaceholderImage } from "./PlaceholderImage";
import type { BlogPost } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-date";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid gap-3.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-img-1">
        <PlaceholderImage
          label={post.coverLabel}
          angle={post.coverAngle}
          spacing={11}
          tone={post.coverTone}
          labelPosition="center"
          src={post.coverImage}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-[1100ms] ease-estella group-hover:scale-[1.04]"
          alt={post.title}
        />
        <span className="absolute top-2.5 left-2.5 z-[1] bg-paper px-[9px] py-[5px] text-[9px] tracking-[0.2em] text-muted uppercase">
          {post.category}
        </span>
      </div>
      <div className="grid gap-2 border-t border-ink/12 pt-3.5">
        <h3 className="m-0 font-display text-[21px] leading-[1.25]">{post.title}</h3>
        <div className="flex gap-2 text-[9.5px] tracking-[0.16em] text-muted uppercase">
          <span>{formatPostDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <p className="m-0 text-[13px] leading-[1.75] text-muted text-pretty">{post.excerpt}</p>
        <span className="mt-1 justify-self-start border-b border-ink/30 pb-[3px] text-[10px] tracking-[0.2em] uppercase transition-[border-color,color] duration-300 ease-out group-hover:border-gold group-hover:text-gold">
          Leer artículo
        </span>
      </div>
    </Link>
  );
}
