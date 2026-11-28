import type { Metadata } from "next";
import { ClientesView } from "@/features/clientes/components/ClientesView";
import { obtenerClientes } from "@/features/clientes/services/clientes.service";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function ClientesPage() {
  const clientes = await obtenerClientes();
  return <ClientesView clientesIniciales={clientes} />;
}
