# 💰 Personal Finance Dashboard

Aplicación web moderna para gestión de finanzas personales con dashboards interactivos y análisis visual de ingresos y gastos.

## 🚀 Características

- ✅ CRUD completo de transacciones (Crear, Leer, Editar, Borrar)
- 📊 Visualización gráfica de gastos mensuales con Chart.js
- 🗂️ Categorización de ingresos y gastos
- 📅 Filtrado por fecha (mes/año) y categoría
- 💵 Manejo correcto de moneda (sin errores de punto flotante)
- 🎨 Diseño moderno con animaciones y efectos glassmorphism

## 🛠️ Tech Stack

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool y dev server
- **Chart.js** - Visualización de datos
- **date-fns** - Manejo de fechas

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Base de datos relacional

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd personal-finance-dashboard
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/finance_db"
PORT=5000
```

Ejecutar migraciones de base de datos:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

## 🚀 Ejecución

### Modo Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor estará en `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
La aplicación estará en `http://localhost:5173`

## 📊 Modelo de Datos

### Users
- `id` - Identificador único
- `email` - Email único del usuario
- `name` - Nombre del usuario

### Categories
- `id` - Identificador único
- `name` - Nombre de la categoría
- `type` - Tipo: "income" o "expense"
- `userId` - Relación con usuario

### Transactions
- `id` - Identificador único
- `amount` - Monto (DECIMAL 10,2)
- `description` - Descripción
- `date` - Fecha de transacción
- `type` - Tipo: "income" o "expense"
- `categoryId` - Relación con categoría
- `userId` - Relación con usuario

## 💰 Manejo de Moneda

Este proyecto implementa las mejores prácticas para manejo de dinero:

- ✅ Usa `DECIMAL(10, 2)` en PostgreSQL (no FLOAT)
- ✅ Evita errores de punto flotante
- ✅ Precisión de 2 decimales para centavos
- ✅ Cálculos precisos en el backend

## 📁 Estructura del Proyecto

```
personal-finance-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # API client
│   │   └── utils/          # Utilidades
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # Rutas Express
│   │   ├── controllers/    # Lógica de negocio
│   │   └── server.js       # Punto de entrada
│   ├── prisma/
│   │   └── schema.prisma   # Schema de BD
│   └── package.json
└── README.md
```

## 🎯 Roadmap

- [ ] Autenticación JWT
- [ ] Exportar datos a CSV/PDF
- [ ] Presupuestos mensuales
- [ ] Notificaciones de gastos
- [ ] Modo oscuro/claro
- [ ] PWA (Progressive Web App)

## 📝 Licencia

MIT

## 👨‍💻 Autor

Tu Nombre
