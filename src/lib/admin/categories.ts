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
