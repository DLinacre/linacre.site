[CmdletBinding()]
param([string]$Metadata, [switch]$DryRun, [switch]$Replace)
$ErrorActionPreference = 'Stop'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Install Node.js 22 LTS from nodejs.org, reopen PowerShell, then run npm ci in this website folder.' }
$Publisher = Join-Path $PSScriptRoot 'scripts/publishing/publish.ts'
$Arguments = @('--import', 'tsx', $Publisher, '--project')
if ($Metadata) { $Arguments += @('--metadata', $Metadata) }
if ($DryRun) { $Arguments += '--dry-run' }
if ($Replace) { $Arguments += '--replace' }
Push-Location $PSScriptRoot
try { & node @Arguments; if ($LASTEXITCODE -ne 0) { throw 'Publication did not complete. Read the error above. Source files were not deleted.' } }
finally { Pop-Location }
