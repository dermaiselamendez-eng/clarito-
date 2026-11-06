import Link from "next/link";
import { obtenerSesion } from "@/lib/auth";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";

const NAV = [
  { href: "/admin", label: "Panel principal", icon: "📊" },
  { href: "/admin/pacientes", label: "Pacientes", icon: "🩺" },
  { href: "/admin/citas", label: "Citas", icon: "📅" },
  { href: "/admin/tratamientos", label: "Tratamientos", icon: "✨" },
  { href: "/admin/cobros", label: "Cobros", icon: "💳" },
  { href: "/admin/recordatorios", label: "Recordatorios", icon: "🔔" },
  { href: "/admin/inventario", label: "Inventario", icon: "📦" },
  { href: "/admin/landing", label: "Mi página", icon: "🖥️" },
  { href: "/admin/equipo", label: "Equipo", icon: "👥" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sesion = await obtenerSesion();

  return (
    <div className="min-h-screen bg-crema-soft">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-marino/8 bg-white px-5 py-7 lg:flex">
          <div className="px-2">
            <p className="font-display text-lg tracking-wide text-marino-dark">ISELA MÉNDEZ</p>
            <p className="text-xs text-niebla">Panel de administrador</p>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-pizarra transition hover:bg-crema-soft hover:text-marino-dark"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 rounded-xl bg-crema-soft p-4">
            <p className="text-sm font-medium text-marino-dark">{sesion?.nombre}</p>
            <p className="text-xs text-niebla">{sesion?.rol}</p>
            <BotonCerrarSesion />
          </div>
        </aside>

        <main className="min-h-screen flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
