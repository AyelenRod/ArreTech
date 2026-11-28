import { CircleAlert, ClipboardList, PackageCheck, TriangleAlert } from "lucide-react";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { formatearNumero } from "@/lib/format";
import type { KpisCatalogo as Kpis } from "../types";

export function KpisCatalogo({ kpis }: { kpis: Kpis }) {
  return (
    <StatGrid>
      <StatCard titulo="Total SKUs" valor={formatearNumero(kpis.total)} icono={<ClipboardList />} detalle="Productos activos en catálogo" />
      <StatCard
        titulo="Stock óptimo"
        valor={formatearNumero(kpis.optimo)}
        icono={<PackageCheck />}
        tono="exito"
        detalle="Por encima del mínimo"
      />
      <StatCard
        titulo="Stock bajo"
        valor={formatearNumero(kpis.bajo)}
        icono={<TriangleAlert />}
        tono="advertencia"
        detalle="Entre 50 % y 100 % del mínimo"
      />
      <StatCard
        titulo="Stock crítico"
        valor={formatearNumero(kpis.critico)}
        icono={<CircleAlert />}
        tono="peligro"
        destacado={kpis.critico > 0}
        detalle={`50 % del mínimo o menos · ${formatearNumero(kpis.agotados)} agotados`}
      />
    </StatGrid>
  );
}
