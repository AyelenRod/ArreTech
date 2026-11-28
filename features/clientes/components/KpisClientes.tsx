import { Building2, ClipboardList, UserCheck, UserPlus } from "lucide-react";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { formatearNumero } from "@/lib/format";
import type { KpisClientes as Kpis } from "../types";

export function KpisClientes({ kpis }: { kpis: Kpis }) {
  return (
    <StatGrid>
      <StatCard titulo="Total clientes" valor={formatearNumero(kpis.total)} icono={<ClipboardList />} />
      <StatCard
        titulo="Activos"
        valor={formatearNumero(kpis.activos)}
        icono={<UserCheck />}
        detalle={`${formatearNumero(kpis.total - kpis.activos)} dados de baja`}
      />
      <StatCard titulo="Empresas" valor={formatearNumero(kpis.empresas)} icono={<Building2 />} />
      <StatCard
        titulo="Nuevos este mes"
        valor={formatearNumero(kpis.nuevosEsteMes)}
        icono={<UserPlus />}
        tono="exito"
      />
    </StatGrid>
  );
}
