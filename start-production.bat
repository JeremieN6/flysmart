@echo off
echo ================================
echo   FlySmart - Demarrage rapide
echo ================================
echo.

REM Verifier si node_modules existe
if not exist "node_modules\" (
    echo [1/3] Installation des dependances...
    call npm install
    echo.
) else (
    echo [1/3] Dependances deja installees
    echo.
)

echo [2/3] Build du frontend...
call npm run build
echo.

echo [3/3] Demarrage du serveur...
echo.
echo L'application sera disponible sur http://localhost:5000
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

set NODE_ENV=production
call npm start
