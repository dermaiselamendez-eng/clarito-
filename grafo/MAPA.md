# Grafo · mapa de la carpeta

```mermaid
graph TD
  C[CLAUDE.md] --> N[negocio.md]
  C --> S[soul/]
  C --> P[personalidad/]
  C --> R[protocolos/]
  C --> M[memoria/]
  N --> K[conocimientos/]
  N --> CL[clientes/ privada]
  P --> MA[marca/]
  L[laboratorio/] --> E[entregables/]
  L --> V[video/]
  I[instalador/] -. copia la carpeta a Documentos .-> C
```

`instalador/` (Mac y Windows) instala las herramientas y copia esta carpeta a `Documentos/Claude Code Clarity` sin sobrescribir nada.

Se actualiza al cerrar la entrevista y cuando se agregan carpetas nuevas.
