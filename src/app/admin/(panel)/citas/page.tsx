import { db } from "@/lib/db";
import { formatoFechaHora } from "@/lib/format";
import { crearCita } from "@/lib/actions";
import { Campo, CampoSelect, CampoTextarea, BotonPrimario, Tarjeta, EncabezadoPagina, Pildora } from "@/components/ui";
import EstadoCitaSelector from "@/components/EstadoCitaSelector";

export const dynamic = "force-dynamic";

export default async function CitasPage() {
  const [citas, pacientes, tratamientos] = await Promise.all([
    db.cita.findMany({
      include: { paciente: true, tratamiento: true },
      orderBy: { fecha: "desc" },
      take: 100,
    }),
    db.paciente.findMany({ orderBy: { nombre: "asc" } }),
    db.tratamiento.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Citas" descripcion="Agenda y da seguimiento a cada visita" />

      <Tarjeta titulo="Agendar nueva cita">
        <form action={crearCita} className="grid gap-4 sm:grid-cols-2">
          <CampoSelect
            label="Paciente"
            name="pacienteId"
            required
            opciones={pacientes.map((p: { id: string; nombre: string }) => ({ value: p.id, label: p.nombre }))}
          />
          <CampoSelect
            label="Tratamiento"
            name="tratamientoId"
            opciones={[{ value: "", label: "Valoración general" }, ...tratamientos.map((t: { id: string; nombre: string }) => ({ value: t.id, label: t.nombre }))]}
          />
          <Campo label="Fecha y hora" name="fecha" type="datetime-local" required />
          <div className="sm:col-span-2">
            <CampoTextarea label="Notas" name="notas" />
          </div>
          <div className="sm:col-span-2">
            <BotonPrimario>Agendar</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Próximas y recientes">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-marino/8 text-xs uppercase tracking-wider text-niebla">
                <th className="py-3 pr-4">Paciente</th>
                <th className="py-3 pr-4">Tratamiento</th>
                <th className="py-3 pr-4">Fecha</th>
                <th className="py-3 pr-4">Origen</th>
                <th className="py-3 pr-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id} className="border-b border-marino/5">
                  <td className="py-3 pr-4 font-medium text-marino-dark">{c.paciente.nombre}</td>
                  <td className="py-3 pr-4 text-pizarra">{c.tratamiento?.nombre ?? "Valoración general"}</td>
                  <td className="py-3 pr-4 text-pizarra">{formatoFechaHora(c.fecha)}</td>
                  <td className="py-3 pr-4">
                    <Pildora tono={c.origenLanding ? "cielo" : "niebla"}>
                      {c.origenLanding ? "Landing" : "Manual"}
                    </Pildora>
                  </td>
                  <td className="py-3 pr-4">
                    <EstadoCitaSelector citaId={c.id} estado={c.estado} />
                  </td>
                </tr>
              ))}
              {citas.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-niebla">
                    Aún no hay citas.
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
