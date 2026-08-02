"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";

export type CategoryFormState = { error?: string };

function revalidateCategoryPages() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/productos");
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const label = String(formData.get("label") ?? "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();

  if (!slug || !label) return { error: "Slug y nombre son obligatorios." };
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "El slug solo puede tener minúsculas, números y guiones." };
  }

  const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : await prisma.category.count();
  if (!Number.isFinite(sortOrder)) return { error: "El orden debe ser un número." };

  try {
    await prisma.category.create({ data: { slug, label, sortOrder } });
  } catch {
    return { error: "Ya existe una categoría con ese slug." };
  }

  revalidateCategoryPages();
  redirect("/admin/categorias");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const label = String(formData.get("label") ?? "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") ?? "").trim());

  if (!label) return { error: "El nombre es obligatorio." };
  if (!Number.isFinite(sortOrder)) return { error: "El orden debe ser un número." };

  await prisma.category.update({ where: { id }, data: { label, sortOrder } });

  revalidateCategoryPages();
  redirect("/admin/categorias");
}

/** Only called from the UI when the category has zero products — see the list page. */
export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidateCategoryPages();
}

/**
 * Sube o baja una categoría una posición en los filtros de la tienda.
 * Renumera la lista completa, igual que moveProduct().
 */
export async function moveCategory(id: string, direction: "up" | "down") {
  await requireAdmin();

  const all = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    select: { id: true },
  });
  const index = all.findIndex((category) => category.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= all.length) return;

  const reordered = [...all];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  await prisma.$transaction(
    reordered.map((category, position) =>
      prisma.category.update({ where: { id: category.id }, data: { sortOrder: position } })
    )
  );

  revalidateCategoryPages();
}
