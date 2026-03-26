# [ ROSHAN_NATIVE ] - Neural Engine Launch Protocol
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[ INITIALIZING NEURAL ENGINE ]" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$VENV_PATH = ".\venv-roshan\Scripts\python.exe"
$SCRIPT_PATH = ".\neural_service.py"

if (Test-Path $VENV_PATH) {
    Write-Host "[+] Activating 16-Core Ryzen 9950X Satellite..." -ForegroundColor Green
    & $VENV_PATH $SCRIPT_PATH
} else {
    Write-Host "[!] ERROR: Virtual environment not found at $VENV_PATH" -ForegroundColor Red
}
