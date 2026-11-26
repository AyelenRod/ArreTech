"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Cpu } from "lucide-react";
import { esRutaActiva, navegacion, rutaInicial } from "@/config/navigation";
import { cn } from "@/lib/cn";
import type { EstadoSistema } from "@/lib/mock-session";

interface SidebarProps {
  estadoSistema: EstadoSistema;
  onNavegar?: () => void;
}

export function Sidebar({ estadoSistema, onNavegar }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      <Link
        href={rutaInicial}
        onClick={onNavegar}
        className="flex items-center gap-3 px-5 py-5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Cpu className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-bold text-default-900">ArreTech</span>
          <span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-default-500">
            Gestión operativa
          </span>
        </span>
      </Link>

      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 pb-4">
        <Suspense fallback={<ListaNavegacion pathname="" onNavegar={onNavegar} />}>
          <ListaNavegacionActiva onNavegar={onNavegar} />
        </Suspense>
      </nav>

      <div className="m-3 rounded-lg border border-default-200 bg-default-50 px-3 py-2.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold uppercase tracking-wide text-default-600">Estado sistema</span>
          <span className="flex items-center gap-1.5 font-medium text-default-700">
            <span
              className={cn(
                "size-2 rounded-full",
                estadoSistema.enLinea ? "bg-success" : "bg-danger",
              )}
              aria-hidden
            />
            {estadoSistema.enLinea ? "En línea" : "Sin conexión"}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-default-500">
          <span>Latencia nodo</span>
          <span className="font-medium text-default-700">{estadoSistema.latenciaMs} ms</span>
        </div>
      </div>
    </div>
  );
}

function ListaNavegacionActiva({ onNavegar }: { onNavegar?: () => void }) {
  const pathname = usePathname();
  return <ListaNavegacion pathname={pathname} onNavegar={onNavegar} />;
}

function ListaNavegacion({ pathname, onNavegar }: { pathname: string; onNavegar?: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      {navegacion.map((seccion) => (
        <div key={seccion.titulo}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-default-500">
            {seccion.titulo}
          </p>
          <ul className="flex flex-col gap-0.5">
            {seccion.items.map((item) => {
              const activo = esRutaActiva(pathname, item.href);
              const Icono = item.icono;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavegar}
                    aria-current={activo ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      activo
                        ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                        : "text-default-700 hover:bg-default-100",
                    )}
                  >
                    <Icono className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.etiqueta}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
