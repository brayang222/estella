import { BlogCard } from "./BlogCard";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";
import type { BlogPost } from "@/lib/blog";

/**
 * Artículos relacionados al final de la ficha de producto. Cierra el circuito
 * de enlaces internos: producto → artículo → categoría, que es lo que le da
 * peso a las páginas que queremos posicionar.
 */
export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="grid gap-[clamp(20px,2.6vw,32px)] border-t border-ink/12 pt-[clamp(40px,5vw,64px)] md:col-span-2">
      <Reveal>
        <h2 className="m-0 font-display text-[clamp(22px,3vw,32px)] leading-[1.1]">
          Antes de decidir
        </h2>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[clamp(20px,2.6vw,36px)]">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={staggerDelay(index)}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
