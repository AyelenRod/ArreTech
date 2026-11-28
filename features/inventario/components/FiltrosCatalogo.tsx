"use client";

import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import type { FiltrosCatalogo as Filtros, NivelStock } from "../types";
import { etiquetasNivel } from "../utils";

interface FiltrosCatalogoProps {
  filtros: Filtros;
  subcategorias: string[];
  marcas: string[];
  onChange: (cambios: Partial<Filtros>) => void;
  onLimpiar: () => void;
}

const opcionesNivel = (Object.keys(etiquetasNivel) as NivelStock[]).map((valor) => ({
  valor,
  etiqueta: etiquetasNivel[valor].replace("Stock ", ""),
}));

function aOpciones(valores: string[]) {
  return valores.map((valor) => ({ valor, etiqueta: valor }));
}

export function FiltrosCatalogo({ filtros, subcategorias, marcas, onChange, onLimpiar }: FiltrosCatalogoProps) {
  return (
    <FilterBar
      busqueda={filtros.busqueda}
      onBusquedaChange={(busqueda) => onChange({ busqueda })}
      placeholder="Buscar por SKU, nombre, marca o categoría"
      onLimpiar={onLimpiar}
    >
      <FilterSelect
        etiqueta="Categoría"
        opciones={aOpciones(subcategorias)}
        valor={filtros.subcategoria}
        onChange={(subcategoria) => onChange({ subcategoria })}
      />
      <FilterSelect
        etiqueta="Stock"
        opciones={opcionesNivel}
        valor={filtros.nivel}
        onChange={(valor) => onChange({ nivel: valor as NivelStock | "" })}
      />
      <FilterSelect
        etiqueta="Marca"
        opciones={aOpciones(marcas)}
        valor={filtros.marca}
        onChange={(marca) => onChange({ marca })}
      />
    </FilterBar>
  );
}
