import { db } from "@/lib/db";
import { formatoMoneda, formatoPorcentaje } from "@/lib/format";
import {
  generarSerieMensual,
  distribucionTratamientos,
  distribucionGastos,
} from "@/lib/simulation";
import {
  GraficaIngresosGastos,
  GraficaPacientes,
  GraficaDistribucion,
} from "@/components/DashboardCharts";

export const dynamic = "force-dynamic";

function Badge() {
  return (
    <span className="ml-2 rounded-full bg-cielo/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-marino-dark">
      Simulación
    </span>
  );
}

export default async function DashboardPage() {
  const serie = generarSerieMensual(12);
  const mesActual = serie[serie.length - 1];

  const [totalVisitas, totalConversiones, citasPendientes, totalPacientes] = await Promise.all([
    db.visitaLanding.count(),
    db.visitaLanding.count({ where: { convertido: true } }),
    db.cita.count({ where: { estado: "PENDIENTE" } }),
    db.paciente.count(),
  ]);

  const conversion = totalVisitas > 0 ? totalConversiones / totalVisitas : 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-marino-dark">Hola, Dra. Méndez 👋</h1>
        <p className="mt-1 text-niebla">Así va tu clínica hoy.</p>
      </div>

      {/* KPIs financieros simulados */}
      <section>
        <h2 className="flex items-center text-sm font-semibold uppercase tracking-wider text-niebla">
          Simulación financiera del mes
          <Badge />
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <TarjetaKpi titulo="Entró" valor={formatoMoneda(mesActual.ingresos)} detalle="Ingresos estimados" tono="marino" />
          <TarjetaKpi titulo="Salió" valor={formatoMoneda(mesActual.gastos)} detalle="Gastos estimados" tono="niebla" />
          <TarjetaKpi titulo="Quedó" valor={formatoMoneda(mesActual.utilidad)} detalle="Utilidad estimada" tono="cielo" />
        </div>
      </section>

      {/* Gráficas */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl2 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-marino-dark">Ingresos vs. gastos (12 meses)</h3>
            <Badge />
          </div>
          <GraficaIngresosGastos datos={serie} />
        </div>
        <div className="rounded-xl2 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-marino-dark">De dónde viene el ingreso</h3>
            <Badge />
          </div>
          <GraficaDistribucion datos={distribucionTratamientos} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl2 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-marino-dark">Pacientes atendidos por mes</h3>
            <Badge />
          </div>
          <GraficaPacientes datos={serie} />
        </div>
        <div className="rounded-xl2 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-marino-dark">En qué se va el gasto</h3>
            <Badge />
          </div>
          <GraficaDistribucion datos={distribucionGastos} />
        </div>
      </section>

      {/* Métricas reales de la landing */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-niebla">
          Resultados reales de tu página de agenda
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <TarjetaKpi titulo="Visitas" valor={String(totalVisitas)} detalle="Personas que vieron tu landing" tono="marino" real />
          <TarjetaKpi titulo="Registros" valor={String(totalConversiones)} detalle="Citas agendadas desde la landing" tono="cielo" real />
          <TarjetaKpi titulo="Conversión" valor={formatoPorcentaje(conversion)} detalle="Visitas que terminaron en cita" tono="niebla" real />
        </div>
      </section>

      {/* Resumen operativo real */}
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl2 border border-marino/8 bg-white p-6">
          <p className="text-sm text-niebla">Citas pendientes por confirmar</p>
          <p className="mt-1 font-display text-3xl text-marino-dark">{citasPendientes}</p>
        </div>
        <div className="rounded-xl2 border border-marino/8 bg-white p-6">
          <p className="text-sm text-niebla">Pacientes registrados</p>
          <p className="mt-1 font-display text-3xl text-marino-dark">{totalPacientes}</p>
        </div>
      </section>
    </div>
  );
}

function TarjetaKpi({
  titulo,
  valor,
  detalle,
  tono,
  real,
}: {
  titulo: string;
  valor: string;
  detalle: string;
  tono: "marino" | "cielo" | "niebla";
  real?: boolean;
}) {
  const fondos = {
    marino: "bg-marino text-white",
    cielo: "bg-cielo text-marino-dark",
    niebla: "bg-crema-soft text-marino-dark border border-marino/8",
  };
  return (
    <div className={`rounded-xl2 p-6 shadow-card ${fondos[tono]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-80">{titulo}</p>
        {real && (
          <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Real
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-3xl">{valor}</p>
      <p className="mt-1 text-xs opacity-70">{detalle}</p>
    </div>
  );
}
