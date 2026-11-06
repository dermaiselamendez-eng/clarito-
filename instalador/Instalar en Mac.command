#!/bin/bash
# Doble clic para instalar Claude Code Clarity en tu Mac.
cd "$(dirname "$0")" || exit 1
bash ./instalar-mac.sh
echo
read -r -p "Presiona Enter para cerrar esta ventana." _
