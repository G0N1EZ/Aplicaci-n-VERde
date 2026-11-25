import type { Metadata } from "next";
import AvisoBorrador from "@/components/AvisoBorrador";
import Pagina from "@/components/Pagina";
import { privacidad } from "@/lib/datos";

export const metadata: Metadata = { title: "Privacidad y seguridad | VERde" };

export default function Privacidad() {
  return (
    <Pagina
      titulo="Privacidad y seguridad"
      volverA="/nosotros"
      textoVolver="Volver a Nosotros"
    >
      <section>
        <h2 className="text-lg font-bold">Cómo funciona este prototipo</h2>
        <dl className="mt-2 divide-y divide-zinc-200">
          {privacidad.comoFunciona.map((p) => (
            <div key={p.titulo} className="py-3">
              <dt className="font-bold">{p.titulo}</dt>
              <dd className="text-zinc-700">{p.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-bold">Protocolos éticos</h2>
        <div className="mt-3">
          <AvisoBorrador titulo="Por redactar">
            Aquí van los protocolos del grupo. Los temas son una sugerencia y
            todavía no hay ninguno vigente.
          </AvisoBorrador>
        </div>
        <ul className="mt-4 space-y-3">
          {privacidad.protocolos.map((p) => (
            <li
              key={p.titulo}
              className={`rounded-2xl border-2 p-4 ${p.texto ? "border-zinc-200" : "border-dashed border-zinc-300"}`}
            >
              <h3 className="font-bold">{p.titulo}</h3>
              <p
                className={
                  p.texto
                    ? "mt-1 whitespace-pre-line text-zinc-700"
                    : "mt-1 text-sm text-zinc-600"
                }
              >
                {p.texto ?? "Pendiente"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </Pagina>
  );
}
