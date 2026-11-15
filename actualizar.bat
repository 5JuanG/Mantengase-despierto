@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo   Subiendo archivos a GitHub
echo   Repo: 5JuanG/Mantengase-despierto
echo ==========================================
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git no esta instalado. Descargalo en https://git-scm.com/download/win
    pause
    exit /b 1
)

if not exist ".git" (
    echo Primera vez: preparando la carpeta...
    git init
    git branch -M main
    git remote add origin https://github.com/5JuanG/Mantengase-despierto.git
    git fetch origin
    git reset --soft origin/main 2>nul
)

git remote set-url origin https://github.com/5JuanG/Mantengase-despierto.git

git add -A

set "FECHA=%date% %time:~0,5%"
git commit -m "Actualizacion %FECHA%"
if errorlevel 1 (
    echo.
    echo No hay cambios nuevos para subir.
)

git push -u origin main
if errorlevel 1 (
    echo.
    echo ERROR al subir. Revisa tu conexion o inicia sesion en GitHub cuando te lo pida.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Listo. Archivos subidos correctamente.
echo ==========================================
pause