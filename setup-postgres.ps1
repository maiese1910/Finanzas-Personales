# Script para configurar PostgreSQL para Finance Dashboard

Write-Host "🐘 Configurando PostgreSQL para Finance Dashboard" -ForegroundColor Cyan
Write-Host ""

# Ruta a los binarios de PostgreSQL
$pgBin = "C:\Program Files\PostgreSQL\17\bin"
$psql = Join-Path $pgBin "psql.exe"

# Verificar que PostgreSQL está instalado
if (-Not (Test-Path $psql)) {
    Write-Host "❌ No se encontró PostgreSQL en $pgBin" -ForegroundColor Red
    exit 1
}

Write-Host "✅ PostgreSQL encontrado en: $pgBin" -ForegroundColor Green
Write-Host ""

# Verificar que el servicio está corriendo
$service = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($service.Status -eq "Running") {
    Write-Host "✅ Servicio PostgreSQL está corriendo" -ForegroundColor Green
} else {
    Write-Host "⚠️  Servicio PostgreSQL no está corriendo. Intentando iniciar..." -ForegroundColor Yellow
    Start-Service -Name "postgresql-x64-17"
    Write-Host "✅ Servicio iniciado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Para conectarte a PostgreSQL, usa uno de estos comandos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Usando la ruta completa:" -ForegroundColor Yellow
Write-Host '   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres' -ForegroundColor White
Write-Host ""
Write-Host "2. O primero añade al PATH de esta sesión:" -ForegroundColor Yellow
Write-Host '   $env:Path += ";C:\Program Files\PostgreSQL\17\bin"' -ForegroundColor White
Write-Host '   psql -U postgres' -ForegroundColor White
Write-Host ""
Write-Host "Te pedirá la contraseña que estableciste durante la instalación." -ForegroundColor Magenta
Write-Host ""
