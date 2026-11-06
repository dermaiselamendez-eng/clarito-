"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [estado, setEstado] = useState<"idle" | "enviando" | "error">("idle");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();

    if (!res.ok || !data.ok) {
      setError(data.error ?? "No pudimos iniciar sesión.");
      setEstado("error");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-marino-dark px-6">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-10 shadow-soft">
        <p className="text-center font-display text-lg tracking-wide text-marino-dark">
          ISELA MÉNDEZ
        </p>
        <h1 className="mt-1 text-center text-sm text-niebla">Panel de administrador</h1>

        <form onSubmit={enviar} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-marino-dark">Correo</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-marino/15 bg-crema-soft px-4 py-3 outline-none focus:border-marino focus:ring-2 focus:ring-cielo"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-marino-dark">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-marino/15 bg-crema-soft px-4 py-3 outline-none focus:border-marino focus:ring-2 focus:ring-cielo"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={estado === "enviando"}
            className="w-full rounded-full bg-marino px-6 py-3.5 text-sm font-medium text-white shadow-soft transition hover:bg-marino-dark disabled:opacity-60"
          >
            {estado === "enviando" ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-xs text-niebla hover:text-marino-dark">
          ← Volver al sitio
        </a>
      </div>
    </div>
  );
}
