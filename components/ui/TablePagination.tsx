"use client";

import { Pagination } from "@heroui/react";
import { formatearNumero } from "@/lib/format";

interface TablePaginationProps {
  pagina: number;
  tamanoPagina: number;
  totalRegistros: number;
  onChange: (pagina: number) => void;
  sustantivo?: string;
}

export function TablePagination({
  pagina,
  tamanoPagina,
  totalRegistros,
  onChange,
  sustantivo = "registros",
}: TablePaginationProps) {
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / tamanoPagina));
  const desde = totalRegistros === 0 ? 0 : (pagina - 1) * tamanoPagina + 1;
  const hasta = Math.min(pagina * tamanoPagina, totalRegistros);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-default-500">
        Mostrando <span className="font-semibold text-default-700">{desde}</span> a{" "}
        <span className="font-semibold text-default-700">{hasta}</span> de{" "}
        <span className="font-semibold text-default-700">{formatearNumero(totalRegistros)}</span> {sustantivo}
      </p>
      {totalPaginas > 1 && (
        <Pagination
          page={pagina}
          total={totalPaginas}
          onChange={onChange}
          size="sm"
          showControls
          isCompact
          aria-label="Paginación"
        />
      )}
    </div>
  );
}

export function paginar<T>(filas: T[], pagina: number, tamanoPagina: number): T[] {
  const inicio = (pagina - 1) * tamanoPagina;
  return filas.slice(inicio, inicio + tamanoPagina);
}
