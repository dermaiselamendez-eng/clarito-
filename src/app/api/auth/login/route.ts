import { NextRequest, NextResponse } from "next/server";
import { crearSesion, validarCredenciales } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

  const usuario = await validarCredenciales(email ?? "", password ?? "");
  if (!usuario) {
    return NextResponse.json(
      { ok: false, error: "Correo o contraseña incorrectos." },
      { status: 401 }
    );
  }

  await crearSesion({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol as "ADMIN" | "DOCTOR" | "RECEPCION",
  });

  return NextResponse.json({ ok: true });
}
