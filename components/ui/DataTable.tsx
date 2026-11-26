import { cn } from "@/lib/cn";

export interface ColumnaTabla<T> {
  clave: string;
  encabezado: React.ReactNode;
  celda: (fila: T) => React.ReactNode;
  alineacion?: "izquierda" | "centro" | "derecha";
  /** Para importes, folios y fechas: evita que se partan en varias líneas. */
  sinSalto?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columnas: ColumnaTabla<T>[];
  filas: T[];
  obtenerClave: (fila: T) => string;
  mensajeVacio?: string;
  etiquetaAccesible?: string;
}

const clasesAlineacion = {
  izquierda: "text-left",
  centro: "text-center",
  derecha: "text-right",
};

export function DataTable<T>({
  columnas,
  filas,
  obtenerClave,
  mensajeVacio = "No hay registros que coincidan con los filtros.",
  etiquetaAccesible,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" aria-label={etiquetaAccesible}>
        <thead>
          <tr className="border-b border-default-200 bg-default-50">
            {columnas.map((columna) => (
              <th
                key={columna.clave}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-default-500",
                  clasesAlineacion[columna.alineacion ?? "izquierda"],
                )}
              >
                {columna.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="px-4 py-10 text-center text-default-500">
                {mensajeVacio}
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={obtenerClave(fila)} className="border-b border-default-100 last:border-0 hover:bg-default-50">
                {columnas.map((columna) => (
                  <td
                    key={columna.clave}
                    className={cn(
                      "px-4 py-3 align-top text-default-700",
                      clasesAlineacion[columna.alineacion ?? "izquierda"],
                      columna.sinSalto && "whitespace-nowrap",
                      columna.className,
                    )}
                  >
                    {columna.celda(fila)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface TableCardProps {
  titulo?: React.ReactNode;
  encabezado?: React.ReactNode;
  pie?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function TableCard({ titulo, encabezado, pie, children, className }: TableCardProps) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-xl border border-default-200 bg-white shadow-sm",
        className,
      )}
    >
      {(titulo || encabezado) && (
        <div className="flex flex-col gap-3 border-b border-default-200 p-4 sm:p-5">
          {titulo && <h2 className="text-lg font-semibold text-default-900">{titulo}</h2>}
          {encabezado}
        </div>
      )}
      {children}
      {pie && <div className="border-t border-default-200 px-4 py-3 sm:px-5">{pie}</div>}
    </section>
  );
}
