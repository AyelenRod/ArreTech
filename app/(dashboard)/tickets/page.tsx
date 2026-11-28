import type { Metadata } from "next";
import { TicketsView } from "@/features/tickets/components/TicketsView";
import { obtenerCatalogosNuevoTicket } from "@/features/tickets/services/catalogos.service";
import {
  obtenerDatosVerificacionPiezas,
  obtenerFechaCorte,
  obtenerTickets,
} from "@/features/tickets/services/tickets.service";
import { obtenerSesion } from "@/lib/mock-session";

export const metadata: Metadata = {
  title: "Tickets de servicio",
};

export default async function TicketsPage() {
  const [tickets, catalogos, verificacionPiezas, fechaCorte, sesion] = await Promise.all([
    obtenerTickets(),
    obtenerCatalogosNuevoTicket(),
    obtenerDatosVerificacionPiezas(),
    obtenerFechaCorte(),
    obtenerSesion(),
  ]);
  return (
    <TicketsView
      ticketsIniciales={tickets}
      catalogos={catalogos}
      verificacionPiezas={verificacionPiezas}
      fechaCorte={fechaCorte}
      registradoPor={`${sesion.nombre} ${sesion.apellido}`}
    />
  );
}
