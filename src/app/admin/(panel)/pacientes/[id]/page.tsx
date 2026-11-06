import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatoFecha, formatoFechaHora, formatoMoneda } from "@/lib/format";
import { agregarNotaClinica } from "@/lib/actions";
import { CampoTextarea, Campo, BotonPrimario, Tarjeta, EncabezadoPagina, Pildora } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PacienteDetallePage({ params }: { params: { id: string } }) {
  const paciente = await db.paciente.findUnique({
    where: { id: params.id },
    include: {
      citas: { include: { tratamiento: true }, orderBy: { fecha: "desc" } },
      cobros: { orderBy: { fecha: "desc" } },
      expedientes: { orderBy: { creadoEn: "desc" } },
    },
  });

  if (!paciente) notFound();

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo={paciente.nombre} descripcion={`${paciente.telefono} · Paciente desde ${formatoFecha(paciente.creadoEn)}`} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta titulo="Citas">
          <ul className="space-y-3">
            {paciente.citas.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-crema-soft px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-marino-dark">{c.tratamiento?.nombre ?? "Valoración general"}</p>
                  <p className="text-niebla">{formatoFechaHora(c.fecha)}</p>
                </div>
                <Pildora tono={c.estado === "COMPLETADA" ? "verde" : c.estado === "CANCELADA" ? "rojo" : "cielo"}>
                  {c.estado}
                </Pildora>
              </li>
            ))}
            {paciente.citas.length === 0 && <p className="text-sm text-niebla">Sin citas registradas.</p>}
          </ul>
        </Tarjeta>

        <Tarjeta titulo="Cobros">
          <ul className="space-y-3">
            {paciente.cobros.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-crema-soft px-4 py-3 text-sm">
                <span className="text-marino-dark">{formatoFecha(c.fecha)} · {c.metodo}</span>
                <span className="font-medium text-marino-dark">{formatoMoneda(c.monto)}</span>
              </li>
            ))}
            {paciente.cobros.length === 0 && <p className="text-sm text-niebla">Sin cobros registrados.</p>}
          </ul>
        </Tarjeta>
      </div>

      <Tarjeta titulo="Expediente clínico">
        <form action={agregarNotaClinica} className="mb-6 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="pacienteId" value={paciente.id} />
          <Campo label="Título de la nota" name="titulo" required placeholder="Ej. Valoración inicial" />
          <div className="sm:col-span-2">
            <CampoTextarea label="Contenido" name="contenido" required placeholder="Observaciones, diagnóstico, plan..." />
          </div>
          <div className="sm:col-span-2">
            <BotonPrimario>Agregar nota</BotonPrimario>
          </div>
        </form>

        <div className="space-y-4">
          {paciente.expedientes.map((n) => (
            <div key={n.id} className="rounded-xl border border-marino/8 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-marino-dark">{n.titulo}</p>
                <p className="text-xs text-niebla">{formatoFechaHora(n.creadoEn)}</p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-pizarra">{n.contenido}</p>
            </div>
          ))}
          {paciente.expedientes.length === 0 && (
            <p className="text-sm text-niebla">Aún no hay notas clínicas.</p>
          )}
        </div>
      </Tarjeta>

      {paciente.notas && (
        <Tarjeta titulo="Notas generales">
          <p className="text-sm text-pizarra">{paciente.notas}</p>
        </Tarjeta>
      )}
    </div>
  );
}
