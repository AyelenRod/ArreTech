"use client";

import { ArrowRight, Archive, Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionBanner } from "@/components/ui/ActionBanner";
import { ActionButton } from "@/components/ui/ActionButton";
import { DataTable, TableCard } from "@/components/ui/DataTable";
import { FilterTabs, type OpcionFiltro } from "@/components/ui/FilterTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { TablePagination, paginar } from "@/components/ui/TablePagination";
import { descargarCsv } from "@/lib/csv";
import type { CatalogosNuevoTicket } from "../services/catalogos.service";
import type { DatosVerificacionPiezas, FiltrosTickets as Filtros, TabTickets, TicketListado } from "../types";
import {
  FILTROS_INICIALES,
  TAMANO_PAGINA,
  calcularFaltantesPiezas,
  calcularKpisTickets,
  columnasCsvTickets,
  contarPorTab,
  contarTicketsConFaltantes,
  etiquetasTab,
  filtrarTickets,
  obtenerOpcionesTecnico,
} from "../utils";
import { crearColumnasTickets } from "./columnasTickets";
import { FiltrosTickets } from "./FiltrosTickets";
import { KpisTickets } from "./KpisTickets";
import { NuevoTicketDrawer } from "./NuevoTicketDrawer";
import { VerificarPiezasModal } from "./VerificarPiezasModal";

interface TicketsViewProps {
  ticketsIniciales: TicketListado[];
  catalogos: CatalogosNuevoTicket;
  verificacionPiezas: DatosVerificacionPiezas;
  fechaCorte: string;
  registradoPor: string;
}

export function TicketsView({
  ticketsIniciales,
  catalogos,
  verificacionPiezas,
  fechaCorte,
  registradoPor,
}: TicketsViewProps) {
  const [tickets, setTickets] = useState(ticketsIniciales);
  const [tab, setTab] = useState<TabTickets>("todos");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [pagina, setPagina] = useState(1);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [verificacionAbierta, setVerificacionAbierta] = useState(false);

  const kpis = useMemo(() => calcularKpisTickets(tickets, fechaCorte), [tickets, fechaCorte]);
  const conteos = useMemo(() => contarPorTab(tickets), [tickets]);
  const tecnicos = useMemo(() => obtenerOpcionesTecnico(tickets), [tickets]);
  const faltantes = useMemo(
    () => calcularFaltantesPiezas(verificacionPiezas.requerimientos, verificacionPiezas.productos),
    [verificacionPiezas],
  );
  const ticketsConFaltantes = contarTicketsConFaltantes(faltantes);
  const filtrados = useMemo(() => filtrarTickets(tickets, tab, filtros), [tickets, tab, filtros]);
  const columnas = useMemo(() => crearColumnasTickets(fechaCorte), [fechaCorte]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const paginaVisible = Math.min(pagina, totalPaginas);

  const opcionesTab: OpcionFiltro<TabTickets>[] = (Object.keys(etiquetasTab) as TabTickets[]).map((valor) => ({
    valor,
    etiqueta: etiquetasTab[valor],
    conteo: conteos[valor],
  }));

  const cambiarTab = (valor: TabTickets) => {
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

  const exportar = () => {
    descargarCsv("tickets-servicio", columnasCsvTickets, filtrados);
  };

  const agregarTicket = (ticket: TicketListado) => {
    setTickets((actuales) => [ticket, ...actuales]);
    setTab("todos");
    setPagina(1);
  };

  return (
    <>
      <PageHeader
        titulo="Tickets de Reparación y Mantenimiento"
        descripcion="Seguimiento de equipos recibidos, en banco técnico y entregas programadas, con trazabilidad de refacciones."
        migas={[{ etiqueta: "Operación" }, { etiqueta: "Tickets de servicio" }]}
        acciones={
          <>
            <ActionButton variante="secundario" icono={<Download />} onPress={exportar} isDisabled={filtrados.length === 0}>
              Exportar listado
            </ActionButton>
            <ActionButton icono={<Plus />} onPress={() => setFormularioAbierto(true)}>
              Abrir Nuevo Ticket
            </ActionButton>
          </>
        }
      />

      <KpisTickets kpis={kpis} />

      <FilterTabs opciones={opcionesTab} valor={tab} onChange={cambiarTab} etiquetaAccesible="Filtrar tickets por estado" />

      <FiltrosTickets filtros={filtros} tecnicos={tecnicos} onChange={cambiarFiltros} onLimpiar={limpiarFiltros} />

      <TableCard
        pie={
          <TablePagination
            pagina={paginaVisible}
            tamanoPagina={TAMANO_PAGINA}
            totalRegistros={filtrados.length}
            onChange={setPagina}
            sustantivo="tickets"
          />
        }
      >
        <DataTable
          columnas={columnas}
          filas={paginar(filtrados, paginaVisible, TAMANO_PAGINA)}
          obtenerClave={(ticket) => ticket.uuid}
          etiquetaAccesible="Tickets de servicio"
          mensajeVacio="No hay tickets que coincidan con los filtros."
        />
      </TableCard>

      <ActionBanner
        icono={<Archive />}
        tono={faltantes.length > 0 ? "advertencia" : "primario"}
        titulo="Verificación de piezas en almacén"
        descripcion={
          faltantes.length > 0 ? (
            <>
              <span className="font-semibold text-default-700">
                {faltantes.length} {faltantes.length === 1 ? "refacción" : "refacciones"} de {ticketsConFaltantes}{" "}
                {ticketsConFaltantes === 1 ? "ticket abierto" : "tickets abiertos"}
              </span>{" "}
              sin surtir, con stock insuficiente o en nivel crítico. Revísalas antes de continuar el ensamble.
            </>
          ) : (
            "Las refacciones pendientes de surtir tienen stock suficiente."
          )
        }
        acciones={
          <ActionButton iconoFinal={<ArrowRight />} onPress={() => setVerificacionAbierta(true)}>
            Verificar piezas
          </ActionButton>
        }
      />

      <VerificarPiezasModal
        abierto={verificacionAbierta}
        onCerrar={() => setVerificacionAbierta(false)}
        faltantes={faltantes}
      />

      <NuevoTicketDrawer
        abierto={formularioAbierto}
        onCerrar={() => setFormularioAbierto(false)}
        onCreado={agregarTicket}
        catalogos={catalogos}
        registradoPor={registradoPor}
      />
    </>
  );
}
