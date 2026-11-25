import { Suspense } from "react";
import MarcoCelular from "@/components/MarcoCelular";
import PantallaMapa from "@/components/PantallaMapa";

export default function Inicio() {
  return (
    <MarcoCelular conBarra>
      {/* Suspense: Next.js lo exige porque la pantalla lee la dirección (?reporte=) */}
      <Suspense>
        <PantallaMapa />
      </Suspense>
    </MarcoCelular>
  );
}
