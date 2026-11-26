import Image from "next/image";
import tecnicoReparacion from "../assets/tecnico-reparacion.jpg";

export function PanelImagen() {
  return (
    <div className="relative hidden min-h-[640px] overflow-hidden rounded-2xl border border-default-300 lg:block">
      <Image
        src={tecnicoReparacion}
        alt="Técnico reparando la tarjeta electrónica de un teléfono en el taller"
        fill
        loading="eager"
        placeholder="blur"
        sizes="(min-width: 1024px) 60vw, 1px"
        className="object-cover object-center"
      />
    </div>
  );
}
