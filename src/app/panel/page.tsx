import type { Metadata } from "next";
import PanelMunicipal from "@/components/PanelMunicipal";

export const metadata: Metadata = { title: "Panel municipal y JJVV | VERde" };

// Sin MarcoCelular: en la oficina se usa en computador, a todo el ancho.
export default function Panel() {
  return <PanelMunicipal />;
}
