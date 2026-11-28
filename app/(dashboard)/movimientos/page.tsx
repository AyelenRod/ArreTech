import type { Metadata } from "next";
import { MovimientosView } from "@/features/inventario/components/MovimientosView";
import { obtenerMovimientos } from "@/features/inventario/services/movimientos.service";
import { obtenerProductos } from "@/features/inventario/services/productos.service";
import { obtenerSesion } from "@/lib/mock-session";

export const metadata: Metadata = {
  title: "Movimientos de inventario",
};

export default async function MovimientosPage() {
  const [movimientos, productos, sesion] = await Promise.all([
    obtenerMovimientos(),
    obtenerProductos(),
    obtenerSesion(),
  ]);
  return (
    <MovimientosView
      movimientosIniciales={movimientos}
      productosIniciales={productos}
      responsable={`${sesion.nombre} ${sesion.apellido}`}
    />
  );
}
