import { AppShell } from "@/components/layout/AppShell";
import { obtenerEstadoSistema, obtenerNotificaciones, obtenerSesion } from "@/lib/mock-session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sesion, estadoSistema, notificaciones] = await Promise.all([
    obtenerSesion(),
    obtenerEstadoSistema(),
    obtenerNotificaciones(),
  ]);

  return (
    <AppShell sesion={sesion} estadoSistema={estadoSistema} notificaciones={notificaciones}>
      {children}
    </AppShell>
  );
}
