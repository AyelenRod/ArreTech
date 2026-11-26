import { obtenerIniciales } from "./format";

/** Nombres de la tabla `roles` según la propuesta de BD (varchar, no enum). */
export type RolSistema = "Administrador" | "Bodega" | "Ventas / Caja" | "Técnico";

export interface SesionUsuario {
  uuid: string;
  numeroEmpleado: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolSistema;
  iniciales: string;
}

export interface EstadoSistema {
  enLinea: boolean;
  latenciaMs: number;
}

export interface Notificaciones {
  pendientes: number;
}

const sesionMock: SesionUsuario = {
  uuid: "8f1c2a4e-3b7d-4c6a-9e21-5d0f7a9b1c33",
  numeroEmpleado: "EMP-0001",
  nombre: "Carlos",
  apellido: "Mendoza",
  correo: "carlos.mendoza@arretech.mx",
  rol: "Administrador",
  iniciales: obtenerIniciales("Carlos", "Mendoza"),
};

export async function obtenerSesion(): Promise<SesionUsuario> {
  return sesionMock;
}

export async function obtenerEstadoSistema(): Promise<EstadoSistema> {
  return { enLinea: true, latenciaMs: 14 };
}

export async function obtenerNotificaciones(): Promise<Notificaciones> {
  return { pendientes: 3 };
}
