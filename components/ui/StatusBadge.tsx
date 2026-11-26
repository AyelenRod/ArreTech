import { cn } from "@/lib/cn";
import { clasesTonoPunto, clasesTonoSuave, type Tono } from "./tonos";

interface StatusBadgeProps {
  etiqueta: string;
  tono?: Tono;
  conPunto?: boolean;
  className?: string;
}

export function StatusBadge({ etiqueta, tono = "neutro", conPunto = true, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        clasesTonoSuave[tono],
        className,
      )}
    >
      {conPunto && <span className={cn("size-1.5 shrink-0 rounded-full", clasesTonoPunto[tono])} aria-hidden />}
      {etiqueta}
    </span>
  );
}
