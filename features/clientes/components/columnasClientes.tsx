import type { ColumnaTabla } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatearFecha, formatearNumero } from "@/lib/format";
import type { ClienteListado } from "../types";
import { etiquetasTipo, obtenerAnio, obtenerEstatus, obtenerFolio } from "../utils";

export const columnasClientes: ColumnaTabla<ClienteListado>[] = [
  {
    clave: "cliente",
    encabezado: "Cliente",
    sinSalto: true,
    celda: (cliente) => (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="font-semibold text-primary-700">{obtenerFolio(cliente.id)}</span>
          {obtenerEstatus(cliente) === "inactivo" && <StatusBadge etiqueta="Inactivo" tono="neutro" conPunto={false} />}
        </span>
        <span className="text-xs text-default-500">Cliente desde {obtenerAnio(cliente.createdAt)}</span>
      </div>
    ),
  },
  {
    clave: "contacto",
    encabezado: "Contacto",
    className: "min-w-56",
    celda: (cliente) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-default-900">{cliente.nombre}</span>
        {cliente.correo && <span className="break-all text-xs text-default-500">{cliente.correo}</span>}
        {cliente.telefono && (
          <span className="whitespace-nowrap text-xs text-default-500">{cliente.telefono}</span>
        )}
      </div>
    ),
  },
  {
    clave: "tipo",
    encabezado: "Tipo",
    sinSalto: true,
    celda: (cliente) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-default-900">{etiquetasTipo[cliente.tipo].tipo}</span>
        <span className="text-xs text-default-500">{etiquetasTipo[cliente.tipo].regimen}</span>
      </div>
    ),
  },
  {
    clave: "tickets",
    encabezado: "Tickets",
    sinSalto: true,
    celda: (cliente) => (
      <div className="flex flex-col items-start gap-1">
        <span className="font-medium text-default-900">
          {formatearNumero(cliente.totalTickets)} {cliente.totalTickets === 1 ? "ticket" : "tickets"}
        </span>
        {cliente.ticketsActivos > 0 ? (
          <StatusBadge
            etiqueta={`${cliente.ticketsActivos} ${cliente.ticketsActivos === 1 ? "activo" : "activos"}`}
            tono="primario"
          />
        ) : (
          <StatusBadge etiqueta="Sin activos" tono="neutro" />
        )}
      </div>
    ),
  },
  {
    clave: "ultimo-servicio",
    encabezado: "Último servicio",
    sinSalto: true,
    celda: (cliente) =>
      cliente.ultimoServicio ? (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-default-900">{formatearFecha(cliente.ultimoServicio.fecha)}</span>
          <span className="text-xs text-default-500">Atendió: {cliente.ultimoServicio.atendio}</span>
        </div>
      ) : (
        <span className="text-default-400">Sin servicios</span>
      ),
  },
];
