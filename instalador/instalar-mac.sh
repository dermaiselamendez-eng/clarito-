#!/usr/bin/env bash
# Instalador de Claude Code Clarity para Mac.
# Se puede correr las veces que quieras: lo que ya está instalado se salta
# y nunca se sobrescriben tus archivos.
# La contraseña de tu Mac solo se escribe en ESTA ventana (nunca en un chat).

set -u

# --- Rutas -------------------------------------------------------------------
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORIGEN="$(cd "$AQUI/.." && pwd)"                 # la carpeta del repo descargado
DESTINO="${CLARITY_DESTINO:-$HOME/Documents/Claude Code Clarity}"
ESTADO="$HOME/.clarity-lab"
SOLO_COPIA="${CLARITY_SOLO_COPIA:-0}"            # 1 = solo copiar la carpeta (pruebas)

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

FALLAS=()
HECHOS=()

paso()  { printf '\n→ %s\n' "$1"; }
bien()  { printf '   ✔ %s\n' "$1"; HECHOS+=("$1"); }
falla() { printf '   ✖ %s\n' "$1: $2"; FALLAS+=("$1: $2"); }
existe_app() { [ -d "/Applications/$1" ] || [ -d "$HOME/Applications/$1" ]; }

echo "=============================================="
echo "  Instalador de Claude Code Clarity (Mac)"
echo "=============================================="

# --- 0. Nombre del negocio -----------------------------------------------------
mkdir -p "$ESTADO"
NEGOCIO=""
[ -f "$ESTADO/negocio.txt" ] && NEGOCIO="$(cat "$ESTADO/negocio.txt")"
if [ -z "$NEGOCIO" ] && [ -t 0 ]; then
  printf '\n¿Cómo se llama tu negocio? (Enter para dejarlo para después): '
  read -r NEGOCIO || NEGOCIO=""
fi
[ -n "$NEGOCIO" ] && printf '%s\n' "$NEGOCIO" > "$ESTADO/negocio.txt"

# --- 1. Carpeta de trabajo ------------------------------------------------------
copiar_carpeta() {
  paso "Creando tu carpeta en Documentos: $DESTINO"
  mkdir -p "$DESTINO" || { falla "Carpeta" "no pude crear $DESTINO. Revisa que tengas espacio en el disco."; return; }
  # Copia solo lo que falta: nunca reemplaza un archivo que ya tengas.
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --ignore-existing --exclude 'instalador/' --exclude '.git/' --exclude '.git' \
      "$ORIGEN/" "$DESTINO/" \
      || { falla "Carpeta" "no pude copiar los archivos. Vuelve a correr el instalador."; return; }
  else
    for item in "$ORIGEN"/* "$ORIGEN"/.[!.]*; do
      [ -e "$item" ] || continue
      case "$(basename "$item")" in instalador|.git) continue ;; esac
      cp -Rn "$item" "$DESTINO/" 2>/dev/null || true
    done
  fi
  printf '%s\n' "$DESTINO" > "$ESTADO/carpeta.txt"

  # Botón para abrir Claude en la carpeta
  local boton="$DESTINO/Abrir Claude.command"
  if [ ! -f "$boton" ]; then
    cat > "$boton" <<'EOF'
#!/bin/bash
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")" || exit 1
claude
EOF
    chmod +x "$boton"
  fi
  bien "Carpeta lista"
}

copiar_carpeta
if [ "$SOLO_COPIA" = "1" ]; then
  echo; echo "Modo prueba: solo se copió la carpeta."; exit 0
fi

# --- 2. Herramientas de Apple (Xcode Command Line Tools) ------------------------
paso "Herramientas básicas de Apple"
if xcode-select -p >/dev/null 2>&1; then
  bien "Herramientas de Apple ya estaban"
else
  xcode-select --install >/dev/null 2>&1 || true
  echo "   Se abrió una ventanita de Apple: dale «Instalar» y espera (puede tardar 10-20 min)."
  espera=0
  until xcode-select -p >/dev/null 2>&1 || [ $espera -ge 1800 ]; do sleep 15; espera=$((espera+15)); done
  if xcode-select -p >/dev/null 2>&1; then bien "Herramientas de Apple"; else
    falla "Herramientas de Apple" "termina la instalación de la ventanita de Apple y vuelve a correr este instalador"; fi
fi

# --- 3. Homebrew ----------------------------------------------------------------
paso "Homebrew (el instalador de programas)"
if ! command -v brew >/dev/null 2>&1; then
  echo "   Te va a pedir la contraseña de tu Mac AQUÍ, en esta ventana. Al escribirla no se ve nada: es normal."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || true
fi
for b in /opt/homebrew/bin/brew /usr/local/bin/brew; do
  [ -x "$b" ] && eval "$("$b" shellenv)" && break
done
if command -v brew >/dev/null 2>&1; then
  bien "Homebrew"
  # Que Homebrew quede disponible en ventanas nuevas (una sola vez)
  if ! grep -qs 'brew shellenv' "$HOME/.zprofile"; then
    # shellcheck disable=SC2016
    printf '\neval "$(%s shellenv)"\n' "$(command -v brew)" >> "$HOME/.zprofile"
  fi
else
  falla "Homebrew" "abre brew.sh, copia el comando que aparece ahí, pégalo en Terminal y luego vuelve a correr este instalador"
fi

# --- 4. Herramientas: git, Node, FFmpeg, uv, Python ------------------------------
paso "Herramientas: git, Node, FFmpeg, uv y Python"
if command -v brew >/dev/null 2>&1; then
  for f in git node ffmpeg uv python; do
    if brew list --formula "$f" >/dev/null 2>&1; then
      echo "   · $f ya estaba"
    elif echo "   · instalando $f (puede tardar)…" && brew install "$f" >/dev/null 2>&1; then
      echo "   · $f instalado"
    else
      falla "$f" "corre «brew install $f» en Terminal y vuelve a intentar"
    fi
  done
  bien "Herramientas revisadas"
else
  falla "Herramientas" "primero hace falta Homebrew"
fi

# --- 5. Apps: Claude, Obsidian, Superwhisper (dictado), Chrome ------------------
paso "Apps: Claude, Obsidian, Superwhisper y Chrome"
if command -v brew >/dev/null 2>&1; then
  # cask:App.app  (superwhisper: el nombre de la app va en minúsculas)
  for par in "claude:Claude.app" "obsidian:Obsidian.app" "superwhisper:superwhisper.app" "google-chrome:Google Chrome.app"; do
    cask="${par%%:*}"; app="${par#*:}"
    if existe_app "$app" || brew list --cask "$cask" >/dev/null 2>&1; then
      echo "   · ${app%.app} ya estaba"
    elif echo "   · instalando ${app%.app} (puede tardar)…" && brew install --cask "$cask" >/dev/null 2>&1; then
      echo "   · ${app%.app} instalada"
    else
      falla "${app%.app}" "corre «brew install --cask $cask» en Terminal o descárgala de su página"
    fi
  done
  bien "Apps revisadas"
else
  falla "Apps" "primero hace falta Homebrew"
fi

# --- 6. Claude Code (instalador oficial de Anthropic) ----------------------------
paso "Claude Code"
if command -v claude >/dev/null 2>&1; then
  bien "Claude Code ya estaba"
else
  curl -fsSL https://claude.ai/install.sh | bash || true
  export PATH="$HOME/.local/bin:$PATH"
  if command -v claude >/dev/null 2>&1; then bien "Claude Code"; else
    falla "Claude Code" "cierra esta ventana, abre una nueva y vuelve a correr el instalador"; fi
fi
if ! grep -qs '.local/bin' "$HOME/.zshrc"; then
  # shellcheck disable=SC2016
  printf '\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "$HOME/.zshrc"
fi

# --- 7. Motores: Playwright (navegador) y Graphify (mapa) ------------------------
paso "Motores: Playwright y Graphify"
if command -v uv >/dev/null 2>&1; then
  if command -v playwright >/dev/null 2>&1 || uv tool install playwright >/dev/null 2>&1; then
    if playwright install chromium >/dev/null 2>&1; then echo "   · Playwright listo"; else
      falla "Playwright" "corre «playwright install chromium» en Terminal"; fi
  else
    falla "Playwright" "corre «uv tool install playwright» en Terminal"
  fi
  if command -v graphify >/dev/null 2>&1 || uv tool install graphifyy >/dev/null 2>&1; then
    graphify install >/dev/null 2>&1 || true   # agrega la habilidad del mapa a Claude
    echo "   · Graphify listo"
  else
    falla "Graphify" "corre «uv tool install graphifyy» en Terminal"
  fi
  bien "Motores revisados"
else
  falla "Motores" "falta uv: corre «brew install uv» y vuelve a intentar"
fi

# --- 8. Sonido cuando Claude termina (solo en tu carpeta) -------------------------
paso "Sonido cuando Claude termina"
LOCAL="$DESTINO/.claude/settings.local.json"
if [ -f "$LOCAL" ]; then
  bien "El sonido ya estaba configurado"
else
  mkdir -p "$DESTINO/.claude"
  cat > "$LOCAL" <<'EOF'
{
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": "afplay /System/Library/Sounds/Glass.aiff >/dev/null 2>&1 || true" } ] }
    ]
  }
}
EOF
  bien "Sonido configurado"
fi

# --- 9. Obsidian: registrar la carpeta como bóveda (solo si es sencillo) ---------
paso "Obsidian: tu carpeta como bóveda"
OBS="$HOME/Library/Application Support/obsidian/obsidian.json"
if [ -f "$OBS" ] && grep -qF "$DESTINO" "$OBS"; then
  bien "Obsidian ya conocía tu carpeta"
elif [ ! -f "$OBS" ]; then
  mkdir -p "$(dirname "$OBS")"
  id="$(LC_ALL=C tr -dc 'a-f0-9' </dev/urandom | head -c 16)"
  ts="$(($(date +%s) * 1000))"
  ruta="${DESTINO//\\/\\\\}"; ruta="${ruta//\"/\\\"}"
  printf '{"vaults":{"%s":{"path":"%s","ts":%s,"open":true}}}\n' "$id" "$ruta" "$ts" > "$OBS"
  bien "Carpeta registrada en Obsidian"
else
  echo "   En Obsidian: «Abrir carpeta como bóveda» y elige Documentos › Claude Code Clarity."
  HECHOS+=("Obsidian: abrir la carpeta a mano")
fi

# --- 10. Verificación final -----------------------------------------------------
paso "Revisión final"
if command -v claude >/dev/null 2>&1; then
  claude --version || falla "Revisión" "«claude --version» no respondió; abre una ventana nueva y corre el instalador otra vez"
  claude doctor </dev/null || echo "   (claude doctor mostró avisos; revisa arriba)"
else
  falla "Revisión" "no encuentro el comando claude; abre una ventana nueva y corre el instalador otra vez"
fi

# --- Resumen ----------------------------------------------------------------------
{
  echo "Instalación de Claude Code Clarity · $(date '+%Y-%m-%d %H:%M')"
  echo "Negocio: ${NEGOCIO:-POR DEFINIR}"
  echo "Carpeta: $DESTINO"
  for h in "${HECHOS[@]+"${HECHOS[@]}"}"; do echo "OK  $h"; done
  for f in "${FALLAS[@]+"${FALLAS[@]}"}"; do echo "ERR $f"; done
} > "$ESTADO/resumen.txt"

echo
echo "=============================================="
if [ ${#FALLAS[@]} -eq 0 ]; then
  echo "✔ Listo"
  echo "Abre tu carpeta (Documentos › Claude Code Clarity) y da doble clic en «Abrir Claude.command»."
  echo "La primera vez, Claude te pedirá entrar con tu cuenta en el navegador."
else
  for f in "${FALLAS[@]}"; do echo "✖ Se atoró en $f"; done
  echo
  echo "Puedes volver a correr este instalador: lo que ya quedó se salta."
fi
echo "(Resumen guardado en $ESTADO/resumen.txt)"
echo "=============================================="
