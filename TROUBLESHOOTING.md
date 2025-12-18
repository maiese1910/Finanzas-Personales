# 🔧 Guía de Solución de Problemas - PostgreSQL

## ❌ Problema: "la autentificación password falló para el usuario «postgres»"

Esto significa que la contraseña que ingresaste no es correcta.

---

## ✅ SOLUCIÓN 1: Usar pgAdmin 4 (Interfaz Gráfica)

pgAdmin 4 se instaló junto con PostgreSQL. Es MÁS FÁCIL que usar la línea de comandos.

### Pasos:

1. **Abrir pgAdmin 4:**
   - Busca "pgAdmin 4" en el menú de inicio de Windows
   - O ejecuta: `Start-Process "C:\Program Files\PostgreSQL\17\pgAdmin 4\bin\pgAdmin4.exe"`

2. **Conectarte:**
   - Te pedirá una "Master Password" (puedes crear una nueva)
   - En el panel izquierdo, haz clic en "Servers" → "PostgreSQL 17"
   - Ingresa tu contraseña de PostgreSQL

3. **Crear la base de datos:**
   - Haz clic derecho en "Databases"
   - Selecciona "Create" → "Database"
   - Nombre: `finance_db`
   - Haz clic en "Save"

4. **¡Listo!** Ahora puedes continuar con el backend.

---

## ✅ SOLUCIÓN 2: Resetear la contraseña de PostgreSQL

Si olvidaste tu contraseña:

### Opción A: Usar Windows Authentication

1. Abrir el archivo de configuración:
   ```powershell
   notepad "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
   ```

2. Busca la línea que dice:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

3. Cámbiala temporalmente a:
   ```
   host    all             all             127.0.0.1/32            trust
   ```

4. Reinicia PostgreSQL:
   ```powershell
   Restart-Service postgresql-x64-17
   ```

5. Ahora puedes conectarte sin contraseña:
   ```powershell
   psql -U postgres
   ```

6. Cambia la contraseña:
   ```sql
   ALTER USER postgres WITH PASSWORD 'nueva_contraseña';
   ```

7. **IMPORTANTE:** Revierte el cambio en `pg_hba.conf` (vuelve a poner `scram-sha-256`)

8. Reinicia PostgreSQL de nuevo.

---

## ✅ SOLUCIÓN 3: Método manual sin contraseña (temporal)

Si solo quieres crear la base de datos AHORA y lidiar con la contraseña después:

1. **Modificar pg_hba.conf:**
   ```powershell
   notepad "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
   ```

2. **Cambiar `scram-sha-256` a `trust`** en las líneas de localhost

3. **Reiniciar PostgreSQL:**
   ```powershell
   Restart-Service postgresql-x64-17
   ```

4. **Crear la base de datos SIN contraseña:**
   ```powershell
   psql -U postgres -c "CREATE DATABASE finance_db;"
   ```

5. **Restaurar seguridad** (cambiar `trust` de vuelta a `scram-sha-256`)

---

## ✅ SOLUCIÓN 4: Verificar cuál es tu contraseña

Intenta estas contraseñas comunes:

- `postgres` (la más común)
- `admin`
- Tu contraseña de Windows
- `password`
- `12345678`
- Contraseña vacía (solo presiona Enter)

---

## 🎯 Recomendación

La forma **MÁS FÁCIL** es usar **pgAdmin 4**. Es una interfaz gráfica donde puedes:
- Ver tus bases de datos
- Crear tablas visualmente
- Ejecutar SQL
- Gestionar usuarios

Para abrirlo:
```powershell
Start-Process "C:\Program Files\PostgreSQL\17\pgAdmin 4\bin\pgAdmin4.exe"
```

O búscalo en el menú de inicio de Windows.
