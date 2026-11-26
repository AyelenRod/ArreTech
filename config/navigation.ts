import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  ChartColumn,
  History,
  LayoutDashboard,
  Package,
  Ticket,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

export interface ItemNavegacion {
  etiqueta: string;
  href: string;
  icono: LucideIcon;
}

export interface SeccionNavegacion {
  titulo: string;
  items: ItemNavegacion[];
}

export const navegacion: SeccionNavegacion[] = [
  {
    titulo: "Operación",
    items: [
      { etiqueta: "Panel de Control", href: "/panel", icono: LayoutDashboard },
      { etiqueta: "Tickets de servicio", href: "/tickets", icono: Ticket },
      { etiqueta: "Órdenes de reparación", href: "/ordenes", icono: Wrench },
      { etiqueta: "Catálogo y Refacciones", href: "/catalogo", icono: Package },
      { etiqueta: "Movimientos", href: "/movimientos", icono: ArrowLeftRight },
      { etiqueta: "Clientes", href: "/clientes", icono: Users },
    ],
  },
  {
    titulo: "Supervisión",
    items: [{ etiqueta: "Analítica y KPIs", href: "/analitica", icono: ChartColumn }],
  },
  {
    titulo: "Administración",
    items: [
      { etiqueta: "Usuarios y Roles", href: "/usuarios", icono: UserCog },
      { etiqueta: "Bitácora de auditoría", href: "/bitacora", icono: History },
    ],
  },
];

export const rutaInicial = "/panel";

export function esRutaActiva(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
