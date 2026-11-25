import type { Metadata } from "next";
import FormularioOrientacion from "@/components/FormularioOrientacion";
import MarcoCelular from "@/components/MarcoCelular";

export const metadata: Metadata = { title: "Orientación jurídica | VERde" };

export default async function Pagina({
  params,
}: PageProps<"/reporte/[id]/orientacion">) {
  const { id } = await params;
  return (
    <MarcoCelular>
      <FormularioOrientacion id={id} />
    </MarcoCelular>
  );
}
