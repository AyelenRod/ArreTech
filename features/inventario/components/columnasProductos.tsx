import type { ColumnaTabla } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { clasesTonoPunto } from "@/components/ui/tonos";
import { cn } from "@/lib/cn";
import { formatearMoneda } from "@/lib/format";
import type { Producto } from "../types";
import { etiquetasNivel, formatearUnidades, obtenerNivelStock, tonosNivel } from "../utils";

export const columnasProductos: ColumnaTabla<Producto>[] = [
  {
    clave: "sku",
    encabezado: "SKU",
    sinSalto: true,
    celda: (producto) => {
      const nivel = obtenerNivelStock(producto);
      return (
        <span className="flex items-center gap-2">
          <span className={cn("size-2 shrink-0 rounded-full", clasesTonoPunto[tonosNivel[nivel]])} aria-hidden />
          <span className="font-semibold text-primary-700">{producto.sku}</span>
        </span>
      );
    },
  },
  {
    clave: "producto",
    encabezado: "Producto y marca",
    className: "min-w-64",
    celda: (producto) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-default-900">{producto.nombre}</span>
        <span className="text-xs text-default-500">
          {producto.marca}
          {producto.descripcion && ` · ${producto.descripcion}`}
        </span>
      </div>
    ),
  },
  {
    clave: "categoria",
    encabezado: "Categoría",
    sinSalto: true,
    celda: (producto) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-default-900">{producto.subcategoria}</span>
        <span className="text-xs text-default-500">{producto.categoria}</span>
      </div>
    ),
  },
  {
    clave: "stock",
    encabezado: "Stock",
    sinSalto: true,
    celda: (producto) => (
      <div className="flex flex-col items-start gap-1">
        <span className="font-semibold tabular-nums text-default-900">{formatearUnidades(producto.stockActual)}</span>
        <StatusBadge
          etiqueta={`Mín. ${formatearUnidades(producto.stockMinimo)}`}
          tono={tonosNivel[obtenerNivelStock(producto)]}
          conPunto={false}
        />
      </div>
    ),
  },
  {
    clave: "precio",
    encabezado: "Precio / estado",
    sinSalto: true,
    celda: (producto) => {
      const nivel = obtenerNivelStock(producto);
      return (
        <div className="flex flex-col items-start gap-1">
          <span className="font-semibold tabular-nums text-default-900">{formatearMoneda(producto.precio)}</span>
          <StatusBadge
            etiqueta={producto.stockActual === 0 ? "Agotado" : etiquetasNivel[nivel]}
            tono={tonosNivel[nivel]}
          />
        </div>
      );
    },
  },
];
