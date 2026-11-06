// Motor de SIMULACIÓN financiera.
// Todo lo que sale de aquí es una proyección de ejemplo basada en los promedios
// que la clínica proporcionó (venta promedio mensual, pacientes/mes, gastos/mes).
// No son cifras reales contables: se usan solo para mostrar cómo luce el panel.

const VENTA_MENSUAL_PROMEDIO = 16_000_000;
const PACIENTES_MES_PROMEDIO = 3000;
const GASTOS_MENSUAL_PROMEDIO = 1_925_000;

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

// Generador pseudoaleatorio con semilla fija para que la simulación
// se vea igual cada vez que se carga el panel (reproducible).
function azarConSemilla(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export type MesSimulado = {
  mes: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
  pacientes: number;
};

export function generarSerieMensual(cantidadMeses = 12): MesSimulado[] {
  const azar = azarConSemilla(2026);
  const hoy = new Date();
  const resultado: MesSimulado[] = [];

  for (let i = cantidadMeses - 1; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const variacionIngresos = 0.88 + azar() * 0.26; // ±12%
    const variacionGastos = 0.92 + azar() * 0.16; // ±8%
    const variacionPacientes = 0.9 + azar() * 0.2;

    const ingresos = Math.round(VENTA_MENSUAL_PROMEDIO * variacionIngresos);
    const gastos = Math.round(GASTOS_MENSUAL_PROMEDIO * variacionGastos);

    resultado.push({
      mes: MESES[fecha.getMonth()],
      ingresos,
      gastos,
      utilidad: ingresos - gastos,
      pacientes: Math.round(PACIENTES_MES_PROMEDIO * variacionPacientes),
    });
  }

  return resultado;
}

export type CategoriaIngreso = { categoria: string; porcentaje: number };

// Distribución estimada de a dónde va el ingreso, solo para visualización.
export const distribucionTratamientos: CategoriaIngreso[] = [
  { categoria: "Tratamientos Faciales", porcentaje: 32 },
  { categoria: "Tratamientos Corporales", porcentaje: 26 },
  { categoria: "Injerto Capilar", porcentaje: 18 },
  { categoria: "Skin Care / Farmacia", porcentaje: 14 },
  { categoria: "Dermatología Clínica", porcentaje: 10 },
];

export type CategoriaGasto = { categoria: string; porcentaje: number };

// Distribución estimada de gastos, solo para visualización.
export const distribucionGastos: CategoriaGasto[] = [
  { categoria: "Nómina y especialistas", porcentaje: 46 },
  { categoria: "Insumos y equipo", porcentaje: 24 },
  { categoria: "Renta e instalaciones", porcentaje: 16 },
  { categoria: "Marketing y landing", porcentaje: 8 },
  { categoria: "Administración", porcentaje: 6 },
];

export function resumenDelMes() {
  const serie = generarSerieMensual(1)[0];
  return serie;
}

export const supuestosSimulacion = {
  ventaMensualPromedio: VENTA_MENSUAL_PROMEDIO,
  pacientesMesPromedio: PACIENTES_MES_PROMEDIO,
  gastosMensualPromedio: GASTOS_MENSUAL_PROMEDIO,
};
