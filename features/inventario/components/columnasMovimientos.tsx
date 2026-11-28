import type { ColumnaTabla } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { clasesTonoPunto } from "@/components/ui/tonos";
import { cn } from "@/lib/cn";
import { formatearFechaHora } from "@/lib/format";
import type { MovimientoListado } from "../types";
import {
  cantidadConSigno,
  etiquetasMotivo,
  etiquetasTipo,
  formatearUnidades,
  obtenerFolioMovimiento,
} from "../utils";

export const columnasMovimientos: ColumnaTabla<MovimientoListado>[] = [
  {
    clave: "movimiento",
    encabezado: "Movimiento",
    className: "min-w-48",
    celda: (movimiento) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              clasesTonoPunto[movimiento.tipo === "entrada" ? "exito" : "peligro"],
            )}
            aria-hidden
          />
          <span className="font-semibold text-primary-700">{obtenerFolioMovimiento(movimiento)}</span>
        </span>
        <span className="text-xs text-default-500">{movimiento.referencia ?? "Sin referencia"}</span>
      </div>
    ),
  },
  {
    clave: "producto",
    encabezado: "Producto",
    className: "min-w-60",
    celda: ({ producto }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-default-900">{producto.nombre}</span>
        <span className="text-xs text-default-500">
          {producto.sku} · {producto.marca}
        </span>
      </div>
    ),
  },
  {
    clave: "tipo",
    encabezado: "Tipo",
    sinSalto: true,
    celda: (movimiento) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-default-900">{etiquetasTipo[movimiento.tipo]}</span>
        <span className="text-xs text-default-500">{etiquetasMotivo[movimiento.motivo]}</span>
      </div>
    ),
  },
  {
    clave: "cantidad",
    encabezado: "Cantidad",
    sinSalto: true,
    celda: (movimiento) => {
      const cantidad = cantidadConSigno(movimiento);
      return (
        <div className="flex flex-col items-start gap-1">
          <span
            className={cn(
              "font-semibold tabular-nums",
              cantidad > 0 ? "text-success-600" : "text-danger",
            )}
          >
            {cantidad > 0 ? "+" : "-"}
            {formatearUnidades(Math.abs(cantidad))}
          </span>
          <StatusBadge etiqueta={`Stock: ${formatearUnidades(movimiento.stockResultante)}`} tono="neutro" conPunto={false} />
        </div>
      );
    },
  },
  {
    clave: "fecha",
    encabezado: "Fecha / responsable",
    sinSalto: true,
    celda: ({ createdAt, responsable }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-default-900">{formatearFechaHora(createdAt)}</span>
        <span className="text-xs text-default-500">
          {responsable.nombreCorto}
          {responsable.rol && ` · ${responsable.rol}`}
        </span>
      </div>
    ),
  },
];
