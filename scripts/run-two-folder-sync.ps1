param(
  [string]$OriginalDir = "D:\Success_Suphancasting\Product_image\original",
  [string]$WebDir = "D:\Success_Suphancasting\Product_image\web",
  [string]$NextJsPublicDir = "D:\Success_Suphancasting\suphancasting\public\products\generated",
  [int]$Size = 1200,
  [int]$Quality = 85,
  [ValidateSet("transparent", "white")]
  [string]$Background = "transparent",
  [switch]$Watch,
  [double]$IntervalSec = 2.0,
  [switch]$InstallDeps
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonScript = Join-Path $ScriptDir "two_folder_image_sync.py"

if (!(Test-Path $PythonScript)) {
  throw "Missing script: $PythonScript"
}

if (Get-Command py -ErrorAction SilentlyContinue) {
  $PythonCmd = "py -3"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  $PythonCmd = "python"
} else {
  throw "Python 3 not found. Please install Python first."
}

if ($InstallDeps) {
  Write-Host "Installing Python dependencies (Pillow + rembg)..."
  Invoke-Expression "$PythonCmd -m pip install --upgrade pillow rembg"
}

$WatchArg = ""
if ($Watch) { $WatchArg = "--watch" }

$cmd = @(
  "$PythonCmd `"$PythonScript`"",
  "--original-dir `"$OriginalDir`"",
  "--web-dir `"$WebDir`"",
  "--nextjs-public-dir `"$NextJsPublicDir`"",
  "--size $Size",
  "--quality $Quality",
  "--background $Background",
  "--interval-sec $IntervalSec",
  $WatchArg
) -join " "

Write-Host "Running two-folder sync..."
Write-Host $cmd
Invoke-Expression $cmd

