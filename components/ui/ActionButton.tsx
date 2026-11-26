"use client";

import { Button, type ButtonProps } from "@heroui/react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variante = "primario" | "secundario" | "fantasma" | "peligro";

const propsVariante: Record<Variante, Pick<ButtonProps, "color" | "variant">> = {
  primario: { color: "primary", variant: "solid" },
  secundario: { color: "default", variant: "bordered" },
  fantasma: { color: "default", variant: "light" },
  peligro: { color: "danger", variant: "solid" },
};

interface ActionButtonProps {
  children?: React.ReactNode;
  variante?: Variante;
  icono?: React.ReactNode;
  iconoFinal?: React.ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  form?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  soloIcono?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function ActionButton({
  children,
  variante = "primario",
  icono,
  iconoFinal,
  href,
  soloIcono = false,
  className,
  ...resto
}: ActionButtonProps) {
  return (
    <Button
      {...propsVariante[variante]}
      {...resto}
      {...(href ? { as: Link, href } : {})}
      isIconOnly={soloIcono}
      radius="md"
      startContent={soloIcono ? undefined : icono}
      endContent={iconoFinal}
      className={cn("shrink-0 font-semibold [&_svg]:size-4", variante === "secundario" && "bg-white", className)}
    >
      {soloIcono ? icono : children}
    </Button>
  );
}
