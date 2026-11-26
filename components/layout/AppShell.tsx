"use client";

import { Drawer, DrawerContent } from "@heroui/react";
import { useState } from "react";
import type { EstadoSistema, Notificaciones, SesionUsuario } from "@/lib/mock-session";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  sesion: SesionUsuario;
  estadoSistema: EstadoSistema;
  notificaciones: Notificaciones;
  children: React.ReactNode;
}

export function AppShell({ sesion, estadoSistema, notificaciones, children }: AppShellProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="flex min-h-dvh w-full bg-default-50">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-default-200 lg:block">
        <Sidebar estadoSistema={estadoSistema} />
      </aside>

      <Drawer
        isOpen={menuAbierto}
        onOpenChange={setMenuAbierto}
        placement="left"
        size="xs"
        hideCloseButton
        classNames={{ base: "max-w-64 rounded-none" }}
      >
        <DrawerContent>
          <Sidebar estadoSistema={estadoSistema} onNavegar={cerrarMenu} />
        </DrawerContent>
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          sesion={sesion}
          notificaciones={notificaciones}
          onAbrirMenu={() => setMenuAbierto(true)}
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-screen-2xl min-w-0 flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
