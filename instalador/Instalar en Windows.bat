@echo off
chcp 65001 >nul
rem Doble clic para instalar Claude Code Clarity en Windows.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0instalar-windows.ps1"
echo.
pause
