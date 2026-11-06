"use client";

export default function BotonCerrarSesion() {
  async function salir() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button onClick={salir} className="mt-3 text-xs font-medium text-marino hover:text-marino-dark">
      Cerrar sesión
    </button>
  );
}
