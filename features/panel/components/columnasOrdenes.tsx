import type { ColumnaTabla } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { estadosOrden } from "../ordenes";
import type { OrdenServicio } from "../types";

export const columnasOrdenes: ColumnaTabla<OrdenServicio>[] = [
  {
    clave: "folio",
    encabezado: "Folio",
    sinSalto: true,
    celda: (orden) => <span className="font-semibold text-primary">{orden.folio}</span>,
  },
  {
    clave: "cliente",
    encabezado: "Cliente",
    celda: (orden) => (
      <>
        <p className="font-semibold text-default-900">{orden.cliente}</p>
        <p className="text-xs text-default-500">{orden.referenciaCliente}</p>
      </>
    ),
  },
  {
    clave: "equipo",
    encabezado: "Equipo / Falla",
    celda: (orden) => (
      <>
        <p className="text-default-800">{orden.equipo}</p>
        <p className="text-xs text-default-500">{orden.falla}</p>
      </>
    ),
  },
  {
    clave: "estado",
    encabezado: "Estado",
    alineacion: "centro",
    sinSalto: true,
    celda: (orden) => <StatusBadge {...estadosOrden[orden.estado]} />,
  },
];
