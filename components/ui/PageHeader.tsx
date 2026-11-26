import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export interface MigaDePan {
  etiqueta: string;
  href?: string;
}

interface PageHeaderProps {
  titulo: string;
  descripcion?: string;
  migas?: MigaDePan[];
  acciones?: React.ReactNode;
}

export function PageHeader({ titulo, descripcion, migas, acciones }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 flex-1 basis-80">
        {migas && migas.length > 0 && (
          <nav aria-label="Migas de pan" className="mb-1.5">
            <ol className="flex flex-wrap items-center gap-1 text-[11px] font-semibold uppercase tracking-wide">
              {migas.map((miga, indice) => {
                const esUltima = indice === migas.length - 1;
                return (
                  <Fragment key={`${miga.etiqueta}-${indice}`}>
                    {indice > 0 && <ChevronRight className="size-3 text-default-400" aria-hidden />}
                    <li>
                      {miga.href && !esUltima ? (
                        <Link href={miga.href} className="text-default-500 hover:text-primary">
                          {miga.etiqueta}
                        </Link>
                      ) : (
                        <span
                          className={esUltima ? "text-primary" : "text-default-500"}
                          aria-current={esUltima ? "page" : undefined}
                        >
                          {miga.etiqueta}
                        </span>
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-default-900 sm:text-3xl">{titulo}</h1>
        {descripcion && <p className="mt-1 max-w-3xl text-sm text-default-500">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </header>
  );
}
