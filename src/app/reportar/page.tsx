import type { Metadata } from "next";
import FormularioReporte from "@/components/FormularioReporte";
import MarcoCelular from "@/components/MarcoCelular";

export const metadata: Metadata = { title: "Crear reporte | VERde" };

export default function Reportar() {
  return (
    <MarcoCelular>
      <FormularioReporte />
    </MarcoCelular>
  );
}
