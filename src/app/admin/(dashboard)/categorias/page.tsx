import { CategoryCreateForm, CategoryEditForm } from "@/components/admin/CategoryForms";
import { OrderButtons } from "@/components/admin/OrderButtons";
import { moveCategory } from "@/lib/admin/categories";
import { prisma } from "@/lib/db";
import { getCategories } from "@/lib/queries";

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    prisma.product.groupBy({ by: ["categoryId"], _count: true }),
  ]);
  const countByCategory = new Map(counts.map((c) => [c.categoryId, c._count]));

  return (
    <div className="grid max-w-[680px] gap-8">
      <div className="grid gap-1">
        <h1 className="m-0 font-display text-[26px]">Categorías</h1>
        <p className="m-0 text-[12px] text-muted">
          El orden manda en los filtros de la tienda; las flechas lo cambian.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
        {categories.map((category, index) => (
          <div key={category.id} className="flex items-start gap-4 bg-paper px-4 py-4">
            <div className="pt-1.5">
              <OrderButtons
                moveUp={moveCategory.bind(null, category.id, "up")}
                moveDown={moveCategory.bind(null, category.id, "down")}
                isFirst={index === 0}
                isLast={index === categories.length - 1}
                label={category.label}
              />
            </div>
            <div className="flex-1">
              <CategoryEditForm category={category} count={countByCategory.get(category.id) ?? 0} />
            </div>
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
