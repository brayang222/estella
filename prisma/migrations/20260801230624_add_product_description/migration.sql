-- AlterTable
-- Added with a temporary default so existing rows stay valid; the seed fills
-- in the real copy right after, and the default is dropped so new products
-- must supply their own description.
ALTER TABLE "Product" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ALTER COLUMN "description" DROP DEFAULT;
