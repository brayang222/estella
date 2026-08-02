import { CategoryCreateForm, CategoryEditForm } from "@/components/admin/CategoryForms";
import { prisma } from "@/lib/db";
import { getCategories } from "@/lib/queries";

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    prisma.product.groupBy({ by: ["categoryId"], _count: true }),
  ]);
  const countByCategory = new Map(counts.map((c) => [c.categoryId, c._count]));

  return (
    <div className="grid max-w-[640px] gap-8">
      <h1 className="m-0 font-display text-[26px]">Categorías</h1>

      <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
        {categories.map((category) => (
          <div key={category.id} className="bg-paper px-4 py-4">
            <CategoryEditForm category={category} count={countByCategory.get(category.id) ?? 0} />
          </div>
        ))}
      </div>

      <div className="grid gap-3 border border-ink/12 p-4">
        <span className="text-[10px] tracking-[0.15em] text-muted uppercase">Nueva categoría</span>
        <CategoryCreateForm />
      </div>
    </div>
  );
}
