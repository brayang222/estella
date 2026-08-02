import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProduct } from "@/lib/admin/products";
import { formatPrice } from "@/lib/products";
import { getProducts } from "@/lib/queries";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="m-0 font-display text-[26px]">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-ink px-5 py-2.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          Nueva pieza
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-[13px] text-muted">Todavía no hay productos.</p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-ink/12 bg-ink/12">
          {products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[56px_1fr_auto_auto_auto] items-center gap-4 bg-paper px-4 py-3"
            >
              <div className="relative size-14 overflow-hidden bg-img-1">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element -- small local admin thumbnail
                  <img
                    src={product.images[0].url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="m-0 text-[13px] font-medium">{product.name}</p>
                <p className="m-0 text-[11px] text-muted">
                  {product.category.label} · {product.referenceCode}
                </p>
              </div>
              <span className="text-[13px] whitespace-nowrap">{formatPrice(product.price)}</span>
              <span
                className={`text-[10px] tracking-[0.15em] uppercase ${
                  product.available ? "text-muted" : "text-red-700"
                }`}
              >
                {product.available ? "Disponible" : "Agotado"}
              </span>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="text-[11px] tracking-[0.1em] uppercase underline-offset-4 hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  action={deleteProduct.bind(null, product.id)}
                  confirmMessage={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
