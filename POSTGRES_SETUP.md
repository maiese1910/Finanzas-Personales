# 🚀 Guía Paso a Paso: Configurar PostgreSQL

## Paso 1: Agregar PostgreSQL al PATH (para esta sesión)

Abre PowerShell y ejecuta:

```powershell
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"
```

Ahora puedes usar `psql` directamente.

## Paso 2: Conectarte a PostgreSQL

```powershell
psql -U postgres
```

Te pedirá la **contraseña** que estableciste durante la instalación.

## Paso 3: Crear la base de datos

Una vez conectado a PostgreSQL, ejecuta:

```sql
CREATE DATABASE finance_db;
```

Luego sal con:
```sql
\q
```

**O hazlo todo en un solo comando:**

```powershell
psql -U postgres -c "CREATE DATABASE finance_db;"
```

## Paso 4: Crear el archivo .env

En la carpeta `backend`, crea un archivo llamado `.env` con este contenido:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/finance_db"
PORT=5000
```

**⚠️ IMPORTANTE:** Reemplaza `TU_PASSWORD_AQUI` con tu contraseña de PostgreSQL.

## Paso 5: Instalar dependencias del backend

```powershell
cd backend
npm install
```

## Paso 6: Ejecutar migraciones de Prisma

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

Esto creará todas las tablas (Users, Categories, Transactions).

## Paso 7: Iniciar el backend

```powershell
npm run dev
```

El servidor debería iniciar en `http://localhost:5000`

## Paso 8: Iniciar el frontend (en otra terminal)

```powershell
cd frontend
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

---

## 🔍 Verificar que todo funciona

1. **Ver la base de datos con pgAdmin o psql:**
   ```powershell
   psql -U postgres -d finance_db -c "\dt"
   ```
   
2. **Abrir Prisma Studio (interfaz visual):**
   ```powershell
   cd backend
   npx prisma studio
   ```
   Se abrirá en `http://localhost:5555`

---

## ❓ Solución de problemas

### "Password authentication failed"
- Verifica que la contraseña en `.env` sea correcta
- Intenta conectarte manualmente: `psql -U postgres`

### "Database does not exist"
- Crea la base de datos: `psql -U postgres -c "CREATE DATABASE finance_db;"`

### "Port 5432 is not reachable"
- Verifica que el servicio esté corriendo: `Get-Service postgresql-x64-17`
- Si está detenido: `Start-Service postgresql-x64-17`

---

## 💡 Tips útiles

**Ver todas tus bases de datos:**
```powershell
psql -U postgres -c "\l"
```

**Eliminar y recrear la base de datos:**
```powershell
psql -U postgres -c "DROP DATABASE IF EXISTS finance_db;"
psql -U postgres -c "CREATE DATABASE finance_db;"
```

**Ver las tablas creadas por Prisma:**
```powershell
psql -U postgres -d finance_db -c "\dt"
```
