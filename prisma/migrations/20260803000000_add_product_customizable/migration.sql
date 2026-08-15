-- AlterTable: campos de personalización del armador de cadenas
ALTER TABLE "Product" ADD COLUMN "customizable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN "dropPointX"   DOUBLE PRECISION;
ALTER TABLE "Product" ADD COLUMN "dropPointY"   DOUBLE PRECISION;

-- Mantener comportamiento actual: cadenas y dijes ya existentes pasan a ser personalizables
UPDATE "Product" SET "customizable" = true
WHERE "categoryId" IN (
  SELECT "id" FROM "Category" WHERE "slug" IN ('cadenas', 'dijes')
);

-- Migrar los drop points que estaban hardcodeados en ChainBuilder.tsx
UPDATE "Product" SET "dropPointX" = 49.7, "dropPointY" = 86.5 WHERE "slug" = 'cadena-prueba-1';
UPDATE "Product" SET "dropPointX" = 44.5, "dropPointY" = 88.8 WHERE "slug" = 'cadena-prueba-2';
UPDATE "Product" SET "dropPointX" = 46.2, "dropPointY" = 87.1 WHERE "slug" = 'cadena-prueba-3';
