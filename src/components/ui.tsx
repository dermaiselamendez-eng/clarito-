export function Campo({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marino-dark">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-marino/15 bg-crema-soft px-3.5 py-2.5 text-sm text-marino-dark outline-none transition focus:border-marino focus:ring-2 focus:ring-cielo"
      />
    </label>
  );
}

export function CampoTextarea({
  label,
  name,
  placeholder,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marino-dark">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        rows={3}
        className="w-full rounded-xl border border-marino/15 bg-crema-soft px-3.5 py-2.5 text-sm text-marino-dark outline-none transition focus:border-marino focus:ring-2 focus:ring-cielo"
      />
    </label>
  );
}

export function CampoSelect({
  label,
  name,
  opciones,
  required,
}: {
  label: string;
  name: string;
  opciones: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marino-dark">{label}</span>
      <select
        name={name}
        required={required}
        className="w-full rounded-xl border border-marino/15 bg-crema-soft px-3.5 py-2.5 text-sm text-marino-dark outline-none transition focus:border-marino focus:ring-2 focus:ring-cielo"
      >
        {opciones.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function BotonPrimario({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-marino px-6 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-marino-dark"
    >
      {children}
    </button>
  );
}

export function Tarjeta({
  titulo,
  acciones,
  children,
}: {
  titulo: string;
  acciones?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl2 border border-marino/8 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-marino-dark">{titulo}</h2>
        {acciones}
      </div>
      {children}
    </div>
  );
}

export function Pildora({ children, tono = "niebla" }: { children: React.ReactNode; tono?: "marino" | "cielo" | "niebla" | "verde" | "rojo" }) {
  const tonos: Record<string, string> = {
    marino: "bg-marino text-white",
    cielo: "bg-cielo text-marino-dark",
    niebla: "bg-crema-soft text-pizarra",
    verde: "bg-emerald-100 text-emerald-700",
    rojo: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tonos[tono]}`}>
      {children}
    </span>
  );
}

export function EncabezadoPagina({ titulo, descripcion }: { titulo: string; descripcion?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl text-marino-dark">{titulo}</h1>
      {descripcion && <p className="mt-1 text-niebla">{descripcion}</p>}
    </div>
  );
}
