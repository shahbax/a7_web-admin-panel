-- CreateTable
CREATE TABLE "content_docs" (
    "key" TEXT NOT NULL,
    "draft" JSONB NOT NULL,
    "published" JSONB,
    "updatedById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_docs_pkey" PRIMARY KEY ("key")
);
