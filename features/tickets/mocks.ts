import type {
  ClienteTicket,
  DetalleTicket,
  EstadoTicket,
  EventoTicket,
  PrioridadTicket,
  ProductoTicket,
  PruebaCalidad,
  TicketServicio,
  TipoEquipo,
  UsuarioTicket,
} from "./types";
import { CATEGORIA_MANO_DE_OBRA, calcularImportes } from "./utils";

/** "Ahora" de los mocks; con backend, el servidor medirá contra `now()`. */
export const FECHA_CORTE_MOCK = "2026-11-28T18:00:00Z";

/** Los ids 1 y 2 coinciden con los usuarios de inventario y con la sesión mock. */
export const usuariosMock: UsuarioTicket[] = [
  {
    id: 1,
    uuid: "8f1c2a4e-3b7d-4c6a-9e21-5d0f7a9b1c33",
    nombre: "Carlos",
    apellido: "Mendoza",
    rol: "Administrador",
    estado: "activo",
    pendiente: {
      especialidad: "Supervisor general y especialista PCB",
      certificacion: {
        nombre: "IPC-7711/7721",
        descripcion: "Rework, modification and repair of electronic assemblies",
      },
      estacion: "Banco de micro-soldadura #02",
    },
  },
  {
    id: 2,
    uuid: "2a7d9c41-6e0b-4f3a-8d52-1b9e7c4a6f02",
    nombre: "Miguel",
    apellido: "Torres",
    rol: "Ventas / Caja",
    estado: "activo",
    pendiente: { especialidad: null, certificacion: null, estacion: null },
  },
  {
    id: 4,
    uuid: "5c2e8a17-4d9b-4f60-a3c8-2e7b1d9f0a44",
    nombre: "Rigoberto",
    apellido: "Molina",
    rol: "Técnico",
    estado: "activo",
    pendiente: {
      especialidad: "Técnico nivel 2",
      certificacion: { nombre: "CompTIA A+", descripcion: "Soporte y reparación de hardware" },
      estacion: "Banco técnico #01",
    },
  },
  {
    id: 6,
    uuid: "e1a4c7d2-8b3f-4e95-b6a0-9c2d5f8e1b66",
    nombre: "David",
    apellido: "Suárez",
    rol: "Técnico",
    estado: "activo",
    pendiente: {
      especialidad: "Ingeniero de infraestructura",
      certificacion: { nombre: "HPE ATP Servers", descripcion: "Instalación y servicio de servidores" },
      estacion: "Banco de servidores #01",
    },
  },
  {
    id: 7,
    uuid: "0b9d3f6a-2c8e-4a17-9d54-6f1e3a7c2b77",
    nombre: "Melissa",
    apellido: "Castillo",
    rol: "Técnico",
    estado: "activo",
    pendiente: { especialidad: "Técnica de ensamble", certificacion: null, estacion: "Banco técnico #04" },
  },
  {
    id: 8,
    uuid: "9a6c1e3b-7f2d-4b08-8e45-3d0a6c9f4e88",
    nombre: "Andrea",
    apellido: "Ramos",
    rol: "Ventas / Caja",
    estado: "activo",
    pendiente: { especialidad: null, certificacion: null, estacion: null },
  },
];

type FilaCliente = [nombre: string, telefono: string | null, correo: string | null];

const filasClientes: FilaCliente[] = [
  ["Corporativo Sigma S.A.", "(55) 4120-9981", "contacto@corposigma.mx"],
  ["Mariana Ríos Soto", "(55) 8831-2094", "m.rios@correo.mx"],
  ["Roberto Garza Gil", "(55) 7012-3345", "rgarza@garzagil.mx"],
  ["Consultoría Ramos S.C.", "(55) 5540-1928", "sistemas@ramosconsultoria.mx"],
  ["Alejandro Peña M.", "(55) 1290-8431", "alex.pena99@correo.mx"],
  ["Logística Transgasusa", "(55) 9102-4411", "soporte@transgasusa.mx"],
  ["TechSolutions S.A. de C.V.", "(55) 7012-3346", "rgarza@techsolutions.mx"],
  ["Farmacias Del Valle", "(55) 3381-7720", "ti@farmaciasdelvalle.mx"],
  ["Lucía Hernández Vega", "(55) 6623-0145", null],
  ["Jorge Iván Cruz", "(55) 2290-5531", "jorge.cruz@correo.mx"],
  ["Colegio Montessori Arboledas", "(55) 5378-4410", "direccion@montessoriarboledas.mx"],
  ["Sofía Martínez León", null, "sofia.martinez@correo.mx"],
];

export const clientesMock: ClienteTicket[] = filasClientes.map(([nombre, telefono, correo], indice) => ({
  id: indice + 1,
  uuid: `6b1f4d82-9c3a-4e57-8a20-${String(indice + 1).padStart(12, "0")}`,
  nombre,
  telefono,
  correo,
}));

/**
 * Subconjunto de `productos` usado en tickets; los ids compartidos llevan el mismo stock que en inventario.
 * La mano de obra es un producto de categoría "Mano de obra" y no maneja stock.
 */
export const productosTicketMock: ProductoTicket[] = [
  { id: 101, sku: "CRG-USBC-DELL", nombre: "Centro de carga USB-C Dell OEM Latitude", descripcion: "Conector reforzado de montaje superficial", categoria: "Refacciones", stockActual: 5, stockMinimo: 3 },
  { id: 102, sku: "CBX-ARC-MX4", nombre: "Pasta térmica Arctic MX-4 (4 g)", descripcion: "Compuesto térmico de micropartículas de carbono", categoria: "Consumibles", stockActual: 12, stockMinimo: 6 },
  { id: 103, sku: "CAP-SMD-0805", nombre: "Capacitores SMD cerámicos 10 µF 25 V", descripcion: "Filtrado del riel VBUS, encapsulado 0805", categoria: "Refacciones", stockActual: 2, stockMinimo: 20 },
  { id: 104, sku: "LAB-MIC-02", nombre: "Mano de obra especializada: micro-soldadura y reballing", descripcion: "Diagnóstico térmico, sustitución de IC y banco de pruebas", categoria: CATEGORIA_MANO_DE_OBRA, stockActual: 0, stockMinimo: 0 },
  { id: 105, sku: "LAB-DIA-01", nombre: "Mano de obra: diagnóstico y mantenimiento preventivo", descripcion: "Desensamble, limpieza y pruebas de funcionamiento", categoria: CATEGORIA_MANO_DE_OBRA, stockActual: 0, stockMinimo: 0 },
  { id: 106, sku: "LAB-GEN-01", nombre: "Mano de obra general: desensamble y reemplazo", descripcion: "Sustitución de componentes y pruebas", categoria: CATEGORIA_MANO_DE_OBRA, stockActual: 0, stockMinimo: 0 },
  { id: 107, sku: "LAB-SRV-01", nombre: "Mano de obra en servidor", descripcion: "Servicio en sitio de banco, pruebas de estrés y RAID", categoria: CATEGORIA_MANO_DE_OBRA, stockActual: 0, stockMinimo: 0 },
  { id: 1, sku: "SKU-SSD-0480", nombre: "SSD Kingston A400 480 GB", descripcion: "SATA III, 2.5 in", categoria: "Refacciones", stockActual: 86, stockMinimo: 20 },
  { id: 5, sku: "SKU-RAM-8GB-SO", nombre: "RAM Crucial 8 GB DDR4 SO-DIMM", descripcion: "DDR4 2666 MHz para laptop", categoria: "Refacciones", stockActual: 4, stockMinimo: 15 },
  { id: 7, sku: "SKU-PAN-156-FHD", nombre: "Pantalla 15.6\" FHD 30 pines", descripcion: "IPS, 1920 x 1080, eDP 30 pines", categoria: "Refacciones", stockActual: 3, stockMinimo: 4 },
  { id: 12, sku: "SKU-FTE-EVGA-600", nombre: "Fuente EVGA 600 W 80 Plus", descripcion: "600 W, 80 Plus White", categoria: "Refacciones", stockActual: 8, stockMinimo: 5 },
  { id: 24, sku: "SKU-PAS-AS5", nombre: "Pasta térmica Arctic Silver 5", descripcion: "Jeringa de 3.5 g", categoria: "Consumibles", stockActual: 30, stockMinimo: 10 },
  { id: 108, sku: "SKU-BAT-APL-A2389", nombre: "Batería Apple A2389", descripcion: "Para MacBook Air M1, 49.9 Wh", categoria: "Refacciones", stockActual: 0, stockMinimo: 2 },
  { id: 109, sku: "SKU-TEC-LEN-T14", nombre: "Teclado Lenovo ThinkPad T14 Gen 2", descripcion: "Español latino, retroiluminado", categoria: "Refacciones", stockActual: 1, stockMinimo: 2 },
  { id: 110, sku: "SKU-PSU-HPE-500", nombre: "Módulo fuente HPE 500 W hot-plug", descripcion: "Flex Slot Platinum", categoria: "Refacciones", stockActual: 2, stockMinimo: 1 },
  { id: 111, sku: "SKU-VEN-ASUS-G15", nombre: "Ventilador ASUS ROG Strix G15 (par)", descripcion: "CPU y GPU, 12 V", categoria: "Refacciones", stockActual: 0, stockMinimo: 2 },
  { id: 112, sku: "SKU-BIS-HP-14", nombre: "Kit de bisagras HP 14", descripcion: "Izquierda y derecha con tornillería", categoria: "Refacciones", stockActual: 3, stockMinimo: 2 },
  { id: 113, sku: "SKU-BAT-ASUS-B31", nombre: "Batería ASUS B31N1912", descripcion: "11.55 V, 42 Wh", categoria: "Refacciones", stockActual: 4, stockMinimo: 2 },
  { id: 114, sku: "SKU-RAM-16-ECC", nombre: "RAM 16 GB DDR4 ECC UDIMM", descripcion: "3200 MHz, para servidor", categoria: "Refacciones", stockActual: 6, stockMinimo: 4 },
  { id: 115, sku: "LAB-CAL-01", nombre: "Mano de obra: recalibración de digitalizador", descripcion: "Firmware y calibración táctil", categoria: CATEGORIA_MANO_DE_OBRA, stockActual: 0, stockMinimo: 0 },
];

const QA_LAPTOP: [string, string][] = [
  ["Prueba de encendido y POST", "Arranque sin errores"],
  ["Carga y batería", "Carga estable con el cargador del cliente"],
  ["Prueba de estrés térmico", "30 min sin apagados"],
  ["Limpieza y ensamble", "Tornillería y sellos completos"],
];

const QA_SERVIDOR: [string, string][] = [
  ["Prueba de encendido y POST", "Sin alertas en iLO / iDRAC"],
  ["Redundancia de fuentes y RAID", "Arreglo y fuentes en estado óptimo"],
  ["Prueba de estrés (24 h)", "Sin errores de memoria ni temperatura"],
];

type Linea = [idProducto: number, cantidad: number, precioUnitario: number, folioMovimiento: string | null];

interface FilaTicket {
  id: number;
  cliente: number;
  tecnico: number;
  recepcion: number;
  estado: EstadoTicket;
  prioridad: PrioridadTicket;
  equipo: [tipo: TipoEquipo, modelo: string, numeroSerie: string | null, especificaciones: string | null];
  ubicacion: string;
  falla: string;
  diagnostico?: string;
  procedimiento?: string;
  /** Fechas en que el ticket entró a cada estado. */
  fechas: { recibido: string; en_reparacion?: string; surtido?: string; terminado?: string; entregado?: string };
  compromiso: string | null;
  lineas?: Linea[];
  evidencias?: string;
  garantiaDias?: number;
  calidad?: [prueba: string, resultado: string, aprobada?: boolean][];
}

const filasTickets: FilaTicket[] = [
  {
    id: 899, cliente: 8, tecnico: 7, recepcion: 2, estado: "recibido", prioridad: "media",
    equipo: ["Escritorio", "HP ProDesk 400 G6", "MXL0234KQ7", "Intel Core i5-9500 · 8 GB RAM"],
    ubicacion: "Recepción / triaje",
    falla: "Se reinicia al abrir el sistema de punto de venta.",
    fechas: { recibido: "2026-11-28T15:40:00Z" },
    compromiso: "2026-12-01T23:00:00Z",
  },
  {
    id: 898, cliente: 12, tecnico: 4, recepcion: 8, estado: "recibido", prioridad: "baja",
    equipo: ["Laptop", "Acer Aspire 5 A515", "NXHVPAL0071", "AMD Ryzen 5 5500U · 8 GB RAM"],
    ubicacion: "Recepción / triaje",
    falla: "Teclas de la fila superior no responden.",
    fechas: { recibido: "2026-11-28T00:20:00Z" },
    compromiso: "2026-12-03T00:00:00Z",
  },
  {
    id: 897, cliente: 10, tecnico: 1, recepcion: 8, estado: "recibido", prioridad: "alta",
    equipo: ["Laptop", "MacBook Pro 13\" M1 2020", "C02FK1Q8Q05D", "Apple M1 · 8 GB · 256 GB"],
    ubicacion: "Recepción / triaje",
    falla: "Derrame de café sobre el teclado; no enciende.",
    diagnostico: "Humedad visible junto al conector de batería. Se desconectó la batería en mostrador para evitar corrosión.",
    fechas: { recibido: "2026-11-27T17:05:00Z" },
    compromiso: "2026-11-29T00:00:00Z",
  },
  {
    id: 896, cliente: 11, tecnico: 7, recepcion: 2, estado: "recibido", prioridad: "media",
    equipo: ["All-in-One", "Lenovo IdeaCentre AIO 3", "MP1X7Q2L", "Intel Core i3-1115G4 · 8 GB RAM"],
    ubicacion: "Recepción / triaje",
    falla: "Pantalla con líneas verticales intermitentes.",
    fechas: { recibido: "2026-11-26T20:30:00Z" },
    compromiso: "2026-11-30T23:00:00Z",
  },
  {
    id: 895, cliente: 9, tecnico: 4, recepcion: 8, estado: "recibido", prioridad: "baja",
    equipo: ["Impresora", "Epson EcoTank L3250", "X8HF012345", "Multifuncional Wi-Fi"],
    ubicacion: "Recepción / triaje",
    falla: "Atasco de papel constante y manchas de tinta en las hojas.",
    fechas: { recibido: "2026-11-26T16:10:00Z" },
    compromiso: "2026-11-29T23:00:00Z",
  },
  {
    id: 894, cliente: 1, tecnico: 6, recepcion: 2, estado: "recibido", prioridad: "alta",
    equipo: ["Servidor", "Dell PowerEdge T150", "7XK2QH3", "Intel Xeon E-2314 · 32 GB ECC"],
    ubicacion: "Recepción / triaje",
    falla: "Alarma de disco degradado en el arreglo RAID 1.",
    fechas: { recibido: "2026-11-25T15:00:00Z" },
    compromiso: "2026-11-27T00:00:00Z",
  },
  {
    id: 893, cliente: 1, tecnico: 1, recepcion: 2, estado: "en_reparacion", prioridad: "alta",
    equipo: ["Laptop", "Lenovo ThinkPad T14 Gen 2", "PF-382KM0", "Intel Core i7-1165G7 · 16 GB RAM"],
    ubicacion: "Banco técnico #02",
    falla: "Daño por líquido en el teclado; sin POST.",
    diagnostico: "Corrosión en la flex del teclado y en el conector KB1. La placa arranca con teclado externo.",
    fechas: { recibido: "2026-11-23T16:00:00Z", en_reparacion: "2026-11-23T19:30:00Z" },
    compromiso: "2026-11-27T23:00:00Z",
    lineas: [[109, 1, 1350, null], [106, 1, 350, null]],
  },
  {
    id: 892, cliente: 2, tecnico: 4, recepcion: 8, estado: "en_reparacion", prioridad: "media",
    equipo: ["Laptop", "MacBook Air M1 2020", "C02F992KLQ", "Apple M1 · 8 GB · 256 GB"],
    ubicacion: "Banco técnico #01",
    falla: "Batería degradada (34 %) e hinchada.",
    diagnostico: "Batería con 1,034 ciclos y celda inflada que levanta el trackpad.",
    fechas: { recibido: "2026-11-24T18:00:00Z", en_reparacion: "2026-11-25T15:00:00Z", surtido: "2026-11-25T16:10:00Z" },
    compromiso: "2026-11-29T00:00:00Z",
    lineas: [[108, 1, 1890, "MOV-2026-0044"], [106, 1, 350, null]],
  },
  {
    id: 890, cliente: 3, tecnico: 1, recepcion: 8, estado: "en_reparacion", prioridad: "alta",
    equipo: ["Laptop", "HP Pavilion 15-eg", "5CD1287XQZ", "Intel Core i7-1195G7 · 16 GB RAM"],
    ubicacion: "Banco técnico #02",
    falla: "Pantalla negra con imagen tenue.",
    diagnostico: "Retroiluminación del panel dañada; con monitor externo la imagen es correcta.",
    fechas: { recibido: "2026-11-24T20:30:00Z", en_reparacion: "2026-11-25T17:00:00Z" },
    compromiso: "2026-11-29T23:00:00Z",
    lineas: [[7, 1, 1890, null], [106, 1, 350, null]],
  },
  {
    id: 889, cliente: 4, tecnico: 6, recepcion: 2, estado: "en_reparacion", prioridad: "alta",
    equipo: ["Servidor", "HPE ProLiant ML30 Gen10", "USE81909XX", "Intel Xeon E-2324 · 32 GB ECC"],
    ubicacion: "Banco de servidores #01",
    falla: "Falla en la fuente de poder redundante PSU2.",
    diagnostico: "PSU2 no entrega 12 V; el servidor opera solo con PSU1, sin redundancia.",
    fechas: { recibido: "2026-11-25T16:30:00Z", en_reparacion: "2026-11-25T18:00:00Z", surtido: "2026-11-26T15:20:00Z" },
    compromiso: "2026-11-28T23:00:00Z",
    lineas: [[110, 1, 2450, "MOV-2026-0047"], [107, 1, 1200, null]],
  },
  {
    id: 887, cliente: 5, tecnico: 7, recepcion: 8, estado: "en_reparacion", prioridad: "media",
    equipo: ["Laptop", "Asus ROG Strix G15", "G513RM-091A", "AMD Ryzen 7 · RTX 3060"],
    ubicacion: "Banco técnico #04",
    falla: "Sobrecalentamiento; se apaga al jugar.",
    diagnostico: "Ventilador de GPU con rodamiento dañado y pasta térmica seca.",
    fechas: { recibido: "2026-11-22T17:20:00Z", en_reparacion: "2026-11-23T15:40:00Z", surtido: "2026-11-23T16:00:00Z" },
    compromiso: "2026-11-30T00:00:00Z",
    lineas: [[102, 1, 140, "MOV-2026-0040"], [111, 1, 690, null], [105, 1, 450, null]],
  },
  {
    id: 886, cliente: 9, tecnico: 4, recepcion: 2, estado: "en_reparacion", prioridad: "baja",
    equipo: ["Laptop", "Lenovo IdeaPad 3 15\"", "PF3K9ZTQ", "AMD Ryzen 5 · 8 GB RAM"],
    ubicacion: "Banco técnico #01",
    falla: "Lentitud extrema al iniciar y abrir programas.",
    diagnostico: "Disco mecánico con sectores reasignados y RAM al 95 % en reposo.",
    fechas: { recibido: "2026-11-21T19:00:00Z", en_reparacion: "2026-11-22T16:00:00Z", surtido: "2026-11-22T16:30:00Z" },
    compromiso: "2026-12-02T00:00:00Z",
    lineas: [[1, 1, 899, "MOV-2026-0038"], [5, 1, 649, "MOV-2026-0038"], [106, 1, 350, null]],
  },
  {
    id: 885, cliente: 8, tecnico: 7, recepcion: 2, estado: "en_reparacion", prioridad: "media",
    equipo: ["Escritorio", "Dell OptiPlex 3080", "4R7TQ33", "Intel Core i5-10500 · 8 GB RAM"],
    ubicacion: "Banco técnico #04",
    falla: "No da video al encender.",
    diagnostico: "Código de LED 2-3: posible falla de memoria. Pendiente prueba con módulo de repuesto.",
    fechas: { recibido: "2026-11-26T15:30:00Z", en_reparacion: "2026-11-27T16:00:00Z" },
    compromiso: "2026-12-01T00:00:00Z",
  },
  {
    id: 883, cliente: 11, tecnico: 4, recepcion: 8, estado: "en_reparacion", prioridad: "baja",
    equipo: ["Laptop", "HP 14-dq2060la", "5CG1342LMN", "Intel Core i5 · 8 GB RAM"],
    ubicacion: "Banco técnico #01",
    falla: "Bisagra rota; la carcasa se abre al cerrar la tapa.",
    fechas: { recibido: "2026-11-20T18:10:00Z", en_reparacion: "2026-11-21T15:00:00Z" },
    compromiso: "2026-12-04T00:00:00Z",
    lineas: [[112, 1, 420, null], [106, 1, 350, null]],
  },
  {
    id: 882, cliente: 10, tecnico: 1, recepcion: 8, estado: "en_reparacion", prioridad: "media",
    equipo: ["Escritorio", "PC ensamblada", null, "AMD Ryzen 5 5600 · 16 GB RAM"],
    ubicacion: "Banco técnico #02",
    falla: "No enciende después de un apagón.",
    diagnostico: "Fuente de poder sin salida en el riel de 12 V; la tarjeta madre responde con fuente de prueba.",
    fechas: { recibido: "2026-11-24T21:00:00Z", en_reparacion: "2026-11-25T16:00:00Z", surtido: "2026-11-25T16:20:00Z" },
    compromiso: "2026-11-30T00:00:00Z",
    lineas: [[12, 1, 1199, "MOV-2026-0045"], [106, 1, 350, null]],
  },
  {
    id: 891, cliente: 7, tecnico: 1, recepcion: 8, estado: "terminado", prioridad: "alta",
    equipo: ["Laptop", "Dell Latitude 5420", "12L-9912A-RX", "Intel Core i5-1145G7 · 16 GB RAM"],
    ubicacion: "Bahía de pruebas #3",
    falla: "Cortocircuito en el puerto USB-C; no enciende.",
    diagnostico:
      "Cortocircuito directo en la línea principal de 20 V (VBUS). El equipo no encendía ni respondía a cargadores tipo C certificados. Resistencia medida a tierra en el riel de entrada: 0.8 Ω (estado anormal severo).",
    procedimiento:
      "Desensamble completo y detección térmica de la falla con cámara FLIR. Reemplazo del controlador de carga BQ25713 y de dos capacitores cerámicos SMD en corto. Limpieza por ultrasonido de sulfatación en el puerto USB-C secundario, aplicación de pasta térmica Arctic MX-4 y prueba de estrés de 45 min a 65 W constantes.",
    fechas: {
      recibido: "2026-11-24T16:15:00Z",
      en_reparacion: "2026-11-24T17:30:00Z",
      surtido: "2026-11-25T15:20:00Z",
      terminado: "2026-11-26T22:40:00Z",
    },
    compromiso: "2026-11-27T23:00:00Z",
    lineas: [
      [101, 1, 450, "MOV-2026-0042"],
      [102, 1, 140, "MOV-2026-0042"],
      [103, 2, 50, "MOV-2026-0042"],
      [104, 1, 800, null],
    ],
    evidencias: "Microscopio 40X: línea VBUS\nSoldadura BGA nueva\nPrueba 19.6 V @ 3.2 A",
    garantiaDias: 90,
    calidad: [
      ["Prueba de encendido y POST", "Exitoso (BIOS v1.22.0 reconocido)"],
      ["Negociación y carga USB-C PD", "Negocia 20 V / 3.25 A estable"],
      ["Prueba de estrés térmico (AIDA64)", "Delta máx. 68 °C tras 45 min continuos"],
      ["Limpieza estética y ensamble", "Sellos térmicos y tornillería completa"],
    ],
  },
  {
    id: 888, cliente: 6, tecnico: 4, recepcion: 2, estado: "terminado", prioridad: "media",
    equipo: ["Laptop", "Panasonic Toughbook CF-33", "7BTYA0912", "Tablet rugerizada · Intel Core i5"],
    ubicacion: "Anaquel de salida",
    falla: "La pantalla táctil no responde en la esquina inferior.",
    diagnostico: "Digitalizador funcional; calibración corrupta tras actualización de firmware.",
    procedimiento: "Reinstalación del firmware del digitalizador y recalibración de 25 puntos.",
    fechas: { recibido: "2026-11-22T16:00:00Z", en_reparacion: "2026-11-23T15:00:00Z", terminado: "2026-11-24T20:00:00Z" },
    compromiso: "2026-11-25T23:00:00Z",
    lineas: [[115, 1, 600, null]],
    evidencias: "Prueba de toque en 25 puntos",
    garantiaDias: 30,
  },
  {
    id: 884, cliente: 12, tecnico: 7, recepcion: 8, estado: "terminado", prioridad: "baja",
    equipo: ["Laptop", "HP 240 G8", "CND1234XYZ", "Intel Celeron N4020 · 4 GB RAM"],
    ubicacion: "Anaquel de salida",
    falla: "Mantenimiento preventivo: ruido del ventilador.",
    procedimiento: "Limpieza de disipador y ventilador, cambio de pasta térmica y pruebas de temperatura.",
    fechas: { recibido: "2026-11-21T17:00:00Z", en_reparacion: "2026-11-24T15:00:00Z", surtido: "2026-11-24T15:10:00Z", terminado: "2026-11-24T19:30:00Z" },
    compromiso: "2026-11-26T00:00:00Z",
    lineas: [[24, 1, 249, "MOV-2026-0041"], [105, 1, 450, null]],
    garantiaDias: 30,
  },
  {
    id: 880, cliente: 1, tecnico: 6, recepcion: 2, estado: "terminado", prioridad: "alta",
    equipo: ["Escritorio", "Lenovo ThinkCentre M70q", "MJ0F2K8T", "Intel Core i5-10400T · 16 GB RAM"],
    ubicacion: "Anaquel de salida",
    falla: "El puerto de red no tiene enlace.",
    diagnostico: "Controlador de red deshabilitado por política de BIOS y driver dañado.",
    procedimiento: "Restablecimiento de BIOS, reinstalación del driver Intel I219-V y prueba de 1 Gbps.",
    fechas: { recibido: "2026-11-18T16:00:00Z", en_reparacion: "2026-11-19T15:00:00Z", terminado: "2026-11-21T22:00:00Z" },
    compromiso: "2026-11-20T00:00:00Z",
    lineas: [[106, 1, 350, null]],
    garantiaDias: 30,
  },
  {
    id: 879, cliente: 5, tecnico: 1, recepcion: 8, estado: "terminado", prioridad: "media",
    equipo: ["Laptop", "Asus Vivobook 15", "N3N0CV12P3", "Intel Core i3 · 8 GB RAM"],
    ubicacion: "Anaquel de salida",
    falla: "La batería no carga.",
    diagnostico: "Batería con celda abierta; el circuito de carga funciona con batería de prueba.",
    procedimiento: "Reemplazo de batería y calibración de ciclo completo.",
    fechas: { recibido: "2026-11-19T18:00:00Z", en_reparacion: "2026-11-20T16:00:00Z", surtido: "2026-11-20T16:15:00Z", terminado: "2026-11-21T19:00:00Z" },
    compromiso: "2026-11-23T00:00:00Z",
    lineas: [[113, 1, 1150, "MOV-2026-0036"], [106, 1, 350, null]],
    garantiaDias: 90,
  },
  {
    id: 878, cliente: 2, tecnico: 4, recepcion: 8, estado: "entregado", prioridad: "media",
    equipo: ["Laptop", "Dell Inspiron 15 3511", "9TQ2KD3", "Intel Core i5-1135G7 · 8 GB RAM"],
    ubicacion: "Entregado",
    falla: "Disco duro con sectores dañados; Windows no arranca.",
    procedimiento: "Clonado de datos recuperables, cambio a SSD e instalación limpia de Windows.",
    fechas: { recibido: "2026-11-14T17:00:00Z", en_reparacion: "2026-11-15T15:00:00Z", surtido: "2026-11-15T15:30:00Z", terminado: "2026-11-17T20:00:00Z", entregado: "2026-11-18T18:30:00Z" },
    compromiso: "2026-11-18T00:00:00Z",
    lineas: [[1, 1, 899, "MOV-2026-0031"], [106, 1, 350, null]],
    garantiaDias: 90,
  },
  {
    id: 876, cliente: 7, tecnico: 6, recepcion: 2, estado: "entregado", prioridad: "alta",
    equipo: ["Servidor", "Dell PowerEdge T40", "5GH8KQ2", "Intel Xeon E-2224G · 16 GB ECC"],
    ubicacion: "Entregado",
    falla: "Reinicios aleatorios con errores de memoria ECC.",
    procedimiento: "Sustitución de los dos módulos de memoria y prueba de estrés de 24 h.",
    fechas: { recibido: "2026-11-12T16:00:00Z", en_reparacion: "2026-11-12T18:00:00Z", surtido: "2026-11-13T15:00:00Z", terminado: "2026-11-14T21:00:00Z", entregado: "2026-11-15T17:00:00Z" },
    compromiso: "2026-11-15T00:00:00Z",
    lineas: [[114, 2, 1650, "MOV-2026-0027"], [107, 1, 1200, null]],
    garantiaDias: 90,
  },
  {
    id: 875, cliente: 4, tecnico: 7, recepcion: 8, estado: "entregado", prioridad: "baja",
    equipo: ["Laptop", "Lenovo IdeaPad Slim 3", "PF4AB12C", "AMD Ryzen 5 7520U · 8 GB RAM"],
    ubicacion: "Entregado",
    falla: "Mantenimiento preventivo y cambio de pasta térmica.",
    procedimiento: "Limpieza interna, pasta térmica Arctic MX-4 y prueba de temperatura.",
    fechas: { recibido: "2026-11-10T17:00:00Z", en_reparacion: "2026-11-11T15:00:00Z", surtido: "2026-11-11T15:05:00Z", terminado: "2026-11-11T19:00:00Z", entregado: "2026-11-12T20:00:00Z" },
    compromiso: "2026-11-13T00:00:00Z",
    lineas: [[102, 1, 140, "MOV-2026-0022"], [105, 1, 450, null]],
    garantiaDias: 30,
  },
  {
    id: 872, cliente: 6, tecnico: 1, recepcion: 2, estado: "entregado", prioridad: "media",
    equipo: ["Laptop", "Panasonic Toughbook CF-31", "1KTSA48211", "Tablet rugerizada · Intel Core i5"],
    ubicacion: "Entregado",
    falla: "Bisagra floja y puerto serial sin comunicación.",
    procedimiento: "Ajuste de bisagra y resoldado del conector DB9.",
    fechas: { recibido: "2026-11-09T16:00:00Z", en_reparacion: "2026-11-09T19:00:00Z", terminado: "2026-11-11T18:00:00Z", entregado: "2026-11-12T16:00:00Z" },
    compromiso: "2026-11-12T00:00:00Z",
    lineas: [[106, 1, 350, null]],
    garantiaDias: 30,
  },
];

function nombreUsuario(id: number): string {
  const usuario = usuariosMock.find((u) => u.id === id);
  return usuario ? `${usuario.nombre} ${usuario.apellido}` : "Usuario desconocido";
}

function armarTrazabilidad(fila: FilaTicket): EventoTicket[] {
  const { fechas } = fila;
  const eventos: EventoTicket[] = [
    {
      fecha: fechas.recibido,
      estado: "recibido",
      titulo: "Recepción en mostrador",
      detalle: `Registrado por ${nombreUsuario(fila.recepcion)}`,
    },
  ];
  if (fechas.en_reparacion) {
    eventos.push({
      fecha: fechas.en_reparacion,
      estado: "en_reparacion",
      titulo: "Asignación a banco técnico",
      detalle: `${fila.estado === "en_reparacion" ? fila.ubicacion : "Banco técnico"} · ${nombreUsuario(fila.tecnico)}`,
    });
  }
  const folio = fila.lineas?.find((linea) => linea[3])?.[3];
  if (fechas.surtido && folio) {
    eventos.push({
      fecha: fechas.surtido,
      estado: null,
      titulo: "Refacciones surtidas de almacén",
      detalle: `Salida en kardex · ${folio}`,
    });
  }
  if (fechas.terminado) {
    eventos.push({
      fecha: fechas.terminado,
      estado: "terminado",
      titulo: "Reparación finalizada y QA aprobado",
      detalle: "Listo para entrega física y liquidación",
    });
  }
  if (fechas.entregado) {
    eventos.push({
      fecha: fechas.entregado,
      estado: "entregado",
      titulo: "Entregado al cliente",
      detalle: "Firma de conformidad en mostrador",
    });
  }
  return eventos;
}

function armarCalidad(fila: FilaTicket): PruebaCalidad[] {
  if (fila.calidad) {
    return fila.calidad.map(([prueba, resultado, aprobada = true]) => ({ prueba, resultado, aprobada }));
  }
  if (fila.estado !== "terminado" && fila.estado !== "entregado") return [];
  const base = fila.equipo[0] === "Servidor" ? QA_SERVIDOR : QA_LAPTOP;
  return base.map(([prueba, resultado]) => ({ prueba, resultado, aprobada: true }));
}

function productoMock(id: number): ProductoTicket {
  const producto = productosTicketMock.find((p) => p.id === id);
  if (!producto) throw new Error(`Producto mock ${id} no existe.`);
  return producto;
}

export const detallesTicketMock: DetalleTicket[] = filasTickets
  .flatMap((fila) => (fila.lineas ?? []).map((linea) => ({ idTicket: fila.id, linea })))
  .map(({ idTicket, linea: [idProducto, cantidad, precioUnitario, folioMovimiento] }, indice) => ({
    id: indice + 1,
    idTicket,
    idProducto,
    cantidad,
    precioUnitario,
    pendiente: { folioMovimiento },
  }));

export const ticketsMock: TicketServicio[] = filasTickets.map((fila, indice) => {
  const lineas = detallesTicketMock
    .filter((detalle) => detalle.idTicket === fila.id)
    .map((detalle) => ({ ...detalle, producto: productoMock(detalle.idProducto) }));
  const [tipo, modelo, numeroSerie, especificaciones] = fila.equipo;
  const ultimaFecha = Object.values(fila.fechas).sort().at(-1) ?? fila.fechas.recibido;

  return {
    id: fila.id,
    uuid: `c7e3a915-4b2d-4f86-9a1c-${String(indice + 1).padStart(12, "0")}`,
    idCliente: fila.cliente,
    idUsuario: fila.tecnico,
    descripcionProblema: fila.falla,
    estado: fila.estado,
    fechaEntrega: fila.compromiso,
    costoTotal: lineas.length > 0 ? calcularImportes(lineas).total : null,
    evidencias: fila.evidencias ?? null,
    createdAt: fila.fechas.recibido,
    updatedAt: ultimaFecha,
    deletedAt: null,
    pendiente: {
      prioridad: fila.prioridad,
      equipo: { tipo, modelo, numeroSerie, especificaciones },
      ubicacion: fila.ubicacion,
      idUsuarioRecepcion: fila.recepcion,
      diagnostico: fila.diagnostico ?? null,
      procedimiento: fila.procedimiento ?? null,
      garantiaDias: fila.garantiaDias ?? 30,
      controlCalidad: armarCalidad(fila),
      trazabilidad: armarTrazabilidad(fila),
    },
  };
});
