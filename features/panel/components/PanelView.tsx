import { PageHeader } from "@/components/ui/PageHeader";
import { obtenerIndicadores, obtenerOrdenesActivas, obtenerReabastecimiento } from "../services/panelService";
import { AccionesPanel } from "./AccionesPanel";
import { AlertasReabastecimiento } from "./AlertasReabastecimiento";
import { OrdenesActivas } from "./OrdenesActivas";
import { ResumenInventario } from "./ResumenInventario";

export async function PanelView() {
  const [indicadores, ordenes, reabastecimiento] = await Promise.all([
    obtenerIndicadores(),
    obtenerOrdenesActivas(),
    obtenerReabastecimiento(),
  ]);

  return (
    <>
      <PageHeader
        migas={[{ etiqueta: "Centro de operaciones" }, { etiqueta: "Taller y Logística" }]}
        titulo="Panel de Control Operativo"
        descripcion="Métricas en tiempo real de inventarios, servicios y estado de operaciones"
        acciones={<AccionesPanel />}
      />
      <ResumenInventario indicadores={indicadores} />
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <OrdenesActivas ordenes={ordenes} />
        <AlertasReabastecimiento reabastecimiento={reabastecimiento} />
      </div>
    </>
  );
}
