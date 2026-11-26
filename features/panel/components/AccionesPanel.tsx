"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export function AccionesPanel() {
  const router = useRouter();
  const [actualizando, iniciarActualizacion] = useTransition();

  return (
    <>
      <ActionButton
        variante="secundario"
        icono={<RefreshCw />}
        isLoading={actualizando}
        onPress={() => iniciarActualizacion(() => router.refresh())}
      >
        Actualizar datos
      </ActionButton>
      <ActionButton icono={<Plus />}>Nueva Orden de Servicio</ActionButton>
    </>
  );
}
