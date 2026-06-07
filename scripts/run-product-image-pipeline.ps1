param(
  [string]$SourceRoot = "D:\Success_Suphancasting\Product_image",
  [string]$NextJsPublicDir = "D:\Success_Suphancasting\suphancasting\public\products\generated",
  [int]$Size = 1200,
  [int]$Quality = 85,
  [ValidateSet("transparent", "white")]
  [string]$Background = "transparent",
  [switch]$InstallDeps
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonScript = Join-Path $ScriptDir "image_pipeline.py"

if (!(Test-Path $PythonScript)) {
  throw "Missing script: $PythonScript"
}

$PythonCmd = $null
if (Get-Command py -ErrorAction SilentlyContinue) {
  $PythonCmd = "py -3"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  $PythonCmd = "python"
} else {
  throw "Python is not installed. Install Python 3 first."
}

if ($InstallDeps) {
  Write-Host "Installing required dependencies: Pillow, rembg"
  Invoke-Expression "$PythonCmd -m pip install --upgrade pillow rembg"
}

$Command = @(
  "$PythonCmd `"$PythonScript`"",
  "--root `"$SourceRoot`"",
  "--nextjs-public-dir `"$NextJsPublicDir`"",
  "--size $Size",
  "--quality $Quality",
  "--background $Background"
) -join " "

Write-Host "Running image pipeline..."
Write-Host $Command
Invoke-Expression $Command

Write-Host "Done."
Write-Host "Outputs:"
Write-Host "- $SourceRoot\bg_removed"
Write-Host "- $SourceRoot\cleaned"
Write-Host "- $SourceRoot\web_ready"
Write-Host "- $NextJsPublicDir"

