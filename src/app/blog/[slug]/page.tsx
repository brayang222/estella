import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Curtain, Reveal } from "@/components/Reveal";
import { BlogPostingJsonLd } from "@/components/JsonLd";
import { getPostBySlug, posts } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-date";
import { staggerDelay } from "@/lib/stagger";
import { getSiteSettings } from "@/lib/queries";
import { waLink } from "@/lib/whatsapp";

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
  const settings = await getSiteSettings();

  return (
    <article className="mx-auto grid max-w-[760px] gap-[clamp(32px,4vw,52px)] pt-[clamp(110px,14vw,160px)] pb-[clamp(72px,10vw,130px)] px-gutter">
      <BlogPostingJsonLd post={post} />

      <Reveal className="grid gap-3.5">
        <Link
          href="/blog"
          className="mb-2 justify-self-start text-[10px] tracking-[0.2em] text-muted uppercase hover:text-gold"
        >
          ← Volver al diario
        </Link>
        <span className="text-[10px] tracking-[0.34em] text-gold uppercase">{post.category}</span>
        <h1 className="m-0 font-display text-[clamp(30px,5vw,52px)] leading-[1.1]">
          {post.title}
        </h1>
        <div className="flex gap-2.5 text-[10px] tracking-[0.16em] text-muted uppercase">
          <span>{formatPostDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime} de lectura</span>
        </div>
      </Reveal>

      <Curtain className="aspect-video">
        <PlaceholderImage
          label={post.coverLabel}
          angle={post.coverAngle}
          spacing={11}
          tone={post.coverTone}
          labelPosition="bottom"
          alt={post.title}
        />
      </Curtain>

      <div className="grid gap-[22px]">
        {post.content.map((paragraph, index) => (
          <Reveal key={index} delay={staggerDelay(index)}>
            <p
              className={`m-0 leading-[1.9] text-muted text-pretty ${
                index === 0 ? "text-[16px] text-ink" : "text-[15px]"
              }`}
            >
              {paragraph}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-3 grid justify-items-start gap-3.5 bg-paper-alt p-[clamp(28px,4vw,44px)]">
        <span className="text-[10px] tracking-[0.3em] text-gold uppercase">
          ¿Tienes preguntas?
        </span>
        <h2 className="m-0 font-display text-[clamp(22px,3vw,30px)]">Hablemos por WhatsApp</h2>
        <a
          href={waLink(settings.whatsappGreeting, settings.whatsappNumber)}
          target="_blank"
          rel="noopener"
          className="bg-ink px-[30px] py-[15px] text-[10.5px] tracking-[0.2em] text-paper uppercase transition-[background-color,transform] duration-[400ms] ease-estella hover:-translate-y-0.5 hover:bg-gold"
        >
          Escribir por WhatsApp
        </a>
      </Reveal>
    </article>
  );
}
