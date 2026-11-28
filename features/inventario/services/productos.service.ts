import { productosMock } from "../mocks";
import type { NuevoProducto, Producto } from "../types";
import { normalizarSku } from "../utils";

/** Solo productos activos (sin soft delete). */
export async function obtenerProductos(): Promise<Producto[]> {
  return productosMock
    .filter((producto) => producto.deletedAt === null)
    .sort((a, b) => a.sku.localeCompare(b.sku, "es"));
}

export async function crearProducto(datos: NuevoProducto): Promise<Producto> {
  const sku = normalizarSku(datos.sku);
  if (productosMock.some((producto) => producto.deletedAt === null && producto.sku === sku)) {
    throw new Error(`Ya existe un producto activo con el SKU ${sku}.`);
  }
  if (datos.precio < 0 || datos.stockActual < 0 || datos.stockMinimo < 0) {
    throw new Error("El precio y los valores de stock no pueden ser negativos.");
  }
  const producto: Producto = {
    ...datos,
    sku,
    id: Math.max(0, ...productosMock.map((p) => p.id)) + 1,
    uuid: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    deletedAt: null,
  };
  productosMock.push(producto);
  return producto;
}
