import { clientesMock, ticketsMock, usuariosMock } from "../mocks";
import type { Cliente, ClienteListado, NuevoCliente } from "../types";
import { esTicketActivo } from "../utils";

function nombreCorto(idUsuario: number): string {
  const usuario = usuariosMock[idUsuario];
  return usuario ? `${usuario.nombre[0]}. ${usuario.apellido}` : "—";
}

function armarListado(cliente: Cliente): ClienteListado {
  const tickets = ticketsMock
    .filter((ticket) => ticket.idCliente === cliente.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const ultimo = tickets[0];

  return {
    ...cliente,
    totalTickets: tickets.length,
    ticketsActivos: tickets.filter((ticket) => esTicketActivo(ticket.estado)).length,
    ultimoServicio: ultimo ? { fecha: ultimo.createdAt, atendio: nombreCorto(ultimo.idUsuario) } : null,
  };
}

/** Incluye clientes con soft delete (se muestran como inactivos). */
export async function obtenerClientes(): Promise<ClienteListado[]> {
  return clientesMock
    .map(armarListado)
    .sort((a, b) => a.id - b.id);
}

export async function crearCliente(datos: NuevoCliente): Promise<ClienteListado> {
  if (!datos.telefono && !datos.correo) {
    throw new Error("El cliente necesita al menos un teléfono o un correo.");
  }
  const cliente: Cliente = {
    ...datos,
    id: Math.max(0, ...clientesMock.map((c) => c.id)) + 1,
    uuid: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    deletedAt: null,
  };
  clientesMock.push(cliente);
  return armarListado(cliente);
}
