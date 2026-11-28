import type { RolSistema } from "@/lib/mock-session";

/** Enum `estado_ticket` de la BD. */
export type EstadoTicket = "recibido" | "en_reparacion" | "terminado" | "entregado";

/** Enum `estado_usuario` de la BD. */
export type EstadoUsuario = "activo" | "inactivo";

/* ---------- Pendientes de backend: el diseño los usa y la BD no los tiene ---------- */

/** Propuesto: columna `prioridad` en `tickets_servicio`. */
export type PrioridadTicket = "alta" | "media" | "baja";

/** Propuesto: columna `tipo_equipo` en `tickets_servicio`. */
export type TipoEquipo = "Laptop" | "Escritorio" | "All-in-One" | "Servidor" | "Impresora";

export interface EquipoTicket {
  tipo: TipoEquipo;
  modelo: string;
  numeroSerie: string | null;
  especificaciones: string | null;
}

export interface PruebaCalidad {
  prueba: string;
  resultado: string;
  aprobada: boolean;
}

/** Hoy saldría de `audit_logs` (entity_type = 'tickets_servicio'). */
export interface EventoTicket {
  fecha: string;
  /** Estado al que pasó el ticket; `null` para eventos que no cambian el estado. */
  estado: EstadoTicket | null;
  titulo: string;
  detalle: string;
}

/**
 * Columnas que el diseño necesita y `tickets_servicio` no tiene.
 * Se agrupan aquí para poder quitarlas o mapearlas cuando el backend responda.
 */
export interface PendientesTicket {
  prioridad: PrioridadTicket;
  equipo: EquipoTicket;
  ubicacion: string;
  /** Quién registró el ticket en mostrador; `id_usuario` es el técnico. */
  idUsuarioRecepcion: number;
  diagnostico: string | null;
  procedimiento: string | null;
  garantiaDias: number;
  controlCalidad: PruebaCalidad[];
  trazabilidad: EventoTicket[];
}

/** Propuesto: datos de perfil técnico en `usuarios`. */
export interface PendientesUsuario {
  especialidad: string | null;
  certificacion: { nombre: string; descripcion: string } | null;
  estacion: string | null;
}

/* ---------- Tablas de la BD ---------- */

export interface UsuarioTicket {
  id: number;
  uuid: string;
  nombre: string;
  apellido: string;
  rol: RolSistema;
  estado: EstadoUsuario;
  pendiente: PendientesUsuario;
}

/** Fila de `clientes`. */
export interface ClienteTicket {
  id: number;
  uuid: string;
  nombre: string;
  telefono: string | null;
  correo: string | null;
}

/** Columnas de `productos` que usan los tickets. */
export interface ProductoTicket {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
}

/** Fila de `detalle_ticket`. `folioMovimiento` es propuesto (enlace con `movimientos_inventario`). */
export interface DetalleTicket {
  id: number;
  idTicket: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  pendiente: { folioMovimiento: string | null };
}

/** Fila de `tickets_servicio`. `id_usuario` es el técnico asignado. */
export interface TicketServicio {
  id: number;
  uuid: string;
  idCliente: number;
  idUsuario: number;
  descripcionProblema: string;
  estado: EstadoTicket;
  /** Fecha aproximada de entrega: es la "fecha compromiso" del diseño. */
  fechaEntrega: string | null;
  costoTotal: number | null;
  /** Texto libre; el frontend lo lee como un pie de foto por línea. */
  evidencias: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  pendiente: PendientesTicket;
}

/* ---------- Vistas ---------- */

export interface ResumenUsuario {
  id: number;
  nombre: string;
  iniciales: string;
  rol: RolSistema | null;
  especialidad: string | null;
}

export interface TicketListado extends TicketServicio {
  cliente: Pick<ClienteTicket, "id" | "nombre" | "telefono" | "correo">;
  tecnico: ResumenUsuario;
  /** Nombre de la primera refacción o servicio registrado en `detalle_ticket`. */
  primerConcepto: string | null;
}

export interface LineaDetalle extends DetalleTicket {
  producto: ProductoTicket;
  esManoDeObra: boolean;
}

export interface TicketDetalle extends TicketListado {
  recepcion: ResumenUsuario;
  tecnicoCompleto: UsuarioTicket | null;
  lineas: LineaDetalle[];
  /** Instante contra el que se mide el tiempo en taller de los tickets abiertos. */
  fechaCorte: string;
}

export interface Importes {
  refacciones: number;
  manoDeObra: number;
  subtotal: number;
  iva: number;
  total: number;
}

/** Refacción requerida por un ticket abierto (fila de `detalle_ticket` con su ticket). */
export interface RequerimientoPieza {
  idDetalle: number;
  folio: string;
  uuidTicket: string;
  estado: EstadoTicket;
  idProducto: number;
  cantidad: number;
  /** Ya tiene salida en `movimientos_inventario` (sale de la columna propuesta `folioMovimiento`). */
  conSalida: boolean;
}

export type MotivoFaltante = "insuficiente" | "critico";

export interface FaltantePieza {
  idDetalle: number;
  folio: string;
  uuidTicket: string;
  sku: string;
  pieza: string;
  cantidadRequerida: number;
  stockDisponible: number;
  stockMinimo: number;
  motivos: MotivoFaltante[];
}

export interface DatosVerificacionPiezas {
  requerimientos: RequerimientoPieza[];
  productos: ProductoTicket[];
}

export interface NuevoTicket {
  idCliente: number;
  idUsuario: number | null;
  descripcionProblema: string;
  fechaEntrega: string | null;
  prioridad: PrioridadTicket;
  equipo: EquipoTicket;
}

export type TabTickets = "todos" | EstadoTicket;

export interface FiltrosTickets {
  busqueda: string;
  tecnico: string;
  prioridad: PrioridadTicket | "";
  tipoEquipo: TipoEquipo | "";
}

export interface KpisTickets {
  activos: number;
  enReparacion: number;
  terminados: number;
  /** Fracción 0–1 o `null` si aún no hay tickets terminados con fecha compromiso. */
  slaCumplido: number | null;
  slaEvaluados: number;
}
