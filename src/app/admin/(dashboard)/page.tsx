import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, LOW_STOCK_THRESHOLD } from "@/lib/products";
import { getSiteSettings } from "@/lib/queries";
import { DEFAULT_SITE_SETTINGS, marqueeLines, normalizeWhatsappNumber } from "@/lib/settings";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/**
 * Aisladas del render: leer la hora es normal en un Server Component, pero el
 * linter de pureza de React solo lo permite si no ocurre directo en el cuerpo
 * del componente.
 */
function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < MINUTE_MS) return "justo ahora";
  if (diff < HOUR_MS) return `hace ${Math.floor(diff / MINUTE_MS)} min`;
  if (diff < DAY_MS) return `hace ${Math.floor(diff / HOUR_MS)} h`;
  const days = Math.floor(diff / DAY_MS);
  if (days < 7) return `hace ${days} ${days === 1 ? "día" : "días"}`;
  return dateFormat.format(date);
}

function signInMethod(user: { passwordHash: string | null; accounts: { provider: string }[] }): string {
  if (user.accounts.length > 0) return user.accounts.map((a) => a.provider).join(", ");
  return user.passwordHash ? "correo y contraseña" : "sin método";
}

const cardClass = "grid gap-4 border border-ink/12 p-5";
const kpiCardClass = `${cardClass} gap-1.5 transition-colors duration-300 ease-out hover:border-ink`;
const sectionTitleClass = "m-0 font-display text-[18px]";
const rowLinkClass = "text-[12.5px] underline-offset-4 hover:underline";

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** label + value (sans, no serif) + una línea de contexto — nunca solo el número. */
function Kpi({ label, value, sub }: { label: string; value: string | number; sub: React.ReactNode }) {
  return (
    <>
      <span className="text-[10px] tracking-[0.2em] text-muted uppercase">{label}</span>
      <span className="text-[30px] leading-none font-medium tracking-tight">{value}</span>
      <span className="text-[11px] leading-[1.5] text-muted">{sub}</span>
    </>
  );
}

/** Barra de magnitud: mismo hue (ink) en todas, solo cambia el largo. Sin href, no es un enlace. */
function MagnitudeBar({
  label,
  count,
  max,
  unit,
  href,
}: {
  label: string;
  count: number;
  max: number;
  unit: string;
  href?: string;
}) {
  const pct = max > 0 ? Math.max((count / max) * 100, count > 0 ? 4 : 0) : 0;
  const body = (
    <div className="grid gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12.5px]">{label}</span>
        <span className="text-[11px] text-muted">
          {count} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-paper-alt">
        <div
          className="h-full rounded-full bg-ink/70 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="text-ink">
      {body}
    </Link>
  ) : (
    body
  );
}

export default async function AdminHomePage() {
  const weekAgo = daysAgo(7);

  // El catálogo, las cuentas, los favoritos y las bolsas son pequeños en esta
  // tienda (decenas de filas, no miles): traer cada tabla completa y calcular
  // en JS es más simple y barato que una docena de count()/aggregate()
  // separados. Si el catálogo crece mucho, esto se vuelve el primer cuello de
  // botella a resolver con aggregate/groupBy en la base de datos.
  const [allProducts, categories, allUsers, allFavorites, allCartItems, settings] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        available: true,
        price: true,
        tag: true,
        categoryId: true,
        stock: true,
        _count: { select: { images: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, slug: true, label: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        passwordHash: true,
        accounts: { select: { provider: true } },
      },
    }),
    prisma.favorite.findMany({
      select: {
        id: true,
        createdAt: true,
        userId: true,
        user: { select: { name: true, email: true } },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
          },
        },
      },
    }),
    prisma.cartItem.findMany({
      select: {
        id: true,
        quantity: true,
        updatedAt: true,
        userId: true,
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true, price: true } },
      },
    }),
    getSiteSettings(),
  ]);

  // --- Piezas: disponibilidad, fotos, precio, categorías, etiquetas ---
  const products = allProducts.length;
  const unavailable = allProducts.filter((p) => !p.available).length;
  const noPhotos = allProducts
    .filter((p) => p._count.images === 0)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const onePhoto = allProducts.filter((p) => p._count.images === 1);
  const lowStock = allProducts
    .filter((p) => p.available && p.stock !== null && p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  const totalImages = allProducts.reduce((sum, p) => sum + p._count.images, 0);
  const avgImages = products > 0 ? totalImages / products : 0;

  const prices = allProducts.map((p) => p.price);
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const catalogValue = allProducts.filter((p) => p.available).reduce((sum, p) => sum + p.price, 0);

  const countByCategory = new Map<string, number>();
  const countByTag = new Map<string, number>();
  for (const product of allProducts) {
    countByCategory.set(product.categoryId, (countByCategory.get(product.categoryId) ?? 0) + 1);
    countByTag.set(product.tag, (countByTag.get(product.tag) ?? 0) + 1);
  }
  const topCategory = categories
    .map((category) => ({ ...category, count: countByCategory.get(category.id) ?? 0 }))
    .sort((a, b) => b.count - a.count)[0];
  const maxCategoryCount = Math.max(1, ...categories.map((c) => countByCategory.get(c.id) ?? 0));
  const tagRows = [...countByTag.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  const maxTagCount = Math.max(1, ...tagRows.map((row) => row.count));

  // --- Cuentas ---
  const customers = allUsers.length;
  const admins = allUsers.filter((u) => u.role === "admin").length;
  const newCustomers = allUsers.filter((u) => u.createdAt >= weekAgo).length;
  const recentSignups = allUsers.slice(0, 5);

  // --- Favoritos ---
  const totalFavorites = allFavorites.length;
  const favoritingPeople = new Set(allFavorites.map((f) => f.userId)).size;
  const favoritesByProduct = new Map<string, { product: (typeof allFavorites)[number]["product"]; count: number }>();
  for (const favorite of allFavorites) {
    const entry = favoritesByProduct.get(favorite.product.id);
    if (entry) entry.count += 1;
    else favoritesByProduct.set(favorite.product.id, { product: favorite.product, count: 1 });
  }
  const topFavorites = [...favoritesByProduct.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  // --- Bolsas ---
  const cartValue = allCartItems.reduce((total, line) => total + line.quantity * line.product.price, 0);
  const cartUnits = allCartItems.reduce((total, line) => total + line.quantity, 0);
  const activeBags = new Set(allCartItems.map((line) => line.userId)).size;

  // --- Pulso: últimos favoritos, últimos cambios de bolsa y últimas cuentas, mezclados por fecha ---
  const activity = [
    ...allFavorites.map((f) => ({
      at: f.createdAt,
      key: `fav-${f.id}`,
      node: (
        <>
          <strong className="font-normal text-ink">{f.user.name ?? f.user.email}</strong> guardó{" "}
          <Link href={`/producto/${f.product.slug}`} className="underline-offset-4 hover:underline">
            {f.product.name}
          </Link>{" "}
          en favoritos
        </>
      ),
    })),
    ...allCartItems.map((c) => ({
      at: c.updatedAt,
      key: `cart-${c.id}`,
      node: (
        <>
          <strong className="font-normal text-ink">{c.user.name ?? c.user.email}</strong> tiene {c.quantity}{" "}
          {c.quantity === 1 ? "unidad" : "unidades"} de{" "}
          <Link href={`/producto/${c.product.slug}`} className="underline-offset-4 hover:underline">
            {c.product.name}
          </Link>{" "}
          en su bolsa
        </>
      ),
    })),
    ...allUsers.map((u) => ({
      at: u.createdAt,
      key: `user-${u.id}`,
      node: (
        <>
          <strong className="font-normal text-ink">{u.name ?? u.email}</strong> creó una cuenta
        </>
      ),
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  const instagramConfigured = settings.instagramUrl !== DEFAULT_SITE_SETTINGS.instagramUrl;
  const tiktokConfigured = settings.tiktokUrl !== DEFAULT_SITE_SETTINGS.tiktokUrl;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="m-0 font-display text-[26px]">Panel</h1>
          <p className="m-0 text-[13px] text-muted">Cómo está la tienda ahora mismo.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-ink px-5 py-2.5 text-[11px] tracking-[0.2em] text-paper uppercase transition-colors duration-300 ease-out hover:bg-gold"
        >
          Nueva pieza
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/clientes" className={kpiCardClass}>
          <Kpi
            label="Valor en bolsas"
            value={formatPrice(cartValue)}
            sub={
              cartUnits > 0
                ? `${cartUnits} ${cartUnits === 1 ? "unidad" : "unidades"} · ${activeBags} ${activeBags === 1 ? "bolsa activa" : "bolsas activas"}`
                : "Ninguna bolsa activa todavía"
            }
          />
        </Link>
        <Link href="/admin/productos" className={kpiCardClass}>
          <Kpi
            label="Valor del catálogo"
            value={formatPrice(catalogValue)}
            sub={`${products - unavailable} ${products - unavailable === 1 ? "pieza disponible" : "piezas disponibles"}`}
          />
        </Link>
        <Link href="/admin/productos" className={kpiCardClass}>
          <Kpi
            label="Precio promedio"
            value={formatPrice(avgPrice)}
            sub={products > 0 ? `Entre ${formatPrice(minPrice)} y ${formatPrice(maxPrice)}` : "sin piezas todavía"}
          />
        </Link>
        <Link href="/admin/productos" className={kpiCardClass}>
          <Kpi
            label="Piezas"
            value={products}
            sub={
              unavailable > 0 ? (
                <span className="text-red-700">{unavailable} agotadas</span>
              ) : (
                "todas disponibles"
              )
            }
          />
        </Link>

        <Link href="/admin/productos" className={kpiCardClass}>
          <Kpi
            label="Fotos por pieza"
            value={avgImages.toFixed(1)}
            sub={
              noPhotos.length > 0 ? (
                <span className="text-red-700">{noPhotos.length} sin fotos</span>
              ) : onePhoto.length > 0 ? (
                `${onePhoto.length} con solo 1 foto`
              ) : (
                "buena cobertura en todas"
              )
            }
          />
        </Link>
        <Link href="/admin/clientes" className={kpiCardClass}>
          <Kpi
            label="Cuentas"
            value={customers}
            sub={
              <span className="inline-flex items-center gap-1.5">
                {newCustomers > 0 && <span className="size-[6px] rounded-full bg-dot-online" />}
                {newCustomers > 0 ? `+${newCustomers} esta semana` : "sin cuentas nuevas esta semana"} ·{" "}
                {admins} {admins === 1 ? "admin" : "admins"}
              </span>
            }
          />
        </Link>
        <Link href="/favoritos" className={kpiCardClass}>
          <Kpi
            label="Favoritos guardados"
            value={totalFavorites}
            sub={
              favoritingPeople > 0
                ? `${favoritingPeople} ${favoritingPeople === 1 ? "persona distinta" : "personas distintas"}`
                : "nadie ha guardado nada aún"
            }
          />
        </Link>
        <Link href="/admin/categorias" className={kpiCardClass}>
          <Kpi
            label="Categorías"
            value={categories.length}
            sub={topCategory && topCategory.count > 0 ? `${topCategory.label} tiene más piezas` : "sin piezas asignadas"}
          />
        </Link>
      </div>

      <section className={cardClass}>
        <h2 className={sectionTitleClass}>Actividad reciente</h2>
        {activity.length === 0 ? (
          <p className="m-0 text-[12px] text-muted">Todavía no hay actividad para mostrar.</p>
        ) : (
          <ol className="m-0 grid list-none gap-2.5 p-0">
            {activity.map((entry) => (
              <li key={entry.key} className="flex items-baseline justify-between gap-4">
                <span className="text-[12.5px] leading-[1.5]">{entry.node}</span>
                <span className="shrink-0 text-[11px] whitespace-nowrap text-muted">
                  {formatRelative(entry.at)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {(noPhotos.length > 0 || onePhoto.length > 0 || lowStock.length > 0) && (
        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Necesita tu atención</h2>

          {lowStock.length > 0 && (
            <div className="grid gap-1.5">
              <p className="m-0 text-[12.5px] text-muted">
                <span className="text-red-700">{lowStock.length}</span>{" "}
                {lowStock.length === 1 ? "pieza tiene" : "piezas tienen"} pocas unidades — piensa en
                reponer stock.
              </p>
              <ul className="m-0 flex flex-wrap gap-x-5 gap-y-1.5 list-none p-0">
                {lowStock.slice(0, 6).map((product) => (
                  <li key={product.id}>
                    <Link href={`/admin/productos/${product.id}`} className={rowLinkClass}>
                      {product.name} ({product.stock})
                    </Link>
                  </li>
                ))}
                {lowStock.length > 6 && (
                  <li className="text-[12px] text-muted">+{lowStock.length - 6} más</li>
                )}
              </ul>
            </div>
          )}

          {noPhotos.length > 0 && (
            <div className="grid gap-1.5">
              <p className="m-0 text-[12.5px] text-muted">
                <span className="text-red-700">{noPhotos.length}</span>{" "}
                {noPhotos.length === 1 ? "pieza no tiene fotos" : "piezas no tienen fotos"} y se muestran con
                el marcador de posición en la tienda.
              </p>
              <ul className="m-0 flex flex-wrap gap-x-5 gap-y-1.5 list-none p-0">
                {noPhotos.slice(0, 6).map((product) => (
                  <li key={product.id}>
                    <Link href={`/admin/productos/${product.id}`} className={rowLinkClass}>
                      {product.name}
                    </Link>
                  </li>
                ))}
                {noPhotos.length > 6 && (
                  <li className="text-[12px] text-muted">+{noPhotos.length - 6} más</li>
                )}
              </ul>
            </div>
          )}

          {onePhoto.length > 0 && (
            <div className="grid gap-1.5">
              <p className="m-0 text-[12.5px] text-muted">
                {onePhoto.length} {onePhoto.length === 1 ? "pieza tiene" : "piezas tienen"} solo 1 foto —
                súbeles algunas más para que se vean mejor.
              </p>
              <ul className="m-0 flex flex-wrap gap-x-5 gap-y-1.5 list-none p-0">
                {onePhoto.slice(0, 6).map((product) => (
                  <li key={product.id}>
                    <Link href={`/admin/productos/${product.id}`} className={rowLinkClass}>
                      {product.name}
                    </Link>
                  </li>
                ))}
                {onePhoto.length > 6 && (
                  <li className="text-[12px] text-muted">+{onePhoto.length - 6} más</li>
                )}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Categorías</h2>
          {categories.length === 0 ? (
            <p className="m-0 text-[12px] text-muted">Todavía no hay categorías.</p>
          ) : (
            <div className="grid gap-3">
              {categories.map((category) => (
                <MagnitudeBar
                  key={category.id}
                  label={category.label}
                  count={countByCategory.get(category.id) ?? 0}
                  max={maxCategoryCount}
                  unit={(countByCategory.get(category.id) ?? 0) === 1 ? "pieza" : "piezas"}
                  href={`/productos?categoria=${category.slug}`}
                />
              ))}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Piezas por etiqueta</h2>
          {tagRows.length === 0 ? (
            <p className="m-0 text-[12px] text-muted">Todavía no hay piezas.</p>
          ) : (
            <div className="grid gap-3">
              {tagRows.map((row) => (
                <MagnitudeBar
                  key={row.tag}
                  label={row.tag}
                  count={row.count}
                  max={maxTagCount}
                  unit={row.count === 1 ? "pieza" : "piezas"}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Lo más guardado</h2>
          {topFavorites.length === 0 ? (
            <p className="m-0 text-[12px] text-muted">Todavía nadie ha guardado favoritos.</p>
          ) : (
            <ol className="m-0 grid list-none gap-3 p-0">
              {topFavorites.map(({ product, count }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden bg-img-1">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element -- miniatura local del panel
                      <img
                        src={product.images[0].url}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <Link href={`/producto/${product.slug}`} className={`${rowLinkClass} flex-1`}>
                    {product.name}
                  </Link>
                  <span className="text-[11px] whitespace-nowrap text-muted">
                    {count} {count === 1 ? "persona" : "personas"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Cuentas nuevas</h2>
          {recentSignups.length === 0 ? (
            <p className="m-0 text-[12px] text-muted">Todavía no hay cuentas.</p>
          ) : (
            <ol className="m-0 grid list-none gap-2.5 p-0">
              {recentSignups.map((user) => (
                <li key={user.id} className="flex items-baseline justify-between gap-3">
                  <div className="grid">
                    <span className="text-[12.5px]">{user.name ?? "Sin nombre"}</span>
                    <span className="text-[11px] break-all text-muted">
                      {user.email} · {signInMethod(user)}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] whitespace-nowrap text-muted">
                    {dateFormat.format(user.createdAt)}
                  </span>
                </li>
              ))}
            </ol>
          )}
          <Link
            href="/admin/clientes"
            className="justify-self-start text-[11px] tracking-[0.1em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
          >
            Ver todas las cuentas
          </Link>
        </section>
      </div>

      <section className={cardClass}>
        <h2 className={sectionTitleClass}>Ajustes</h2>
        <div className="grid gap-2.5 text-[12.5px] leading-[1.7] text-muted sm:grid-cols-2">
          <p className="m-0">
            WhatsApp:{" "}
            <strong className="font-normal text-ink">
              +{normalizeWhatsappNumber(settings.whatsappNumber)}
            </strong>
          </p>
          <p className="m-0">
            Letrero: <strong className="font-normal text-ink">{marqueeLines(settings).length} frases</strong>
          </p>
          <p className="m-0">
            Instagram:{" "}
            {instagramConfigured ? (
              <strong className="font-normal text-ink">configurado</strong>
            ) : (
              <span className="text-red-700">sin configurar</span>
            )}
          </p>
          <p className="m-0">
            TikTok:{" "}
            {tiktokConfigured ? (
              <strong className="font-normal text-ink">configurado</strong>
            ) : (
              <span className="text-red-700">sin configurar</span>
            )}
          </p>
        </div>
        <Link
          href="/admin/ajustes"
          className="justify-self-start border border-ink/20 px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ease-out hover:border-ink"
        >
          Cambiar ajustes
        </Link>
      </section>
    </div>
  );
}
