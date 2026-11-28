import type { ColumnaCsv } from "@/lib/csv";
import type { ErroresFormulario } from "@/components/ui/FormOverlay";
import type {
  ClienteListado,
  EstadoTicket,
  EstatusCliente,
  FiltrosClientes,
  KpisClientes,
  TabClientes,
  TipoCliente,
} from "./types";

/** Mes de referencia fijo (AAAA-MM) para "Nuevos este mes"; no se lee el reloj. */
export const MES_ACTUAL = "2026-11";

export const TAMANO_PAGINA = 10;

export const FILTROS_INICIALES: FiltrosClientes = {
  busqueda: "",
  tipo: "",
  ciudad: "",
  estatus: "",
  soloNuevos: false,
};

export const etiquetasTipo: Record<TipoCliente, { tipo: string; regimen: string }> = {
  particular: { tipo: "Particular", regimen: "Persona física" },
  empresa: { tipo: "Empresa", regimen: "Persona moral" },
};

export const etiquetasEstatus: Record<EstatusCliente, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export function esTicketActivo(estado: EstadoTicket): boolean {
  return estado !== "entregado";
}

export function obtenerFolio(id: number): string {
  return `CLI-${String(id).padStart(3, "0")}`;
}

export function obtenerEstatus(cliente: { deletedAt: string | null }): EstatusCliente {
  return cliente.deletedAt ? "inactivo" : "activo";
}

export function obtenerAnio(iso: string): string {
  return iso.slice(0, 4);
}

export function esNuevoEsteMes(cliente: { createdAt: string }): boolean {
  return cliente.createdAt.startsWith(MES_ACTUAL);
}

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function cumpleTab(cliente: ClienteListado, tab: TabClientes): boolean {
  switch (tab) {
    case "particulares":
      return cliente.tipo === "particular";
    case "empresas":
      return cliente.tipo === "empresa";
    case "con_tickets":
      return cliente.ticketsActivos > 0;
    case "inactivos":
      return obtenerEstatus(cliente) === "inactivo";
    default:
      return true;
  }
}

export function contarPorTab(clientes: ClienteListado[]): Record<TabClientes, number> {
  const tabs: TabClientes[] = ["todos", "particulares", "empresas", "con_tickets", "inactivos"];
  return Object.fromEntries(
    tabs.map((tab) => [tab, clientes.filter((cliente) => cumpleTab(cliente, tab)).length]),
  ) as Record<TabClientes, number>;
}

export function filtrarClientes(
  clientes: ClienteListado[],
  tab: TabClientes,
  filtros: FiltrosClientes,
): ClienteListado[] {
  const termino = normalizar(filtros.busqueda.trim());
  const terminoDigitos = termino.replace(/\D/g, "");

  return clientes.filter((cliente) => {
    if (!cumpleTab(cliente, tab)) return false;
    if (filtros.tipo && cliente.tipo !== filtros.tipo) return false;
    if (filtros.ciudad && cliente.ciudad !== filtros.ciudad) return false;
    if (filtros.estatus && obtenerEstatus(cliente) !== filtros.estatus) return false;
    if (filtros.soloNuevos && !esNuevoEsteMes(cliente)) return false;
    if (!termino) return true;

    const textos = [cliente.nombre, cliente.correo, cliente.rfc, obtenerFolio(cliente.id)];
    if (textos.some((texto) => texto && normalizar(texto).includes(termino))) return true;
    return terminoDigitos.length >= 3 && (cliente.telefono ?? "").replace(/\D/g, "").includes(terminoDigitos);
  });
}

export function calcularKpis(clientes: ClienteListado[]): KpisClientes {
  const nuevos = clientes.filter(esNuevoEsteMes);
  return {
    total: clientes.length,
    activos: clientes.filter((cliente) => obtenerEstatus(cliente) === "activo").length,
    empresas: clientes.filter((cliente) => cliente.tipo === "empresa").length,
    nuevosEsteMes: nuevos.length,
    nuevosConTicketsActivos: nuevos.filter((cliente) => cliente.ticketsActivos > 0).length,
  };
}

export function obtenerCiudades(clientes: ClienteListado[]): string[] {
  return [...new Set(clientes.map((cliente) => cliente.ciudad))].sort((a, b) => a.localeCompare(b, "es"));
}

/** CHECK `chk_clientes_contacto`: teléfono o correo no nulo. */
export function validarContacto(datos: Record<string, string>): ErroresFormulario {
  if (datos.telefono || datos.correo) return {};
  const mensaje = "Captura al menos un teléfono o un correo.";
  return { telefono: mensaje, correo: mensaje };
}

const PATRON_CORREO = /^[^\s@]+@(?:[^\s@.]+\.)+[A-Za-z]{2,}$/;

/** Persona física: 4 letras; persona moral: 3. Después, fecha AAMMDD y homoclave de 3. */
const PATRONES_RFC: Record<TipoCliente, RegExp> = {
  particular: /^[A-ZÑ&]{4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{3}$/,
  empresa: /^[A-ZÑ&]{3}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{3}$/,
};

export function normalizarRfc(rfc: string): string {
  return rfc.trim().toUpperCase();
}

function validarCorreo(correo: string): string | undefined {
  if (!correo || PATRON_CORREO.test(correo)) return undefined;
  return "Escribe un correo válido, por ejemplo nombre@dominio.mx.";
}

function validarRfc(rfc: string, tipo: string): string | undefined {
  if (!rfc) return undefined;
  const valor = normalizarRfc(rfc);
  const tipoCliente = tipo in PATRONES_RFC ? (tipo as TipoCliente) : null;

  if (!tipoCliente) {
    if (Object.values(PATRONES_RFC).some((patron) => patron.test(valor))) return undefined;
    return "El RFC no tiene un formato válido (12 caracteres para persona moral o 13 para persona física).";
  }

  const longitud = tipoCliente === "particular" ? 13 : 12;
  const regimen = etiquetasTipo[tipoCliente].regimen.toLowerCase();
  if (valor.length !== longitud) {
    return `El RFC de ${regimen} debe tener ${longitud} caracteres (tiene ${valor.length}).`;
  }
  if (!PATRONES_RFC[tipoCliente].test(valor)) {
    const letras = longitud - 9;
    return `RFC inválido para ${regimen}: ${letras} letras, 6 dígitos de fecha (AAMMDD) y 3 caracteres de homoclave.`;
  }
  return undefined;
}

export function validarNuevoCliente(datos: Record<string, string>): ErroresFormulario {
  const errores = validarContacto(datos);
  return {
    ...errores,
    correo: errores.correo ?? validarCorreo(datos.correo ?? ""),
    rfc: validarRfc(datos.rfc ?? "", datos.tipo ?? ""),
  };
}

export const columnasCsvClientes: ColumnaCsv<ClienteListado>[] = [
  { encabezado: "ID", valor: (c) => obtenerFolio(c.id) },
  { encabezado: "Nombre", valor: (c) => c.nombre },
  { encabezado: "Teléfono", valor: (c) => c.telefono },
  { encabezado: "Correo", valor: (c) => c.correo },
  { encabezado: "Tipo", valor: (c) => etiquetasTipo[c.tipo].tipo },
  { encabezado: "Ciudad", valor: (c) => c.ciudad },
  { encabezado: "RFC", valor: (c) => c.rfc },
  { encabezado: "Estatus", valor: (c) => etiquetasEstatus[obtenerEstatus(c)] },
  { encabezado: "Cliente desde", valor: (c) => c.createdAt.slice(0, 10) },
  { encabezado: "Tickets", valor: (c) => c.totalTickets },
  { encabezado: "Tickets activos", valor: (c) => c.ticketsActivos },
  { encabezado: "Último servicio", valor: (c) => c.ultimoServicio?.fecha.slice(0, 10) },
  { encabezado: "Atendió", valor: (c) => c.ultimoServicio?.atendio },
];
