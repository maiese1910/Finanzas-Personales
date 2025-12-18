-- SCRIPT DE INICIALIZACIÓN MANUAL PARA FINANZLY (SUPABASE)
-- Pega este código en el SQL Editor de Supabase y dale a "Run"

-- 1. Crear la tabla de Usuarios
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "username" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '$',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear la tabla de Categorías
CREATE TABLE IF NOT EXISTS "categories" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL, -- 'income' o 'expense'
    "color" TEXT,
    "icon" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Crear la tabla de Transacciones
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" SERIAL PRIMARY KEY,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL, -- 'income' o 'expense'
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS "transactions_userId_date_idx" ON "transactions"("userId", "date");
CREATE INDEX IF NOT EXISTS "transactions_categoryId_idx" ON "transactions"("categoryId");
