"use client";

import { ArrowRight, Download, Plus, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionBanner } from "@/components/ui/ActionBanner";
import { ActionButton } from "@/components/ui/ActionButton";
import { DataTable, TableCard } from "@/components/ui/DataTable";
import { FilterTabs, type OpcionFiltro } from "@/components/ui/FilterTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { TablePagination, paginar } from "@/components/ui/TablePagination";
import { descargarCsv } from "@/lib/csv";
import type { ClienteListado, FiltrosClientes as Filtros, TabClientes } from "../types";
import {
  FILTROS_INICIALES,
  MES_ACTUAL,
  TAMANO_PAGINA,
  calcularKpis,
  columnasCsvClientes,
  contarPorTab,
  filtrarClientes,
  obtenerCiudades,
} from "../utils";
import { columnasClientes } from "./columnasClientes";
import { FiltrosClientes } from "./FiltrosClientes";
import { KpisClientes } from "./KpisClientes";
import { NuevoClienteDrawer } from "./NuevoClienteDrawer";

const etiquetasTab: Record<TabClientes, string> = {
  todos: "Todos",
  particulares: "Particulares",
  empresas: "Empresas",
  con_tickets: "Con tickets activos",
  inactivos: "Inactivos",
};

export function ClientesView({ clientesIniciales }: { clientesIniciales: ClienteListado[] }) {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [tab, setTab] = useState<TabClientes>("todos");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [pagina, setPagina] = useState(1);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const kpis = useMemo(() => calcularKpis(clientes), [clientes]);
  const conteos = useMemo(() => contarPorTab(clientes), [clientes]);
  const ciudades = useMemo(() => obtenerCiudades(clientes), [clientes]);
  const filtrados = useMemo(() => filtrarClientes(clientes, tab, filtros), [clientes, tab, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const paginaVisible = Math.min(pagina, totalPaginas);

  const opcionesTab: OpcionFiltro<TabClientes>[] = (Object.keys(etiquetasTab) as TabClientes[]).map((valor) => ({
    valor,
    etiqueta: etiquetasTab[valor],
    conteo: conteos[valor],
  }));

  const cambiarTab = (valor: TabClientes) => {
    setTab(valor);
    setPagina(1);
  };

  const cambiarFiltros = (cambios: Partial<Filtros>) => {
    setFiltros((actuales) => ({ ...actuales, ...cambios }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setTab("todos");
    setPagina(1);
  };

  const verNuevos = () => {
    setTab("todos");
    setFiltros({ ...FILTROS_INICIALES, soloNuevos: true });
    setPagina(1);
  };

  const exportar = () => {
    descargarCsv(`clientes-${MES_ACTUAL}`, columnasCsvClientes, filtrados);
  };

  const agregarCliente = (cliente: ClienteListado) => {
    setClientes((actuales) => [...actuales, cliente]);
  };

  return (
    <>
      <PageHeader
        titulo="Clientes"
        descripcion="Clientes registrados, historial de servicios y tickets activos."
        migas={[{ etiqueta: "Operación" }, { etiqueta: "Clientes" }]}
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
              Nuevo Cliente
            </ActionButton>
          </>
        }
      />

      <KpisClientes kpis={kpis} />

      <FilterTabs
        opciones={opcionesTab}
        valor={tab}
        onChange={cambiarTab}
        etiquetaAccesible="Filtrar clientes"
      />

      <FiltrosClientes
        filtros={filtros}
        ciudades={ciudades}
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
            sustantivo="clientes"
          />
        }
      >
        <DataTable
          columnas={columnasClientes}
          filas={paginar(filtrados, paginaVisible, TAMANO_PAGINA)}
          obtenerClave={(cliente) => cliente.uuid}
          etiquetaAccesible="Listado de clientes"
          mensajeVacio="No hay clientes que coincidan con los filtros."
        />
      </TableCard>

      {kpis.nuevosEsteMes > 0 && (
        <ActionBanner
          icono={<UserPlus />}
          titulo={`${kpis.nuevosEsteMes} ${kpis.nuevosEsteMes === 1 ? "cliente nuevo" : "clientes nuevos"} este mes`}
          descripcion={`${kpis.nuevosEsteMes} ${kpis.nuevosEsteMes === 1 ? "cliente se registró" : "clientes se registraron"} este mes, ${kpis.nuevosConTicketsActivos} con tickets activos. Revisa que sus datos de contacto estén completos.`}
          acciones={
            <ActionButton iconoFinal={<ArrowRight />} onPress={verNuevos}>
              Ver nuevos
            </ActionButton>
          }
        />
      )}

      <NuevoClienteDrawer
        abierto={formularioAbierto}
        onCerrar={() => setFormularioAbierto(false)}
        onCreado={agregarCliente}
      />
    </>
  );
}
