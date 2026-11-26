import { Lock } from "lucide-react";

export function LoginFooter() {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-default-200 bg-white px-4 py-3 text-xs">
      <span className="flex items-center gap-1.5 text-default-600">
        <Lock className="size-3.5 text-emerald-600" aria-hidden />
        Sistema en la nube ArreTech
      </span>
      <span className="text-default-300" aria-hidden>
        •
      </span>
      <span className="text-default-400">© 2026 ArreTech Inc. Todos los derechos reservados.</span>
    </footer>
  );
}
