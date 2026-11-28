import { cn } from "@/lib/cn";

export function InicialesUsuario({ iniciales, grande = false }: { iniciales: string; grande?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold",
        grande
          ? "size-12 rounded-xl bg-primary text-base text-primary-foreground"
          : "size-8 rounded-full bg-primary-50 text-xs text-primary-700",
      )}
      aria-hidden
    >
      {iniciales}
    </span>
  );
}
