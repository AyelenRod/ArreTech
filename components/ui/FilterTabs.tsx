"use client";

import { cn } from "@/lib/cn";

export interface OpcionFiltro<T extends string> {
  valor: T;
  etiqueta: string;
  conteo?: number;
}

interface FilterTabsProps<T extends string> {
  opciones: OpcionFiltro<T>[];
  valor: T;
  onChange: (valor: T) => void;
  etiquetaAccesible?: string;
}

export function FilterTabs<T extends string>({
  opciones,
  valor,
  onChange,
  etiquetaAccesible = "Filtrar por estado",
}: FilterTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={etiquetaAccesible}
      className="flex flex-wrap gap-1 rounded-xl border border-default-200 bg-white p-1"
    >
      {opciones.map((opcion) => {
        const activa = opcion.valor === valor;
        return (
          <button
            key={opcion.valor}
            type="button"
            role="tab"
            aria-selected={activa}
            onClick={() => onChange(opcion.valor)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors",
              activa
                ? "bg-primary-50 font-semibold text-primary-700"
                : "text-default-600 hover:bg-default-100",
            )}
          >
            {opcion.etiqueta}
            {opcion.conteo !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  activa ? "bg-primary text-primary-foreground" : "bg-default-100 text-default-600",
                )}
              >
                {opcion.conteo}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
