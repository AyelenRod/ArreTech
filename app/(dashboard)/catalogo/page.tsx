import type { Metadata } from "next";
import { CatalogoView } from "@/features/inventario/components/CatalogoView";
import { obtenerProductos } from "@/features/inventario/services/productos.service";

export const metadata: Metadata = {
  title: "Catálogo y Refacciones",
};

export default async function CatalogoPage() {
  const productos = await obtenerProductos();
  return <CatalogoView productosIniciales={productos} />;
}
