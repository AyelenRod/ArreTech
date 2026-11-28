import type { RolSistema } from "@/lib/mock-session";

/** Enum `tipo_movimiento_enum` de la BD. */
export type TipoMovimiento = "entrada" | "salida";

/** Propuesto: columna `motivo` en `movimientos_inventario`, pendiente de backend. */
export type MotivoMovimiento = "compra" | "venta" | "ticket" | "ajuste" | "devolucion";

/** Valores que guarda `productos.categoria` (varchar); son los grupos de los tabs. */
export type CategoriaProducto = "Refacciones" | "Equipos" | "Consumibles" | "Accesorios";

/** Derivado de `stock_actual` y `stock_minimo`; no es columna. */
export type NivelStock = "optimo" | "bajo" | "critico";

/** Fila de `productos`. `sku`, `marca` y `subcategoria` son columnas propuestas, pendientes de backend. */
export interface Producto {
  id: number;
  uuid: string;
  sku: string;
  nombre: string;
  marca: string;
  descripcion: string | null;
  categoria: CategoriaProducto;
  subcategoria: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface NuevoProducto {
  sku: string;
  nombre: string;
  marca: string;
  descripcion: string | null;
  categoria: CategoriaProducto;
  subcategoria: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
}

/** Fila de `movimientos_inventario`. `motivo` es columna propuesta. */
export interface Movimiento {
  id: number;
  uuid: string;
  idProducto: number;
  idUsuario: number;
  tipo: TipoMovimiento;
  motivo: MotivoMovimiento;
  cantidad: number;
  referencia: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface UsuarioInventario {
  id: number;
  uuid: string;
  nombre: string;
  apellido: string;
  rol: RolSistema;
}

export interface MovimientoListado extends Movimiento {
  producto: Pick<Producto, "sku" | "nombre" | "marca" | "descripcion">;
  responsable: { id: number; nombre: string; nombreCorto: string; rol: RolSistema | null };
  /** Stock del producto justo después del movimiento; se deriva del historial. */
  stockResultante: number;
}

export interface NuevoMovimiento {
  idProducto: number;
  tipo: TipoMovimiento;
  motivo: MotivoMovimiento;
  cantidad: number;
  referencia: string | null;
}

export type TabCatalogo = "todos" | CategoriaProducto;

export interface FiltrosCatalogo {
  busqueda: string;
  subcategoria: string;
  nivel: NivelStock | "";
  marca: string;
}

export interface KpisCatalogo {
  total: number;
  optimo: number;
  bajo: number;
  critico: number;
  agotados: number;
}

export type TabMovimientos = "todos" | "entradas" | "salidas" | "ajustes" | "devoluciones";

export interface FiltrosMovimientos {
  busqueda: string;
  motivo: MotivoMovimiento | "";
  responsable: string;
}

export interface KpisMovimientos {
  total: number;
  entradas: number;
  unidadesEntrada: number;
  salidas: number;
  unidadesSalida: number;
  ajustesYDevoluciones: number;
}
