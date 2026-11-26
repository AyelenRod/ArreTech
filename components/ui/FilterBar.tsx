"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { FilterX, Search } from "lucide-react";

interface FilterBarProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  placeholder?: string;
  onLimpiar?: () => void;
  children?: React.ReactNode;
}

export function FilterBar({
  busqueda,
  onBusquedaChange,
  placeholder = "Buscar…",
  onLimpiar,
  children,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-default-200 bg-white p-3">
      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={busqueda}
        onValueChange={onBusquedaChange}
        size="sm"
        variant="bordered"
        startContent={<Search className="size-4 shrink-0 text-default-400" aria-hidden />}
        className="min-w-0 flex-1 basis-64"
      />
      {children}
      {onLimpiar && (
        <Button isIconOnly size="sm" variant="light" aria-label="Limpiar filtros" onPress={onLimpiar}>
          <FilterX className="size-4 text-default-500" />
        </Button>
      )}
    </div>
  );
}

export interface OpcionSelect {
  valor: string;
  etiqueta: string;
}

interface FilterSelectProps {
  etiqueta: string;
  opciones: OpcionSelect[];
  valor: string;
  onChange: (valor: string) => void;
}

/** Incluye la opción "Todos" con valor "" al inicio. */
export function FilterSelect({ etiqueta, opciones, valor, onChange }: FilterSelectProps) {
  const opcionesConTodos = [{ valor: "", etiqueta: "Todos" }, ...opciones];
  return (
    <Select
      aria-label={etiqueta}
      size="sm"
      variant="bordered"
      disallowEmptySelection
      selectedKeys={[valor]}
      onSelectionChange={(claves) => onChange(String(claves.currentKey ?? ""))}
      renderValue={(items) => (
        <span className="truncate text-sm">
          <span className="text-default-500">{etiqueta}: </span>
          {items[0]?.textValue}
        </span>
      )}
      className="w-full min-w-0 sm:w-48"
    >
      {opcionesConTodos.map((opcion) => (
        <SelectItem key={opcion.valor} textValue={opcion.etiqueta}>
          {opcion.etiqueta}
        </SelectItem>
      ))}
    </Select>
  );
}
