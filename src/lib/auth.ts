import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE_NAME = "iselamendez_sesion";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-no-usar-en-produccion"
);

export type SesionUsuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "ADMIN" | "DOCTOR" | "RECEPCION";
};

export async function crearSesion(usuario: SesionUsuario) {
  const token = await new SignJWT({ ...usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function cerrarSesion() {
  cookies().delete(COOKIE_NAME);
}

export async function obtenerSesion(): Promise<SesionUsuario | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SesionUsuario;
  } catch {
    return null;
  }
}

export async function validarCredenciales(email: string, password: string) {
  const usuario = await db.usuario.findUnique({ where: { email } });
  if (!usuario || !usuario.activo) return null;
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return null;
  return usuario;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
