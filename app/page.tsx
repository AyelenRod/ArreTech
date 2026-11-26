import { redirect } from "next/navigation";
import { rutaInicial } from "@/config/navigation";

export default function Inicio() {
  redirect(rutaInicial);
}
