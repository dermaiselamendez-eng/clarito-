"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { MesSimulado } from "@/lib/simulation";

const COLORES = ["#1c3c5c", "#aed9fa", "#405861", "#ACD4E4", "#879296", "#0a2a43"];

export function GraficaIngresosGastos({ datos }: { datos: MesSimulado[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={datos} margin={{ left: -10, right: 10, top: 10 }}>
        <defs>
          <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c3c5c" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#1c3c5c" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gastos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#879296" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#879296" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e2da" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#879296" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "#879296" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(v: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(v)}
          contentStyle={{ borderRadius: 12, border: "1px solid #e8e2da" }}
        />
        <Area type="monotone" dataKey="ingresos" stroke="#1c3c5c" fill="url(#ingresos)" strokeWidth={2.5} name="Ingresos" />
        <Area type="monotone" dataKey="gastos" stroke="#879296" fill="url(#gastos)" strokeWidth={2} name="Gastos" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GraficaPacientes({ datos }: { datos: MesSimulado[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={datos} margin={{ left: -20, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e2da" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#879296" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#879296" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e2da" }} />
        <Bar dataKey="pacientes" fill="#aed9fa" radius={[6, 6, 0, 0]} name="Pacientes" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficaDistribucion({
  datos,
}: {
  datos: { categoria: string; porcentaje: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={datos}
          dataKey="porcentaje"
          nameKey="categoria"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={2}
        >
          {datos.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          height={60}
          wrapperStyle={{ fontSize: 12, color: "#405861" }}
        />
        <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #e8e2da" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
