# Instalador de Claude Code Clarity para Windows (PowerShell 5.1 o más nuevo).
# Se puede correr las veces que quieras: lo que ya está instalado se salta
# y nunca se sobrescriben tus archivos.
# Si Windows pide permiso o contraseña, es en SU ventanita (nunca en un chat).

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

# --- Rutas -------------------------------------------------------------------
$Aqui    = Split-Path -Parent $MyInvocation.MyCommand.Path
$Origen  = (Resolve-Path (Join-Path $Aqui '..')).Path
$Destino = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Claude Code Clarity'
$Estado  = Join-Path $env:USERPROFILE '.clarity-lab'

$Fallas = New-Object System.Collections.ArrayList
$Hechos = New-Object System.Collections.ArrayList

function Paso($t)      { Write-Host ''; Write-Host "→ $t" -ForegroundColor Cyan }
function Bien($t)      { Write-Host "   ✔ $t" -ForegroundColor Green; [void]$Hechos.Add($t) }
function Falla($p, $q) { Write-Host "   ✖ ${p}: $q" -ForegroundColor Yellow; [void]$Fallas.Add("${p}: $q") }
function Tiene($cmd)   { [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
function Refrescar-Path {
  $m = [Environment]::GetEnvironmentVariable('Path', 'Machine')
  $u = [Environment]::GetEnvironmentVariable('Path', 'User')
  $env:Path = "$m;$u;$env:USERPROFILE\.local\bin"
}

Write-Host '=============================================='
Write-Host '  Instalador de Claude Code Clarity (Windows)'
Write-Host '=============================================='

# --- 0. Nombre del negocio -----------------------------------------------------
New-Item -ItemType Directory -Force -Path $Estado | Out-Null
$ArchivoNegocio = Join-Path $Estado 'negocio.txt'
$Negocio = ''
if (Test-Path $ArchivoNegocio) { $Negocio = (Get-Content $ArchivoNegocio -Raw).Trim() }
if (-not $Negocio) {
  $Negocio = Read-Host '¿Cómo se llama tu negocio? (Enter para dejarlo para después)'
  if ($Negocio) { Set-Content -Path $ArchivoNegocio -Value $Negocio -Encoding UTF8 }
}

# --- 1. Carpeta de trabajo ------------------------------------------------------
Paso "Creando tu carpeta en Documentos: $Destino"
try {
  New-Item -ItemType Directory -Force -Path $Destino -ErrorAction Stop | Out-Null
  # /XC /XN /XO = nunca reemplazar un archivo que ya exista
  robocopy "$Origen" "$Destino" /E /XC /XN /XO /XD instalador .git /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) { throw 'robocopy' }
  Set-Content -Path (Join-Path $Estado 'carpeta.txt') -Value $Destino -Encoding UTF8
  $Boton = Join-Path $Destino 'Abrir Claude.bat'
  if (-not (Test-Path $Boton)) {
    $txt = "@echo off`r`nchcp 65001 >nul`r`ncd /d `"%~dp0`"`r`nset `"PATH=%USERPROFILE%\.local\bin;%PATH%`"`r`nclaude`r`npause`r`n"
    [IO.File]::WriteAllText($Boton, $txt, (New-Object System.Text.UTF8Encoding($false)))
  }
  Bien 'Carpeta lista'
} catch {
  Falla 'Carpeta' 'no pude copiar los archivos. Revisa que tengas espacio y vuelve a correr el instalador.'
}

# --- 2. winget -------------------------------------------------------------------
Paso 'Revisando winget (el instalador de programas de Windows)'
$HayWinget = Tiene 'winget'
if ($HayWinget) { Bien 'winget' } else {
  Falla 'winget' 'abre Microsoft Store, busca «Instalador de aplicación» (App Installer), actualízalo y vuelve a correr este instalador'
}

function Instalar-Winget($id, $nombre) {
  $lista = winget list --id $id --exact --accept-source-agreements 2>$null | Out-String
  if ($lista -match [regex]::Escape($id)) { Write-Host "   · $nombre ya estaba"; return }
  Write-Host "   · instalando $nombre (puede tardar)…"
  winget install --id $id --exact --silent --accept-package-agreements --accept-source-agreements | Out-Null
  # 0 = listo; -1978335189 = ya estaba y no hay nada nuevo
  if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq -1978335189) { Write-Host "   · $nombre instalado" }
  else { Falla $nombre "corre «winget install --id $id» en PowerShell o descárgalo de su página" }
}

# --- 3. Herramientas: git, Node, FFmpeg, uv, Python ------------------------------
Paso 'Herramientas: git, Node, FFmpeg, uv y Python'
if ($HayWinget) {
  Instalar-Winget 'Git.Git'            'Git'
  Instalar-Winget 'OpenJS.NodeJS.LTS'  'Node'
  Instalar-Winget 'Gyan.FFmpeg'        'FFmpeg'
  Instalar-Winget 'astral-sh.uv'       'uv'
  Instalar-Winget 'Python.Python.3.12' 'Python'
  Refrescar-Path
  Bien 'Herramientas revisadas'
} else { Falla 'Herramientas' 'primero hace falta winget' }

# --- 4. Apps: Claude, Obsidian, Chrome ------------------------------------------
# Dictado: Windows ya trae dictado con la tecla Windows + H (no hace falta instalar nada).
Paso 'Apps: Claude, Obsidian y Chrome'
if ($HayWinget) {
  Instalar-Winget 'Anthropic.Claude'   'Claude'
  Instalar-Winget 'Obsidian.Obsidian'  'Obsidian'
  Instalar-Winget 'Google.Chrome'      'Chrome'
  Bien 'Apps revisadas'
} else { Falla 'Apps' 'primero hace falta winget' }

# --- 5. Claude Code (instalador oficial de Anthropic) ----------------------------
Paso 'Claude Code'
Refrescar-Path
if (Tiene 'claude') { Bien 'Claude Code ya estaba' } else {
  powershell -NoProfile -ExecutionPolicy Bypass -Command 'irm https://claude.ai/install.ps1 | iex'
  Refrescar-Path
  if (Tiene 'claude') { Bien 'Claude Code' } else {
    Falla 'Claude Code' 'cierra esta ventana, abre una nueva y vuelve a correr el instalador'
  }
}
# Que la carpeta de Claude Code quede en el PATH del usuario (una sola vez)
$LocalBin = Join-Path $env:USERPROFILE '.local\bin'
$PathUsuario = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($PathUsuario -notlike "*$LocalBin*") {
  [Environment]::SetEnvironmentVariable('Path', "$PathUsuario;$LocalBin", 'User')
}

# --- 6. Motores: Playwright (navegador) y Graphify (mapa) ------------------------
Paso 'Motores: Playwright y Graphify'
if (Tiene 'uv') {
  if (-not (Tiene 'playwright')) { uv tool install playwright | Out-Null; Refrescar-Path }
  if (Tiene 'playwright') {
    playwright install chromium | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host '   · Playwright listo' } else { Falla 'Playwright' 'corre «playwright install chromium» en PowerShell' }
  } else { Falla 'Playwright' 'corre «uv tool install playwright» en PowerShell' }

  if (-not (Tiene 'graphify')) { uv tool install graphifyy | Out-Null; Refrescar-Path }
  if (Tiene 'graphify') {
    graphify install 2>$null | Out-Null   # agrega la habilidad del mapa a Claude
    Write-Host '   · Graphify listo'
  } else { Falla 'Graphify' 'corre «uv tool install graphifyy» en PowerShell' }
  Bien 'Motores revisados'
} else { Falla 'Motores' 'falta uv: cierra esta ventana, abre una nueva y vuelve a correr el instalador' }

# --- 7. Sonido cuando Claude termina (solo en tu carpeta) -------------------------
Paso 'Sonido cuando Claude termina'
$Local = Join-Path $Destino '.claude\settings.local.json'
if (Test-Path $Local) { Bien 'El sonido ya estaba configurado' } else {
  New-Item -ItemType Directory -Force -Path (Join-Path $Destino '.claude') | Out-Null
  $json = @'
{
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": "powershell.exe -NoProfile -Command \"(New-Object Media.SoundPlayer 'C:\\Windows\\Media\\notify.wav').PlaySync()\"" } ] }
    ]
  }
}
'@
  [IO.File]::WriteAllText($Local, $json, (New-Object System.Text.UTF8Encoding($false)))
  Bien 'Sonido configurado'
}

# --- 8. Obsidian: registrar la carpeta como bóveda (solo si es sencillo) ---------
Paso 'Obsidian: tu carpeta como bóveda'
$Obs = Join-Path $env:APPDATA 'obsidian\obsidian.json'
if ((Test-Path $Obs) -and ((Get-Content $Obs -Raw) -like "*Claude Code Clarity*")) {
  Bien 'Obsidian ya conocía tu carpeta'
} elseif (-not (Test-Path $Obs)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $Obs) | Out-Null
  $id = -join ((1..16) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
  $ts = [int64]((Get-Date).ToUniversalTime() - (Get-Date '1970-01-01')).TotalMilliseconds
  $ruta = $Destino.Replace('\', '\\').Replace('"', '\"')
  $txt = '{"vaults":{"' + $id + '":{"path":"' + $ruta + '","ts":' + $ts + ',"open":true}}}'
  [IO.File]::WriteAllText($Obs, $txt, (New-Object System.Text.UTF8Encoding($false)))
  Bien 'Carpeta registrada en Obsidian'
} else {
  Write-Host '   En Obsidian: «Abrir carpeta como bóveda» y elige Documentos > Claude Code Clarity.'
  [void]$Hechos.Add('Obsidian: abrir la carpeta a mano')
}

# --- 9. Verificación final -----------------------------------------------------
Paso 'Revisión final'
Refrescar-Path
if (Tiene 'claude') {
  claude --version
  if ($LASTEXITCODE -ne 0) { Falla 'Revisión' '«claude --version» no respondió; abre una ventana nueva y corre el instalador otra vez' }
  claude doctor
} else {
  Falla 'Revisión' 'no encuentro el comando claude; abre una ventana nueva y corre el instalador otra vez'
}

# --- Resumen ----------------------------------------------------------------------
$res = @()
$res += "Instalación de Claude Code Clarity · $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
if ($Negocio) { $res += "Negocio: $Negocio" } else { $res += 'Negocio: POR DEFINIR' }
$res += "Carpeta: $Destino"
foreach ($h in $Hechos) { $res += "OK  $h" }
foreach ($f in $Fallas) { $res += "ERR $f" }
Set-Content -Path (Join-Path $Estado 'resumen.txt') -Value $res -Encoding UTF8

Write-Host ''
Write-Host '=============================================='
if ($Fallas.Count -eq 0) {
  Write-Host '✔ Listo' -ForegroundColor Green
  Write-Host 'Abre tu carpeta (Documentos > Claude Code Clarity) y da doble clic en «Abrir Claude.bat».'
  Write-Host 'La primera vez, Claude te pedirá entrar con tu cuenta en el navegador.'
} else {
  foreach ($f in $Fallas) { Write-Host "✖ Se atoró en $f" -ForegroundColor Yellow }
  Write-Host ''
  Write-Host 'Puedes volver a correr este instalador: lo que ya quedó se salta.'
}
Write-Host "(Resumen guardado en $(Join-Path $Estado 'resumen.txt'))"
Write-Host '=============================================='
