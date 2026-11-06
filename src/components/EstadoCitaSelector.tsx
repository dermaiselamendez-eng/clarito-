"use client";

import { useTransition } from "react";
import { actualizarEstadoCita } from "@/lib/actions";

const ESTADOS = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];

export default function EstadoCitaSelector({ citaId, estado }: { citaId: string; estado: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={estado}
      disabled={pending}
      onChange={(e) => startTransition(() => actualizarEstadoCita(citaId, e.target.value))}
      className="rounded-full border border-marino/15 bg-crema-soft px-3 py-1 text-xs font-medium text-marino-dark outline-none"
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}
