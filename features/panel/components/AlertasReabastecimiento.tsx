import { BellRing, ShoppingCart } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatearMoneda } from "@/lib/format";
import type { AlertaReabastecimiento, Reabastecimiento } from "../types";

function cantidad(total: number, unidad: AlertaReabastecimiento["unidad"]): string {
  return `${total} ${total === 1 ? unidad.singular : unidad.plural}`;
}

function TarjetaAlerta({ alerta }: { alerta: AlertaReabastecimiento }) {
  const restante = cantidad(alerta.existencia, alerta.unidad);

  return (
    <li className="rounded-lg bg-default-50 p-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-default-900">{alerta.nombre}</h3>
        <StatusBadge
          etiqueta={alerta.existencia === 1 ? `${restante} restante` : restante}
          tono="peligro"
          conPunto={false}
        />
      </div>
      <p className="mt-1.5 text-xs text-default-500">
        SKU: {alerta.sku} • {alerta.detalle}
      </p>
      <p className="mt-1 text-xs text-default-500">Mínimo en almacén: {cantidad(alerta.minimo, alerta.unidad)}</p>
    </li>
  );
}

export function AlertasReabastecimiento({ reabastecimiento }: { reabastecimiento: Reabastecimiento }) {
  return (
    <aside className="flex min-w-0 flex-col rounded-xl border border-default-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="flex items-start gap-2 text-base font-semibold leading-snug text-default-900">
            <BellRing className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
            Alertas de Reabastecimiento
          </h2>
          <StatusBadge etiqueta={`${reabastecimiento.totalCriticos} Críticos`} tono="peligro" conPunto={false} />
        </div>
        <p className="text-xs leading-relaxed text-default-500">
          Componentes con existencia crítica requeridos para órdenes activas
        </p>
        <ul className="flex flex-col gap-2">
          {reabastecimiento.alertas.map((alerta) => (
            <TarjetaAlerta key={alerta.sku} alerta={alerta} />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 border-t border-default-200 bg-default-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="max-w-36 text-[11px] font-semibold uppercase tracking-wide text-default-500">
            Total estimado de reposición
          </p>
          <p className="text-right text-lg font-bold tabular-nums text-default-900">
            {formatearMoneda(reabastecimiento.costoEstimado)}
          </p>
        </div>
        <ActionButton icono={<ShoppingCart />} className="w-full px-2 text-[13px] [&_svg]:shrink-0">
          Generar Orden de Compra Sugerida
        </ActionButton>
      </div>
    </aside>
  );
}
