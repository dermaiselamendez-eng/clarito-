import { db } from "./db";

export async function obtenerContenidoLanding() {
  const filas = await db.contenidoLanding.findMany();
  const mapa: Record<string, string> = {};
  for (const f of filas) mapa[f.clave] = f.valor;
  return mapa;
}
