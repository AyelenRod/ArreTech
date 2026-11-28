"use client";

import {
  Alert,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useId, useState } from "react";

export type DatosFormulario = Record<string, string>;
export type ErroresFormulario = Record<string, string | undefined>;

interface FormOverlayProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  descripcion?: string;
  variante?: "modal" | "drawer";
  textoEnviar?: string;
  /** Reglas que la validación nativa no cubre (p. ej. CHECK de la BD). Devuelve errores por `name`. */
  validar?: (datos: DatosFormulario) => ErroresFormulario;
  /** Si lanza un Error, su mensaje se muestra dentro del formulario. */
  onEnviar: (datos: DatosFormulario) => void | Promise<void>;
  children: React.ReactNode;
}

function leerFormulario(formulario: HTMLFormElement): DatosFormulario {
  const datos: DatosFormulario = {};
  new FormData(formulario).forEach((valor, clave) => {
    if (typeof valor === "string") datos[clave] = valor.trim();
  });
  return datos;
}

function limpiarErrores(errores: ErroresFormulario = {}): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errores).filter((entrada): entrada is [string, string] => Boolean(entrada[1])),
  );
}

export function FormOverlay({
  abierto,
  onCerrar,
  titulo,
  descripcion,
  variante = "modal",
  textoEnviar = "Guardar",
  validar,
  onEnviar,
  children,
}: FormOverlayProps) {
  const idFormulario = useId();
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const cerrar = () => {
    setErrores({});
    setErrorGeneral(null);
    onCerrar();
  };

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const datos = leerFormulario(evento.currentTarget);
    const nuevosErrores = limpiarErrores(validar?.(datos));
    setErrores(nuevosErrores);
    setErrorGeneral(null);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await onEnviar(datos);
      cerrar();
    } catch (error) {
      setErrorGeneral(error instanceof Error ? error.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const encabezado = (
    <>
      <span>{titulo}</span>
      {descripcion && <span className="text-sm font-normal text-default-500">{descripcion}</span>}
    </>
  );

  const cuerpo = (
    <Form
      id={idFormulario}
      validationBehavior="native"
      validationErrors={errores}
      onSubmit={enviar}
      className="flex flex-col items-stretch gap-4"
    >
      {errorGeneral && <Alert color="danger" title="No se pudo guardar" description={errorGeneral} />}
      {/* Las reglas entre campos (p. ej. teléfono o correo) se reevalúan al enviar; si no, el otro campo queda bloqueado. */}
      <div
        className="contents"
        onInput={() => {
          if (Object.keys(errores).length > 0) setErrores({});
        }}
      >
        {children}
      </div>
    </Form>
  );

  const pie = (
    <>
      <Button variant="light" onPress={cerrar} isDisabled={enviando}>
        Cancelar
      </Button>
      <Button color="primary" type="submit" form={idFormulario} isLoading={enviando} className="font-semibold">
        {textoEnviar}
      </Button>
    </>
  );

  const alCambiarApertura = (abrir: boolean) => {
    if (!abrir) cerrar();
  };

  if (variante === "drawer") {
    return (
      <Drawer isOpen={abierto} onOpenChange={alCambiarApertura} placement="right" size="md" isDismissable={!enviando}>
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">{encabezado}</DrawerHeader>
          <DrawerBody>{cuerpo}</DrawerBody>
          <DrawerFooter className="flex-wrap">{pie}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal
      isOpen={abierto}
      onOpenChange={alCambiarApertura}
      size="lg"
      scrollBehavior="inside"
      placement="center"
      isDismissable={!enviando}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{encabezado}</ModalHeader>
        <ModalBody>{cuerpo}</ModalBody>
        <ModalFooter className="flex-wrap">{pie}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
