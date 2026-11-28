interface ResultadoValidacion {
  validationDetails: ValidityState;
  validationErrors: string[];
}

/** Mensaje en español para campos obligatorios vacíos; el resto viene de `validate`. */
export function mensajeError(siFalta: string) {
  return ({ validationDetails, validationErrors }: ResultadoValidacion) =>
    validationDetails.valueMissing ? siFalta : validationErrors.join(" ");
}
