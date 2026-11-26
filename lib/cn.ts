type ValorClase = string | false | null | undefined;

export function cn(...clases: ValorClase[]): string {
  return clases.filter(Boolean).join(" ");
}
