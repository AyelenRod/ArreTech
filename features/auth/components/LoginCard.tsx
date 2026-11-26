import { LoginForm } from "./LoginForm";

export function LoginCard() {
  return (
    <section className="flex flex-1 flex-col rounded-2xl border border-default-200 bg-white p-6 shadow-sm">
      <div className="m-auto w-full max-w-[400px]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-default-400">Hardware &amp; Taller</p>

        <div className="mt-2 mb-5">
          <h1 className="text-xl font-bold tracking-tight text-default-900">Iniciar Sesión en el Sistema</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-default-500">
            Acceso centralizado para personal operativo, bodega y servicio técnico
          </p>
        </div>

        <LoginForm />

        <div className="mt-5 border-t border-default-100 pt-4 text-center">
          <button type="button" className="rounded text-xs font-semibold text-primary outline-primary hover:underline">
            ¿Olvidaste tu contraseña o necesitas solicitar acceso?
          </button>
          <p className="mt-2 text-xs text-default-400">Contactar al Administrador de TI (Ext. 402 / Soporte Interno)</p>
        </div>
      </div>
    </section>
  );
}
