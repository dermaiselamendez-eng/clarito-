import { obtenerContenidoLanding } from "@/lib/contenido";
import { actualizarContenidoLanding } from "@/lib/actions";
import { Campo, CampoTextarea, BotonPrimario, Tarjeta, EncabezadoPagina } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function LandingAdminPage() {
  const c = await obtenerContenidoLanding();

  return (
    <div className="space-y-8">
      <EncabezadoPagina
        titulo="Mi página"
        descripcion="Edita el contenido que ven tus pacientes en la landing — se publica al instante"
      />

      <a
        href="/"
        target="_blank"
        className="inline-block rounded-full border border-marino/20 bg-white px-5 py-2.5 text-sm font-medium text-marino-dark hover:border-marino/40"
      >
        Ver mi página en vivo ↗
      </a>

      <form action={actualizarContenidoLanding} className="space-y-8">
        <Tarjeta titulo="Mensaje principal">
          <div className="grid gap-4">
            <Campo label="Título principal" name="hero_titulo" defaultValue={c.hero_titulo} />
            <CampoTextarea label="Subtítulo" name="hero_subtitulo" defaultValue={c.hero_subtitulo} />
            <Campo label="Texto del botón de agenda" name="hero_cta" defaultValue={c.hero_cta} />
          </div>
        </Tarjeta>

        <Tarjeta titulo="Contacto y ubicación">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Campo label="Dirección" name="direccion" defaultValue={c.direccion} />
            </div>
            <Campo label="Teléfono" name="telefono" defaultValue={c.telefono} />
            <Campo label="WhatsApp (solo números, con código de país)" name="whatsapp" defaultValue={c.whatsapp} />
            <Campo label="Horario entre semana" name="horario_semana" defaultValue={c.horario_semana} />
            <Campo label="Horario sábado" name="horario_sabado" defaultValue={c.horario_sabado} />
          </div>
        </Tarjeta>

        <Tarjeta titulo="Redes sociales">
          <div className="grid gap-4 sm:grid-cols-3">
            <Campo label="Instagram" name="instagram" defaultValue={c.instagram} />
            <Campo label="Facebook" name="facebook" defaultValue={c.facebook} />
            <Campo label="TikTok" name="tiktok" defaultValue={c.tiktok} />
          </div>
        </Tarjeta>

        <BotonPrimario>Guardar cambios</BotonPrimario>
      </form>
    </div>
  );
}
