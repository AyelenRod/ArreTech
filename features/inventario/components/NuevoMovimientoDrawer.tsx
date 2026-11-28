"use client";

import { Input, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FormOverlay, type DatosFormulario } from "@/components/ui/FormOverlay";
import { crearMovimiento, type ResultadoMovimiento } from "../services/movimientos.service";
import type { MotivoMovimiento, Producto, TipoMovimiento } from "../types";
import {
  etiquetasMotivo,
  etiquetasTipo,
  formatearUnidades,
  motivosPorTipo,
  stockTrasMovimiento,
  validarCantidad,
} from "../utils";
import { mensajeError } from "./mensajesFormulario";

interface NuevoMovimientoDrawerProps {
  abierto: boolean;
  onCerrar: () => void;
  onCreado: (resultado: ResultadoMovimiento) => void;
  productos: Producto[];
  responsable: string;
}

const ejemplosReferencia: Record<MotivoMovimiento, string> = {
  compra: "Ej. Factura PROV-KIN-20931",
  venta: "Ej. VTA-2026-1194",
  ticket: "Ej. Ticket TCK-2026-0891",
  ajuste: "Ej. Conteo físico: faltante de 1 pieza",
  devolucion: "Ej. Devolución de cliente, venta VTA-2026-1131",
};

export function NuevoMovimientoDrawer({
  abierto,
  onCerrar,
  onCreado,
  productos,
  responsable,
}: NuevoMovimientoDrawerProps) {
  const enviar = async (datos: DatosFormulario) => {
    const resultado = await crearMovimiento({
      idProducto: Number(datos.idProducto),
      tipo: datos.tipo as TipoMovimiento,
      motivo: datos.motivo as MotivoMovimiento,
      cantidad: Number(datos.cantidad),
      referencia: datos.referencia || null,
    });
    onCreado(resultado);
  };

  return (
    <FormOverlay
      abierto={abierto}
      onCerrar={onCerrar}
      variante="drawer"
      titulo="Nuevo movimiento"
      descripcion={`Se registrará a nombre de ${responsable}. Las salidas no pueden dejar el stock en negativo.`}
      textoEnviar="Registrar movimiento"
      onEnviar={enviar}
    >
      <CamposMovimiento productos={productos} />
    </FormOverlay>
  );
}

/** Vive dentro del drawer: su estado se reinicia cada vez que se cierra. */
function CamposMovimiento({ productos }: { productos: Producto[] }) {
  const [idProducto, setIdProducto] = useState("");
  const [tipo, setTipo] = useState<TipoMovimiento>("entrada");
  const [motivo, setMotivo] = useState<MotivoMovimiento | "">("compra");
  const [cantidad, setCantidad] = useState("");

  const producto = productos.find((p) => String(p.id) === idProducto);
  const motivos = motivosPorTipo[tipo];
  const errorCantidad = validarCantidad(cantidad, tipo, producto);
  const cantidadValida = /^\d+$/.test(cantidad.trim()) && !errorCantidad;

  const cambiarTipo = (valor: string) => {
    const nuevoTipo = valor as TipoMovimiento;
    setTipo(nuevoTipo);
    if (motivo && !motivosPorTipo[nuevoTipo].includes(motivo)) setMotivo("");
  };

  return (
    <>
      <Select
        name="idProducto"
        label="Producto"
        labelPlacement="outside-top"
        placeholder="Selecciona un producto"
        variant="bordered"
        isRequired
        selectedKeys={idProducto ? [idProducto] : []}
        onSelectionChange={(claves) => setIdProducto(String(claves.currentKey ?? ""))}
        description={
          producto
            ? `Stock actual: ${formatearUnidades(producto.stockActual)} · Mín. ${formatearUnidades(producto.stockMinimo)}`
            : undefined
        }
        errorMessage={mensajeError("Selecciona el producto.")}
      >
        {productos.map((p) => (
          <SelectItem key={String(p.id)} textValue={`${p.sku} · ${p.nombre}`} description={`${p.sku} · Stock: ${formatearUnidades(p.stockActual)}`}>
            {p.nombre}
          </SelectItem>
        ))}
      </Select>

      <RadioGroup
        name="tipo"
        label="Tipo de movimiento"
        orientation="horizontal"
        value={tipo}
        onValueChange={cambiarTipo}
        isRequired
        classNames={{ label: "text-sm text-foreground" }}
      >
        {(Object.keys(etiquetasTipo) as TipoMovimiento[]).map((valor) => (
          <Radio key={valor} value={valor}>
            {etiquetasTipo[valor]}
          </Radio>
        ))}
      </RadioGroup>

      <Select
        name="motivo"
        label="Motivo"
        labelPlacement="outside-top"
        placeholder="Selecciona el motivo"
        variant="bordered"
        isRequired
        selectedKeys={motivo ? [motivo] : []}
        onSelectionChange={(claves) => setMotivo(String(claves.currentKey ?? "") as MotivoMovimiento | "")}
        errorMessage={mensajeError("Selecciona el motivo.")}
      >
        {motivos.map((valor) => (
          <SelectItem key={valor} textValue={etiquetasMotivo[valor]}>
            {etiquetasMotivo[valor]}
          </SelectItem>
        ))}
      </Select>

      <Input
        name="cantidad"
        label="Cantidad"
        labelPlacement="outside-top"
        placeholder="Ej. 10"
        inputMode="numeric"
        variant="bordered"
        isRequired
        value={cantidad}
        onValueChange={setCantidad}
        endContent={<span className="text-sm text-default-400">uds.</span>}
        validate={(valor) => validarCantidad(valor, tipo, producto)}
        description={
          producto && cantidadValida
            ? `El stock quedará en ${formatearUnidades(stockTrasMovimiento(producto.stockActual, tipo, Number(cantidad)))}.`
            : undefined
        }
        errorMessage={mensajeError("Escribe la cantidad.")}
      />

      <Input
        name="referencia"
        label="Referencia"
        labelPlacement="outside-top"
        placeholder={motivo ? ejemplosReferencia[motivo] : "Factura, venta, ticket o nota breve"}
        variant="bordered"
        maxLength={150}
        description="Opcional. Folio de factura, venta o ticket, o una nota breve."
      />
    </>
  );
}
