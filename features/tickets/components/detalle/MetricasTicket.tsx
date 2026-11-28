import { CalendarClock, Clock, Gauge, Wallet } from "lucide-react";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { formatearFechaHora, formatearMoneda } from "@/lib/format";
import type { Importes, TicketDetalle } from "../../types";
import {
  calcularTiempoEnTaller,
  etiquetasCompromiso,
  etiquetasEstado,
  evaluarCompromiso,
  formatearDuracion,
  minutosEntre,
  obtenerEtapa,
} from "../../utils";

export function MetricasTicket({ ticket, importes }: { ticket: TicketDetalle; importes: Importes }) {
  const { etapa, total, fraccion } = obtenerEtapa(ticket.estado);
  const compromiso = evaluarCompromiso(ticket, ticket.fechaCorte);
  const tiempo = calcularTiempoEnTaller(ticket, ticket.fechaCorte);
  const objetivo = ticket.fechaEntrega ? minutosEntre(ticket.createdAt, ticket.fechaEntrega) : null;
  const abierto = ticket.estado === "recibido" || ticket.estado === "en_reparacion";

  return (
    <StatGrid>
      <StatCard
        titulo="Tiempo en taller"
        valor={<span className="whitespace-nowrap">{formatearDuracion(tiempo)}</span>}
        icono={<Clock />}
        detalle={
          objetivo === null
            ? abierto
              ? "Sigue en taller · sin fecha compromiso"
              : "Sin fecha compromiso"
            : `${abierto ? "Sigue en taller · " : ""}Objetivo máximo: ${formatearDuracion(objetivo)}`
        }
      />
      <StatCard
        titulo="Compromiso de entrega"
        valor={<span className="text-xl">{ticket.fechaEntrega ? formatearFechaHora(ticket.fechaEntrega) : "—"}</span>}
        icono={<CalendarClock />}
        tono={compromiso === "vencido" ? "peligro" : "neutro"}
        detalle={<span className={compromiso === "vencido" ? "font-semibold text-danger" : undefined}>{etiquetasCompromiso[compromiso]}</span>}
      />
      <StatCard
        titulo="Progreso global"
        valor={`${Math.round(fraccion * 100)} %`}
        icono={<Gauge />}
        tono={ticket.estado === "terminado" || ticket.estado === "entregado" ? "exito" : "primario"}
        detalle={
          <div className="flex flex-col gap-2">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-default-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={etapa}
              aria-label="Etapa del ticket"
            >
              <div className="h-full rounded-full bg-success" style={{ width: `${fraccion * 100}%` }} />
            </div>
            <span>
              Etapa {etapa} de {total}: {etiquetasEstado[ticket.estado]}
            </span>
          </div>
        }
      />
      <StatCard
        titulo="Total a liquidar"
        valor={<span className="whitespace-nowrap text-2xl">{formatearMoneda(importes.total)}</span>}
        icono={<Wallet />}
        tono="primario"
        detalle={ticket.lineas.length === 0 ? "Aún sin refacciones ni mano de obra" : "IVA incluido · desglose abajo"}
      />
    </StatGrid>
  );
}
