export interface ModuloPerfil {
  perfil: string;
  alcance: string;
  claseColor: string;
}

export const modulosPorPerfil: ModuloPerfil[] = [
  { perfil: "Admin", alcance: "Total & Auditoría", claseColor: "bg-primary" },
  { perfil: "Bodega", alcance: "Stock & Refacciones", claseColor: "bg-amber-500" },
  { perfil: "Ventas/Caja", alcance: "Clientes & Folios", claseColor: "bg-purple-600" },
  { perfil: "Técnicos", alcance: "Diagnóstico & Piezas", claseColor: "bg-emerald-600" },
];
