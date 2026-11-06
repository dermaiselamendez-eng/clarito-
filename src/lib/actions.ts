"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { hashPassword } from "./auth";

function str(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

// ---------- Pacientes ----------
export async function crearPaciente(form: FormData) {
  await db.paciente.create({
    data: {
      nombre: str(form, "nombre") ?? "Sin nombre",
      telefono: str(form, "telefono") ?? "",
      email: str(form, "email"),
      genero: str(form, "genero"),
      notas: str(form, "notas"),
      origen: "Manual",
    },
  });
  revalidatePath("/admin/pacientes");
}

export async function agregarNotaClinica(form: FormData) {
  const pacienteId = str(form, "pacienteId");
  if (!pacienteId) return;
  await db.notaClinica.create({
    data: {
      pacienteId,
      titulo: str(form, "titulo") ?? "Nota",
      contenido: str(form, "contenido") ?? "",
    },
  });
  revalidatePath(`/admin/pacientes/${pacienteId}`);
}

// ---------- Citas ----------
export async function crearCita(form: FormData) {
  const pacienteId = str(form, "pacienteId");
  const fecha = str(form, "fecha");
  if (!pacienteId || !fecha) return;
  await db.cita.create({
    data: {
      pacienteId,
      tratamientoId: str(form, "tratamientoId"),
      fecha: new Date(fecha),
      notas: str(form, "notas"),
    },
  });
  revalidatePath("/admin/citas");
}

export async function actualizarEstadoCita(citaId: string, estado: string) {
  await db.cita.update({ where: { id: citaId }, data: { estado: estado as any } });
  revalidatePath("/admin/citas");
  revalidatePath("/admin");
}

// ---------- Tratamientos ----------
export async function crearTratamiento(form: FormData) {
  const precioStr = str(form, "precio");
  await db.tratamiento.create({
    data: {
      nombre: str(form, "nombre") ?? "Nuevo tratamiento",
      categoria: str(form, "categoria") ?? "General",
      descripcion: str(form, "descripcion"),
      precio: precioStr ? parseFloat(precioStr) : null,
      duracionMin: parseInt(str(form, "duracionMin") ?? "60", 10),
    },
  });
  revalidatePath("/admin/tratamientos");
  revalidatePath("/");
}

export async function alternarTratamientoActivo(id: string, activo: boolean) {
  await db.tratamiento.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/tratamientos");
  revalidatePath("/");
}

// ---------- Cobros ----------
export async function crearCobro(form: FormData) {
  const pacienteId = str(form, "pacienteId");
  const montoStr = str(form, "monto");
  if (!pacienteId || !montoStr) return;
  await db.cobro.create({
    data: {
      pacienteId,
      tratamientoId: str(form, "tratamientoId"),
      citaId: str(form, "citaId"),
      monto: parseFloat(montoStr),
      metodo: (str(form, "metodo") as any) ?? "EFECTIVO",
      notas: str(form, "notas"),
    },
  });
  revalidatePath("/admin/cobros");
  revalidatePath("/admin");
}

// ---------- Recordatorios ----------
export async function crearRecordatorio(form: FormData) {
  const fechaEnvio = str(form, "fechaEnvio");
  if (!fechaEnvio) return;
  await db.recordatorio.create({
    data: {
      citaId: str(form, "citaId"),
      titulo: str(form, "titulo") ?? "Recordatorio",
      mensaje: str(form, "mensaje") ?? "",
      fechaEnvio: new Date(fechaEnvio),
    },
  });
  revalidatePath("/admin/recordatorios");
}

export async function actualizarEstadoRecordatorio(id: string, estado: string) {
  await db.recordatorio.update({ where: { id }, data: { estado: estado as any } });
  revalidatePath("/admin/recordatorios");
}

// ---------- Inventario ----------
export async function crearInsumo(form: FormData) {
  await db.insumoInventario.create({
    data: {
      nombre: str(form, "nombre") ?? "Insumo",
      categoria: str(form, "categoria") ?? "General",
      stockActual: parseInt(str(form, "stockActual") ?? "0", 10),
      stockMinimo: parseInt(str(form, "stockMinimo") ?? "5", 10),
      unidad: str(form, "unidad") ?? "pza",
    },
  });
  revalidatePath("/admin/inventario");
}

export async function ajustarStock(id: string, delta: number) {
  const insumo = await db.insumoInventario.findUnique({ where: { id } });
  if (!insumo) return;
  await db.insumoInventario.update({
    where: { id },
    data: { stockActual: Math.max(0, insumo.stockActual + delta) },
  });
  revalidatePath("/admin/inventario");
}

// ---------- Equipo ----------
export async function crearUsuario(form: FormData) {
  const email = str(form, "email");
  const password = str(form, "password");
  if (!email || !password) return;
  await db.usuario.create({
    data: {
      nombre: str(form, "nombre") ?? "Sin nombre",
      email,
      password: await hashPassword(password),
      rol: (str(form, "rol") as any) ?? "RECEPCION",
    },
  });
  revalidatePath("/admin/equipo");
}

export async function alternarUsuarioActivo(id: string, activo: boolean) {
  await db.usuario.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/equipo");
}

// ---------- Contenido landing ----------
export async function actualizarContenidoLanding(form: FormData) {
  const claves = [
    "hero_titulo",
    "hero_subtitulo",
    "hero_cta",
    "direccion",
    "telefono",
    "whatsapp",
    "horario_semana",
    "horario_sabado",
    "instagram",
    "facebook",
    "tiktok",
  ];
  for (const clave of claves) {
    const valor = str(form, clave);
    if (valor === null) continue;
    await db.contenidoLanding.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor },
    });
  }
  revalidatePath("/admin/landing");
  revalidatePath("/");
}
