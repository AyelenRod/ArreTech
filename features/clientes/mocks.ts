import type { Cliente, EstadoTicket, TipoCliente } from "./types";

export interface TicketMock {
  id: number;
  idCliente: number;
  idUsuario: number;
  estado: EstadoTicket;
  createdAt: string;
}

export const usuariosMock: Record<number, { nombre: string; apellido: string }> = {
  2: { nombre: "Miguel", apellido: "Torres" },
  3: { nombre: "Ana", apellido: "Ruiz" },
  4: { nombre: "Jorge", apellido: "Salinas" },
};

type FilaCliente = [
  nombre: string,
  telefono: string | null,
  correo: string | null,
  tipo: TipoCliente,
  ciudad: string,
  rfc: string | null,
  createdAt: string,
  deletedAt: string | null,
];

const filasClientes: FilaCliente[] = [
  ["Consultoría Ramos S.A. de C.V.", "+52 961 123 4567", "ramos@consultoria.mx", "empresa", "Tuxtla Gutiérrez", "CRA180312KT4", "2024-02-14T17:00:00Z", null],
  ["Alejandro Peña", "+52 961 234 5678", "alejandro.pena@correo.mx", "particular", "Tuxtla Gutiérrez", null, "2023-06-03T18:30:00Z", null],
  ["Logística Transgasa", "+52 961 345 6789", "contacto@transgasa.mx", "empresa", "Tapachula", "LTR150820MN2", "2025-01-21T16:10:00Z", "2026-08-30T19:00:00Z"],
  ["María Fernanda López", "+52 962 118 2040", null, "particular", "Tapachula", null, "2025-09-11T20:45:00Z", null],
  ["Papelería El Estudiante", null, "ventas@elestudiante.mx", "empresa", "San Cristóbal de las Casas", "PES090514AB1", "2022-11-08T15:00:00Z", null],
  ["Ricardo Gómez Ortiz", "+52 967 674 1122", "ricardo.gomez@correo.mx", "particular", "San Cristóbal de las Casas", null, "2024-07-19T17:20:00Z", null],
  ["Clínica Dental Sonrisa", "+52 961 602 3344", "admin@sonrisa.mx", "empresa", "Tuxtla Gutiérrez", "CDS170402QW8", "2023-03-27T16:00:00Z", null],
  ["Laura Hernández", "+52 963 632 7788", "laura.hdz@correo.mx", "particular", "Comitán", null, "2026-11-04T18:00:00Z", null],
  ["Despacho Contable Aguilar", "+52 963 101 9090", "contacto@aguilar.mx", "empresa", "Comitán", "DCA110718PL3", "2026-11-06T17:30:00Z", null],
  ["José Luis Martínez", "+52 961 455 6677", null, "particular", "Tuxtla Gutiérrez", null, "2021-10-02T16:40:00Z", "2025-12-15T18:00:00Z"],
  ["Escuela Primaria Benito Juárez", "+52 961 610 2233", "direccion@primariabj.edu.mx", "empresa", "Chiapa de Corzo", null, "2024-08-26T15:30:00Z", null],
  ["Sofía Castillo", null, "sofia.castillo@correo.mx", "particular", "Chiapa de Corzo", null, "2026-11-12T19:15:00Z", null],
  ["Hotel Posada del Sol", "+52 962 625 4455", "gerencia@posadadelsol.mx", "empresa", "Tapachula", "HPS120925RT6", "2023-12-01T17:00:00Z", null],
  ["Daniel Vázquez", "+52 961 377 8899", "daniel.vazquez@correo.mx", "particular", "Tuxtla Gutiérrez", null, "2025-04-17T21:00:00Z", null],
  ["Ferretería La Llave", "+52 967 678 0011", null, "empresa", "San Cristóbal de las Casas", "FLL080210HG5", "2022-05-30T16:20:00Z", "2026-03-02T17:00:00Z"],
  ["Gabriela Morales", "+52 961 299 1357", "gaby.morales@correo.mx", "particular", "Tuxtla Gutiérrez", null, "2026-11-18T18:40:00Z", null],
  ["Constructora Grijalva", "+52 961 612 2468", "proyectos@grijalva.mx", "empresa", "Tuxtla Gutiérrez", "CGR160603JK9", "2025-07-08T15:45:00Z", null],
  ["Héctor Ruiz Domínguez", "+52 962 120 3579", "hector.ruiz@correo.mx", "particular", "Tapachula", null, "2024-03-22T17:10:00Z", null],
  ["Farmacias Del Valle", null, "soporte@farmaciasdelvalle.mx", "empresa", "Comitán", "FDV140117ZX7", "2026-11-20T16:30:00Z", null],
  ["Patricia Nájera", "+52 963 690 4680", null, "particular", "Comitán", null, "2023-09-14T20:00:00Z", null],
  ["Agencia de Viajes Mundo Maya", "+52 961 614 5791", "reservas@mundomaya.mx", "empresa", "Tuxtla Gutiérrez", "AVM190830CV1", "2025-10-29T16:50:00Z", null],
  ["Fernando Ocaña", "+52 961 388 6802", "fernando.ocana@correo.mx", "particular", "Chiapa de Corzo", null, "2022-08-05T18:25:00Z", null],
  ["Taller Mecánico Hermanos Cruz", "+52 962 641 7913", null, "empresa", "Tapachula", null, "2024-12-10T15:15:00Z", null],
  ["Valeria Espinosa", null, "valeria.espinosa@correo.mx", "particular", "San Cristóbal de las Casas", null, "2026-11-23T19:30:00Z", null],
  ["Notaría Pública 12", "+52 961 618 9024", "notaria12@correo.mx", "empresa", "Tuxtla Gutiérrez", "NPD050421BN4", "2021-04-12T16:00:00Z", null],
  ["Raúl Pérez Coutiño", "+52 961 312 0135", "raul.perez@correo.mx", "particular", "Tuxtla Gutiérrez", null, "2025-02-25T17:35:00Z", "2026-06-10T18:00:00Z"],
];

export const clientesMock: Cliente[] = filasClientes.map(
  ([nombre, telefono, correo, tipo, ciudad, rfc, createdAt, deletedAt], indice) => ({
    id: indice + 1,
    uuid: `5b0c1e2a-7f3d-4a8e-9c10-${String(indice + 1).padStart(12, "0")}`,
    nombre,
    telefono,
    correo,
    tipo,
    ciudad,
    rfc,
    createdAt,
    deletedAt,
  }),
);

type FilaTicket = [idCliente: number, idUsuario: number, estado: EstadoTicket, createdAt: string];

const filasTickets: FilaTicket[] = [
  [1, 2, "entregado", "2025-03-10T17:00:00Z"],
  [1, 3, "entregado", "2025-11-02T16:00:00Z"],
  [1, 2, "en_reparacion", "2026-11-18T18:00:00Z"],
  [1, 4, "recibido", "2026-11-24T17:00:00Z"],
  [2, 2, "entregado", "2024-01-15T16:00:00Z"],
  [2, 2, "terminado", "2026-11-15T19:00:00Z"],
  [3, 3, "entregado", "2025-04-02T16:00:00Z"],
  [3, 3, "entregado", "2026-07-21T17:00:00Z"],
  [4, 4, "entregado", "2026-02-08T18:00:00Z"],
  [5, 3, "entregado", "2023-05-19T16:00:00Z"],
  [5, 2, "en_reparacion", "2026-11-20T17:30:00Z"],
  [6, 4, "entregado", "2025-09-30T15:00:00Z"],
  [7, 2, "entregado", "2024-06-11T16:00:00Z"],
  [7, 3, "recibido", "2026-11-22T18:00:00Z"],
  [8, 4, "recibido", "2026-11-05T17:00:00Z"],
  [9, 2, "entregado", "2026-11-10T16:30:00Z"],
  [11, 3, "entregado", "2025-01-14T16:00:00Z"],
  [11, 3, "en_reparacion", "2026-11-19T15:00:00Z"],
  [13, 2, "entregado", "2026-09-03T18:00:00Z"],
  [14, 4, "terminado", "2026-11-21T19:00:00Z"],
  [16, 2, "recibido", "2026-11-19T17:00:00Z"],
  [17, 3, "entregado", "2026-01-27T16:00:00Z"],
  [17, 4, "entregado", "2026-05-12T17:00:00Z"],
  [18, 2, "entregado", "2025-08-08T15:30:00Z"],
  [20, 4, "entregado", "2024-10-22T16:00:00Z"],
  [21, 3, "en_reparacion", "2026-11-17T18:00:00Z"],
  [22, 2, "entregado", "2023-02-13T17:00:00Z"],
  [23, 4, "entregado", "2026-10-30T16:00:00Z"],
  [25, 2, "entregado", "2022-07-01T16:00:00Z"],
  [25, 3, "entregado", "2024-04-18T17:00:00Z"],
  [25, 2, "terminado", "2026-11-23T18:00:00Z"],
  [26, 4, "entregado", "2025-06-05T16:00:00Z"],
];

export const ticketsMock: TicketMock[] = filasTickets.map(([idCliente, idUsuario, estado, createdAt], indice) => ({
  id: indice + 1,
  idCliente,
  idUsuario,
  estado,
  createdAt,
}));
