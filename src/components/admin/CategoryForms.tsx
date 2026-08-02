"use client";

import { useActionState } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryFormState,
} from "@/lib/admin/categories";
import { DeleteButton } from "./DeleteButton";
import type { Category } from "@/lib/products";

const inputClass =
  "border border-ink/20 bg-transparent px-3 py-2 text-[13px] focus:border-ink focus:outline-none";
const initialState: CategoryFormState = {};

export function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_90px_auto] sm:items-end">
      {state.error && <p className="m-0 text-[12px] text-red-700 sm:col-span-4">{state.error}</p>}
      <label className="grid gap-1">
        <span className="text-[10px] text-muted uppercase">Slug</span>
        <input name="slug" placeholder="anillos" required className={inputClass} />
      </label>
      <label className="grid gap-1">
        <span className="text-[10px] text-muted uppercase">Nombre</span>
        <input name="label" placeholder="Anillos" required className={inputClass} />
      </label>
      <label className="grid gap-1">
        <span className="text-[10px] text-muted uppercase">Orden</span>
        <input name="sortOrder" type="number" placeholder="0" className={inputClass} />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer bg-ink px-4 py-2 text-[11px] tracking-[0.15em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold disabled:cursor-default disabled:opacity-60"
      >
        {pending ? "…" : "Agregar"}
      </button>
    </form>
  );
}

export function CategoryEditForm({ category, count }: { category: Category; count: number }) {
  const action = updateCategory.bind(null, category.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="grid gap-2">
      <form action={formAction} className="grid gap-3 sm:grid-cols-[100px_1fr_90px_auto] sm:items-end">
        <span className="self-center text-[12px] text-muted">{category.slug}</span>
        <label className="grid gap-1">
          <span className="text-[10px] text-muted uppercase">Nombre</span>
          <input name="label" defaultValue={category.label} required className={inputClass} />
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] text-muted uppercase">Orden</span>
          <input name="sortOrder" type="number" defaultValue={category.sortOrder} className={inputClass} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer border border-ink/20 px-4 py-2 text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 ease-out hover:border-ink disabled:cursor-default disabled:opacity-60"
        >
          {pending ? "…" : "Guardar"}
        </button>
      </form>
      {state.error && <p className="m-0 text-[12px] text-red-700">{state.error}</p>}
      <p className="m-0 text-[11px] text-muted">
        {count} producto{count === 1 ? "" : "s"}
        {count === 0 && (
          <>
            {" · "}
            <DeleteButton
              action={deleteCategory.bind(null, category.id)}
              confirmMessage={`¿Eliminar la categoría "${category.label}"?`}
            >
              Eliminar categoría
            </DeleteButton>
          </>
        )}
      </p>
    </div>
  );
}
