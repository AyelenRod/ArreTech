import { CircleCheckBig, ClipboardList, Timer, Wrench } from "lucide-react";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { formatearNumero, formatearPorcentaje } from "@/lib/format";
import type { KpisTickets as Kpis } from "../types";

export function KpisTickets({ kpis }: { kpis: Kpis }) {
  return (
    <StatGrid>
      <StatCard
        titulo="Total tickets activos"
        valor={formatearNumero(kpis.activos)}
        icono={<ClipboardList />}
        detalle="Recibidos, en reparación y terminados"
      />
      <StatCard
        titulo="En banco técnico"
        valor={formatearNumero(kpis.enReparacion)}
        icono={<Wrench />}
        tono="advertencia"
        detalle="Estado: en reparación"
      />
      <StatCard
        titulo="Terminados / listos"
        valor={formatearNumero(kpis.terminados)}
        icono={<CircleCheckBig />}
        tono="exito"
        detalle="Pendientes de entrega al cliente"
      />
      <StatCard
        titulo="SLA cumplido"
        valor={kpis.slaCumplido === null ? "—" : formatearPorcentaje(kpis.slaCumplido)}
        icono={<Timer />}
        tono="primario"
        detalle={`Terminados antes de la fecha compromiso · ${formatearNumero(kpis.slaEvaluados)} evaluados`}
      />
    </StatGrid>
  );
}
