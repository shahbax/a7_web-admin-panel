-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "sourceUrl" TEXT,
    "reference" TEXT,
    "payload" JSONB,
    "ip" TEXT,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_type_createdAt_idx" ON "leads"("type", "createdAt");

-- CreateIndex
CREATE INDEX "leads_handled_idx" ON "leads"("handled");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");
