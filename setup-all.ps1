# Script automático de configuración para Finance Dashboard
# Ejecutar como: .\setup-all.ps1

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  💰 Finance Dashboard - Configuración Automática" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Agregar PostgreSQL al PATH
Write-Host "📍 Paso 1: Configurando PostgreSQL..." -ForegroundColor Yellow
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"

# Verificar psql
try {
    $version = & psql --version 2>&1
    Write-Host "   ✅ $version" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: No se pudo encontrar PostgreSQL" -ForegroundColor Red
    exit 1
}

# Paso 2: Solicitar contraseña
Write-Host ""
Write-Host "📍 Paso 2: Configuración de base de datos" -ForegroundColor Yellow
Write-Host ""
Write-Host "Por favor, ingresa la contraseña de PostgreSQL" -ForegroundColor Cyan
Write-Host "(la que estableciste durante la instalación)" -ForegroundColor Gray
Write-Host ""

$password = Read-Host "Contraseña de postgres" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Paso 3: Crear archivo .env
Write-Host ""
Write-Host "📍 Paso 3: Creando archivo .env..." -ForegroundColor Yellow

$envContent = @"
DATABASE_URL="postgresql://postgres:$plainPassword@localhost:5432/finance_db"
PORT=5000
"@

Set-Content -Path "backend\.env" -Value $envContent
Write-Host "   ✅ Archivo .env creado" -ForegroundColor Green

# Paso 4: Crear base de datos
Write-Host ""
Write-Host "📍 Paso 4: Creando base de datos finance_db..." -ForegroundColor Yellow

$env:PGPASSWORD = $plainPassword
try {
    & psql -U postgres -c "CREATE DATABASE finance_db;" 2>&1 | Out-Null
    Write-Host "   ✅ Base de datos creada (o ya existe)" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠️  La base de datos puede que ya exista" -ForegroundColor Yellow
}

# Paso 5: Instalar dependencias del backend
Write-Host ""
Write-Host "📍 Paso 5: Instalando dependencias del backend..." -ForegroundColor Yellow
Push-Location backend
npm install | Out-Null
Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green

# Paso 6: Ejecutar migraciones
Write-Host ""
Write-Host "📍 Paso 6: Ejecutando migraciones de Prisma..." -ForegroundColor Yellow
npx prisma migrate dev --name init 2>&1 | Out-Null
npx prisma generate | Out-Null
Write-Host "   ✅ Tablas creadas en la base de datos" -ForegroundColor Green
Pop-Location

# Resumen final
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar tu aplicación:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow  
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📊 Abrir Prisma Studio (opcional):" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npx prisma studio" -ForegroundColor White
Write-Host ""
