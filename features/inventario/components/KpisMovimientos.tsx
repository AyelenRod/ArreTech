import { ArrowDownToLine, ArrowUpFromLine, ClipboardList, RefreshCcw } from "lucide-react";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { formatearNumero } from "@/lib/format";
import type { KpisMovimientos as Kpis } from "../types";
import { formatearUnidades } from "../utils";

export function KpisMovimientos({ kpis }: { kpis: Kpis }) {
  return (
    <StatGrid>
      <StatCard titulo="Total movimientos" valor={formatearNumero(kpis.total)} icono={<ClipboardList />} />
      <StatCard
        titulo="Entradas"
        valor={formatearNumero(kpis.entradas)}
        icono={<ArrowDownToLine />}
        tono="exito"
        detalle={`${formatearUnidades(kpis.unidadesEntrada)} ingresadas`}
      />
      <StatCard
        titulo="Salidas"
        valor={formatearNumero(kpis.salidas)}
        icono={<ArrowUpFromLine />}
        tono="peligro"
        detalle={`${formatearUnidades(kpis.unidadesSalida)} retiradas`}
      />
      <StatCard
        titulo="Ajustes y devoluciones"
        valor={formatearNumero(kpis.ajustesYDevoluciones)}
        icono={<RefreshCcw />}
        tono="advertencia"
        detalle="Por motivo, entradas o salidas"
      />
    </StatGrid>
  );
}
