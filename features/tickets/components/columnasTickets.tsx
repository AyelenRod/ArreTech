import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import type { ColumnaTabla } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { clasesTonoPunto } from "@/components/ui/tonos";
import { cn } from "@/lib/cn";
import { formatearFechaHora } from "@/lib/format";
import type { TicketListado } from "../types";
import {
  etiquetasCompromiso,
  etiquetasEstado,
  etiquetasPrioridad,
  evaluarCompromiso,
  obtenerFolioTicket,
  tonosCompromiso,
  tonosEstado,
  tonosPrioridad,
} from "../utils";
import { InicialesUsuario } from "./InicialesUsuario";

export function rutaTicket(ticket: Pick<TicketListado, "uuid">): string {
  return `/tickets/${ticket.uuid}`;
}

export function crearColumnasTickets(fechaCorte: string): ColumnaTabla<TicketListado>[] {
  return [
    {
      clave: "folio",
      encabezado: "Folio",
      sinSalto: true,
      celda: (ticket) => (
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <span
              className={cn("size-2 shrink-0 rounded-full", clasesTonoPunto[tonosPrioridad[ticket.pendiente.prioridad]])}
              aria-hidden
            />
            <Link href={rutaTicket(ticket)} className="font-semibold text-primary-700 hover:underline">
              {obtenerFolioTicket(ticket)}
            </Link>
          </span>
          <span className="pl-4 text-xs text-default-500">{ticket.pendiente.ubicacion}</span>
        </div>
      ),
    },
    {
      clave: "cliente",
      encabezado: "Cliente y contacto",
      className: "min-w-52",
      celda: ({ cliente }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-default-900">{cliente.nombre}</span>
          {cliente.correo && <span className="break-all text-xs text-default-500">{cliente.correo}</span>}
          {cliente.telefono && <span className="whitespace-nowrap text-xs text-default-500">{cliente.telefono}</span>}
        </div>
      ),
    },
    {
      clave: "equipo",
      encabezado: "Equipo / modelo",
      className: "min-w-52",
      celda: ({ pendiente: { equipo } }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-default-900">{equipo.modelo}</span>
          <span className="text-xs text-default-500">
            <span className="whitespace-nowrap">S/N: {equipo.numeroSerie ?? "Sin serie"}</span>
            {equipo.especificaciones && ` · ${equipo.especificaciones}`}
          </span>
        </div>
      ),
    },
    {
      clave: "falla",
      encabezado: "Falla reportada",
      className: "min-w-64",
      celda: (ticket) => (
        <div className="flex flex-col items-start gap-1.5">
          <span className="text-default-900">{ticket.descripcionProblema}</span>
          {ticket.primerConcepto && (
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
              <Package className="size-3 shrink-0" aria-hidden />
              <span className="truncate">{ticket.primerConcepto}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      clave: "tecnico",
      encabezado: "Técnico",
      className: "min-w-48",
      celda: ({ tecnico }) => (
        <div className="flex items-center gap-2.5">
          <InicialesUsuario iniciales={tecnico.iniciales} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-semibold text-default-900">{tecnico.nombre}</span>
            <span className="text-xs text-default-500">{tecnico.especialidad ?? tecnico.rol ?? "—"}</span>
          </div>
        </div>
      ),
    },
    {
      clave: "estado",
      encabezado: "Estado / prioridad",
      sinSalto: true,
      celda: (ticket) => (
        <div className="flex flex-col items-start gap-1.5">
          <StatusBadge etiqueta={etiquetasEstado[ticket.estado]} tono={tonosEstado[ticket.estado]} />
          <span className="text-xs text-default-500">
            Prioridad {etiquetasPrioridad[ticket.pendiente.prioridad].toLowerCase()}
          </span>
        </div>
      ),
    },
    {
      clave: "compromiso",
      encabezado: "Compromiso",
      sinSalto: true,
      celda: (ticket) => {
        const compromiso = evaluarCompromiso(ticket, fechaCorte);
        return (
          <div className="flex flex-col items-start gap-1.5">
            <span className="font-medium text-default-900">
              {ticket.fechaEntrega ? formatearFechaHora(ticket.fechaEntrega) : "—"}
            </span>
            {ticket.estado !== "entregado" && (
              <StatusBadge
                etiqueta={etiquetasCompromiso[compromiso]}
                tono={tonosCompromiso[compromiso]}
                conPunto={false}
              />
            )}
          </div>
        );
      },
    },
    {
      clave: "acciones",
      encabezado: "Detalle",
      alineacion: "derecha",
      celda: (ticket) => (
        <Link
          href={rutaTicket(ticket)}
          aria-label={`Ver detalle de ${obtenerFolioTicket(ticket)}`}
          className="inline-flex size-8 items-center justify-center rounded-lg text-default-500 hover:bg-default-100 hover:text-primary"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ),
    },
  ];
}
