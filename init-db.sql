-- Script de inicialización para Finance Dashboard
-- Ejecutar como usuario postgres

-- Crear la base de datos
CREATE DATABASE finance_db;

-- Conectar a la base de datos
\c finance_db

-- Verificar que estamos en la base de datos correcta
SELECT current_database();

-- Mensaje de éxito
\echo '✅ Base de datos finance_db creada exitosamente'
\echo '📊 Ahora puedes ejecutar las migraciones de Prisma'
