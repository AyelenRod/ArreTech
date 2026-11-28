"use client";

import { ArrowRight, Download, Plus, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionBanner } from "@/components/ui/ActionBanner";
import { ActionButton } from "@/components/ui/ActionButton";
import { DataTable, TableCard } from "@/components/ui/DataTable";
import { FilterTabs, type OpcionFiltro } from "@/components/ui/FilterTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { TablePagination, paginar } from "@/components/ui/TablePagination";
import { descargarCsv } from "@/lib/csv";
import type { FiltrosCatalogo as Filtros, Producto, TabCatalogo } from "../types";
import {
  CATEGORIAS,
  FILTROS_CATALOGO_INICIALES,
  TAMANO_PAGINA,
  calcularKpisCatalogo,
  columnasCsvProductos,
  contarPorCategoria,
  filtrarProductos,
  obtenerMarcas,
  obtenerSubcategorias,
} from "../utils";
import { columnasProductos } from "./columnasProductos";
import { FiltrosCatalogo } from "./FiltrosCatalogo";
import { KpisCatalogo } from "./KpisCatalogo";
import { NuevoProductoDrawer } from "./NuevoProductoDrawer";

const tabs: TabCatalogo[] = ["todos", ...CATEGORIAS];

function plural(cantidad: number, singular: string, plural: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}

export function CatalogoView({ productosIniciales }: { productosIniciales: Producto[] }) {
  const [productos, setProductos] = useState(productosIniciales);
  const [tab, setTab] = useState<TabCatalogo>("todos");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_CATALOGO_INICIALES);
  const [pagina, setPagina] = useState(1);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const kpis = useMemo(() => calcularKpisCatalogo(productos), [productos]);
  const conteos = useMemo(() => contarPorCategoria(productos), [productos]);
  const subcategorias = useMemo(() => obtenerSubcategorias(productos, tab), [productos, tab]);
  const marcas = useMemo(() => obtenerMarcas(productos), [productos]);
  const skus = useMemo(() => productos.map((producto) => producto.sku), [productos]);
  const filtrados = useMemo(() => filtrarProductos(productos, tab, filtros), [productos, tab, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const paginaVisible = Math.min(pagina, totalPaginas);

  const opcionesTab: OpcionFiltro<TabCatalogo>[] = tabs.map((valor) => ({
    valor,
    etiqueta: valor === "todos" ? "Todos" : valor,
    conteo: conteos[valor],
  }));

  const cambiarTab = (valor: TabCatalogo) => {
    setTab(valor);
    setFiltros((actuales) => ({ ...actuales, subcategoria: "" }));
    setPagina(1);
  };

  const cambiarFiltros = (cambios: Partial<Filtros>) => {
    setFiltros((actuales) => ({ ...actuales, ...cambios }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_CATALOGO_INICIALES);
    setTab("todos");
    setPagina(1);
  };

  const verCriticos = () => {
    setTab("todos");
    setFiltros({ ...FILTROS_CATALOGO_INICIALES, nivel: "critico" });
    setPagina(1);
  };

  const exportar = () => {
    descargarCsv("catalogo-productos", columnasCsvProductos, filtrados);
  };

  const agregarProducto = (producto: Producto) => {
    setProductos((actuales) => [...actuales, producto].sort((a, b) => a.sku.localeCompare(b.sku, "es")));
  };

  return (
    <>
      <PageHeader
        titulo="Catálogo de Productos"
        descripcion="Inventario de refacciones, equipos y consumibles para ventas y reparación."
        migas={[{ etiqueta: "Operación" }, { etiqueta: "Catálogo de productos" }]}
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
              Nuevo Producto
            </ActionButton>
          </>
        }
      />

      <KpisCatalogo kpis={kpis} />

      <FilterTabs opciones={opcionesTab} valor={tab} onChange={cambiarTab} etiquetaAccesible="Filtrar por categoría" />

      <FiltrosCatalogo
        filtros={filtros}
        subcategorias={subcategorias}
        marcas={marcas}
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
            sustantivo="productos"
          />
        }
      >
        <DataTable
          columnas={columnasProductos}
          filas={paginar(filtrados, paginaVisible, TAMANO_PAGINA)}
          obtenerClave={(producto) => producto.uuid}
          etiquetaAccesible="Catálogo de productos"
          mensajeVacio="No hay productos que coincidan con los filtros."
        />
      </TableCard>

      {kpis.critico > 0 && (
        <ActionBanner
          tono="peligro"
          icono={<TriangleAlert />}
          titulo="Alerta de stock crítico"
          descripcion={`${plural(kpis.critico, "producto está", "productos están")} en stock crítico y ${plural(kpis.bajo, "tiene", "tienen")} stock bajo. Revisa los niveles mínimos para reabastecer antes de agotar existencias.`}
          acciones={
            <ActionButton variante="peligro" iconoFinal={<ArrowRight />} onPress={verCriticos}>
              Ver críticos
            </ActionButton>
          }
        />
      )}

      <NuevoProductoDrawer
        abierto={formularioAbierto}
        onCerrar={() => setFormularioAbierto(false)}
        onCreado={agregarProducto}
        skusExistentes={skus}
      />
    </>
  );
}
