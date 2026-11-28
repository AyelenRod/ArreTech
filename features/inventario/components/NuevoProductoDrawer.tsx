"use client";

import { Input, Textarea } from "@heroui/react";
import { FormOverlay, type DatosFormulario } from "@/components/ui/FormOverlay";
import { FormSelect } from "@/components/ui/FormSelect";
import { crearProducto } from "../services/productos.service";
import type { CategoriaProducto, Producto } from "../types";
import {
  CATEGORIAS,
  leerPrecio,
  normalizarSku,
  validarEnteroNoNegativo,
  validarPrecio,
  validarSku,
} from "../utils";
import { mensajeError } from "./mensajesFormulario";

interface NuevoProductoDrawerProps {
  abierto: boolean;
  onCerrar: () => void;
  onCreado: (producto: Producto) => void;
  skusExistentes: string[];
}

const opcionesCategoria = CATEGORIAS.map((categoria) => ({ valor: categoria, etiqueta: categoria }));

export function NuevoProductoDrawer({ abierto, onCerrar, onCreado, skusExistentes }: NuevoProductoDrawerProps) {
  const enviar = async (datos: DatosFormulario) => {
    const producto = await crearProducto({
      sku: normalizarSku(datos.sku),
      nombre: datos.nombre,
      marca: datos.marca,
      descripcion: datos.descripcion || null,
      categoria: datos.categoria as CategoriaProducto,
      subcategoria: datos.subcategoria,
      precio: leerPrecio(datos.precio),
      stockActual: Number(datos.stockActual),
      stockMinimo: Number(datos.stockMinimo),
    });
    onCreado(producto);
  };

  return (
    <FormOverlay
      abierto={abierto}
      onCerrar={onCerrar}
      variante="drawer"
      titulo="Nuevo producto"
      descripcion="Alta de refacciones, equipos, consumibles o accesorios en el catálogo."
      textoEnviar="Registrar producto"
      onEnviar={enviar}
    >
      <Input
        name="sku"
        label="SKU"
        labelPlacement="outside-top"
        placeholder="Ej. SKU-SSD-0480"
        variant="bordered"
        maxLength={50}
        isRequired
        validate={(valor) => validarSku(valor, skusExistentes)}
        errorMessage={mensajeError("Escribe el SKU del producto.")}
        classNames={{ input: "uppercase placeholder:normal-case" }}
      />
      <Input
        name="nombre"
        label="Nombre"
        labelPlacement="outside-top"
        placeholder="Ej. SSD Kingston A400 480 GB"
        variant="bordered"
        maxLength={150}
        isRequired
        errorMessage={mensajeError("Escribe el nombre del producto.")}
      />
      <Input
        name="marca"
        label="Marca"
        labelPlacement="outside-top"
        placeholder="Ej. Kingston"
        variant="bordered"
        maxLength={100}
        isRequired
        errorMessage={mensajeError("Escribe la marca.")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelect name="categoria" etiqueta="Categoría" opciones={opcionesCategoria} isRequired />
        <Input
          name="subcategoria"
          label="Subcategoría"
          labelPlacement="outside-top"
          placeholder="Ej. Almacenamiento"
          variant="bordered"
          maxLength={100}
          isRequired
          errorMessage={mensajeError("Escribe la subcategoría.")}
        />
      </div>
      <Textarea
        name="descripcion"
        label="Descripción"
        labelPlacement="outside"
        placeholder="Especificaciones y garantía. Ej. SATA III, 2.5 in · Garantía 3 años"
        variant="bordered"
        minRows={2}
      />
      <Input
        name="precio"
        label="Precio de venta (MXN)"
        labelPlacement="outside-top"
        placeholder="0.00"
        inputMode="decimal"
        variant="bordered"
        isRequired
        startContent={<span className="text-sm text-default-400">$</span>}
        validate={validarPrecio}
        errorMessage={mensajeError("Escribe el precio.")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="stockActual"
          label="Stock inicial"
          labelPlacement="outside-top"
          inputMode="numeric"
          variant="bordered"
          defaultValue="0"
          isRequired
          validate={(valor) => validarEnteroNoNegativo(valor, "stock inicial")}
          errorMessage={mensajeError("Escribe el stock inicial (puede ser 0).")}
        />
        <Input
          name="stockMinimo"
          label="Stock mínimo"
          labelPlacement="outside-top"
          inputMode="numeric"
          variant="bordered"
          defaultValue="0"
          isRequired
          description="Con este valor o menos se marca en stock bajo."
          validate={(valor) => validarEnteroNoNegativo(valor, "stock mínimo")}
          errorMessage={mensajeError("Escribe el stock mínimo (puede ser 0).")}
        />
      </div>
    </FormOverlay>
  );
}
