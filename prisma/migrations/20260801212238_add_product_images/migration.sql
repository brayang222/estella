-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productId_order_key" ON "ProductImage"("productId", "order");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing single-image data into ProductImage as order = 1
INSERT INTO "ProductImage" ("id", "productId", "url", "order")
SELECT gen_random_uuid()::text, "id", "image", 1
FROM "Product"
WHERE "image" IS NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image";
