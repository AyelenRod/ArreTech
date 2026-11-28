"use client";

import { ArrowRight, Download, PackageX, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionBanner } from "@/components/ui/ActionBanner";
import { ActionButton } from "@/components/ui/ActionButton";
import { DataTable, TableCard } from "@/components/ui/DataTable";
import { FilterTabs, type OpcionFiltro } from "@/components/ui/FilterTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { TablePagination, paginar } from "@/components/ui/TablePagination";
import { descargarCsv } from "@/lib/csv";
import type { ResultadoMovimiento } from "../services/movimientos.service";
import type { FiltrosMovimientos as Filtros, MovimientoListado, Producto, TabMovimientos } from "../types";
import {
  FILTROS_MOVIMIENTOS_INICIALES,
  TAMANO_PAGINA,
  calcularKpisMovimientos,
  columnasCsvMovimientos,
  contarPorTabMovimientos,
  filtrarMovimientos,
  obtenerCriticosConSalidas,
  obtenerResponsables,
} from "../utils";
import { columnasMovimientos } from "./columnasMovimientos";
import { FiltrosMovimientos } from "./FiltrosMovimientos";
import { KpisMovimientos } from "./KpisMovimientos";
import { NuevoMovimientoDrawer } from "./NuevoMovimientoDrawer";

const etiquetasTab: Record<TabMovimientos, string> = {
  todos: "Todos",
  entradas: "Entradas",
  salidas: "Salidas",
  ajustes: "Ajustes",
  devoluciones: "Devoluciones",
};

interface MovimientosViewProps {
  movimientosIniciales: MovimientoListado[];
  productosIniciales: Producto[];
  responsable: string;
}

function describirCriticos(productos: Producto[]): string {
  const nombres = productos.slice(0, 3).map((producto) => producto.nombre);
  const restantes = productos.length - nombres.length;
  const lista = restantes > 0 ? `${nombres.join(", ")} y ${restantes} más` : nombres.join(", ");
  return `${lista}. Registra una entrada o revisa los mínimos en el catálogo.`;
}

export function MovimientosView({ movimientosIniciales, productosIniciales, responsable }: MovimientosViewProps) {
  const [movimientos, setMovimientos] = useState(movimientosIniciales);
  const [productos, setProductos] = useState(productosIniciales);
  const [tab, setTab] = useState<TabMovimientos>("todos");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_MOVIMIENTOS_INICIALES);
  const [pagina, setPagina] = useState(1);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const kpis = useMemo(() => calcularKpisMovimientos(movimientos), [movimientos]);
  const conteos = useMemo(() => contarPorTabMovimientos(movimientos), [movimientos]);
  const responsables = useMemo(() => obtenerResponsables(movimientos), [movimientos]);
  const criticos = useMemo(() => obtenerCriticosConSalidas(productos, movimientos), [productos, movimientos]);
  const filtrados = useMemo(() => filtrarMovimientos(movimientos, tab, filtros), [movimientos, tab, filtros]);
  const productosOrdenados = useMemo(
    () => [...productos].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [productos],
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const paginaVisible = Math.min(pagina, totalPaginas);

  const opcionesTab: OpcionFiltro<TabMovimientos>[] = (Object.keys(etiquetasTab) as TabMovimientos[]).map(
    (valor) => ({ valor, etiqueta: etiquetasTab[valor], conteo: conteos[valor] }),
  );

  const cambiarTab = (valor: TabMovimientos) => {
    setTab(valor);
    setPagina(1);
  };

  const cambiarFiltros = (cambios: Partial<Filtros>) => {
    setFiltros((actuales) => ({ ...actuales, ...cambios }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_MOVIMIENTOS_INICIALES);
    setTab("todos");
    setPagina(1);
  };

  const exportar = () => {
    descargarCsv("movimientos-inventario", columnasCsvMovimientos, filtrados);
  };

  const agregarMovimiento = ({ movimiento, producto }: ResultadoMovimiento) => {
    setMovimientos((actuales) => [movimiento, ...actuales]);
    setProductos((actuales) => actuales.map((p) => (p.id === producto.id ? producto : p)));
    setPagina(1);
  };

  return (
    <>
      <PageHeader
        titulo="Movimientos de Inventario"
        descripcion="Entradas y salidas de inventario: compras, ventas, refacciones para tickets, ajustes y devoluciones."
        migas={[{ etiqueta: "Operación" }, { etiqueta: "Movimientos de inventario" }]}
        acciones={
          <>
            <ActionButton
              variante="secundario"
              icono={<Download />}
              onPress={exportar}
              isDisabled={filtrados.length === 0}
            >
              Exportar listado
            </ActionButton>
            <ActionButton icono={<Plus />} onPress={() => setFormularioAbierto(true)}>
              Nuevo Movimiento
            </ActionButton>
          </>
        }
      />

      <KpisMovimientos kpis={kpis} />

      <FilterTabs
        opciones={opcionesTab}
        valor={tab}
        onChange={cambiarTab}
        etiquetaAccesible="Filtrar movimientos"
      />

      <FiltrosMovimientos
        filtros={filtros}
        responsables={responsables}
        onChange={cambiarFiltros}
        onLimpiar={limpiarFiltros}
      />

      <TableCard
        pie={
          <TablePagination
            pagina={paginaVisible}
            tamanoPagina={TAMANO_PAGINA}
            totalRegistros={filtrados.length}
            onChange={setPagina}
            sustantivo="movimientos"
          />
        }
      >
        <DataTable
          columnas={columnasMovimientos}
          filas={paginar(filtrados, paginaVisible, TAMANO_PAGINA)}
          obtenerClave={(movimiento) => movimiento.uuid}
          etiquetaAccesible="Movimientos de inventario"
          mensajeVacio="No hay movimientos que coincidan con los filtros."
        />
      </TableCard>

      {criticos.length > 0 && (
        <ActionBanner
          tono="peligro"
          icono={<PackageX />}
          titulo={`${criticos.length} ${criticos.length === 1 ? "producto quedó" : "productos quedaron"} en stock crítico tras sus salidas`}
          descripcion={describirCriticos(criticos)}
          acciones={
            <ActionButton variante="secundario" iconoFinal={<ArrowRight />} href="/catalogo">
              Ir al catálogo
            </ActionButton>
          }
        />
      )}

      <NuevoMovimientoDrawer
        abierto={formularioAbierto}
        onCerrar={() => setFormularioAbierto(false)}
        onCreado={agregarMovimiento}
        productos={productosOrdenados}
        responsable={responsable}
      />
    </>
  );
}
