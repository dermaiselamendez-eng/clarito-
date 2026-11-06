import { db } from "@/lib/db";
import { formatoFechaHora } from "@/lib/format";
import { crearRecordatorio, actualizarEstadoRecordatorio } from "@/lib/actions";
import { Campo, CampoSelect, CampoTextarea, BotonPrimario, Tarjeta, EncabezadoPagina, Pildora } from "@/components/ui";
import EstadoRecordatorioSelector from "@/components/EstadoRecordatorioSelector";

export const dynamic = "force-dynamic";

export default async function RecordatoriosPage() {
  const [recordatorios, citas] = await Promise.all([
    db.recordatorio.findMany({ include: { cita: { include: { paciente: true } } }, orderBy: { fechaEnvio: "asc" } }),
    db.cita.findMany({
      where: { estado: { in: ["PENDIENTE", "CONFIRMADA"] } },
      include: { paciente: true },
      orderBy: { fecha: "asc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Recordatorios" descripcion="No dejes que tus pacientes olviden su cita" />

      <Tarjeta titulo="Programar recordatorio">
        <form action={crearRecordatorio} className="grid gap-4 sm:grid-cols-2">
          <CampoSelect
            label="Cita relacionada (opcional)"
            name="citaId"
            opciones={[
              { value: "", label: "Ninguna / general" },
              ...citas.map((c: { id: string; fecha: Date; paciente: { nombre: string } }) => ({
                value: c.id,
                label: `${c.paciente.nombre} · ${formatoFechaHora(c.fecha)}`,
              })),
            ]}
          />
          <Campo label="Fecha y hora de envío" name="fechaEnvio" type="datetime-local" required />
          <Campo label="Título" name="titulo" required placeholder="Ej. Confirmar cita de mañana" />
          <div className="sm:col-span-2">
            <CampoTextarea label="Mensaje" name="mensaje" required placeholder="Texto que le enviarás al paciente" />
          </div>
          <div className="sm:col-span-2">
            <BotonPrimario>Programar</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Todos los recordatorios">
        <div className="space-y-3">
          {recordatorios.map((r) => (
            <div key={r.id} className="flex flex-col gap-2 rounded-xl bg-crema-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-marino-dark">{r.titulo}</p>
                <p className="text-sm text-pizarra">{r.mensaje}</p>
                <p className="mt-1 text-xs text-niebla">
                  {formatoFechaHora(r.fechaEnvio)} {r.cita && `· ${r.cita.paciente.nombre}`}
                </p>
              </div>
              <EstadoRecordatorioSelector id={r.id} estado={r.estado} />
            </div>
          ))}
          {recordatorios.length === 0 && <p className="text-sm text-niebla">Sin recordatorios programados.</p>}
        </div>
      </Tarjeta>
    </div>
  );
}
