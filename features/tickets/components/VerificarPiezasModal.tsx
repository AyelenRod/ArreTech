"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { PackageCheck } from "lucide-react";
import Link from "next/link";
import { DataTable, type ColumnaTabla } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { FaltantePieza } from "../types";
import { contarTicketsConFaltantes, etiquetasMotivoFaltante } from "../utils";

interface VerificarPiezasModalProps {
  abierto: boolean;
  onCerrar: () => void;
  faltantes: FaltantePieza[];
}

const columnas: ColumnaTabla<FaltantePieza>[] = [
  {
    clave: "folio",
    encabezado: "Folio",
    sinSalto: true,
    celda: (faltante) => (
      <Link href={`/tickets/${faltante.uuidTicket}`} className="font-semibold text-primary-700 hover:underline">
        {faltante.folio}
      </Link>
    ),
  },
  {
    clave: "pieza",
    encabezado: "Pieza",
    className: "min-w-56",
    celda: (faltante) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-default-900">{faltante.pieza}</span>
        <span className="text-xs text-default-500">{faltante.sku}</span>
      </div>
    ),
  },
  {
    clave: "requerida",
    encabezado: "Requerida",
    alineacion: "derecha",
    sinSalto: true,
    celda: (faltante) => <span className="tabular-nums">{faltante.cantidadRequerida}</span>,
  },
  {
    clave: "stock",
    encabezado: "Stock disponible",
    sinSalto: true,
    celda: (faltante) => (
      <div className="flex flex-col items-start gap-1">
        <span className="font-semibold tabular-nums text-default-900">
          {faltante.stockDisponible} <span className="text-xs font-normal text-default-500">(mín. {faltante.stockMinimo})</span>
        </span>
        <div className="flex flex-wrap gap-1">
          {faltante.motivos.map((motivo) => (
            <StatusBadge
              key={motivo}
              etiqueta={etiquetasMotivoFaltante[motivo]}
              tono={motivo === "insuficiente" ? "peligro" : "advertencia"}
              conPunto={false}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export function VerificarPiezasModal({ abierto, onCerrar, faltantes }: VerificarPiezasModalProps) {
  const tickets = contarTicketsConFaltantes(faltantes);
  return (
    <Modal
      isOpen={abierto}
      onOpenChange={(abrir) => !abrir && onCerrar()}
      size="3xl"
      scrollBehavior="inside"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span>Verificación de piezas</span>
          <span className="text-sm font-normal text-default-500">
            Refacciones de tickets abiertos, aún sin salida de almacén, con stock menor a lo requerido o en nivel
            crítico.
          </span>
        </ModalHeader>
        <ModalBody>
          {faltantes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-default-300 p-8 text-center">
              <PackageCheck className="size-8 text-success" aria-hidden />
              <p className="font-semibold text-default-900">Sin faltantes</p>
              <p className="text-sm text-default-500">Las refacciones pendientes de surtir tienen stock suficiente.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-default-600">
                {faltantes.length} {faltantes.length === 1 ? "refacción" : "refacciones"} en {tickets}{" "}
                {tickets === 1 ? "ticket" : "tickets"}.
              </p>
              <div className="overflow-hidden rounded-lg border border-default-200">
                <DataTable
                  columnas={columnas}
                  filas={faltantes}
                  obtenerClave={(faltante) => String(faltante.idDetalle)}
                  etiquetaAccesible="Piezas con faltante de stock"
                />
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onCerrar} className="font-semibold">
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
