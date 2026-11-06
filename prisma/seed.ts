import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Catálogo basado en los servicios reales publicados en iselamendez.mx
// y en las categorías que la clínica indicó directamente (injerto capilar, skin care).
// Los precios no están publicados: se dejan en null ("Consultar") hasta que
// la Dra. Isela los capture en el panel.
const tratamientos = [
  // Faciales
  { nombre: "Rejuvenecimiento Facial", categoria: "Tratamientos Faciales" },
  { nombre: "Armonización Facial Masculina", categoria: "Tratamientos Faciales" },
  { nombre: "Aumento de Labios", categoria: "Tratamientos Faciales" },
  { nombre: "Flacidez Facial", categoria: "Tratamientos Faciales" },
  { nombre: "Hilos de Sustentación Facial", categoria: "Tratamientos Faciales" },
  { nombre: "Lipopapada sin Cirugía", categoria: "Tratamientos Faciales" },
  { nombre: "Microagujas", categoria: "Tratamientos Faciales" },
  { nombre: "Rejuvenecimiento de Manos", categoria: "Tratamientos Faciales" },
  { nombre: "Tratamiento para Cicatrices", categoria: "Tratamientos Faciales" },
  { nombre: "Tratamiento para Manchas", categoria: "Tratamientos Faciales" },
  { nombre: "Tratamiento para Ojeras", categoria: "Tratamientos Faciales" },
  // Corporales
  { nombre: "Modelado Corporal", categoria: "Tratamientos Corporales" },
  { nombre: "Reducción de Tallas", categoria: "Tratamientos Corporales" },
  { nombre: "Tonificación Muscular", categoria: "Tratamientos Corporales" },
  { nombre: "Tratamiento para Celulitis", categoria: "Tratamientos Corporales" },
  { nombre: "Tratamiento para Estrías", categoria: "Tratamientos Corporales" },
  { nombre: "Tratamiento para Flacidez Corporal", categoria: "Tratamientos Corporales" },
  { nombre: "Tratamiento para Varices", categoria: "Tratamientos Corporales" },
  { nombre: "Aumento de Glúteos", categoria: "Tratamientos Corporales" },
  { nombre: "Depilación Láser Corporal", categoria: "Tratamientos Corporales" },
  // Injerto capilar
  { nombre: "Consulta Capilar", categoria: "Injerto Capilar", descripcion: "Evaluación del cuero cabelludo, tricoscopia y plan médico personalizado." },
  { nombre: "Injerto Capilar", categoria: "Injerto Capilar" },
  // Skin care / Farmacia
  { nombre: "Asesoría de Skin Care Personalizada", categoria: "Skin Care" },
  { nombre: "Boutique Isela Méndez (Farmacia)", categoria: "Skin Care" },
  // Dermatología clínica
  { nombre: "Consulta Dermatológica", categoria: "Dermatología Clínica" },
  { nombre: "Consulta de Tatuaje / Retiro de Tatuajes", categoria: "Dermatología Clínica" },
  { nombre: "Valoración Facial", categoria: "Dermatología Clínica" },
  { nombre: "Valoración Corporal", categoria: "Dermatología Clínica" },
  { nombre: "Fototerapia", categoria: "Dermatología Clínica" },
  // Zona íntima
  { nombre: "Rejuvenecimiento Vaginal", categoria: "Zona Íntima" },
  { nombre: "Aclaramiento Genital", categoria: "Zona Íntima" },
  { nombre: "Depilación Láser Zona Íntima", categoria: "Zona Íntima" },
  { nombre: "Tratamiento para Incontinencia Urinaria", categoria: "Zona Íntima" },
];

const contenidoLanding: Record<string, string> = {
  hero_titulo: "Tu piel en manos de expertos",
  hero_subtitulo:
    "Dermatología clínica y estética con la Dra. Isela Méndez Baca en Polanco, CDMX.",
  hero_cta: "Agenda tu cita",
  direccion: "Polanco #118, Col. Polanco, Del. Miguel Hidalgo, C.P. 11560, CDMX",
  telefono: "(55) 5018-0191",
  whatsapp: "525560409788",
  horario_semana: "Lunes a Viernes: 09:00 - 20:00 hrs",
  horario_sabado: "Sábado: 08:00 - 16:00 hrs",
  instagram: "https://instagram.com/clinicaiselamendez",
  facebook: "https://facebook.com/clinicaIselaMendez",
  tiktok: "https://tiktok.com/@clinicaiselamendez",
};

async function main() {
  console.log("Creando usuario administrador...");
  const passwordTemporal = "IselaMendez2026!";
  const passwordHash = await bcrypt.hash(passwordTemporal, 10);

  await db.usuario.upsert({
    where: { email: "admin@iselamendez.mx" },
    update: {},
    create: {
      nombre: "Dra. Isela Méndez Baca",
      email: "admin@iselamendez.mx",
      password: passwordHash,
      rol: "ADMIN",
    },
  });

  console.log("Creando catálogo de tratamientos...");
  for (const t of tratamientos) {
    const existe = await db.tratamiento.findFirst({ where: { nombre: t.nombre } });
    if (!existe) {
      await db.tratamiento.create({
        data: {
          nombre: t.nombre,
          categoria: t.categoria,
          descripcion: "descripcion" in t ? (t as any).descripcion : null,
          precio: null,
        },
      });
    }
  }

  console.log("Guardando contenido inicial de la landing...");
  for (const [clave, valor] of Object.entries(contenidoLanding)) {
    await db.contenidoLanding.upsert({
      where: { clave },
      update: {},
      create: { clave, valor },
    });
  }

  console.log("Creando insumos base de inventario...");
  const insumos = [
    { nombre: "Ácido Hialurónico", categoria: "Faciales", stockActual: 20, stockMinimo: 5 },
    { nombre: "Toxina Botulínica", categoria: "Faciales", stockActual: 15, stockMinimo: 5 },
    { nombre: "Agujas Microagujas", categoria: "Faciales", stockActual: 50, stockMinimo: 10, unidad: "caja" },
    { nombre: "Guantes de Nitrilo", categoria: "Insumos Generales", stockActual: 30, stockMinimo: 10, unidad: "caja" },
  ];
  for (const i of insumos) {
    const existe = await db.insumoInventario.findFirst({ where: { nombre: i.nombre } });
    if (!existe) await db.insumoInventario.create({ data: i });
  }

  console.log("\n✅ Listo.");
  console.log("Entra al panel admin con:");
  console.log("  Email: admin@iselamendez.mx");
  console.log(`  Contraseña temporal: ${passwordTemporal}`);
  console.log("  (cámbiala desde Equipo > tu usuario en cuanto entres)\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
