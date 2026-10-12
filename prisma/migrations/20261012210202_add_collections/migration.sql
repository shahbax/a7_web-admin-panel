-- CreateTable
CREATE TABLE "collection_items" (
    "id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_items_collection_status_idx" ON "collection_items"("collection", "status");

-- CreateIndex
CREATE INDEX "collection_items_collection_order_idx" ON "collection_items"("collection", "order");

-- CreateIndex
CREATE UNIQUE INDEX "collection_items_collection_slug_key" ON "collection_items"("collection", "slug");
