import { PackageCheck, PackageX, ShieldCheck, Wrench } from "lucide-react";
import { DataTable, type ColumnaTabla } from "@/components/ui/DataTable";
import { cn } from "@/lib/cn";
import { formatearMoneda } from "@/lib/format";
import type { Importes, LineaDetalle, TicketDetalle } from "../../types";
import { TASA_IVA, calcularImporteLinea, formatearCantidad } from "../../utils";
import { Tarjeta } from "./Tarjeta";

const columnas: ColumnaTabla<LineaDetalle>[] = [
  {
    clave: "codigo",
    encabezado: "Tipo / código",
    sinSalto: true,
    celda: (linea) => (
      <span
        className={cn(
          "rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold",
          linea.esManoDeObra ? "bg-secondary-50 text-secondary-700" : "bg-default-100 text-default-700",
        )}
      >
        {linea.producto.sku}
      </span>
    ),
  },
  {
    clave: "concepto",
    encabezado: "Concepto / refacción",
    className: "min-w-64",
    celda: (linea) => (
      <div className="flex flex-col gap-0.5">
        <span className={cn("font-semibold", linea.esManoDeObra ? "text-secondary-700" : "text-default-900")}>
          {linea.producto.nombre}
        </span>
        {linea.producto.descripcion && <span className="text-xs text-default-500">{linea.producto.descripcion}</span>}
      </div>
    ),
  },
  {
    clave: "cantidad",
    encabezado: "Cant.",
    alineacion: "centro",
    sinSalto: true,
    celda: (linea) => formatearCantidad(linea.cantidad, linea.esManoDeObra),
  },
  {
    clave: "precio",
    encabezado: "Precio unitario",
    alineacion: "derecha",
    sinSalto: true,
    celda: (linea) => <span className="tabular-nums">{formatearMoneda(linea.precioUnitario)}</span>,
  },
  {
    clave: "subtotal",
    encabezado: "Subtotal",
    alineacion: "derecha",
    sinSalto: true,
    celda: (linea) => (
      <span className="font-semibold tabular-nums text-default-900">{formatearMoneda(calcularImporteLinea(linea))}</span>
    ),
  },
];

function FilaImporte({ etiqueta, valor, total = false }: { etiqueta: string; valor: number; total?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
        total && "border-t border-default-200 pt-3",
      )}
    >
      <dt className={total ? "font-semibold text-default-900" : "text-default-600"}>{etiqueta}</dt>
      <dd
        className={cn(
          "whitespace-nowrap tabular-nums",
          total ? "text-xl font-bold text-primary" : "font-semibold text-default-900",
        )}
      >
        {formatearMoneda(valor)}
      </dd>
    </div>
  );
}

function EstadoKardex({ lineas }: { lineas: LineaDetalle[] }) {
  const refacciones = lineas.filter((linea) => !linea.esManoDeObra);
  if (refacciones.length === 0) return null;
  const sinSalida = refacciones.filter((linea) => !linea.pendiente.folioMovimiento).length;
  if (sinSalida > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-700">
        <PackageX className="size-4 shrink-0" aria-hidden />
        {sinSalida} {sinSalida === 1 ? "refacción sin salida" : "refacciones sin salida"} de almacén
      </span>
    );
  }
  const folios = [...new Set(refacciones.map((linea) => linea.pendiente.folioMovimiento))].join(", ");
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-700">
      <PackageCheck className="size-4 shrink-0" aria-hidden />
      Kardex sincronizado · {folios}
    </span>
  );
}

export function RefaccionesTicket({ ticket, importes }: { ticket: TicketDetalle; importes: Importes }) {
  return (
    <Tarjeta
      titulo="Refacciones y mano de obra aplicadas"
      subtitulo="Desglose de almacén y horas de servicio técnico"
      icono={<Wrench />}
      extra={<EstadoKardex lineas={ticket.lineas} />}
    >
      <div className="-mx-4 border-y border-default-200 sm:-mx-5">
        <DataTable
          columnas={columnas}
          filas={ticket.lineas}
          obtenerClave={(linea) => String(linea.id)}
          etiquetaAccesible="Refacciones y mano de obra"
          mensajeVacio="Aún no se registran refacciones ni mano de obra."
        />
      </div>

      <div className="grid gap-4 rounded-lg border border-primary-100 bg-primary-50/50 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex min-w-0 gap-3">
          <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 text-sm text-default-700">
            <p className="font-semibold text-default-900">Términos de póliza y garantía</p>
            <p className="mt-1">
              Garantía de reparación: <span className="font-semibold">{ticket.pendiente.garantiaDias} días naturales</span>{" "}
              sobre componentes sustituidos y mano de obra. No cubre humedad posterior ni sobretensiones externas de la red
              eléctrica.
            </p>
          </div>
        </div>
        <dl className="flex min-w-0 flex-col gap-2 text-sm md:border-l md:border-default-200 md:pl-4">
          <FilaImporte etiqueta="Refacciones y material" valor={importes.refacciones} />
          <FilaImporte etiqueta="Mano de obra" valor={importes.manoDeObra} />
          <FilaImporte etiqueta="Subtotal" valor={importes.subtotal} />
          <FilaImporte etiqueta={`IVA trasladado (${Math.round(TASA_IVA * 100)} %)`} valor={importes.iva} />
          <FilaImporte etiqueta="Total a liquidar" valor={importes.total} total />
        </dl>
      </div>
    </Tarjeta>
  );
}
