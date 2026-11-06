"use client";

import { useTransition } from "react";
import { actualizarEstadoRecordatorio } from "@/lib/actions";

const ESTADOS = ["PENDIENTE", "ENVIADO", "CANCELADO"];

export default function EstadoRecordatorioSelector({ id, estado }: { id: string; estado: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={estado}
      disabled={pending}
      onChange={(e) => startTransition(() => actualizarEstadoRecordatorio(id, e.target.value))}
      className="w-fit rounded-full border border-marino/15 bg-white px-3 py-1 text-xs font-medium text-marino-dark outline-none"
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}
