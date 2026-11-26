"use client";

import { Select, SelectItem } from "@heroui/react";
import type { OpcionSelect } from "./FilterBar";

interface FormSelectProps {
  name: string;
  etiqueta: string;
  opciones: OpcionSelect[];
  placeholder?: string;
  valorInicial?: string;
  isRequired?: boolean;
  descripcion?: string;
}

export function FormSelect({
  name,
  etiqueta,
  opciones,
  placeholder = "Selecciona una opción",
  valorInicial,
  isRequired = false,
  descripcion,
}: FormSelectProps) {
  return (
    <Select
      name={name}
      label={etiqueta}
      labelPlacement="outside-top"
      placeholder={placeholder}
      variant="bordered"
      defaultSelectedKeys={valorInicial ? [valorInicial] : undefined}
      isRequired={isRequired}
      description={descripcion}
      errorMessage={({ validationDetails, validationErrors }) =>
        validationDetails.valueMissing ? `Selecciona ${etiqueta.toLowerCase()}.` : validationErrors.join(" ")
      }
    >
      {opciones.map((opcion) => (
        <SelectItem key={opcion.valor} textValue={opcion.etiqueta}>
          {opcion.etiqueta}
        </SelectItem>
      ))}
    </Select>
  );
}
