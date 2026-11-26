export type EstadoOrden = "en_diagnostico" | "en_reparacion" | "espera_refaccion" | "por_entregar";

export type PrioridadOrden = "alta" | "media" | "baja";

export interface OrdenServicio {
  folio: string;
  cliente: string;
  referenciaCliente: string;
  equipo: string;
  falla: string;
  estado: EstadoOrden;
  prioridad: PrioridadOrden;
}

export interface IndicadoresInventario {
  totalSkus: number;
  nuevosEsteMes: number;
  stockOptimo: number;
  stockBajo: number;
  stockCritico: number;
}

export interface AlertaReabastecimiento {
  sku: string;
  nombre: string;
  detalle: string;
  existencia: number;
  minimo: number;
  unidad: { singular: string; plural: string };
}

export interface Reabastecimiento {
  alertas: AlertaReabastecimiento[];
  totalCriticos: number;
  costoEstimado: number;
}
