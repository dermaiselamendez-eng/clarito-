import { db } from "@/lib/db";
import { crearInsumo, ajustarStock } from "@/lib/actions";
import { Campo, BotonPrimario, Tarjeta, EncabezadoPagina, Pildora } from "@/components/ui";
import AjusteStock from "@/components/AjusteStock";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
  const insumos = await db.insumoInventario.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Inventario" descripcion="Insumos y material de uso clínico" />

      <Tarjeta titulo="Agregar insumo">
        <form action={crearInsumo} className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre" name="nombre" required />
          <Campo label="Categoría" name="categoria" required />
          <Campo label="Stock actual" name="stockActual" type="number" defaultValue="0" />
          <Campo label="Stock mínimo" name="stockMinimo" type="number" defaultValue="5" />
          <Campo label="Unidad" name="unidad" defaultValue="pza" />
          <div className="sm:col-span-2">
            <BotonPrimario>Guardar insumo</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Existencias">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-marino/8 text-xs uppercase tracking-wider text-niebla">
                <th className="py-3 pr-4">Insumo</th>
                <th className="py-3 pr-4">Categoría</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Estado</th>
                <th className="py-3 pr-4">Ajustar</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((i) => (
                <tr key={i.id} className="border-b border-marino/5">
                  <td className="py-3 pr-4 font-medium text-marino-dark">{i.nombre}</td>
                  <td className="py-3 pr-4 text-pizarra">{i.categoria}</td>
                  <td className="py-3 pr-4 text-pizarra">{i.stockActual} {i.unidad}</td>
                  <td className="py-3 pr-4">
                    {i.stockActual <= i.stockMinimo ? (
                      <Pildora tono="rojo">Stock bajo</Pildora>
                    ) : (
                      <Pildora tono="verde">Suficiente</Pildora>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <AjusteStock id={i.id} />
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
