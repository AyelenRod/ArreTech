"use client";

import { FilterBar, FilterSelect, type OpcionSelect } from "@/components/ui/FilterBar";
import type { FiltrosMovimientos as Filtros, MotivoMovimiento } from "../types";
import { etiquetasMotivo } from "../utils";

interface FiltrosMovimientosProps {
  filtros: Filtros;
  responsables: OpcionSelect[];
  onChange: (cambios: Partial<Filtros>) => void;
  onLimpiar: () => void;
}

const opcionesMotivo = (Object.keys(etiquetasMotivo) as MotivoMovimiento[]).map((valor) => ({
  valor,
  etiqueta: etiquetasMotivo[valor],
}));

export function FiltrosMovimientos({ filtros, responsables, onChange, onLimpiar }: FiltrosMovimientosProps) {
  return (
    <FilterBar
      busqueda={filtros.busqueda}
      onBusquedaChange={(busqueda) => onChange({ busqueda })}
      placeholder="Buscar por folio, SKU, producto, referencia o responsable"
      onLimpiar={onLimpiar}
    >
      <FilterSelect
        etiqueta="Motivo"
        opciones={opcionesMotivo}
        valor={filtros.motivo}
        onChange={(valor) => onChange({ motivo: valor as MotivoMovimiento | "" })}
      />
      <FilterSelect
        etiqueta="Responsable"
        opciones={responsables}
        valor={filtros.responsable}
        onChange={(responsable) => onChange({ responsable })}
      />
    </FilterBar>
  );
}
