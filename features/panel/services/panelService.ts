import { indicadoresMock, reabastecimientoMock } from "../data/inventarioMock";
import { ordenesMock } from "../data/ordenesMock";
import type { IndicadoresInventario, OrdenServicio, Reabastecimiento } from "../types";

export async function obtenerIndicadores(): Promise<IndicadoresInventario> {
  return indicadoresMock;
}

export async function obtenerOrdenesActivas(): Promise<OrdenServicio[]> {
  return ordenesMock;
}

export async function obtenerReabastecimiento(): Promise<Reabastecimiento> {
  return reabastecimientoMock;
}
