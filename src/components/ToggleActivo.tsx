"use client";

import { useTransition } from "react";

export default function ToggleActivo({
  activo,
  accion,
}: {
  activo: boolean;
  accion: (activo: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => accion(!activo))}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </button>
  );
}
