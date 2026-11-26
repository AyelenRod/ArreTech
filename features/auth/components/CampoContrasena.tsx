"use client";

import { Input } from "@heroui/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { clasesCampo } from "./clasesCampo";

export function CampoContrasena() {
  const [visible, setVisible] = useState(false);
  const Icono = visible ? EyeOff : Eye;

  return (
    <Input
      name="contrasena"
      type={visible ? "text" : "password"}
      label="Contraseña"
      labelPlacement="outside-top"
      placeholder="••••••••••••"
      autoComplete="current-password"
      variant="bordered"
      radius="lg"
      isRequired
      errorMessage="Ingresa tu contraseña."
      classNames={clasesCampo}
      startContent={<Lock className="size-4 shrink-0 text-default-400" aria-hidden />}
      endContent={
        <button
          type="button"
          onClick={() => setVisible((actual) => !actual)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="shrink-0 rounded text-default-400 outline-primary hover:text-default-600"
        >
          <Icono className="size-4" aria-hidden />
        </button>
      }
    />
  );
}
