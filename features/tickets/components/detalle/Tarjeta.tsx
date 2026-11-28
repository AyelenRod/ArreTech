import { cn } from "@/lib/cn";

interface TarjetaProps {
  titulo: string;
  subtitulo?: string;
  icono?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Tarjeta de sección del detalle de ticket. */
export function Tarjeta({ titulo, subtitulo, icono, extra, children, className }: TarjetaProps) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4 rounded-xl border border-default-200 bg-white p-4 shadow-sm sm:p-5", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 basis-56 items-start gap-3">
          {icono && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 [&_svg]:size-5" aria-hidden>
              {icono}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-default-900">{titulo}</h2>
            {subtitulo && <p className="text-sm text-default-500">{subtitulo}</p>}
          </div>
        </div>
        {extra}
      </header>
      {children}
    </section>
  );
}

/** Encabezado compacto en mayúsculas para las tarjetas del panel lateral. */
export function TarjetaLateral({ titulo, icono, extra, children }: Omit<TarjetaProps, "subtitulo" | "className">) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-default-200 bg-white p-4 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-default-100 pb-3">
        <h2 className="flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-default-600 [&_svg]:size-4 [&_svg]:shrink-0">
          {icono}
          {titulo}
        </h2>
        {extra}
      </header>
      {children}
    </section>
  );
}

export function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-default-500">{etiqueta}</span>
      <div className="text-sm text-default-900">{children}</div>
    </div>
  );
}
