import type { EstadoOrden, OrdenServicio, PrioridadOrden } from "../types";

type FilaOrden = [number, string, string, string, string, EstadoOrden, PrioridadOrden];

const filas: FilaOrden[] = [
  [891, "Corporativo Sigma S.A.", "ID: CLI-4402", "Dell Latitude 5420", "Cortocircuito USB-C", "en_reparacion", "alta"],
  [888, "Mariana Ríos Soto", "Particular", "MacBook Air M1", "Reemplazo batería", "por_entregar", "media"],
  [884, "Roberto Garza Gil", "ID: CLI-2910", "Lenovo ThinkPad T14", "Daño por líquido • Sin POST", "espera_refaccion", "alta"],
  [879, "Consultoría Ramos", "Contrato Corporativo", "HP ProLiant ML30", "Reemplazo PSU Redundante", "en_reparacion", "alta"],
  [875, "Alejandro Peña M.", "Particular", "Asus ROG Strix G15", "Mantenimiento térmico", "en_diagnostico", "baja"],
  [872, "Grupo Altamira", "ID: CLI-1187", "HP EliteBook 840 G8", "Teclado dañado", "en_reparacion", "media"],
  [870, "Daniela Ortiz Vega", "Particular", "Acer Aspire 5", "No enciende", "en_diagnostico", "media"],
  [867, "Notaría 14", "Contrato Corporativo", "Dell OptiPlex 7090", "Cambio de SSD", "por_entregar", "baja"],
  [865, "Héctor Luna Ruiz", "Particular", "MacBook Pro 14", "Pantalla fracturada", "espera_refaccion", "alta"],
  [862, "Colegio Del Valle", "ID: CLI-3051", "Lenovo IdeaPad 3", "Bisagra rota", "en_reparacion", "baja"],
  [860, "Paola Méndez Cruz", "Particular", "HP Pavilion 15", "Sobrecalentamiento", "en_reparacion", "media"],
  [857, "Logística Ruta Sur", "Contrato Corporativo", "Dell PowerEdge T40", "Falla de disco en RAID", "en_reparacion", "alta"],
  [854, "Iván Castro León", "Particular", "MSI Katana GF66", "Sin imagen", "en_diagnostico", "media"],
  [851, "Clínica Santa Fe", "ID: CLI-2206", "Lenovo ThinkCentre M70q", "Reinstalación de sistema", "por_entregar", "baja"],
  [849, "Fernanda Solís", "Particular", "Surface Laptop 4", "Batería inflada", "espera_refaccion", "alta"],
  [846, "Despacho Herrera", "ID: CLI-4018", "Dell Vostro 3510", "Puerto HDMI dañado", "en_reparacion", "media"],
  [843, "Jorge Salas Pinto", "Particular", "Asus VivoBook 15", "Ampliación de RAM", "por_entregar", "baja"],
  [840, "Constructora Nivel", "Contrato Corporativo", "HP ZBook Firefly", "Pantallas azules", "en_diagnostico", "alta"],
  [838, "Lucía Aguilar Rey", "Particular", "MacBook Air M2", "Daño por líquido", "en_reparacion", "alta"],
  [835, "Hotel Mirador", "ID: CLI-1764", "Epson EcoTank L3250", "Atasco de papel", "por_entregar", "baja"],
  [832, "Raúl Jiménez Mora", "Particular", "Lenovo Legion 5", "Ventilador ruidoso", "por_entregar", "baja"],
  [829, "Farmacias La Paz", "Contrato Corporativo", "Dell Latitude 3420", "Cargador no detectado", "espera_refaccion", "media"],
  [827, "Sofía Navarro Gil", "Particular", "HP Envy x360", "Táctil sin respuesta", "en_reparacion", "media"],
  [824, "Agencia Prisma", "ID: CLI-3390", "iMac 24", "Lentitud general", "por_entregar", "baja"],
  [821, "Emilio Duarte", "Particular", "Acer Nitro 5", "Conector de carga flojo", "espera_refaccion", "media"],
  [818, "Transportes Vega", "ID: CLI-2675", "Lenovo ThinkPad E14", "Recuperación de datos", "en_reparacion", "alta"],
  [815, "Karla Ibáñez", "Particular", "Dell Inspiron 15", "Cambio de pantalla", "por_entregar", "media"],
  [812, "Laboratorio Biocentro", "Contrato Corporativo", "HP ProDesk 400", "Fuente de poder dañada", "espera_refaccion", "alta"],
];

export const ordenesMock: OrdenServicio[] = filas.map(
  ([numero, cliente, referenciaCliente, equipo, falla, estado, prioridad]) => ({
    folio: `TCK-2026-${String(numero).padStart(4, "0")}`,
    cliente,
    referenciaCliente,
    equipo,
    falla,
    estado,
    prioridad,
  }),
);
