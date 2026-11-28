"use client";

import { FilterBar, FilterSelect, type OpcionSelect } from "@/components/ui/FilterBar";
import type { FiltrosTickets as Filtros, PrioridadTicket, TipoEquipo } from "../types";
import { TIPOS_EQUIPO, etiquetasPrioridad } from "../utils";

interface FiltrosTicketsProps {
  filtros: Filtros;
  tecnicos: OpcionSelect[];
  onChange: (cambios: Partial<Filtros>) => void;
  onLimpiar: () => void;
}

const opcionesPrioridad = (Object.keys(etiquetasPrioridad) as PrioridadTicket[]).map((valor) => ({
  valor,
  etiqueta: etiquetasPrioridad[valor],
}));

const opcionesEquipo = TIPOS_EQUIPO.map((valor) => ({ valor, etiqueta: valor }));

export function FiltrosTickets({ filtros, tecnicos, onChange, onLimpiar }: FiltrosTicketsProps) {
  return (
    <FilterBar
      busqueda={filtros.busqueda}
      onBusquedaChange={(busqueda) => onChange({ busqueda })}
      placeholder="Buscar por folio (TCK-…), cliente, equipo o número de serie"
      onLimpiar={onLimpiar}
    >
      <FilterSelect
        etiqueta="Técnico"
        opciones={tecnicos}
        valor={filtros.tecnico}
        onChange={(tecnico) => onChange({ tecnico })}
      />
      <FilterSelect
        etiqueta="Prioridad"
        opciones={opcionesPrioridad}
        valor={filtros.prioridad}
        onChange={(valor) => onChange({ prioridad: valor as PrioridadTicket | "" })}
      />
      <FilterSelect
        etiqueta="Equipo"
        opciones={opcionesEquipo}
        valor={filtros.tipoEquipo}
        onChange={(valor) => onChange({ tipoEquipo: valor as TipoEquipo | "" })}
      />
    </FilterBar>
  );
}
