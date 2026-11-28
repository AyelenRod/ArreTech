import { CircleCheckBig, FileText, Printer } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatearFecha } from "@/lib/format";
import type { TicketDetalle } from "../../types";
import {
  calcularImportes,
  etiquetasEstado,
  etiquetasPrioridad,
  obtenerFolioTicket,
  tonosEstado,
  tonosPrioridad,
} from "../../utils";
import { FichaEquipo } from "./FichaEquipo";
import { MetricasTicket } from "./MetricasTicket";
import { PanelLateral } from "./PanelLateral";
import { RefaccionesTicket } from "./RefaccionesTicket";

export function TicketDetalleView({ ticket }: { ticket: TicketDetalle }) {
  const folio = obtenerFolioTicket(ticket);
  const importes = calcularImportes(ticket.lineas);
  const rolRecepcion = ticket.recepcion.rol ? ` (${ticket.recepcion.rol})` : "";

  return (
    <>
      <div className="flex flex-col gap-3">
        <PageHeader
          titulo={folio}
          descripcion={`Ingresado por ${ticket.recepcion.nombre}${rolRecepcion} el ${formatearFecha(ticket.createdAt)} · ${ticket.cliente.nombre}`}
          migas={[
            { etiqueta: "Operación" },
            { etiqueta: "Tickets de servicio", href: "/tickets" },
            { etiqueta: folio },
          ]}
          acciones={
            <>
              {/* TODO: generar el comprobante PDF cuando exista el endpoint. */}
              <ActionButton variante="secundario" icono={<FileText />}>
                Comprobante PDF
              </ActionButton>
              {/* TODO: imprimir la hoja de taller cuando exista la plantilla en backend. */}
              <ActionButton variante="secundario" icono={<Printer />}>
                Hoja de Taller
              </ActionButton>
              {ticket.estado === "terminado" && (
                /* TODO: cambiar estado_ticket a "entregado" cuando exista el endpoint. */
                <ActionButton icono={<CircleCheckBig />}>Marcar como Entregado</ActionButton>
              )}
            </>
          }
        />
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            etiqueta={`Prioridad ${etiquetasPrioridad[ticket.pendiente.prioridad].toLowerCase()}`}
            tono={tonosPrioridad[ticket.pendiente.prioridad]}
            conPunto={false}
          />
          <StatusBadge etiqueta={etiquetasEstado[ticket.estado]} tono={tonosEstado[ticket.estado]} />
        </div>
      </div>

      <MetricasTicket ticket={ticket} importes={importes} />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <FichaEquipo ticket={ticket} />
          <RefaccionesTicket ticket={ticket} importes={importes} />
        </div>
        <PanelLateral ticket={ticket} />
      </div>
    </>
  );
}
