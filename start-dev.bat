@echo off
echo ================================
echo   FlySmart - Mode Developpement
echo ================================
echo.

REM Verifier si node_modules existe
if not exist "node_modules\" (
    echo Installation des dependances...
    call npm install
    echo.
)

echo Demarrage de l'application en mode developpement...
echo.
echo Frontend : http://localhost:5173
echo Backend  : http://localhost:5000
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

call npm run dev
