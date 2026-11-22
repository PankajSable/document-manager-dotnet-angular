# Builds Angular, bundles it into the API and publishes one self-contained folder: .\publish
# Run from the DocManager folder:  powershell -ExecutionPolicy Bypass -File .\publish.ps1
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$api  = "$root\backend\DocManager.Api"

Push-Location "$root\frontend"
npm install
npx ng build --configuration production
Pop-Location

Remove-Item "$api\wwwroot" -Recurse -Force -ErrorAction SilentlyContinue
New-Item "$api\wwwroot" -ItemType Directory | Out-Null
Copy-Item "$root\frontend\dist\frontend\browser\*" "$api\wwwroot" -Recurse

dotnet publish $api -c Release -r win-x64 --self-contained true -o "$root\publish"
Copy-Item "$root\start.bat" "$root\publish\start.bat" -Force
Write-Host "`nDone. Run .\publish\start.bat (or install as a Windows Service, see README)."
