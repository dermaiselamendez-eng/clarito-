import { db } from "@/lib/db";
import { crearUsuario, alternarUsuarioActivo } from "@/lib/actions";
import { Campo, CampoSelect, BotonPrimario, Tarjeta, EncabezadoPagina } from "@/components/ui";
import ToggleActivo from "@/components/ToggleActivo";

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const usuarios = await db.usuario.findMany({ orderBy: { creadoEn: "asc" } });

  return (
    <div className="space-y-8">
      <EncabezadoPagina titulo="Equipo" descripcion="Cuentas con acceso al panel de administrador" />

      <Tarjeta titulo="Agregar colaborador">
        <form action={crearUsuario} className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre completo" name="nombre" required />
          <Campo label="Correo" name="email" type="email" required />
          <Campo label="Contraseña temporal" name="password" type="password" required />
          <CampoSelect
            label="Rol"
            name="rol"
            opciones={[
              { value: "DOCTOR", label: "Doctor(a)" },
              { value: "RECEPCION", label: "Recepción" },
              { value: "ADMIN", label: "Administrador" },
            ]}
          />
          <div className="sm:col-span-2">
            <BotonPrimario>Crear cuenta</BotonPrimario>
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Cuentas activas">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-marino/8 text-xs uppercase tracking-wider text-niebla">
                <th className="py-3 pr-4">Nombre</th>
                <th className="py-3 pr-4">Correo</th>
                <th className="py-3 pr-4">Rol</th>
                <th className="py-3 pr-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-marino/5">
                  <td className="py-3 pr-4 font-medium text-marino-dark">{u.nombre}</td>
                  <td className="py-3 pr-4 text-pizarra">{u.email}</td>
                  <td className="py-3 pr-4 text-pizarra">{u.rol}</td>
                  <td className="py-3 pr-4">
                    <ToggleActivo activo={u.activo} accion={alternarUsuarioActivo.bind(null, u.id)} />
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
