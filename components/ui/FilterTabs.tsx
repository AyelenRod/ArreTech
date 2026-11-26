"use client";

import { cn } from "@/lib/cn";

export interface OpcionFiltro<T extends string> {
  valor: T;
  etiqueta: string;
  conteo?: number;
}

const clasesVariante = {
  pastilla: {
    lista: "gap-1 rounded-xl border border-default-200 bg-white p-1",
    base: "rounded-lg px-3 py-1.5",
    activa: "bg-primary-50 font-semibold text-primary-700",
    inactiva: "text-default-600 hover:bg-default-100",
  },
  subrayado: {
    lista: "gap-x-4",
    base: "border-b-2 pb-2",
    activa: "border-primary font-semibold text-primary",
    inactiva: "border-transparent text-default-600 hover:text-default-900",
  },
};

interface FilterTabsProps<T extends string> {
  opciones: OpcionFiltro<T>[];
  valor: T;
  onChange: (valor: T) => void;
  etiquetaAccesible?: string;
  variante?: keyof typeof clasesVariante;
}

export function FilterTabs<T extends string>({
  opciones,
  valor,
  onChange,
  etiquetaAccesible = "Filtrar por estado",
  variante = "pastilla",
}: FilterTabsProps<T>) {
  const clases = clasesVariante[variante];

  return (
    <div
      role="tablist"
      aria-label={etiquetaAccesible}
      className={cn("flex flex-wrap", clases.lista)}
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
              "flex items-center gap-2 whitespace-nowrap text-sm transition-colors",
              clases.base,
              activa ? clases.activa : clases.inactiva,
            )}
          >
            {opcion.etiqueta}
            {opcion.conteo !== undefined && variante === "subrayado" && <span className="-ml-1">({opcion.conteo})</span>}
            {opcion.conteo !== undefined && variante === "pastilla" && (
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
