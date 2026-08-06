import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/admin/products";
import { getCategories } from "@/lib/queries";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="grid gap-6">
      <h1 className="m-0 font-display text-[26px]">Nueva pieza</h1>
      <p className="m-0 text-[12px] text-muted">
        Completa los datos y guarda. Podrás subir las fotos desde la pantalla de edición.
      </p>
      <ProductForm categories={categories} action={createProduct} withImageUploads={false} />
    </div>
  );
}
