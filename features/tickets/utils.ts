import type { Tono } from "@/components/ui/tonos";
import type { OpcionSelect } from "@/components/ui/FilterBar";
import type { ColumnaCsv } from "@/lib/csv";
import { formatearFechaHora } from "@/lib/format";
import type {
  EstadoTicket,
  FiltrosTickets,
  Importes,
  FaltantePieza,
  KpisTickets,
  MotivoFaltante,
  PrioridadTicket,
  ProductoTicket,
  RequerimientoPieza,
  TabTickets,
  TicketListado,
  TicketServicio,
  TipoEquipo,
  UsuarioTicket,
} from "./types";

export const TAMANO_PAGINA = 6;

/** IVA trasladado sobre refacciones y mano de obra. */
export const TASA_IVA = 0.16;

/** Valor de `productos.categoria` con el que se registra la mano de obra en `detalle_ticket`. */
export const CATEGORIA_MANO_DE_OBRA = "Mano de obra";

/** Orden del flujo de `estado_ticket`; la etapa es la posición + 1. */
export const ESTADOS_TICKET: EstadoTicket[] = ["recibido", "en_reparacion", "terminado", "entregado"];

export const etiquetasEstado: Record<EstadoTicket, string> = {
  recibido: "Recibido",
  en_reparacion: "En reparación",
  terminado: "Terminado",
  entregado: "Entregado",
};

export const etiquetasTab: Record<TabTickets, string> = {
  todos: "Todos",
  recibido: "Recibidos",
  en_reparacion: "En reparación",
  terminado: "Terminados",
  entregado: "Entregados",
};

export const tonosEstado: Record<EstadoTicket, Tono> = {
  recibido: "primario",
  en_reparacion: "advertencia",
  terminado: "exito",
  entregado: "neutro",
};

export const etiquetasPrioridad: Record<PrioridadTicket, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const tonosPrioridad: Record<PrioridadTicket, Tono> = {
  alta: "peligro",
  media: "advertencia",
  baja: "neutro",
};

export const TIPOS_EQUIPO: TipoEquipo[] = ["Laptop", "Escritorio", "All-in-One", "Servidor", "Impresora"];

/** Usuarios que pueden quedar en `tickets_servicio.id_usuario` según la tabla de permisos. */
const ROLES_TECNICOS = new Set(["Técnico", "Administrador"]);

export const FILTROS_INICIALES: FiltrosTickets = {
  busqueda: "",
  tecnico: "",
  prioridad: "",
  tipoEquipo: "",
};

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function coincide(termino: string, textos: (string | null | undefined)[]): boolean {
  return textos.some((texto) => texto && normalizar(texto).includes(termino));
}

export function obtenerFolioTicket(ticket: Pick<TicketServicio, "id" | "createdAt">): string {
  return `TCK-${ticket.createdAt.slice(0, 4)}-${String(ticket.id).padStart(4, "0")}`;
}

/* ---------- Importes ---------- */

function aCentavos(valor: number): number {
  return Math.round(valor * 100);
}

export function esManoDeObra(producto: Pick<ProductoTicket, "categoria">): boolean {
  return producto.categoria === CATEGORIA_MANO_DE_OBRA;
}

export function calcularImporteLinea(linea: { cantidad: number; precioUnitario: number }): number {
  return aCentavos(linea.cantidad * linea.precioUnitario) / 100;
}

/** Se calcula en centavos para no arrastrar errores de punto flotante. */
export function calcularImportes(
  lineas: { cantidad: number; precioUnitario: number; producto: Pick<ProductoTicket, "categoria"> }[],
): Importes {
  let refacciones = 0;
  let manoDeObra = 0;
  for (const linea of lineas) {
    const importe = aCentavos(linea.cantidad * linea.precioUnitario);
    if (esManoDeObra(linea.producto)) manoDeObra += importe;
    else refacciones += importe;
  }
  const subtotal = refacciones + manoDeObra;
  const iva = Math.round(subtotal * TASA_IVA);
  return {
    refacciones: refacciones / 100,
    manoDeObra: manoDeObra / 100,
    subtotal: subtotal / 100,
    iva: iva / 100,
    total: (subtotal + iva) / 100,
  };
}

export function formatearCantidad(cantidad: number, manoDeObra: boolean): string {
  if (manoDeObra) return `${cantidad} serv.`;
  return `${cantidad} ${cantidad === 1 ? "pza" : "pzas"}`;
}

/* ---------- Etapas, tiempos y compromiso ---------- */

export function obtenerEtapa(estado: EstadoTicket): { etapa: number; total: number; fraccion: number } {
  const etapa = ESTADOS_TICKET.indexOf(estado) + 1;
  return { etapa, total: ESTADOS_TICKET.length, fraccion: etapa / ESTADOS_TICKET.length };
}

/** Fecha en que el ticket pasó a `terminado`, tomada de la trazabilidad. */
export function obtenerFechaTerminado(ticket: Pick<TicketServicio, "pendiente">): string | null {
  return ticket.pendiente.trazabilidad.find((evento) => evento.estado === "terminado")?.fecha ?? null;
}

export function minutosEntre(desde: string, hasta: string): number {
  return Math.max(0, Math.round((Date.parse(hasta) - Date.parse(desde)) / 60_000));
}

export function formatearDuracion(minutos: number): string {
  const dias = Math.floor(minutos / 1440);
  const horas = Math.floor((minutos % 1440) / 60);
  const resto = minutos % 60;
  if (dias > 0) return `${dias} d ${horas} h`;
  return `${horas} h ${String(resto).padStart(2, "0")} m`;
}

/** Tiempo desde la recepción hasta que quedó terminado (o hasta la fecha de corte si sigue abierto). */
export function calcularTiempoEnTaller(ticket: TicketServicio, fechaCorte: string): number {
  return minutosEntre(ticket.createdAt, obtenerFechaTerminado(ticket) ?? fechaCorte);
}

export type EstadoCompromiso = "sin_fecha" | "en_tiempo" | "vencido" | "cumplido" | "con_retraso";

/** El compromiso se cumple si el equipo quedó terminado antes de `fecha_entrega`. */
export function evaluarCompromiso(ticket: TicketServicio, fechaCorte: string): EstadoCompromiso {
  if (!ticket.fechaEntrega) return "sin_fecha";
  const limite = Date.parse(ticket.fechaEntrega);
  const terminado = obtenerFechaTerminado(ticket);
  if (terminado) return Date.parse(terminado) <= limite ? "cumplido" : "con_retraso";
  return Date.parse(fechaCorte) > limite ? "vencido" : "en_tiempo";
}

export const etiquetasCompromiso: Record<EstadoCompromiso, string> = {
  sin_fecha: "Sin fecha compromiso",
  en_tiempo: "En tiempo",
  vencido: "Vencido",
  cumplido: "Cumplido",
  con_retraso: "Terminado con retraso",
};

export const tonosCompromiso: Record<EstadoCompromiso, Tono> = {
  sin_fecha: "neutro",
  en_tiempo: "primario",
  vencido: "peligro",
  cumplido: "exito",
  con_retraso: "advertencia",
};

/* ---------- Listado ---------- */

function cumpleTab(ticket: TicketServicio, tab: TabTickets): boolean {
  return tab === "todos" || ticket.estado === tab;
}

export function contarPorTab(tickets: TicketServicio[]): Record<TabTickets, number> {
  const conteos = { todos: tickets.length } as Record<TabTickets, number>;
  for (const estado of ESTADOS_TICKET) {
    conteos[estado] = tickets.filter((ticket) => ticket.estado === estado).length;
  }
  return conteos;
}

export function filtrarTickets(tickets: TicketListado[], tab: TabTickets, filtros: FiltrosTickets): TicketListado[] {
  const termino = normalizar(filtros.busqueda.trim());
  return tickets.filter((ticket) => {
    if (!cumpleTab(ticket, tab)) return false;
    if (filtros.tecnico && String(ticket.idUsuario) !== filtros.tecnico) return false;
    if (filtros.prioridad && ticket.pendiente.prioridad !== filtros.prioridad) return false;
    if (filtros.tipoEquipo && ticket.pendiente.equipo.tipo !== filtros.tipoEquipo) return false;
    if (!termino) return true;
    return coincide(termino, [
      obtenerFolioTicket(ticket),
      ticket.cliente.nombre,
      ticket.pendiente.equipo.modelo,
      ticket.pendiente.equipo.numeroSerie,
    ]);
  });
}

/** Activos: todo lo que no se ha entregado. SLA: terminados a tiempo entre los que ya terminaron. */
export function calcularKpisTickets(tickets: TicketServicio[], fechaCorte: string): KpisTickets {
  let cumplidos = 0;
  let evaluados = 0;
  for (const ticket of tickets) {
    const compromiso = evaluarCompromiso(ticket, fechaCorte);
    if (compromiso === "cumplido" || compromiso === "con_retraso") {
      evaluados += 1;
      if (compromiso === "cumplido") cumplidos += 1;
    }
  }
  return {
    activos: tickets.filter((ticket) => ticket.estado !== "entregado").length,
    enReparacion: tickets.filter((ticket) => ticket.estado === "en_reparacion").length,
    terminados: tickets.filter((ticket) => ticket.estado === "terminado").length,
    slaCumplido: evaluados > 0 ? cumplidos / evaluados : null,
    slaEvaluados: evaluados,
  };
}

/* ---------- Verificación de piezas ---------- */

/** Mismo criterio que inventario: crítico cuando el stock es ≤ 50 % del mínimo (incluye agotados). */
export function esStockCritico(producto: Pick<ProductoTicket, "stockActual" | "stockMinimo">): boolean {
  return producto.stockMinimo > 0 && producto.stockActual * 2 <= producto.stockMinimo;
}

export const etiquetasMotivoFaltante: Record<MotivoFaltante, string> = {
  insuficiente: "Stock insuficiente",
  critico: "Stock crítico",
};

/**
 * Refacciones de tickets abiertos (estado ≠ entregado) que aún no tienen salida de almacén y cuyo
 * producto no alcanza para la cantidad requerida o está en nivel crítico. La mano de obra se omite.
 */
export function calcularFaltantesPiezas(
  requerimientos: RequerimientoPieza[],
  productos: ProductoTicket[],
): FaltantePieza[] {
  const porId = new Map(productos.map((producto) => [producto.id, producto]));
  const faltantes: FaltantePieza[] = [];
  for (const requerimiento of requerimientos) {
    if (requerimiento.estado === "entregado" || requerimiento.conSalida) continue;
    const producto = porId.get(requerimiento.idProducto);
    if (!producto || esManoDeObra(producto)) continue;
    const motivos: MotivoFaltante[] = [];
    if (producto.stockActual < requerimiento.cantidad) motivos.push("insuficiente");
    if (esStockCritico(producto)) motivos.push("critico");
    if (motivos.length === 0) continue;
    faltantes.push({
      idDetalle: requerimiento.idDetalle,
      folio: requerimiento.folio,
      uuidTicket: requerimiento.uuidTicket,
      sku: producto.sku,
      pieza: producto.nombre,
      cantidadRequerida: requerimiento.cantidad,
      stockDisponible: producto.stockActual,
      stockMinimo: producto.stockMinimo,
      motivos,
    });
  }
  return faltantes.sort((a, b) => a.folio.localeCompare(b.folio) || a.pieza.localeCompare(b.pieza, "es"));
}

export function contarTicketsConFaltantes(faltantes: FaltantePieza[]): number {
  return new Set(faltantes.map((faltante) => faltante.uuidTicket)).size;
}

export function obtenerOpcionesTecnico(tickets: TicketListado[]): OpcionSelect[] {
  const porId = new Map<number, string>();
  for (const ticket of tickets) porId.set(ticket.tecnico.id, ticket.tecnico.nombre);
  return [...porId.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], "es"))
    .map(([id, nombre]) => ({ valor: String(id), etiqueta: nombre }));
}

export function esTecnicoAsignable(usuario: Pick<UsuarioTicket, "rol" | "estado">): boolean {
  return usuario.estado === "activo" && ROLES_TECNICOS.has(usuario.rol);
}

/** `evidencias` es texto libre: cada línea no vacía es una captura. */
export function obtenerEvidencias(texto: string | null): string[] {
  if (!texto) return [];
  return texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);
}

/* ---------- Formulario ---------- */

export const LIMITES_NUEVO_TICKET = {
  modelo: 100,
  numeroSerie: 50,
  especificaciones: 150,
  falla: 1000,
};

export function validarTextoObligatorio(valor: string, campo: string): string | undefined {
  if (valor.length > 0 && !valor.trim()) return `Escribe ${campo}; no puede quedar solo con espacios.`;
  return undefined;
}

export function validarNumeroSerie(valor: string): string | undefined {
  const texto = valor.trim();
  if (!texto) return undefined;
  if (!/^[A-Za-z0-9][A-Za-z0-9\-/ ]*$/.test(texto)) {
    return "Usa solo letras, números, guiones o diagonales (ej. 12L-9912A-RX).";
  }
  return undefined;
}

/* ---------- Exportación ---------- */

export const columnasCsvTickets: ColumnaCsv<TicketListado>[] = [
  { encabezado: "Folio", valor: (t) => obtenerFolioTicket(t) },
  { encabezado: "Fecha de recepción", valor: (t) => formatearFechaHora(t.createdAt) },
  { encabezado: "Estado", valor: (t) => etiquetasEstado[t.estado] },
  { encabezado: "Prioridad", valor: (t) => etiquetasPrioridad[t.pendiente.prioridad] },
  { encabezado: "Cliente", valor: (t) => t.cliente.nombre },
  { encabezado: "Teléfono", valor: (t) => t.cliente.telefono },
  { encabezado: "Correo", valor: (t) => t.cliente.correo },
  { encabezado: "Tipo de equipo", valor: (t) => t.pendiente.equipo.tipo },
  { encabezado: "Equipo / modelo", valor: (t) => t.pendiente.equipo.modelo },
  { encabezado: "Número de serie", valor: (t) => t.pendiente.equipo.numeroSerie },
  { encabezado: "Falla reportada", valor: (t) => t.descripcionProblema },
  { encabezado: "Técnico", valor: (t) => t.tecnico.nombre },
  { encabezado: "Ubicación", valor: (t) => t.pendiente.ubicacion },
  { encabezado: "Fecha compromiso", valor: (t) => (t.fechaEntrega ? formatearFechaHora(t.fechaEntrega) : null) },
  { encabezado: "Costo total (MXN)", valor: (t) => (t.costoTotal === null ? null : t.costoTotal.toFixed(2)) },
];
