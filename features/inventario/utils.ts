import type { ColumnaCsv } from "@/lib/csv";
import type { Tono } from "@/components/ui/tonos";
import type {
  CategoriaProducto,
  FiltrosCatalogo,
  FiltrosMovimientos,
  KpisCatalogo,
  KpisMovimientos,
  MotivoMovimiento,
  MovimientoListado,
  NivelStock,
  Producto,
  TabCatalogo,
  TabMovimientos,
  TipoMovimiento,
} from "./types";

export const TAMANO_PAGINA = 10;

/** Límites de las columnas: `integer` de PostgreSQL y `decimal(10,2)`. */
const MAXIMO_ENTERO = 2_147_483_647;
const MAXIMO_PRECIO = 99_999_999.99;

export const CATEGORIAS: CategoriaProducto[] = ["Refacciones", "Equipos", "Consumibles", "Accesorios"];

export const etiquetasNivel: Record<NivelStock, string> = {
  optimo: "Stock óptimo",
  bajo: "Stock bajo",
  critico: "Stock crítico",
};

export const tonosNivel: Record<NivelStock, Tono> = {
  optimo: "exito",
  bajo: "advertencia",
  critico: "peligro",
};

export const etiquetasTipo: Record<TipoMovimiento, string> = {
  entrada: "Entrada",
  salida: "Salida",
};

export const etiquetasMotivo: Record<MotivoMovimiento, string> = {
  compra: "Compra a proveedor",
  venta: "Venta",
  ticket: "Ticket de servicio",
  ajuste: "Ajuste de inventario",
  devolucion: "Devolución",
};

/** Propuesta de CHECK entre `tipo_movimiento` y `motivo`. */
export const motivosPorTipo: Record<TipoMovimiento, MotivoMovimiento[]> = {
  entrada: ["compra", "ajuste", "devolucion"],
  salida: ["venta", "ticket", "ajuste", "devolucion"],
};

export const FILTROS_CATALOGO_INICIALES: FiltrosCatalogo = {
  busqueda: "",
  subcategoria: "",
  nivel: "",
  marca: "",
};

export const FILTROS_MOVIMIENTOS_INICIALES: FiltrosMovimientos = {
  busqueda: "",
  motivo: "",
  responsable: "",
};

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function coincide(termino: string, textos: (string | null | undefined)[]): boolean {
  return textos.some((texto) => texto && normalizar(texto).includes(termino));
}

export function formatearUnidades(cantidad: number): string {
  return `${cantidad.toLocaleString("es-MX")} ${Math.abs(cantidad) === 1 ? "ud." : "uds."}`;
}

/* ---------- Catálogo ---------- */

/** Crítico: ≤ 50 % del mínimo (incluye agotados). Bajo: hasta el mínimo. Óptimo: por encima. */
export function obtenerNivelStock(producto: Pick<Producto, "stockActual" | "stockMinimo">): NivelStock {
  if (producto.stockActual * 2 <= producto.stockMinimo) return "critico";
  if (producto.stockActual <= producto.stockMinimo) return "bajo";
  return "optimo";
}

function cumpleTabCatalogo(producto: Producto, tab: TabCatalogo): boolean {
  return tab === "todos" || producto.categoria === tab;
}

export function contarPorCategoria(productos: Producto[]): Record<TabCatalogo, number> {
  const conteos = { todos: productos.length } as Record<TabCatalogo, number>;
  for (const categoria of CATEGORIAS) {
    conteos[categoria] = productos.filter((producto) => producto.categoria === categoria).length;
  }
  return conteos;
}

export function filtrarProductos(productos: Producto[], tab: TabCatalogo, filtros: FiltrosCatalogo): Producto[] {
  const termino = normalizar(filtros.busqueda.trim());
  return productos.filter((producto) => {
    if (!cumpleTabCatalogo(producto, tab)) return false;
    if (filtros.subcategoria && producto.subcategoria !== filtros.subcategoria) return false;
    if (filtros.marca && producto.marca !== filtros.marca) return false;
    if (filtros.nivel && obtenerNivelStock(producto) !== filtros.nivel) return false;
    if (!termino) return true;
    return coincide(termino, [
      producto.sku,
      producto.nombre,
      producto.marca,
      producto.categoria,
      producto.subcategoria,
      producto.descripcion,
    ]);
  });
}

export function calcularKpisCatalogo(productos: Producto[]): KpisCatalogo {
  const kpis: KpisCatalogo = { total: productos.length, optimo: 0, bajo: 0, critico: 0, agotados: 0 };
  for (const producto of productos) {
    kpis[obtenerNivelStock(producto)] += 1;
    if (producto.stockActual === 0) kpis.agotados += 1;
  }
  return kpis;
}

function valoresUnicos(valores: string[]): string[] {
  return [...new Set(valores)].sort((a, b) => a.localeCompare(b, "es"));
}

export function obtenerSubcategorias(productos: Producto[], tab: TabCatalogo): string[] {
  return valoresUnicos(
    productos.filter((producto) => cumpleTabCatalogo(producto, tab)).map((producto) => producto.subcategoria),
  );
}

export function obtenerMarcas(productos: Producto[]): string[] {
  return valoresUnicos(productos.map((producto) => producto.marca));
}

export function normalizarSku(sku: string): string {
  return sku.trim().toUpperCase();
}

const PATRON_SKU = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const PATRON_PRECIO = /^\d+(?:\.\d{1,2})?$/;
const PATRON_ENTERO = /^\d+$/;

export function validarSku(valor: string, skusExistentes: string[]): string | undefined {
  if (!valor.trim()) return undefined;
  const sku = normalizarSku(valor);
  if (!PATRON_SKU.test(sku)) {
    return "Usa solo letras, números y guiones, sin espacios (ej. SKU-SSD-0480).";
  }
  if (skusExistentes.includes(sku)) return `Ya existe un producto con el SKU ${sku}.`;
  return undefined;
}

export function validarPrecio(valor: string): string | undefined {
  const texto = valor.trim().replace(/,/g, "");
  if (!texto) return undefined;
  if (texto.startsWith("-")) return "El precio no puede ser negativo.";
  if (!PATRON_PRECIO.test(texto)) return "Escribe un precio válido, con hasta 2 decimales (ej. 899.50).";
  if (Number(texto) > MAXIMO_PRECIO) return "El precio no puede superar $99,999,999.99.";
  return undefined;
}

export function leerPrecio(valor: string): number {
  return Number(valor.trim().replace(/,/g, ""));
}

/** Para `stock_actual` y `stock_minimo`: CHECK ≥ 0. */
export function validarEnteroNoNegativo(valor: string, campo: string): string | undefined {
  const texto = valor.trim();
  if (!texto) return undefined;
  if (texto.startsWith("-")) return `El ${campo} no puede ser negativo.`;
  if (!PATRON_ENTERO.test(texto)) return `El ${campo} debe ser un número entero, sin decimales.`;
  if (Number(texto) > MAXIMO_ENTERO) return `El ${campo} es demasiado grande.`;
  return undefined;
}

export const columnasCsvProductos: ColumnaCsv<Producto>[] = [
  { encabezado: "SKU", valor: (p) => p.sku },
  { encabezado: "Producto", valor: (p) => p.nombre },
  { encabezado: "Marca", valor: (p) => p.marca },
  { encabezado: "Descripción", valor: (p) => p.descripcion },
  { encabezado: "Categoría", valor: (p) => p.categoria },
  { encabezado: "Subcategoría", valor: (p) => p.subcategoria },
  { encabezado: "Precio (MXN)", valor: (p) => p.precio.toFixed(2) },
  { encabezado: "Stock actual", valor: (p) => p.stockActual },
  { encabezado: "Stock mínimo", valor: (p) => p.stockMinimo },
  { encabezado: "Nivel de stock", valor: (p) => etiquetasNivel[obtenerNivelStock(p)] },
];

/* ---------- Movimientos ---------- */

export function obtenerFolioMovimiento(movimiento: { id: number; createdAt: string }): string {
  return `MOV-${movimiento.createdAt.slice(0, 4)}-${String(movimiento.id).padStart(4, "0")}`;
}

/** Cantidad con signo según el tipo: la BD guarda siempre `cantidad > 0`. */
export function cantidadConSigno(movimiento: { tipo: TipoMovimiento; cantidad: number }): number {
  return movimiento.tipo === "entrada" ? movimiento.cantidad : -movimiento.cantidad;
}

export function stockTrasMovimiento(stockActual: number, tipo: TipoMovimiento, cantidad: number): number {
  return stockActual + cantidadConSigno({ tipo, cantidad });
}

function cumpleTabMovimientos(movimiento: MovimientoListado, tab: TabMovimientos): boolean {
  switch (tab) {
    case "entradas":
      return movimiento.tipo === "entrada";
    case "salidas":
      return movimiento.tipo === "salida";
    case "ajustes":
      return movimiento.motivo === "ajuste";
    case "devoluciones":
      return movimiento.motivo === "devolucion";
    default:
      return true;
  }
}

export function contarPorTabMovimientos(movimientos: MovimientoListado[]): Record<TabMovimientos, number> {
  const tabs: TabMovimientos[] = ["todos", "entradas", "salidas", "ajustes", "devoluciones"];
  return Object.fromEntries(
    tabs.map((tab) => [tab, movimientos.filter((movimiento) => cumpleTabMovimientos(movimiento, tab)).length]),
  ) as Record<TabMovimientos, number>;
}

export function filtrarMovimientos(
  movimientos: MovimientoListado[],
  tab: TabMovimientos,
  filtros: FiltrosMovimientos,
): MovimientoListado[] {
  const termino = normalizar(filtros.busqueda.trim());
  return movimientos.filter((movimiento) => {
    if (!cumpleTabMovimientos(movimiento, tab)) return false;
    if (filtros.motivo && movimiento.motivo !== filtros.motivo) return false;
    if (filtros.responsable && String(movimiento.responsable.id) !== filtros.responsable) return false;
    if (!termino) return true;
    return coincide(termino, [
      obtenerFolioMovimiento(movimiento),
      movimiento.producto.sku,
      movimiento.producto.nombre,
      movimiento.responsable.nombre,
      movimiento.referencia,
    ]);
  });
}

export function calcularKpisMovimientos(movimientos: MovimientoListado[]): KpisMovimientos {
  const kpis: KpisMovimientos = {
    total: movimientos.length,
    entradas: 0,
    unidadesEntrada: 0,
    salidas: 0,
    unidadesSalida: 0,
    ajustesYDevoluciones: 0,
  };
  for (const movimiento of movimientos) {
    if (movimiento.tipo === "entrada") {
      kpis.entradas += 1;
      kpis.unidadesEntrada += movimiento.cantidad;
    } else {
      kpis.salidas += 1;
      kpis.unidadesSalida += movimiento.cantidad;
    }
    if (movimiento.motivo === "ajuste" || movimiento.motivo === "devolucion") kpis.ajustesYDevoluciones += 1;
  }
  return kpis;
}

export function obtenerResponsables(movimientos: MovimientoListado[]): { valor: string; etiqueta: string }[] {
  const porId = new Map<number, MovimientoListado["responsable"]>();
  for (const movimiento of movimientos) porId.set(movimiento.responsable.id, movimiento.responsable);
  return [...porId.values()]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .map((responsable) => ({ valor: String(responsable.id), etiqueta: responsable.rol ? `${responsable.nombre} (${responsable.rol})` : responsable.nombre }));
}

/** Productos que hoy están en stock crítico y tienen al menos una salida registrada. */
export function obtenerCriticosConSalidas(productos: Producto[], movimientos: MovimientoListado[]): Producto[] {
  const conSalidas = new Set(movimientos.filter((m) => m.tipo === "salida").map((m) => m.idProducto));
  return productos.filter((producto) => conSalidas.has(producto.id) && obtenerNivelStock(producto) === "critico");
}

/** CHECK `chk_movimientos_cantidad_positiva` y `chk_productos_stock_actual_no_negativo`. */
export function validarCantidad(
  valor: string,
  tipo: TipoMovimiento,
  producto: Pick<Producto, "nombre" | "stockActual"> | undefined,
): string | undefined {
  const texto = valor.trim();
  if (!texto) return undefined;
  if (texto.startsWith("-")) return "Escribe la cantidad sin signo; el tipo de movimiento indica si suma o resta.";
  if (!PATRON_ENTERO.test(texto)) return "La cantidad debe ser un número entero, sin decimales.";
  const cantidad = Number(texto);
  if (cantidad <= 0) return "La cantidad debe ser mayor que 0.";
  if (cantidad > MAXIMO_ENTERO) return "La cantidad es demasiado grande.";
  if (tipo === "salida" && producto && cantidad > producto.stockActual) {
    return producto.stockActual === 0
      ? `${producto.nombre} no tiene existencias; no se puede registrar una salida.`
      : `Solo hay ${formatearUnidades(producto.stockActual)} de ${producto.nombre}; la salida dejaría el stock en ${producto.stockActual - cantidad}.`;
  }
  return undefined;
}

export const columnasCsvMovimientos: ColumnaCsv<MovimientoListado>[] = [
  { encabezado: "Folio", valor: (m) => obtenerFolioMovimiento(m) },
  { encabezado: "Fecha", valor: (m) => m.createdAt },
  { encabezado: "SKU", valor: (m) => m.producto.sku },
  { encabezado: "Producto", valor: (m) => m.producto.nombre },
  { encabezado: "Tipo", valor: (m) => etiquetasTipo[m.tipo] },
  { encabezado: "Motivo", valor: (m) => etiquetasMotivo[m.motivo] },
  { encabezado: "Cantidad", valor: (m) => cantidadConSigno(m) },
  { encabezado: "Stock resultante", valor: (m) => m.stockResultante },
  { encabezado: "Referencia", valor: (m) => m.referencia },
  { encabezado: "Responsable", valor: (m) => m.responsable.nombre },
  { encabezado: "Rol", valor: (m) => m.responsable.rol },
];
