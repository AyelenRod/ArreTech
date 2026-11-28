/** Enum `estado_ticket` de la BD. */
export type EstadoTicket = "recibido" | "en_reparacion" | "terminado" | "entregado";

/** Propuesto: la tabla `clientes` aún no tiene esta columna. */
export type TipoCliente = "particular" | "empresa";

/** Derivado de `deleted_at`: un cliente con soft delete se muestra como inactivo. */
export type EstatusCliente = "activo" | "inactivo";

/** Fila de `clientes`. `tipo`, `ciudad` y `rfc` son columnas propuestas, pendientes de backend. */
export interface Cliente {
  id: number;
  uuid: string;
  nombre: string;
  telefono: string | null;
  correo: string | null;
  tipo: TipoCliente;
  ciudad: string;
  rfc: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface UltimoServicio {
  fecha: string;
  atendio: string;
}

export interface ClienteListado extends Cliente {
  totalTickets: number;
  ticketsActivos: number;
  ultimoServicio: UltimoServicio | null;
}

export interface NuevoCliente {
  nombre: string;
  telefono: string | null;
  correo: string | null;
  tipo: TipoCliente;
  ciudad: string;
  rfc: string | null;
}

export type TabClientes = "todos" | "particulares" | "empresas" | "con_tickets" | "inactivos";

export interface FiltrosClientes {
  busqueda: string;
  tipo: TipoCliente | "";
  ciudad: string;
  estatus: EstatusCliente | "";
  soloNuevos: boolean;
}

export interface KpisClientes {
  total: number;
  activos: number;
  empresas: number;
  nuevosEsteMes: number;
  nuevosConTicketsActivos: number;
}
