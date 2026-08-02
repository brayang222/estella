-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "whatsappNumber" TEXT NOT NULL,
    "whatsappGreeting" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "marqueeItems" TEXT NOT NULL,
    "productNote" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
