import type { Metadata } from "next";
import AvisoBorrador from "@/components/AvisoBorrador";
import Pagina from "@/components/Pagina";
import { CATEGORIAS } from "@/lib/categorias";
import { biblioteca } from "@/lib/datos";

export const metadata: Metadata = { title: "Cápsulas | VERde" };

// Contenido FALSO a propósito: se reemplaza en data/biblioteca.json
// cuando el grupo grabe las cápsulas.
export default function Capsulas() {
  return (
    <Pagina titulo="Cápsulas">
      <AvisoBorrador titulo="Contenido falso: hay que cambiarlo">
        Aquí irán las cápsulas que grabe el grupo. Los títulos y textos de abajo
        solo muestran cómo se verá la biblioteca.
      </AvisoBorrador>

      <ul className="space-y-6">
        {biblioteca.map((c) => {
          const { nombre, icono, color } = CATEGORIAS[c.categoria];
          return (
            <li key={c.id}>
              <div
                className="flex aspect-video flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed bg-zinc-50 text-zinc-700"
                style={{ borderColor: color }}
              >
                <span aria-hidden="true" className="text-4xl">
                  {icono}
                </span>
                <span className="text-sm font-semibold">Video pendiente</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-zinc-600">
                {nombre}
              </p>
              <h2 className="text-lg font-bold">{c.titulo}</h2>
              <p className="text-sm text-zinc-700">{c.descripcion}</p>
            </li>
          );
        })}
      </ul>
    </Pagina>
  );
}
