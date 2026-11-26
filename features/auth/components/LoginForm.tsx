"use client";

import { Button, Checkbox, Form, Input } from "@heroui/react";
import { ArrowRight, Mail } from "lucide-react";
import { CampoContrasena } from "./CampoContrasena";
import { clasesCampo } from "./clasesCampo";

export function LoginForm() {
  return (
    <Form
      validationBehavior="native"
      onSubmit={(evento) => evento.preventDefault()}
      className="flex flex-col items-stretch gap-4"
    >
      <Input
        name="identificador"
        type="text"
        label="Correo Electrónico o Número de Empleado"
        labelPlacement="outside-top"
        placeholder="c.mendoza@arretech.com"
        autoComplete="username"
        variant="bordered"
        radius="lg"
        isRequired
        errorMessage="Ingresa tu correo o número de empleado."
        classNames={clasesCampo}
        startContent={<Mail className="size-4 shrink-0 text-default-400" aria-hidden />}
      />

      <CampoContrasena />

      <Checkbox name="recordar" defaultSelected size="sm" radius="sm" classNames={{ label: "text-xs text-default-600" }}>
        Recordar sesión en este equipo
      </Checkbox>

      <Button
        type="submit"
        color="primary"
        radius="lg"
        className="h-10 font-semibold"
        endContent={<ArrowRight className="size-4" aria-hidden />}
      >
        Ingresar al Sistema
      </Button>
    </Form>
  );
}
