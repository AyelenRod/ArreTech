import { CircleAlert, CircleCheck, Package, TrendingUp, TriangleAlert } from "lucide-react";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatearNumero, formatearPorcentaje } from "@/lib/format";
import type { IndicadoresInventario } from "../types";

export function ResumenInventario({ indicadores }: { indicadores: IndicadoresInventario }) {
  const cobertura = Math.round((indicadores.stockOptimo / indicadores.totalSkus) * 100) / 100;

  return (
    <StatGrid>
      <StatCard
        titulo="Total SKUs"
        valor={formatearNumero(indicadores.totalSkus)}
        icono={<Package />}
        detalle={
          <span className="flex items-center gap-1.5 font-semibold text-success-700">
            <TrendingUp className="size-4" aria-hidden />+{indicadores.nuevosEsteMes} este mes
          </span>
        }
      />
      <StatCard
        titulo="Stock óptimo"
        valor={formatearNumero(indicadores.stockOptimo)}
        icono={<CircleCheck />}
        tono="exito"
        tonoValor="neutro"
        detalle={<StatusBadge etiqueta={`${formatearPorcentaje(cobertura)} cobertura`} tono="exito" conPunto={false} />}
      />
      <StatCard
        titulo="Stock bajo"
        valor={formatearNumero(indicadores.stockBajo)}
        icono={<TriangleAlert />}
        tono="advertencia"
        detalle={<StatusBadge etiqueta="Reabastecimiento" tono="advertencia" conPunto={false} />}
      />
      <StatCard
        titulo="Stock crítico / Agotado"
        valor={formatearNumero(indicadores.stockCritico)}
        icono={<CircleAlert />}
        tono="peligro"
        destacado
        detalle={<StatusBadge etiqueta="Taller Detenido" tono="peligro" conPunto={false} />}
      />
    </StatGrid>
  );
}
