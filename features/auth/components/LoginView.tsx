import { LoginCard } from "./LoginCard";
import { LoginFooter } from "./LoginFooter";
import { LoginHeader } from "./LoginHeader";
import { PanelImagen } from "./PanelImagen";

export function LoginView() {
  return (
    <div className="flex min-h-dvh flex-col bg-default-50 lg:h-dvh">
      <LoginHeader />
      <main className="grid flex-1 gap-8 px-4 py-5 sm:px-8 lg:min-h-0 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)]">
        <div className="flex flex-col lg:overflow-y-auto">
          <LoginCard />
        </div>
        <PanelImagen />
      </main>
      <LoginFooter />
    </div>
  );
}
