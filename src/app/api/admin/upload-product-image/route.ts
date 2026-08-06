import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { saveImageFile } from "@/lib/admin/image-utils";

const MAX_IMAGES = 4;
const IMAGE_SLOTS = [1, 2, 3, 4] as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const productId = formData.get("productId");
  const file = formData.get("image");

  if (typeof productId !== "string" || !productId) {
    return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No se recibió el archivo" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  if (product.images.length >= MAX_IMAGES) {
    return NextResponse.json({ error: "Ya tiene el máximo de fotos" }, { status: 422 });
  }

  const used = new Set(product.images.map((img) => img.order));
  const slot = IMAGE_SLOTS.find((order) => !used.has(order));
  if (!slot) {
    return NextResponse.json({ error: "No hay espacio disponible" }, { status: 422 });
  }

  let url: string;
  try {
    url = await saveImageFile(file, product.slug, slot);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al guardar la imagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  await prisma.productImage.create({ data: { productId, url, order: slot } });

  revalidatePath(`/admin/productos/${productId}`);
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/producto/${product.slug}`);

  return NextResponse.json({ ok: true, url });
}
