import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TicketDetalleView } from "@/features/tickets/components/detalle/TicketDetalleView";
import { obtenerIdsTickets, obtenerTicket } from "@/features/tickets/services/tickets.service";
import { obtenerFolioTicket } from "@/features/tickets/utils";

export async function generateStaticParams() {
  const ids = await obtenerIdsTickets();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/tickets/[id]">): Promise<Metadata> {
  const { id } = await params;
  const ticket = await obtenerTicket(id);
  return { title: ticket ? `Ticket ${obtenerFolioTicket(ticket)}` : "Ticket no encontrado" };
}

export default async function TicketPage({ params }: PageProps<"/tickets/[id]">) {
  const { id } = await params;
  const ticket = await obtenerTicket(id);
  if (!ticket) notFound();
  return <TicketDetalleView ticket={ticket} />;
}
