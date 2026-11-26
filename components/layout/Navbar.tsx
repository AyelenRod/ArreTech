"use client";

import { Avatar, Badge, Button, Input } from "@heroui/react";
import { Bell, Menu, Search, Settings } from "lucide-react";
import type { Notificaciones, SesionUsuario } from "@/lib/mock-session";

interface NavbarProps {
  sesion: SesionUsuario;
  notificaciones: Notificaciones;
  onAbrirMenu: () => void;
}

export function Navbar({ sesion, notificaciones, onAbrirMenu }: NavbarProps) {
  const hayPendientes = notificaciones.pendientes > 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-default-200 bg-white/90 px-4 backdrop-blur sm:gap-4 sm:px-6">
      <Button
        isIconOnly
        variant="light"
        aria-label="Abrir menú"
        className="lg:hidden"
        onPress={onAbrirMenu}
      >
        <Menu className="size-5" />
      </Button>

      <form role="search" className="min-w-0 flex-1 sm:max-w-md" onSubmit={(evento) => evento.preventDefault()}>
        <Input
          type="search"
          name="q"
          aria-label="Buscar en el sistema"
          placeholder="Buscar folio, serie o cliente…"
          size="sm"
          radius="lg"
          variant="bordered"
          startContent={<Search className="size-4 shrink-0 text-default-400" aria-hidden />}
          classNames={{ inputWrapper: "bg-white" }}
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <Badge
          content=""
          color="danger"
          size="sm"
          shape="circle"
          placement="top-right"
          isInvisible={!hayPendientes}
          isDot
        >
          <Button
            isIconOnly
            variant="light"
            radius="full"
            aria-label={
              hayPendientes
                ? `Notificaciones: ${notificaciones.pendientes} pendientes`
                : "Notificaciones"
            }
          >
            <Bell className="size-5 text-default-600" />
          </Button>
        </Badge>
        <Button isIconOnly variant="light" radius="full" aria-label="Ajustes" className="hidden sm:inline-flex">
          <Settings className="size-5 text-default-600" />
        </Button>

        <div className="flex min-w-0 items-center gap-3 sm:border-l sm:border-default-200 sm:pl-3">
          <div className="hidden min-w-0 text-right md:block">
            <p className="truncate text-sm font-semibold text-default-900">
              {sesion.nombre} {sesion.apellido}
            </p>
            <p className="truncate text-xs text-default-500">{sesion.rol}</p>
          </div>
          <Avatar
            name={sesion.iniciales}
            getInitials={(nombre) => nombre}
            size="sm"
            color="primary"
            className="shrink-0"
          />
        </div>
      </div>
    </header>
  );
}
