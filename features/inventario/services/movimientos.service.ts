import { obtenerSesion } from "@/lib/mock-session";
import { movimientosMock, productosMock, usuariosMock } from "../mocks";
import type { Movimiento, MovimientoListado, NuevoMovimiento, Producto } from "../types";
import { cantidadConSigno, formatearUnidades, motivosPorTipo, stockTrasMovimiento } from "../utils";

function armarResponsable(idUsuario: number): MovimientoListado["responsable"] {
  const usuario = usuariosMock.find((u) => u.id === idUsuario);
  if (!usuario) return { id: idUsuario, nombre: "Usuario desconocido", nombreCorto: "—", rol: null };
  return {
    id: usuario.id,
    nombre: `${usuario.nombre} ${usuario.apellido}`,
    nombreCorto: `${usuario.nombre[0]}. ${usuario.apellido}`,
    rol: usuario.rol,
  };
}

function armarListado(movimiento: Movimiento, producto: Producto, stockResultante: number): MovimientoListado {
  return {
    ...movimiento,
    producto: {
      sku: producto.sku,
      nombre: producto.nombre,
      marca: producto.marca,
      descripcion: producto.descripcion,
    },
    responsable: armarResponsable(movimiento.idUsuario),
    stockResultante,
  };
}

function masRecienteAntes(a: Movimiento, b: Movimiento): number {
  return b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
}

/**
 * El stock tras cada movimiento se reconstruye hacia atrás desde `stock_actual`
 * (en SQL: suma acumulada con una función de ventana por producto).
 */
export async function obtenerMovimientos(): Promise<MovimientoListado[]> {
  const activos = movimientosMock.filter((m) => m.deletedAt === null).sort(masRecienteAntes);
  const stockPorProducto = new Map(productosMock.map((p) => [p.id, p.stockActual]));
  const listado: MovimientoListado[] = [];

  for (const movimiento of activos) {
    const producto = productosMock.find((p) => p.id === movimiento.idProducto);
    if (!producto) continue;
    const stockDespues = stockPorProducto.get(producto.id) ?? 0;
    listado.push(armarListado(movimiento, producto, stockDespues));
    stockPorProducto.set(producto.id, stockDespues - cantidadConSigno(movimiento));
  }
  return listado;
}

export interface ResultadoMovimiento {
  movimiento: MovimientoListado;
  producto: Producto;
}

/** El responsable es el usuario de la sesión; el backend lo tomará del token. */
export async function crearMovimiento(datos: NuevoMovimiento): Promise<ResultadoMovimiento> {
  const producto = productosMock.find((p) => p.id === datos.idProducto && p.deletedAt === null);
  if (!producto) throw new Error("El producto seleccionado ya no existe en el catálogo.");
  if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error("La cantidad debe ser un número entero mayor que 0.");
  }
  if (!motivosPorTipo[datos.tipo].includes(datos.motivo)) {
    throw new Error("El motivo no corresponde al tipo de movimiento.");
  }
  const stockNuevo = stockTrasMovimiento(producto.stockActual, datos.tipo, datos.cantidad);
  if (stockNuevo < 0) {
    throw new Error(
      `El stock de ${producto.nombre} cambió: ahora hay ${formatearUnidades(producto.stockActual)} y la salida lo dejaría negativo.`,
    );
  }

  const sesion = await obtenerSesion();
  const usuario = usuariosMock.find((u) => u.uuid === sesion.uuid);
  if (!usuario) throw new Error("No se encontró al usuario de la sesión.");

  const movimiento: Movimiento = {
    ...datos,
    id: Math.max(0, ...movimientosMock.map((m) => m.id)) + 1,
    uuid: crypto.randomUUID(),
    idUsuario: usuario.id,
    createdAt: new Date().toISOString(),
    deletedAt: null,
  };
  movimientosMock.push(movimiento);
  producto.stockActual = stockNuevo;

  return { movimiento: armarListado(movimiento, producto, stockNuevo), producto: { ...producto } };
}
