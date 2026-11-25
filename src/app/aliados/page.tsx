import type { Metadata } from "next";
import AvisoBorrador from "@/components/AvisoBorrador";
import Pagina from "@/components/Pagina";
import { aliados } from "@/lib/datos";
import type { EstadoAliado } from "@/types";

export const metadata: Metadata = { title: "Aliados | VERde" };

const ETIQUETAS: Record<EstadoAliado, { nombre: string; clases: string }> = {
  ficticio: { nombre: "Ficticio", clases: "bg-zinc-200 text-zinc-800" },
  en_conversacion: {
    nombre: "En conversación",
    clases: "bg-amber-100 text-amber-900",
  },
  confirmado: { nombre: "Confirmado", clases: "bg-green-100 text-green-900" },
};

export default function Aliados() {
  return (
    <Pagina
      titulo="Aliados"
      volverA="/nosotros"
      textoVolver="Volver a Nosotros"
    >
      <AvisoBorrador titulo="Aliados ficticios">
        Los nombres son inventados. Muestran qué tipo de alianzas
        busca VERde.
      </AvisoBorrador>

      {aliados.map((g) => (
        <section key={g.grupo}>
          <h2 className="text-lg font-bold">{g.grupo}</h2>
          <p className="text-sm text-zinc-700">{g.rol}</p>
          <ul className="mt-3 space-y-3">
            {g.aliados.map((a) => (
              <li
                key={a.nombre}
                className="flex items-center gap-3 rounded-2xl border-2 border-zinc-200 p-3"
              >
                {/* "Logo" provisorio: las iniciales */}
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-zinc-400 font-bold text-zinc-600"
                >
                  {a.nombre
                    .split(" ")
                    .map((palabra) => palabra[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <h3 className="font-bold">{a.nombre}</h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ETIQUETAS[a.estado].clases}`}
                  >
                    {ETIQUETAS[a.estado].nombre}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Pagina>
  );
}
