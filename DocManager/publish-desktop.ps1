# Builds Angular + API + desktop window into .\dist\DocManager  (run DocManager.exe from there)
# Run from the DocManager folder:  powershell -ExecutionPolicy Bypass -File .\publish-desktop.ps1
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$api  = "$root\backend\DocManager.Api"
$desk = "$root\desktop\DocManager.Desktop"
$out  = "$root\dist\DocManager"

Push-Location "$root\frontend"
npm install
npx ng build --configuration production
Pop-Location

Remove-Item "$api\wwwroot" -Recurse -Force -ErrorAction SilentlyContinue
New-Item "$api\wwwroot" -ItemType Directory | Out-Null
Copy-Item "$root\frontend\dist\frontend\browser\*" "$api\wwwroot" -Recurse

dotnet publish $api  -c Release -r win-x64 --self-contained true -o "$out\server"
dotnet publish $desk -c Release -r win-x64 --self-contained true -o $out
Write-Host "`nDone. Run $out\DocManager.exe"
