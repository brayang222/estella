-- CreateTable
CREATE TABLE "CategorySlugHistory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategorySlugHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategorySlugHistory_slug_key" ON "CategorySlugHistory"("slug");

-- CreateIndex
CREATE INDEX "CategorySlugHistory_categoryId_idx" ON "CategorySlugHistory"("categoryId");

-- AddForeignKey
ALTER TABLE "CategorySlugHistory" ADD CONSTRAINT "CategorySlugHistory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
