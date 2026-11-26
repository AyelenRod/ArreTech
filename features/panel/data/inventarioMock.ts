import type { IndicadoresInventario, Reabastecimiento } from "../types";

export const indicadoresMock: IndicadoresInventario = {
  totalSkus: 1428,
  nuevosEsteMes: 12,
  stockOptimo: 1376,
  stockBajo: 44,
  stockCritico: 8,
};

const pieza = { singular: "pza", plural: "pzas" };
const tubo = { singular: "tubo", plural: "tubos" };

export const reabastecimientoMock: Reabastecimiento = {
  totalCriticos: 8,
  costoEstimado: 4850,
  alertas: [
    {
      sku: "LCD-156-FHD30",
      nombre: "Pantalla LED 15.6 Slim 30 Pines FHD",
      detalle: "Genérica OEM",
      existencia: 1,
      minimo: 6,
      unidad: pieza,
    },
    {
      sku: "REF-DEL-USB-099",
      nombre: "Centro de Carga USB-C Dell OEM",
      detalle: "Lote #B14-26",
      existencia: 2,
      minimo: 15,
      unidad: pieza,
    },
    {
      sku: "CHM-AR-MX4",
      nombre: "Pasta Térmica Arctic MX-4 (4g)",
      detalle: "Grado Profesional",
      existencia: 2,
      minimo: 15,
      unidad: tubo,
    },
    {
      sku: "RAM-KF-16G3200",
      nombre: "Memoria RAM Kingston 16GB DDR4 3200MHz",
      detalle: "Kingston SODIMM",
      existencia: 3,
      minimo: 12,
      unidad: pieza,
    },
  ],
};
