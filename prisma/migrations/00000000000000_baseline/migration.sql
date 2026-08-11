-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "price_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "route" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departure_date" DATE NOT NULL,
    "collected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collected_on" DATE NOT NULL DEFAULT CURRENT_DATE,
    "days_until_departure" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "airline" TEXT,
    "source" TEXT NOT NULL DEFAULT 'flightsky',

    CONSTRAINT "price_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_requests" (
    "id" BIGSERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "structure_type" TEXT NOT NULL,
    "site" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_snapshots_route_departure_idx" ON "price_snapshots"("route", "departure_date");

-- CreateIndex
CREATE UNIQUE INDEX "price_snapshots_unique_daily_idx" ON "price_snapshots"("route", "departure_date", "collected_on");

