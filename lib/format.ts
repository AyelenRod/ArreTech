const LOCALE = "es-MX";
const ZONA_HORARIA = "America/Mexico_City";

const moneda = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numero = new Intl.NumberFormat(LOCALE);

const porcentaje = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const fecha = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "medium",
  timeZone: ZONA_HORARIA,
});

const fechaHora = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: ZONA_HORARIA,
});

export function formatearMoneda(valor: number): string {
  return `${moneda.format(valor)} MXN`;
}

export function formatearNumero(valor: number): string {
  return numero.format(valor);
}

/** Recibe una fracción: 0.964 → "96.4 %". */
export function formatearPorcentaje(fraccion: number): string {
  return porcentaje.format(fraccion);
}

export function formatearFecha(iso: string): string {
  return fecha.format(new Date(iso));
}

export function formatearFechaHora(iso: string): string {
  return fechaHora.format(new Date(iso));
}

export function obtenerIniciales(nombre: string, apellido = ""): string {
  const partes = `${nombre} ${apellido}`.trim().split(/\s+/);
  const primera = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primera}${ultima}`.toUpperCase();
}
