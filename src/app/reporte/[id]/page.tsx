import type { Metadata } from "next";
import DetalleReporte from "@/components/DetalleReporte";
import MarcoCelular from "@/components/MarcoCelular";

export const metadata: Metadata = { title: "Detalle del reporte | VERde" };

// [id] cambia según el reporte: /reporte/1, /reporte/2…
export default async function Pagina({
  params,
  searchParams,
}: PageProps<"/reporte/[id]">) {
  const { id } = await params;
  const { desde } = await searchParams;
  return (
    <MarcoCelular conBarra>
      <DetalleReporte id={id} desdePanel={desde === "panel"} />
    </MarcoCelular>
  );
}
