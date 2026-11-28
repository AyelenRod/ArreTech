import { obtenerSesion } from "@/lib/mock-session";
import { obtenerIniciales } from "@/lib/format";
import {
  FECHA_CORTE_MOCK,
  clientesMock,
  detallesTicketMock,
  productosTicketMock,
  ticketsMock,
  usuariosMock,
} from "../mocks";
import type {
  DatosVerificacionPiezas,
  LineaDetalle,
  RequerimientoPieza,
  NuevoTicket,
  ResumenUsuario,
  TicketDetalle,
  TicketListado,
  TicketServicio,
} from "../types";
import { esManoDeObra, esTecnicoAsignable, obtenerFolioTicket } from "../utils";

function resumirUsuario(idUsuario: number): ResumenUsuario {
  const usuario = usuariosMock.find((u) => u.id === idUsuario);
  if (!usuario) {
    return { id: idUsuario, nombre: "Usuario desconocido", iniciales: "?", rol: null, especialidad: null };
  }
  return {
    id: usuario.id,
    nombre: `${usuario.nombre} ${usuario.apellido}`,
    iniciales: obtenerIniciales(usuario.nombre, usuario.apellido),
    rol: usuario.rol,
    especialidad: usuario.pendiente.especialidad,
  };
}

function armarLineas(idTicket: number): LineaDetalle[] {
  return detallesTicketMock
    .filter((detalle) => detalle.idTicket === idTicket)
    .flatMap((detalle) => {
      const producto = productosTicketMock.find((p) => p.id === detalle.idProducto);
      return producto ? [{ ...detalle, producto, esManoDeObra: esManoDeObra(producto) }] : [];
    });
}

function armarListado(ticket: TicketServicio): TicketListado {
  const cliente = clientesMock.find((c) => c.id === ticket.idCliente);
  const lineas = armarLineas(ticket.id);
  return {
    ...ticket,
    cliente: cliente
      ? { id: cliente.id, nombre: cliente.nombre, telefono: cliente.telefono, correo: cliente.correo }
      : { id: ticket.idCliente, nombre: "Cliente desconocido", telefono: null, correo: null },
    tecnico: resumirUsuario(ticket.idUsuario),
    primerConcepto: lineas.find((linea) => !linea.esManoDeObra)?.producto.nombre ?? lineas[0]?.producto.nombre ?? null,
  };
}

function masRecienteAntes(a: TicketServicio, b: TicketServicio): number {
  return b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
}

/** Instante contra el que se miden vencimientos y tiempo en taller; el backend usará `now()`. */
export async function obtenerFechaCorte(): Promise<string> {
  return FECHA_CORTE_MOCK;
}

export async function obtenerTickets(): Promise<TicketListado[]> {
  return ticketsMock
    .filter((ticket) => ticket.deletedAt === null)
    .sort(masRecienteAntes)
    .map(armarListado);
}

/**
 * Refacciones requeridas por los tickets abiertos y el stock de sus productos.
 * Con backend: `detalle_ticket` JOIN `tickets_servicio` (estado <> 'entregado') JOIN `productos`.
 */
export async function obtenerDatosVerificacionPiezas(): Promise<DatosVerificacionPiezas> {
  const abiertos = ticketsMock.filter((ticket) => ticket.deletedAt === null && ticket.estado !== "entregado");
  const requerimientos: RequerimientoPieza[] = abiertos.flatMap((ticket) =>
    detallesTicketMock
      .filter((detalle) => detalle.idTicket === ticket.id)
      .map((detalle) => ({
        idDetalle: detalle.id,
        folio: obtenerFolioTicket(ticket),
        uuidTicket: ticket.uuid,
        estado: ticket.estado,
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad,
        conSalida: detalle.pendiente.folioMovimiento !== null,
      })),
  );
  const idsRequeridos = new Set(requerimientos.map((requerimiento) => requerimiento.idProducto));
  const productos = productosTicketMock.filter((producto) => idsRequeridos.has(producto.id)).map((producto) => ({ ...producto }));
  return { requerimientos, productos };
}

export async function obtenerIdsTickets(): Promise<string[]> {
  return ticketsMock.filter((ticket) => ticket.deletedAt === null).map((ticket) => ticket.uuid);
}

/** Busca por `uuid`, el identificador externo de la BD. */
export async function obtenerTicket(uuid: string): Promise<TicketDetalle | null> {
  const ticket = ticketsMock.find((t) => t.uuid === uuid && t.deletedAt === null);
  if (!ticket) return null;
  return {
    ...armarListado(ticket),
    recepcion: resumirUsuario(ticket.pendiente.idUsuarioRecepcion),
    tecnicoCompleto: usuariosMock.find((u) => u.id === ticket.idUsuario) ?? null,
    lineas: armarLineas(ticket.id),
    fechaCorte: FECHA_CORTE_MOCK,
  };
}

/**
 * `id_usuario` es obligatorio en la BD: si no se elige técnico, queda a nombre de quien registra.
 * Quien registra se guarda en la columna propuesta `id_usuario_recepcion`.
 */
export async function crearTicket(datos: NuevoTicket): Promise<TicketListado> {
  const cliente = clientesMock.find((c) => c.id === datos.idCliente);
  if (!cliente) throw new Error("El cliente seleccionado ya no existe.");
  if (!datos.descripcionProblema.trim()) throw new Error("Describe la falla reportada.");
  if (!datos.equipo.modelo.trim()) throw new Error("Indica el equipo o modelo.");

  const sesion = await obtenerSesion();
  const registra = usuariosMock.find((u) => u.uuid === sesion.uuid);
  if (!registra) throw new Error("No se encontró al usuario de la sesión.");

  const idTecnico = datos.idUsuario ?? registra.id;
  const tecnico = usuariosMock.find((u) => u.id === idTecnico);
  if (!tecnico || !esTecnicoAsignable(tecnico)) {
    throw new Error("El técnico seleccionado no está activo o no puede atender tickets.");
  }

  const ahora = new Date().toISOString();
  const id = Math.max(0, ...ticketsMock.map((t) => t.id)) + 1;
  const ticket: TicketServicio = {
    id,
    uuid: crypto.randomUUID(),
    idCliente: cliente.id,
    idUsuario: tecnico.id,
    descripcionProblema: datos.descripcionProblema.trim(),
    estado: "recibido",
    fechaEntrega: datos.fechaEntrega,
    costoTotal: null,
    evidencias: null,
    createdAt: ahora,
    updatedAt: ahora,
    deletedAt: null,
    pendiente: {
      prioridad: datos.prioridad,
      equipo: datos.equipo,
      ubicacion: "Recepción / triaje",
      idUsuarioRecepcion: registra.id,
      diagnostico: null,
      procedimiento: null,
      garantiaDias: 30,
      controlCalidad: [],
      trazabilidad: [
        {
          fecha: ahora,
          estado: "recibido",
          titulo: "Recepción en mostrador",
          detalle: `Registrado por ${registra.nombre} ${registra.apellido} · ${obtenerFolioTicket({ id, createdAt: ahora })}`,
        },
      ],
    },
  };
  ticketsMock.push(ticket);
  return armarListado(ticket);
}
