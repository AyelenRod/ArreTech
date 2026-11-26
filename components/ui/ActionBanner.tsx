import { cn } from "@/lib/cn";
import { clasesTonoSuave, type Tono } from "./tonos";

interface ActionBannerProps {
  titulo: string;
  descripcion?: React.ReactNode;
  icono?: React.ReactNode;
  tono?: Tono;
  acciones?: React.ReactNode;
}

export function ActionBanner({ titulo, descripcion, icono, tono = "primario", acciones }: ActionBannerProps) {
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-xl border border-default-200 bg-white p-4 shadow-sm sm:p-5">
      {icono && (
        <span
          className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5", clasesTonoSuave[tono])}
          aria-hidden
        >
          {icono}
        </span>
      )}
      <div className="min-w-0 flex-1 basis-64">
        <h2 className="text-sm font-semibold text-default-900">{titulo}</h2>
        {descripcion && <p className="mt-0.5 text-sm text-default-500">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </section>
  );
}
