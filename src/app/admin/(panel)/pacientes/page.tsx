import Link from "next/link";
import { db } from "@/lib/db";
import { formatoFecha } from "@/lib/format";
import { crearPaciente } from "@/lib/actions";
import { Campo, CampoTextarea, BotonPrimario, Tarjeta, EncabezadoPagina, Pildora } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PacientesPage() {
  const pacientes = await db.paciente.findMany({
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { citas: true, cobros: true } } },
  });

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Pacientes" descripcion={`${pacientes.length} pacientes registrados`} />

      <Tarjeta titulo="Registrar nuevo paciente">
        <form action={crearPaciente} className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre completo" name="nombre" required />
          <Campo label="Teléfono" name="telefono" required />
          <Campo label="Correo" name="email" type="email" />
          <Campo label="Género" name="genero" placeholder="Opcional" />
          <div className="sm:col-span-2">
            <CampoTextarea label="Notas" name="notas" placeholder="Contexto general del paciente" />
          </div>
          <div className="sm:col-span-2">
            <BotonPrimario>Guardar paciente</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Listado">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-marino/8 text-xs uppercase tracking-wider text-niebla">
                <th className="py-3 pr-4">Nombre</th>
                <th className="py-3 pr-4">Teléfono</th>
                <th className="py-3 pr-4">Origen</th>
                <th className="py-3 pr-4">Citas</th>
                <th className="py-3 pr-4">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id} className="border-b border-marino/5">
                  <td className="py-3 pr-4 font-medium text-marino-dark">
                    <Link href={`/admin/pacientes/${p.id}`} className="hover:underline">
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-pizarra">{p.telefono}</td>
                  <td className="py-3 pr-4">
                    <Pildora tono={p.origen === "Landing" ? "cielo" : "niebla"}>{p.origen}</Pildora>
                  </td>
                  <td className="py-3 pr-4 text-pizarra">{p._count.citas}</td>
                  <td className="py-3 pr-4 text-niebla">{formatoFecha(p.creadoEn)}</td>
                </tr>
              ))}
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-niebla">
                    Aún no hay pacientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </div>
  );
}
