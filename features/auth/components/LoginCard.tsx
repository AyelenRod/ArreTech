import { Lock } from "lucide-react";
import { LoginForm } from "./LoginForm";

export function LoginCard() {
  return (
    <section className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-9">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 rounded-md border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
          <Lock className="size-3.5" aria-hidden />
          Acceso Autorizado
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-default-400">Hardware &amp; Taller</span>
      </div>

      <div className="my-6">
        <h1 className="text-2xl font-bold tracking-tight text-default-900">Iniciar Sesión en el Sistema</h1>
        <p className="mt-2 text-sm leading-relaxed text-default-500">
          Acceso centralizado para personal operativo, bodega y servicio técnico
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 border-t border-default-100 pt-6 text-center">
        <button type="button" className="rounded text-xs font-semibold text-primary outline-primary hover:underline">
          ¿Olvidaste tu contraseña o necesitas solicitar acceso?
        </button>
        <p className="mt-3 text-xs text-default-400">Contactar al Administrador de TI (Ext. 402 / Soporte Interno)</p>
      </div>
    </section>
  );
}
