import type { OpcionSelect } from "@/components/ui/FilterBar";
import type { Tono } from "@/components/ui/tonos";
import type { EstadoOrden, OrdenServicio } from "./types";

export const estadosOrden: Record<EstadoOrden, { etiqueta: string; tono: Tono }> = {
  en_diagnostico: { etiqueta: "En diagnóstico", tono: "neutro" },
  en_reparacion: { etiqueta: "En reparación", tono: "primario" },
  espera_refaccion: { etiqueta: "Espera refacción", tono: "advertencia" },
  por_entregar: { etiqueta: "Por entregar / Listo", tono: "exito" },
};

export type FiltroEstado = "todas" | "reparacion" | "espera" | "listas";

export const filtrosEstado: { valor: FiltroEstado; etiqueta: string; estados: EstadoOrden[] }[] = [
  { valor: "todas", etiqueta: "Todas", estados: Object.keys(estadosOrden) as EstadoOrden[] },
  { valor: "reparacion", etiqueta: "En Reparación", estados: ["en_reparacion", "en_diagnostico"] },
  { valor: "espera", etiqueta: "Espera Refacción", estados: ["espera_refaccion"] },
  { valor: "listas", etiqueta: "Listas / Por Entregar", estados: ["por_entregar"] },
];

export const opcionesPrioridad: OpcionSelect[] = [
  { valor: "alta", etiqueta: "Alta" },
  { valor: "media", etiqueta: "Media" },
  { valor: "baja", etiqueta: "Baja" },
];

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function filtrarPorEstado(ordenes: OrdenServicio[], filtro: FiltroEstado): OrdenServicio[] {
  const estados = filtrosEstado.find((opcion) => opcion.valor === filtro)?.estados ?? [];
  return ordenes.filter((orden) => estados.includes(orden.estado));
}

export function coincideBusqueda(orden: OrdenServicio, busqueda: string): boolean {
  return normalizar(`${orden.folio} ${orden.cliente} ${orden.equipo}`).includes(normalizar(busqueda.trim()));
}
