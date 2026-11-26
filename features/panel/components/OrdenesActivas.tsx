"use client";

import { useState } from "react";
import { DataTable, TableCard } from "@/components/ui/DataTable";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { paginar, TablePagination } from "@/components/ui/TablePagination";
import { coincideBusqueda, filtrarPorEstado, filtrosEstado, opcionesPrioridad, type FiltroEstado } from "../ordenes";
import type { OrdenServicio } from "../types";
import { columnasOrdenes } from "./columnasOrdenes";

const TAMANO_PAGINA = 5;

export function OrdenesActivas({ ordenes }: { ordenes: OrdenServicio[] }) {
  const [filtro, setFiltro] = useState<FiltroEstado>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [pagina, setPagina] = useState(1);

  const pestanas = filtrosEstado.map(({ valor, etiqueta }) => ({
    valor,
    etiqueta,
    conteo: filtrarPorEstado(ordenes, valor).length,
  }));

  const visibles = filtrarPorEstado(ordenes, filtro).filter(
    (orden) => coincideBusqueda(orden, busqueda) && (!prioridad || orden.prioridad === prioridad),
  );

  const reiniciarPagina =
    <T,>(actualizar: (valor: T) => void) =>
    (valor: T) => {
      actualizar(valor);
      setPagina(1);
    };

  return (
    <TableCard
      titulo="Órdenes de Servicio Activas"
      encabezado={
        <div className="-mb-4 sm:-mb-5">
          <FilterTabs
            variante="subrayado"
            opciones={pestanas}
            valor={filtro}
            onChange={reiniciarPagina(setFiltro)}
          />
        </div>
      }
      pie={
        <TablePagination
          pagina={pagina}
          tamanoPagina={TAMANO_PAGINA}
          totalRegistros={visibles.length}
          onChange={setPagina}
          sustantivo="órdenes activas"
        />
      }
    >
      <div className="border-b border-default-200 p-3">
        <FilterBar
          busqueda={busqueda}
          onBusquedaChange={reiniciarPagina(setBusqueda)}
          placeholder="Buscar por folio, cliente o modelo…"
        >
          <FilterSelect
            etiqueta="Prioridad"
            etiquetaTodos="Todas"
            opciones={opcionesPrioridad}
            valor={prioridad}
            onChange={reiniciarPagina(setPrioridad)}
          />
        </FilterBar>
      </div>
      <DataTable
        etiquetaAccesible="Órdenes de servicio activas"
        columnas={columnasOrdenes}
        filas={paginar(visibles, pagina, TAMANO_PAGINA)}
        obtenerClave={(orden) => orden.folio}
      />
    </TableCard>
  );
}
