"use client";

import { Input } from "@heroui/react";
import { FormOverlay, type DatosFormulario } from "@/components/ui/FormOverlay";
import { FormSelect } from "@/components/ui/FormSelect";
import { crearCliente } from "../services/clientes.service";
import type { ClienteListado, TipoCliente } from "../types";
import { etiquetasTipo, normalizarRfc, validarNuevoCliente } from "../utils";

interface NuevoClienteDrawerProps {
  abierto: boolean;
  onCerrar: () => void;
  onCreado: (cliente: ClienteListado) => void;
}

const opcionesTipo = (Object.keys(etiquetasTipo) as TipoCliente[]).map((valor) => ({
  valor,
  etiqueta: `${etiquetasTipo[valor].tipo} (${etiquetasTipo[valor].regimen.toLowerCase()})`,
}));

export function NuevoClienteDrawer({ abierto, onCerrar, onCreado }: NuevoClienteDrawerProps) {
  const enviar = async (datos: DatosFormulario) => {
    const cliente = await crearCliente({
      nombre: datos.nombre,
      telefono: datos.telefono || null,
      correo: datos.correo || null,
      tipo: datos.tipo as TipoCliente,
      ciudad: datos.ciudad,
      rfc: datos.rfc ? normalizarRfc(datos.rfc) : null,
    });
    onCreado(cliente);
  };

  return (
    <FormOverlay
      abierto={abierto}
      onCerrar={onCerrar}
      variante="drawer"
      titulo="Nuevo cliente"
      descripcion="Captura al menos un medio de contacto: teléfono o correo."
      textoEnviar="Registrar cliente"
      validar={validarNuevoCliente}
      onEnviar={enviar}
    >
      <Input
        name="nombre"
        label="Nombre o razón social"
        labelPlacement="outside-top"
        placeholder="Ej. Consultoría Ramos S.A. de C.V."
        variant="bordered"
        maxLength={150}
        isRequired
      />
      <FormSelect name="tipo" etiqueta="Tipo de cliente" opciones={opcionesTipo} isRequired />
      <Input
        name="telefono"
        type="tel"
        label="Teléfono"
        labelPlacement="outside-top"
        placeholder="+52 961 123 4567"
        variant="bordered"
        maxLength={20}
      />
      <Input
        name="correo"
        inputMode="email"
        autoComplete="email"
        label="Correo"
        labelPlacement="outside-top"
        placeholder="contacto@empresa.mx"
        variant="bordered"
        maxLength={255}
      />
      <Input
        name="ciudad"
        label="Ciudad"
        labelPlacement="outside-top"
        placeholder="Ej. Tuxtla Gutiérrez"
        variant="bordered"
        maxLength={100}
        isRequired
      />
      <Input
        name="rfc"
        label="RFC"
        labelPlacement="outside-top"
        placeholder="Opcional · 12 (moral) o 13 (física) caracteres"
        variant="bordered"
        maxLength={13}
        classNames={{ input: "uppercase placeholder:normal-case" }}
      />
    </FormOverlay>
  );
}
