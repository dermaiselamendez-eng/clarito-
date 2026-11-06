import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pagina = typeof body.pagina === "string" ? body.pagina : "/";

  const yaVisito = req.cookies.get("im_visita")?.value;
  const res = NextResponse.json({ ok: true });

  if (!yaVisito) {
    const visita = await db.visitaLanding.create({ data: { pagina } });
    res.cookies.set("im_visita", visita.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return res;
}
