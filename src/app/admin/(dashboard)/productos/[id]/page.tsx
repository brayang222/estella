import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import { updateProduct } from "@/lib/admin/products";
import { getCategories } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { order: "asc" } } },
    }),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="grid gap-6">
      <h1 className="m-0 font-display text-[26px]">Editar pieza</h1>
      <ProductForm categories={categories} product={product} action={updateProduct.bind(null, id)} />
    </div>
  );
}
