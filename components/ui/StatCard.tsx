import { cn } from "@/lib/cn";
import { clasesTonoSuave, clasesTonoTexto, type Tono } from "./tonos";

interface StatCardProps {
  titulo: string;
  valor: React.ReactNode;
  icono?: React.ReactNode;
  tono?: Tono;
  detalle?: React.ReactNode;
  destacado?: boolean;
}

export function StatCard({ titulo, valor, icono, tono = "neutro", detalle, destacado = false }: StatCardProps) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl border border-default-200 bg-white p-5 shadow-sm",
        destacado && "border-t-4 border-t-danger",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-xs font-semibold uppercase tracking-wide text-default-600">{titulo}</h3>
        {icono && (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5",
              clasesTonoSuave[tono === "neutro" ? "primario" : tono],
            )}
            aria-hidden
          >
            {icono}
          </span>
        )}
      </div>
      <p className={cn("text-3xl font-bold tracking-tight tabular-nums", clasesTonoTexto[tono])}>{valor}</p>
      {detalle && <div className="text-xs text-default-500">{detalle}</div>}
    </article>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</section>;
}
