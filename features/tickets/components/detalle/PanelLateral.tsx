import { BadgeCheck, CircleCheck, CircleDashed, CircleX, ClipboardCheck, History, PenLine, Signature } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import { formatearFechaHora } from "@/lib/format";
import type { TicketDetalle } from "../../types";
import { InicialesUsuario } from "../InicialesUsuario";
import { TarjetaLateral } from "./Tarjeta";

function TecnicoAsignado({ ticket }: { ticket: TicketDetalle }) {
  const usuario = ticket.tecnicoCompleto;
  const activo = usuario?.estado === "activo";
  return (
    <TarjetaLateral
      titulo="Técnico asignado"
      extra={usuario && <StatusBadge etiqueta={activo ? "Activo" : "Inactivo"} tono={activo ? "exito" : "neutro"} />}
    >
      <div className="flex items-center gap-3">
        <InicialesUsuario iniciales={ticket.tecnico.iniciales} grande />
        <div className="min-w-0">
          <p className="font-semibold text-default-900">{ticket.tecnico.nombre}</p>
          <p className="text-sm text-default-500">{ticket.tecnico.especialidad ?? ticket.tecnico.rol ?? "—"}</p>
        </div>
      </div>
      {usuario && (usuario.pendiente.certificacion || usuario.pendiente.estacion) && (
        <div className="flex flex-col gap-2 rounded-lg bg-default-50 p-3 text-xs">
          {usuario.pendiente.certificacion && (
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-default-900">
                <BadgeCheck className="size-4 shrink-0 text-primary" aria-hidden />
                Certificación {usuario.pendiente.certificacion.nombre}
              </p>
              <p className="mt-0.5 text-default-500">{usuario.pendiente.certificacion.descripcion}</p>
            </div>
          )}
          {usuario.pendiente.estacion && (
            <p className="flex flex-wrap justify-between gap-x-3 gap-y-0.5 border-t border-default-200 pt-2">
              <span className="text-default-500">Estación</span>
              <span className="font-semibold text-default-800">{usuario.pendiente.estacion}</span>
            </p>
          )}
        </div>
      )}
    </TarjetaLateral>
  );
}

function ControlCalidad({ ticket }: { ticket: TicketDetalle }) {
  const pruebas = ticket.pendiente.controlCalidad;
  const aprobadas = pruebas.filter((prueba) => prueba.aprobada).length;
  return (
    <TarjetaLateral
      titulo="Control de calidad (QA)"
      icono={<ClipboardCheck className="text-success-600" />}
      extra={
        pruebas.length > 0 && (
          <StatusBadge
            etiqueta={`${aprobadas} / ${pruebas.length} aprobadas`}
            tono={aprobadas === pruebas.length ? "exito" : "advertencia"}
            conPunto={false}
          />
        )
      }
    >
      {pruebas.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-default-500">
          <CircleDashed className="size-4 shrink-0" aria-hidden />
          Las pruebas se registran al terminar la reparación.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pruebas.map((prueba) => (
            <li key={prueba.prueba} className="flex gap-2.5">
              {prueba.aprobada ? (
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-label="Aprobada" />
              ) : (
                <CircleX className="mt-0.5 size-4 shrink-0 text-danger" aria-label="No aprobada" />
              )}
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-default-900">{prueba.prueba}</p>
                <p className="text-xs text-default-500">{prueba.resultado}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </TarjetaLateral>
  );
}

function Trazabilidad({ ticket }: { ticket: TicketDetalle }) {
  const eventos = ticket.pendiente.trazabilidad;
  return (
    <TarjetaLateral
      titulo="Trazabilidad del servicio"
      icono={<History className="text-default-500" />}
      extra={<span className="text-xs text-default-500">{eventos.length} {eventos.length === 1 ? "evento" : "eventos"}</span>}
    >
      <ol className="flex flex-col">
        {eventos.map((evento, indice) => {
          const ultimo = indice === eventos.length - 1;
          return (
            <li key={`${evento.fecha}-${evento.titulo}`} className="relative flex gap-3 pb-4 last:pb-0">
              {!ultimo && <span className="absolute left-[4.5px] top-3 h-full w-px bg-default-200" aria-hidden />}
              <span
                className={cn("relative mt-1.5 size-2.5 shrink-0 rounded-full", ultimo ? "bg-success" : "bg-default-300")}
                aria-hidden
              />
              <div className="min-w-0 text-sm">
                <p className={cn("text-xs", ultimo ? "font-semibold text-success-700" : "text-default-500")}>
                  {formatearFechaHora(evento.fecha)}
                </p>
                <p className="font-semibold text-default-900">{evento.titulo}</p>
                <p className="text-xs text-default-500">{evento.detalle}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </TarjetaLateral>
  );
}

function EntregaFirma({ ticket }: { ticket: TicketDetalle }) {
  const entrega = ticket.pendiente.trazabilidad.find((evento) => evento.estado === "entregado");
  const texto =
    ticket.estado === "terminado"
      ? "Equipo verificado. Listo para la firma de conformidad del cliente en la tableta de mostrador."
      : entrega
        ? `Entregado el ${formatearFechaHora(entrega.fecha)} con firma de conformidad.`
        : "Disponible cuando la reparación quede terminada.";

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-secondary-200 bg-secondary-50/40 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground" aria-hidden>
          <Signature className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-default-900">Entrega con firma digital</h2>
          <p className="text-xs text-default-500">Validación directa en mostrador</p>
        </div>
      </div>
      <p className="text-sm text-default-600">{texto}</p>
      {ticket.estado === "terminado" && (
        /* TODO: abrir la terminal de firma cuando exista el servicio de firma digital. */
        <ActionButton variante="secundario" icono={<PenLine />} className="w-full border-secondary-300 text-secondary-700">
          Abrir terminal de firma digital
        </ActionButton>
      )}
    </section>
  );
}

export function PanelLateral({ ticket }: { ticket: TicketDetalle }) {
  return (
    <aside className="flex min-w-0 flex-col gap-4">
      <TecnicoAsignado ticket={ticket} />
      <ControlCalidad ticket={ticket} />
      <Trazabilidad ticket={ticket} />
      <EntregaFirma ticket={ticket} />
    </aside>
  );
}
