"use client";

import { Chip } from "@heroui/react";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import type { EstatusCliente, FiltrosClientes as Filtros, TipoCliente } from "../types";
import { etiquetasEstatus, etiquetasTipo } from "../utils";

interface FiltrosClientesProps {
  filtros: Filtros;
  ciudades: string[];
  onChange: (cambios: Partial<Filtros>) => void;
  onLimpiar: () => void;
}

const opcionesTipo = (Object.keys(etiquetasTipo) as TipoCliente[]).map((valor) => ({
  valor,
  etiqueta: etiquetasTipo[valor].tipo,
}));

const opcionesEstatus = (Object.keys(etiquetasEstatus) as EstatusCliente[]).map((valor) => ({
  valor,
  etiqueta: etiquetasEstatus[valor],
}));

export function FiltrosClientes({ filtros, ciudades, onChange, onLimpiar }: FiltrosClientesProps) {
  return (
    <FilterBar
      busqueda={filtros.busqueda}
      onBusquedaChange={(busqueda) => onChange({ busqueda })}
      placeholder="Buscar por nombre, correo, teléfono o RFC"
      onLimpiar={onLimpiar}
    >
      <FilterSelect
        etiqueta="Tipo"
        opciones={opcionesTipo}
        valor={filtros.tipo}
        onChange={(valor) => onChange({ tipo: valor as TipoCliente | "" })}
      />
      <FilterSelect
        etiqueta="Ciudad"
        opciones={ciudades.map((ciudad) => ({ valor: ciudad, etiqueta: ciudad }))}
        valor={filtros.ciudad}
        onChange={(ciudad) => onChange({ ciudad })}
      />
      <FilterSelect
        etiqueta="Estatus"
        opciones={opcionesEstatus}
        valor={filtros.estatus}
        onChange={(valor) => onChange({ estatus: valor as EstatusCliente | "" })}
      />
      {filtros.soloNuevos && (
        <Chip color="primary" variant="flat" onClose={() => onChange({ soloNuevos: false })}>
          Nuevos este mes
        </Chip>
      )}
    </FilterBar>
  );
}
