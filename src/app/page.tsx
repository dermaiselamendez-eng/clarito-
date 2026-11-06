import { db } from "@/lib/db";
import { obtenerContenidoLanding } from "@/lib/contenido";
import VisitTracker from "@/components/VisitTracker";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [tratamientos, contenido] = await Promise.all([
    db.tratamiento.findMany({ where: { activo: true }, orderBy: { categoria: "asc" } }),
    obtenerContenidoLanding(),
  ]);

  const categorias = Array.from(new Set(tratamientos.map((t) => t.categoria)));

  return (
    <main className="bg-[#fbfaf8]">
      <VisitTracker pagina="/" />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-marino/5 bg-[#fbfaf8]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl tracking-wide text-marino-dark">
            ISELA MÉNDEZ
          </span>
          <nav className="hidden gap-8 text-sm font-medium text-marino-dark md:flex">
            <a href="#tratamientos" className="transition hover:text-cielo-deep">Tratamientos</a>
            <a href="#nosotros" className="transition hover:text-cielo-deep">Nosotros</a>
            <a href="#ubicacion" className="transition hover:text-cielo-deep">Ubicación</a>
          </nav>
          <a
            href="#agenda"
            className="rounded-full bg-marino px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-marino-dark"
          >
            Agendar cita
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-cielo/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-crema blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-cielo/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-marino-dark">
                Dermatología clínica y estética · Polanco, CDMX
              </span>
              <h1 className="mt-6 font-display text-4xl leading-tight text-marino-dark sm:text-5xl lg:text-6xl">
                {contenido.hero_titulo ?? "Tu piel en manos de expertos"}
              </h1>
              <p className="mt-6 max-w-lg text-lg text-pizarra">
                {contenido.hero_subtitulo}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#agenda"
                  className="rounded-full bg-marino px-8 py-4 text-base font-medium text-white shadow-soft transition hover:bg-marino-dark"
                >
                  {contenido.hero_cta ?? "Agenda tu cita"}
                </a>
                <a
                  href={`https://wa.me/${contenido.whatsapp}`}
                  target="_blank"
                  className="rounded-full border border-marino/20 bg-white px-8 py-4 text-base font-medium text-marino-dark transition hover:border-marino/40"
                >
                  Escríbenos por WhatsApp
                </a>
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rounded-xl2 bg-gradient-to-br from-marino to-marino-dark shadow-soft">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center text-white">
                <p className="font-display text-2xl leading-snug">
                  “Tu piel en manos de expertos”
                </p>
                <p className="mt-4 text-sm text-cielo/90">Dra. Isela Méndez Baca</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tratamientos */}
      <section id="tratamientos" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-marino-dark sm:text-4xl">
              Tratamientos pensados para ti
            </h2>
            <p className="mt-4 text-pizarra">
              Facial, corporal, injerto capilar y skin care — con planes personalizados
              para cada etapa de tu piel.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((cat) => {
              const items = tratamientos.filter((t) => t.categoria === cat);
              return (
                <div
                  key={cat}
                  className="rounded-xl2 border border-marino/8 bg-crema-soft p-7 transition hover:shadow-card"
                >
                  <h3 className="font-display text-xl text-marino-dark">{cat}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-pizarra">
                    {items.slice(0, 5).map((t) => (
                      <li key={t.id} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cielo-deep" />
                        {t.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-marino-dark sm:text-4xl">
              Clínica Dermatológica Isela Méndez
            </h2>
            <p className="mt-6 text-pizarra">
              Dirigida por la <strong className="text-marino-dark">Dra. Isela Méndez Baca</strong>,
              nuestra clínica en Polanco acompaña a mujeres y hombres que buscan cuidar su
              piel con criterio médico, resultados naturales y seguimiento cercano.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-display text-3xl text-marino-dark">+1</p>
                <p className="text-sm text-niebla">Especialista certificada al frente</p>
              </div>
              <div>
                <p className="font-display text-3xl text-marino-dark">{categorias.length}</p>
                <p className="text-sm text-niebla">Áreas de tratamiento</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl2 bg-cielo/30 p-10">
            <p className="font-display text-xl text-marino-dark">Horarios de atención</p>
            <div className="mt-4 space-y-2 text-pizarra">
              <p>{contenido.horario_semana}</p>
              <p>{contenido.horario_sabado}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="bg-marino-dark px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-white sm:text-4xl">Agenda tu cita</h2>
            <p className="mt-4 text-cielo">
              Cuéntanos qué buscas y te contactamos para confirmar tu horario.
            </p>
          </div>
          <BookingForm tratamientos={tratamientos} whatsapp={contenido.whatsapp ?? ""} />
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center font-display text-3xl text-marino-dark sm:text-4xl">
            Visítanos en Polanco
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl2 shadow-soft">
              <iframe
                title="Ubicación Clínica Isela Méndez"
                className="h-80 w-full lg:h-full"
                loading="lazy"
                src="https://www.google.com/maps?q=19.4376828,-99.205287&z=16&output=embed"
              />
            </div>
            <div className="flex flex-col justify-center gap-6 rounded-xl2 border border-marino/8 bg-crema-soft p-8">
              <Dato etiqueta="Dirección" valor={contenido.direccion} />
              <Dato etiqueta="Teléfono" valor={contenido.telefono} />
              <Dato etiqueta="Lunes a viernes" valor={contenido.horario_semana?.replace("Lunes a Viernes: ", "")} />
              <Dato etiqueta="Sábado" valor={contenido.horario_sabado?.replace("Sábado: ", "")} />
              <div className="flex gap-4 pt-2">
                {contenido.instagram && <RedSocial href={contenido.instagram} label="Instagram" />}
                {contenido.facebook && <RedSocial href={contenido.facebook} label="Facebook" />}
                {contenido.tiktok && <RedSocial href={contenido.tiktok} label="TikTok" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-marino/8 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-niebla sm:flex-row">
          <span>© {new Date().getFullYear()} Clínica Dermatológica Isela Méndez</span>
          <a href="/admin/login" className="transition hover:text-marino-dark">
            Acceso administrador
          </a>
        </div>
      </footer>
    </main>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-niebla">{etiqueta}</p>
      <p className="mt-1 text-marino-dark">{valor}</p>
    </div>
  );
}

function RedSocial({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      className="rounded-full border border-marino/15 bg-white px-4 py-2 text-xs font-medium text-marino-dark transition hover:border-marino/40"
    >
      {label}
    </a>
  );
}
