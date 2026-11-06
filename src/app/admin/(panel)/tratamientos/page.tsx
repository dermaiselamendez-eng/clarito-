import { db } from "@/lib/db";
import { formatoMoneda } from "@/lib/format";
import { crearTratamiento, alternarTratamientoActivo } from "@/lib/actions";
import { Campo, CampoTextarea, BotonPrimario, Tarjeta, EncabezadoPagina } from "@/components/ui";
import ToggleActivo from "@/components/ToggleActivo";

export const dynamic = "force-dynamic";

export default async function TratamientosPage() {
  const tratamientos = await db.tratamiento.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] });

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Tratamientos" descripcion="Tu catálogo de servicios — se muestra también en la landing" />

      <Tarjeta titulo="Agregar tratamiento">
        <form action={crearTratamiento} className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre" name="nombre" required />
          <Campo label="Categoría" name="categoria" required placeholder="Ej. Tratamientos Faciales" />
          <Campo label="Precio (opcional, MXN)" name="precio" type="number" placeholder="Déjalo vacío si manejas 'a consultar'" />
          <Campo label="Duración (minutos)" name="duracionMin" type="number" defaultValue="60" />
          <div className="sm:col-span-2">
            <CampoTextarea label="Descripción" name="descripcion" />
          </div>
          <div className="sm:col-span-2">
            <BotonPrimario>Guardar tratamiento</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Catálogo">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-marino/8 text-xs uppercase tracking-wider text-niebla">
                <th className="py-3 pr-4">Nombre</th>
                <th className="py-3 pr-4">Categoría</th>
                <th className="py-3 pr-4">Precio</th>
                <th className="py-3 pr-4">Visible en landing</th>
              </tr>
            </thead>
            <tbody>
              {tratamientos.map((t) => (
                <tr key={t.id} className="border-b border-marino/5">
                  <td className="py-3 pr-4 font-medium text-marino-dark">{t.nombre}</td>
                  <td className="py-3 pr-4 text-pizarra">{t.categoria}</td>
                  <td className="py-3 pr-4 text-pizarra">{t.precio ? formatoMoneda(t.precio) : "A consultar"}</td>
                  <td className="py-3 pr-4">
                    <ToggleActivo activo={t.activo} accion={alternarTratamientoActivo.bind(null, t.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </div>
  );
}
