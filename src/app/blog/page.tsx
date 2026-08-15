import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import { staggerDelay } from "@/lib/stagger";
import { posts } from "@/lib/blog";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guías de cuidado, estilo y todo lo que pasa detrás de cada serie de Estella.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog · Estella",
    description:
      "Guías de cuidado, estilo y todo lo que pasa detrás de cada serie de Estella.",
    url: "/blog",
    type: "website",
    images: [OG_IMAGE],
  },
};

export default function BlogPage() {
  return (
    <section className="grid gap-[clamp(32px,4vw,56px)] pt-[clamp(110px,14vw,160px)] pb-section-y px-gutter">
      <Reveal className="grid max-w-[60ch] gap-3.5">
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">Journal</span>
        <h1 className="m-0 font-display text-[clamp(34px,5vw,64px)] leading-[1.05]">
          El diario de Estella
        </h1>
        <p className="m-0 max-w-[56ch] text-[14px] leading-[1.85] text-muted text-pretty">
          Cuidado de tus piezas, guías de estilo y todo lo que pasa detrás de cada serie. Sin
          relleno, directo al punto.
        </p>
      </Reveal>
      {/* Igual que en el catálogo: las tarjetas usan h3 y sin este nivel
          intermedio el listado saltaría de h1 a h3. */}
      <h2 className="sr-only">Artículos</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[clamp(24px,3vw,44px)]">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={staggerDelay(index)}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
