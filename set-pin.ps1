# ==============================================================================
# PERFECT COMPUTER EDUCATION - SECURE ADMIN PIN CONFIGURATOR
# Securely sets your private Admin PIN with cryptographic SHA-256 hashing
# ==============================================================================

$baseDir = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($baseDir)) {
    $baseDir = "C:\Users\DELL\.gemini\antigravity\scratch\perfect-computer-education"
}

$envFile = Join-Path $baseDir ".env"
$dbFile = Join-Path $baseDir "data\database.json"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  PERFECT COMPUTER EDUCATION - SECURE PIN SETUP" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter your new private Admin PIN (input will be masked):" -ForegroundColor Yellow

$securePin = Read-Host -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePin)
$plainPin = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

if ([string]::IsNullOrWhiteSpace($plainPin) -or $plainPin.Trim().Length -lt 4) {
    Write-Host "Error: PIN must be at least 4 characters long." -ForegroundColor Red
    exit 1
}

Write-Host "Confirm your new Admin PIN:" -ForegroundColor Yellow
$secureConfirm = Read-Host -AsSecureString
$bstrConfirm = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureConfirm)
$plainConfirm = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstrConfirm)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstrConfirm)

if ($plainPin -ne $plainConfirm) {
    Write-Host "Error: PINs do not match. Please run the script again." -ForegroundColor Red
    exit 1
}

# Generate SHA-256 Hash
$bytes = [System.Text.Encoding]::UTF8.GetBytes($plainPin.Trim())
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hashBytes = $sha256.ComputeHash($bytes)
$pinHash = ([System.BitConverter]::ToString($hashBytes)).Replace("-", "").ToLower()

# Clear plain text from memory
$plainPin = $null
$plainConfirm = $null
[GC]::Collect()

# Update database.json
if (Test-Path $dbFile) {
    $rawDb = [System.IO.File]::ReadAllText($dbFile, [System.Text.Encoding]::UTF8)
    $db = $rawDb | ConvertFrom-Json
    $db.adminAuth.pinHash = $pinHash
    $db.adminAuth.pinHint = "Private Admin PIN configured securely."
    $json = $db | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($dbFile, $json, [System.Text.Encoding]::UTF8)
}

# Update .env
if (Test-Path $envFile) {
    $lines = Get-Content $envFile
    $newLines = @()
    foreach ($line in $lines) {
        if ($line -like "ADMIN_PIN_HASH=*") {
            $newLines += "ADMIN_PIN_HASH=$pinHash"
        } else {
            $newLines += $line
        }
    }
    Set-Content -Path $envFile -Value $newLines -Encoding UTF8
}

Write-Host ""
Write-Host "SUCCESS: Your private Admin PIN has been hashed and saved securely!" -ForegroundColor Green
Write-Host "Your raw PIN is never stored or exposed anywhere in the code." -ForegroundColor Green
Write-Host "You can now log in at: http://localhost:8080/admin" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
