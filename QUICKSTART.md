# 🚀 Guía de Inicio Rápido

## ¿Qué acabamos de crear?

Hemos creado la estructura completa de tu **Personal Finance Dashboard**:

✅ **Backend** - Node.js + Express + Prisma + PostgreSQL  
✅ **Frontend** - React + Vite con diseño moderno  
✅ **Database Schema** - Normalizado con manejo correcto de moneda  
✅ **Git Repository** - Proyecto inicializado y con primer commit

---

## 📋 Próximos Pasos para Completar la Configuración

### Paso 1: Configurar PostgreSQL

Durante la instalación de PostgreSQL, se te pidió establecer una **contraseña para el usuario `postgres`**. Necesitarás esa contraseña ahora.

### Paso 2: Crear archivo .env en el Backend

```bash
cd backend
```

Crea un archivo llamado `.env` (sin extensión) con el siguient contenido:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/finance_db"
PORT=5000
```

**IMPORTANTE**: Reemplaza `TU_PASSWORD_AQUI` con la contraseña que estableciste durante la instalación de PostgreSQL.

### Paso 3: Instalar Dependencias del Backend

```bash
npm install
```

### Paso 4: Ejecutar Migraciones de Prisma

Esto creará las tablas en PostgreSQL:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Si te pregunta por crear la base de datos, responde **Yes (y)**.

### Paso 5: Iniciar el Servidor Backend

```bash
npm run dev
```

El backend debería estar corriendo en `http://localhost:5000`

### Paso 6: Iniciar el Frontend (en otra terminal)

Abre una **nueva terminal** y ejecuta:

```bash
cd frontend
npm run dev
```

El frontend debería estar en `http://localhost:5173`

---

## 🎯 Verificación

Si todo funciona correctamente:

1. ✅ Backend en http://localhost:5000 muestra un JSON con información de la API
2. ✅ Frontend en http://localhost:5173 muestra la interfaz con diseño moderno
3. ✅ No hay errores en las consolas

---

##  Estructura del Proyecto

```
personal-finance-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── routes/          # Endpoints API
│   │   └── server.js        # Servidor Express
│   ├── prisma/
│   │   └── schema.prisma    # Esquema de base de datos
│   ├── .env                 # 🔴 Crear este archivo (no incluido en Git)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React (próximamente)
│   │   ├── pages/           # Páginas (próximamente)
│   │   ├── services/        # API client (próximamente)
│   │   ├── App.jsx          # Componente principal
│   │   └── index.css        # Estilos modernos con glassmorphism
│   └── package.json
└── README.md
```

---

## 🛠️ Comandos Útiles

### Backend
```bash
npm run dev          # Iniciar servidor en modo desarrollo
npx prisma studio    # Abrir interfaz visual de la BD
npx prisma generate  # Regenerar cliente Prisma
```

### Frontend
```bash
npm run dev    # Iniciar servidor de desarrollo
npm run build  # Crear build de producción
```

---

## 🔧 Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica que la contraseña en `.env` sea correcta
- Verifica que el puerto en `DATABASE_URL` sea 5432

### Error: "Port 5000 already in use"
- Cambia el puerto en `backend/.env`: `PORT=5001`
- Actualiza el proxy en `frontend/vite.config.js` a `http://localhost:5001`

### Error: Frontend no encuentra el backend
- Verifica que el backend esté corriendo en puerto 5000
- Verifica la configuración del proxy en `vite.config.js`

---

## 📚 Próximas Funcionalidades a Implementar

1. **Componentes Frontend**
   - Formulario de transacciones
   - Lista de transacciones con filtros
   - Gráficos con Chart.js
   - Gestión de categorías

2. **Funcionalidades Backend**
   - Autenticación JWT
   - Validación de datos
   - Manejo de errores mejorado

3. **Features Avanzados**
   - Exportar a PDF/CSV
   - Presupuestos mensuales
   - Notificaciones
   - PWA

---

## 🎨 Características del Diseño

✨ **Glassmorphism** - Efectos de vidrio translúcido  
🌈 **Gradientes Vibrantes** - Colores modernos  
⚡ **Animaciones Suaves** - Transiciones fluidas  
📱 **Responsive** - Se adapta a cualquier pantalla  
🎯 **UX Premium** - Diseño profesional y elegante

---

## 📖 Documentación de Tecnologías

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Chart.js](https://www.chartjs.org/)

---

¿Listo para empezar? ¡Sigue los pasos de arriba y tendrás tu aplicación corriendo en minutos! 🚀
