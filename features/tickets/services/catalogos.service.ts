import type { OpcionSelect } from "@/components/ui/FilterBar";
import { clientesMock, usuariosMock } from "../mocks";
import { esTecnicoAsignable } from "../utils";

/** Opciones planas para el drawer de alta; sirven igual desde tickets o desde el panel. */
export interface CatalogosNuevoTicket {
  clientes: OpcionSelect[];
  tecnicos: (OpcionSelect & { detalle: string | null })[];
}

export async function obtenerCatalogosNuevoTicket(): Promise<CatalogosNuevoTicket> {
  const clientes = clientesMock
    .map((cliente) => ({ valor: String(cliente.id), etiqueta: cliente.nombre }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, "es"));
  const tecnicos = usuariosMock
    .filter(esTecnicoAsignable)
    .map((usuario) => ({
      valor: String(usuario.id),
      etiqueta: `${usuario.nombre} ${usuario.apellido}`,
      detalle: usuario.pendiente.especialidad ?? usuario.rol,
    }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, "es"));
  return { clientes, tecnicos };
}
