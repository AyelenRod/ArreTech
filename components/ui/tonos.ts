export type Tono = "primario" | "exito" | "advertencia" | "peligro" | "neutro";

export const clasesTonoSuave: Record<Tono, string> = {
  primario: "bg-primary-50 text-primary-700",
  exito: "bg-success-50 text-success-700",
  advertencia: "bg-warning-50 text-warning-700",
  peligro: "bg-danger-50 text-danger-600",
  neutro: "bg-default-100 text-default-700",
};

export const clasesTonoPunto: Record<Tono, string> = {
  primario: "bg-primary",
  exito: "bg-success",
  advertencia: "bg-warning",
  peligro: "bg-danger",
  neutro: "bg-default-400",
};

export const clasesTonoTexto: Record<Tono, string> = {
  primario: "text-primary",
  exito: "text-success-600",
  advertencia: "text-warning-600",
  peligro: "text-danger",
  neutro: "text-default-900",
};
