import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const esquema = z.object({
  nombre: z.string().min(2, "Escribe tu nombre completo"),
  telefono: z.string().min(8, "Escribe un teléfono a 10 dígitos"),
  email: z.string().email().optional().or(z.literal("")),
  tratamientoId: z.string().optional().or(z.literal("")),
  fecha: z.string().min(1, "Elige una fecha"),
  notas: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const datos = await req.json().catch(() => null);
  const parse = esquema.safeParse(datos);

  if (!parse.success) {
    return NextResponse.json(
      { ok: false, error: parse.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { nombre, telefono, email, tratamientoId, fecha, notas } = parse.data;

  let paciente = await db.paciente.findFirst({ where: { telefono } });
  if (!paciente) {
    paciente = await db.paciente.create({
      data: { nombre, telefono, email: email || null, origen: "Landing" },
    });
  }

  const cita = await db.cita.create({
    data: {
      pacienteId: paciente.id,
      tratamientoId: tratamientoId || null,
      fecha: new Date(fecha),
      notas: notas || null,
      origenLanding: true,
    },
  });

  const res = NextResponse.json({ ok: true, citaId: cita.id });

  const visitaId = req.cookies.get("im_visita")?.value;
  if (visitaId) {
    await db.visitaLanding
      .update({ where: { id: visitaId }, data: { convertido: true } })
      .catch(() => null);
  }

  return res;
}
