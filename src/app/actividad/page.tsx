import type { Metadata } from "next";
import MiActividad from "@/components/MiActividad";
import Pagina from "@/components/Pagina";

export const metadata: Metadata = { title: "Mi actividad | VERde" };

export default function Actividad() {
  return (
    <Pagina titulo="Mi actividad">
      <MiActividad />
    </Pagina>
  );
}
