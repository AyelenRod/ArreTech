export interface ColumnaCsv<T> {
  encabezado: string;
  valor: (fila: T) => string | number | null | undefined;
}

function escaparCelda(valor: string | number | null | undefined): string {
  const texto = valor == null ? "" : String(valor);
  return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function generarCsv<T>(columnas: ColumnaCsv<T>[], filas: T[]): string {
  const encabezados = columnas.map((columna) => escaparCelda(columna.encabezado)).join(",");
  const cuerpo = filas.map((fila) =>
    columnas.map((columna) => escaparCelda(columna.valor(fila))).join(","),
  );
  return [encabezados, ...cuerpo].join("\r\n");
}

/** Solo en el navegador (manejadores de eventos). Incluye BOM para que Excel respete acentos. */
export function descargarCsv<T>(nombreArchivo: string, columnas: ColumnaCsv<T>[], filas: T[]): void {
  const blob = new Blob(["﻿", generarCsv(columnas, filas)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo.endsWith(".csv") ? nombreArchivo : `${nombreArchivo}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);
}
