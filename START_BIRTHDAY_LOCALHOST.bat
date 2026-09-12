@echo off
cd /d "%~dp0"
echo.
echo Starting Birthday Surprise on http://localhost:8000
start "Birthday Surprise" http://localhost:8000/index.html
py -m http.server 8000
pause
