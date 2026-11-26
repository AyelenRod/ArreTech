import { cn } from "@/lib/cn";
import { modulosPorPerfil } from "../data/modulosPorPerfil";

export function ModulosPorPerfil() {
  return (
    <section className="rounded-xl border border-default-200 bg-white p-4 shadow-sm">
      <h2 className="text-center text-[11px] font-semibold uppercase tracking-wider text-default-500">
        Módulos habilitados por perfil
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {modulosPorPerfil.map((modulo) => (
          <li key={modulo.perfil} className="flex items-center gap-2 rounded-md bg-default-50 px-2.5 py-1.5 text-[11px]">
            <span className={cn("size-1.5 shrink-0 rounded-full", modulo.claseColor)} aria-hidden />
            <span className="truncate">
              <span className="font-semibold text-default-700">{modulo.perfil}:</span>{" "}
              <span className="text-default-500">{modulo.alcance}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
