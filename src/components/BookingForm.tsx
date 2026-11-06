"use client";

import { useState } from "react";

type Tratamiento = { id: string; nombre: string; categoria: string };

export default function BookingForm({
  tratamientos,
  whatsapp,
}: {
  tratamientos: Tratamiento[];
  whatsapp: string;
}) {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      nombre: String(form.get("nombre") || ""),
      telefono: String(form.get("telefono") || ""),
      email: String(form.get("email") || ""),
      tratamientoId: String(form.get("tratamientoId") || ""),
      fecha: String(form.get("fecha") || ""),
      notas: String(form.get("notas") || ""),
    };

    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Algo salió mal, intenta de nuevo.");
        setEstado("error");
        return;
      }
      setEstado("ok");
    } catch {
      setError("No pudimos conectar. Intenta de nuevo o escríbenos por WhatsApp.");
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-xl2 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cielo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5L9 17.5L20 6.5" stroke="#0a2a43" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-marino-dark">¡Listo, recibimos tu solicitud!</h3>
        <p className="mt-2 text-niebla">
          Nuestro equipo te contactará muy pronto para confirmar tu cita. Si prefieres,
          también puedes escribirnos directo por WhatsApp.
        </p>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-marino px-7 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-marino-dark"
        >
          Escribir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="rounded-xl2 bg-white p-6 shadow-soft sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Nombre completo" name="nombre" required placeholder="Tu nombre" />
        <Campo label="Teléfono" name="telefono" required placeholder="55 1234 5678" type="tel" />
        <Campo label="Correo (opcional)" name="email" placeholder="tu@correo.com" type="email" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-marino-dark">
            Tratamiento de interés
          </label>
          <select
            name="tratamientoId"
            className="w-full rounded-xl border border-marino/15 bg-crema-soft px-4 py-3 text-marino-dark outline-none transition focus:border-marino focus:ring-2 focus:ring-cielo"
          >
            <option value="">Aún no lo sé, quiero una valoración</option>
            {tratamientos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.categoria} · {t.nombre}
              </option>
            ))}
          </select>
        </div>
        <Campo label="Fecha y hora preferida" name="fecha" required type="datetime-local" />
        <Campo label="Algo que debamos saber (opcional)" name="notas" placeholder="Cuéntanos brevemente" />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-7 w-full rounded-full bg-marino px-7 py-4 text-base font-medium text-white shadow-soft transition hover:bg-marino-dark disabled:opacity-60 sm:w-auto"
      >
        {estado === "enviando" ? "Enviando..." : "Agendar mi cita"}
      </button>
      <p className="mt-3 text-xs text-niebla">
        Al agendar, nuestro equipo te confirmará disponibilidad por teléfono o WhatsApp.
      </p>
    </form>
  );
}

function Campo({
  label,
  name,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-marino-dark">{label}</label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        type={type}
        className="w-full rounded-xl border border-marino/15 bg-crema-soft px-4 py-3 text-marino-dark outline-none transition focus:border-marino focus:ring-2 focus:ring-cielo"
      />
    </div>
  );
}
