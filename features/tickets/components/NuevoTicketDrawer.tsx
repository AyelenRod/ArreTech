"use client";

import { Input, Radio, RadioGroup, Select, SelectItem, Textarea } from "@heroui/react";
import { FormOverlay, type DatosFormulario } from "@/components/ui/FormOverlay";
import { FormSelect } from "@/components/ui/FormSelect";
import type { CatalogosNuevoTicket } from "../services/catalogos.service";
import { crearTicket } from "../services/tickets.service";
import type { PrioridadTicket, TicketListado, TipoEquipo } from "../types";
import {
  LIMITES_NUEVO_TICKET,
  TIPOS_EQUIPO,
  etiquetasPrioridad,
  validarNumeroSerie,
  validarTextoObligatorio,
} from "../utils";
import { mensajeError } from "./mensajesFormulario";

export interface NuevoTicketDrawerProps {
  abierto: boolean;
  onCerrar: () => void;
  onCreado?: (ticket: TicketListado) => void;
  catalogos: CatalogosNuevoTicket;
  /** Nombre de quien registra (usuario de la sesión). */
  registradoPor: string;
}

const opcionesTipoEquipo = TIPOS_EQUIPO.map((valor) => ({ valor, etiqueta: valor }));

/** Reutilizable desde cualquier vista: solo necesita los catálogos y avisa al crear. */
export function NuevoTicketDrawer({ abierto, onCerrar, onCreado, catalogos, registradoPor }: NuevoTicketDrawerProps) {
  const enviar = async (datos: DatosFormulario) => {
    const ticket = await crearTicket({
      idCliente: Number(datos.idCliente),
      idUsuario: datos.idUsuario ? Number(datos.idUsuario) : null,
      descripcionProblema: datos.falla,
      fechaEntrega: datos.fechaEntrega ? new Date(datos.fechaEntrega).toISOString() : null,
      prioridad: (datos.prioridad || "media") as PrioridadTicket,
      equipo: {
        tipo: (datos.tipoEquipo || "Laptop") as TipoEquipo,
        modelo: datos.modelo,
        numeroSerie: datos.numeroSerie || null,
        especificaciones: datos.especificaciones || null,
      },
    });
    onCreado?.(ticket);
  };

  return (
    <FormOverlay
      abierto={abierto}
      onCerrar={onCerrar}
      variante="drawer"
      titulo="Abrir nuevo ticket"
      descripcion={`Se registrará en estado Recibido a nombre de ${registradoPor}.`}
      textoEnviar="Abrir ticket"
      onEnviar={enviar}
    >
      <CamposTicket catalogos={catalogos} />
    </FormOverlay>
  );
}

/** Vive dentro del drawer: su estado y sus errores se reinician cada vez que se cierra. */
function CamposTicket({ catalogos }: { catalogos: CatalogosNuevoTicket }) {
  return (
    <>
      <Select
        name="idCliente"
        label="Cliente"
        labelPlacement="outside-top"
        placeholder="Selecciona un cliente"
        variant="bordered"
        isRequired
        errorMessage={mensajeError("Selecciona el cliente.")}
      >
        {catalogos.clientes.map((cliente) => (
          <SelectItem key={cliente.valor} textValue={cliente.etiqueta}>
            {cliente.etiqueta}
          </SelectItem>
        ))}
      </Select>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
        <FormSelect name="tipoEquipo" etiqueta="Tipo de equipo" opciones={opcionesTipoEquipo} valorInicial="Laptop" isRequired />
        <Input
          name="modelo"
          label="Equipo / modelo"
          labelPlacement="outside-top"
          placeholder="Ej. Dell Latitude 5420"
          variant="bordered"
          isRequired
          maxLength={LIMITES_NUEVO_TICKET.modelo}
          validate={(valor) => validarTextoObligatorio(valor, "el equipo o modelo")}
          errorMessage={mensajeError("Escribe el equipo o modelo.")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="numeroSerie"
          label="Número de serie"
          labelPlacement="outside-top"
          placeholder="Ej. 12L-9912A-RX"
          variant="bordered"
          maxLength={LIMITES_NUEVO_TICKET.numeroSerie}
          validate={validarNumeroSerie}
          description="Opcional."
        />
        <Input
          name="especificaciones"
          label="Especificaciones"
          labelPlacement="outside-top"
          placeholder="Ej. Core i5 · 16 GB RAM"
          variant="bordered"
          maxLength={LIMITES_NUEVO_TICKET.especificaciones}
          description="Opcional."
        />
      </div>

      <Textarea
        name="falla"
        label="Falla reportada"
        labelPlacement="outside"
        placeholder="Describe lo que reporta el cliente (ej. no enciende tras conectar el cargador)."
        variant="bordered"
        isRequired
        minRows={3}
        maxLength={LIMITES_NUEVO_TICKET.falla}
        validate={(valor) => validarTextoObligatorio(valor, "la falla reportada")}
        errorMessage={mensajeError("Describe la falla reportada.")}
      />

      <FormSelect
        name="idUsuario"
        etiqueta="Técnico asignado"
        placeholder="Asignar después"
        opciones={catalogos.tecnicos}
        descripcion="Opcional. Si lo dejas vacío, el ticket queda a tu nombre hasta reasignarlo."
      />

      <RadioGroup
        name="prioridad"
        label="Prioridad"
        orientation="horizontal"
        defaultValue="media"
        classNames={{ label: "text-sm text-foreground" }}
      >
        {(Object.keys(etiquetasPrioridad) as PrioridadTicket[]).map((valor) => (
          <Radio key={valor} value={valor}>
            {etiquetasPrioridad[valor]}
          </Radio>
        ))}
      </RadioGroup>

      <Input
        name="fechaEntrega"
        type="datetime-local"
        label="Fecha compromiso de entrega"
        labelPlacement="outside-top"
        variant="bordered"
        description="Opcional. Se acuerda con el cliente al recibir el equipo."
      />
    </>
  );
}
