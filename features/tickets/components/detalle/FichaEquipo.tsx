import { Building2, Camera, ClipboardPen, Laptop, Mail, MessageSquareWarning, Phone, ScanSearch, ZoomIn } from "lucide-react";
import type { TicketDetalle } from "../../types";
import { obtenerEvidencias } from "../../utils";
import { Dato, Tarjeta } from "./Tarjeta";

function BloqueTexto({ icono, titulo, children }: { icono: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-default-200 bg-default-50 p-4">
      <h3 className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-default-700 [&_svg]:size-4 [&_svg]:shrink-0">
        {icono}
        {titulo}
      </h3>
      <div className="text-sm leading-relaxed text-default-700">{children}</div>
    </div>
  );
}

export function FichaEquipo({ ticket }: { ticket: TicketDetalle }) {
  const { equipo, ubicacion, diagnostico, procedimiento } = ticket.pendiente;
  const { cliente } = ticket;
  const evidencias = obtenerEvidencias(ticket.evidencias);

  return (
    <Tarjeta
      titulo="Ficha del equipo y diagnóstico técnico"
      subtitulo={`${equipo.tipo} recibido en mostrador`}
      icono={<Laptop />}
    >
      <div className="grid gap-4 rounded-lg border border-default-200 p-4 sm:grid-cols-3">
        <Dato etiqueta="Equipo">
          <p className="font-semibold">{equipo.modelo}</p>
          {equipo.especificaciones && <p className="text-xs text-default-500">{equipo.especificaciones}</p>}
        </Dato>
        <Dato etiqueta="Número de serie">
          <p className="break-all font-mono font-semibold">{equipo.numeroSerie ?? "Sin número de serie"}</p>
        </Dato>
        <Dato etiqueta="Ubicación física">
          <p className="font-semibold">{ubicacion}</p>
        </Dato>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-default-200 bg-default-50 p-4">
        <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-default-500" aria-hidden>
            <Building2 className="size-5" />
          </span>
          <span className="min-w-0 font-semibold text-default-900">{cliente.nombre}</span>
        </div>
        {cliente.telefono && (
          <a href={`tel:${cliente.telefono.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 whitespace-nowrap text-sm text-default-600 hover:text-primary">
            <Phone className="size-4 shrink-0" aria-hidden />
            {cliente.telefono}
          </a>
        )}
        {cliente.correo && (
          <a href={`mailto:${cliente.correo}`} className="flex min-w-0 items-center gap-1.5 text-sm text-default-600 hover:text-primary">
            <Mail className="size-4 shrink-0" aria-hidden />
            <span className="break-all">{cliente.correo}</span>
          </a>
        )}
      </div>

      <BloqueTexto icono={<MessageSquareWarning className="text-warning-600" />} titulo="Falla reportada por el cliente">
        {ticket.descripcionProblema}
      </BloqueTexto>

      <BloqueTexto icono={<ScanSearch className="text-danger" />} titulo="Diagnóstico de entrada">
        {diagnostico ?? <span className="text-default-500">Aún sin diagnóstico registrado.</span>}
      </BloqueTexto>

      <BloqueTexto icono={<ClipboardPen className="text-primary" />} titulo="Procedimiento técnico realizado">
        {procedimiento ?? <span className="text-default-500">Se registra al terminar la reparación.</span>}
      </BloqueTexto>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-default-700">
            <Camera className="size-4 shrink-0 text-primary" aria-hidden />
            Evidencia fotográfica de banco técnico
          </h3>
          <span className="text-xs text-default-500">
            {evidencias.length} {evidencias.length === 1 ? "captura registrada" : "capturas registradas"}
          </span>
        </div>
        {evidencias.length === 0 ? (
          <p className="rounded-lg border border-dashed border-default-300 p-4 text-center text-sm text-default-500">
            Sin evidencias registradas.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {evidencias.map((pie, indice) => (
              <li key={`${indice}-${pie}`} className="overflow-hidden rounded-lg border border-default-200">
                {/* TODO: mostrar la imagen cuando `evidencias` guarde URLs de archivos. */}
                <div className="flex aspect-video items-center justify-center bg-default-100 text-default-400" aria-hidden>
                  <Camera className="size-8" />
                </div>
                <p className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-default-800">
                  <span className="min-w-0">{pie}</span>
                  <ZoomIn className="size-3.5 shrink-0 text-primary" aria-hidden />
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Tarjeta>
  );
}
