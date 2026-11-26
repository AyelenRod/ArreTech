import { LoginCard } from "./LoginCard";
import { LoginFooter } from "./LoginFooter";
import { LoginHeader } from "./LoginHeader";
import { ModulosPorPerfil } from "./ModulosPorPerfil";
import { PanelImagen } from "./PanelImagen";

export function LoginView() {
  return (
    <div className="flex min-h-dvh flex-col bg-default-50">
      <LoginHeader />
      <main className="grid flex-1 gap-10 px-4 py-8 sm:px-10 lg:grid-cols-[minmax(0,450px)_minmax(0,1fr)]">
        <div className="mx-auto flex w-full max-w-[450px] flex-col gap-6">
          <LoginCard />
          <ModulosPorPerfil />
        </div>
        <PanelImagen />
      </main>
      <LoginFooter />
    </div>
  );
}
