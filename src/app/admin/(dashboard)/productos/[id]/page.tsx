import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImagesManager } from "@/components/admin/ProductImagesManager";
import { prisma } from "@/lib/db";
import { updateProduct } from "@/lib/admin/products";
import { getCategories } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        _count: { select: { favorites: true } },
      },
    }),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="grid max-w-[640px] gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px]">Editar pieza</h1>
        <Link
          href={`/producto/${product.slug}`}
          target="_blank"
          className="text-[11px] tracking-[0.1em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          Ver en la tienda ↗
        </Link>
      </div>

      <section className="grid gap-4 border border-ink/12 p-5">
        <ProductImagesManager productId={product.id} images={product.images} />
      </section>

      <ProductForm
        categories={categories}
        product={product}
        action={updateProduct.bind(null, id)}
        withImageUploads={false}
      />
    </div>
  );
}
