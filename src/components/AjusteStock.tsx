"use client";

import { useTransition } from "react";
import { ajustarStock } from "@/lib/actions";

export default function AjusteStock({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(() => ajustarStock(id, -1))}
        className="h-7 w-7 rounded-full bg-crema-soft text-marino-dark hover:bg-cielo/40"
      >
        −
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => ajustarStock(id, 1))}
        className="h-7 w-7 rounded-full bg-crema-soft text-marino-dark hover:bg-cielo/40"
      >
        +
      </button>
    </div>
  );
}
