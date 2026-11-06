import { db } from "@/lib/db";
import { formatoFecha, formatoMoneda } from "@/lib/format";
import { crearCobro } from "@/lib/actions";
import { Campo, CampoSelect, CampoTextarea, BotonPrimario, Tarjeta, EncabezadoPagina, Pildora } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function CobrosPage() {
  const [cobros, pacientes, tratamientos] = await Promise.all([
    db.cobro.findMany({ include: { paciente: true, tratamiento: true }, orderBy: { fecha: "desc" }, take: 100 }),
    db.paciente.findMany({ orderBy: { nombre: "asc" } }),
    db.tratamiento.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const totalMes = cobros
    .filter((c) => {
      const hoy = new Date();
      return c.fecha.getMonth() === hoy.getMonth() && c.fecha.getFullYear() === hoy.getFullYear();
    })
    .reduce((acc, c) => acc + c.monto, 0);

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Cobros" descripcion={`Cobrado este mes (real): ${formatoMoneda(totalMes)}`} />

      <Tarjeta titulo="Registrar cobro">
        <form action={crearCobro} className="grid gap-4 sm:grid-cols-2">
          <CampoSelect label="Paciente" name="pacienteId" required opciones={pacientes.map((p: { id: string; nombre: string }) => ({ value: p.id, label: p.nombre }))} />
          <CampoSelect
            label="Tratamiento"
            name="tratamientoId"
            opciones={[{ value: "", label: "No especificado" }, ...tratamientos.map((t: { id: string; nombre: string }) => ({ value: t.id, label: t.nombre }))]}
          />
          <Campo label="Monto (MXN)" name="monto" type="number" required />
          <CampoSelect
            label="Método de pago"
            name="metodo"
            opciones={[
              { value: "EFECTIVO", label: "Efectivo" },
              { value: "TARJETA", label: "Tarjeta" },
              { value: "TRANSFERENCIA", label: "Transferencia" },
            ]}
          />
          <div className="sm:col-span-2">
            <CampoTextarea label="Notas" name="notas" />
          </div>
          <div className="sm:col-span-2">
            <BotonPrimario>Registrar cobro</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Historial">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-marino/8 text-xs uppercase tracking-wider text-niebla">
                <th className="py-3 pr-4">Paciente</th>
                <th className="py-3 pr-4">Tratamiento</th>
                <th className="py-3 pr-4">Método</th>
                <th className="py-3 pr-4">Fecha</th>
                <th className="py-3 pr-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {cobros.map((c) => (
                <tr key={c.id} className="border-b border-marino/5">
                  <td className="py-3 pr-4 font-medium text-marino-dark">{c.paciente.nombre}</td>
                  <td className="py-3 pr-4 text-pizarra">{c.tratamiento?.nombre ?? "—"}</td>
                  <td className="py-3 pr-4"><Pildora>{c.metodo}</Pildora></td>
                  <td className="py-3 pr-4 text-niebla">{formatoFecha(c.fecha)}</td>
                  <td className="py-3 pr-4 text-right font-medium text-marino-dark">{formatoMoneda(c.monto)}</td>
                </tr>
              ))}
              {cobros.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-niebla">Aún no hay cobros registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </div>
  );
}
