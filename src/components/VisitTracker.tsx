"use client";

import { useEffect } from "react";

export default function VisitTracker({ pagina = "/" }: { pagina?: string }) {
  useEffect(() => {
    fetch("/api/visita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagina }),
    }).catch(() => null);
  }, [pagina]);

  return null;
}
