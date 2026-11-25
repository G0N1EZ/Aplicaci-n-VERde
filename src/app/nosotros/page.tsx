import type { Metadata } from "next";
import Link from "next/link";
import AvisoBorrador from "@/components/AvisoBorrador";
import Pagina from "@/components/Pagina";
import { nosotros } from "@/lib/datos";

export const metadata: Metadata = { title: "Nosotros | VERde" };

const ENLACES = [
  {
    href: "/privacidad",
    titulo: "Privacidad y seguridad",
    texto: "Qué datos se guardan y los protocolos éticos.",
  },
  {
    href: "/aliados",
    titulo: "Aliados",
    texto: "Municipios, clínicas jurídicas, JJVV y ONG.",
  },
  {
    href: "/panel",
    titulo: "Panel municipal y JJVV",
    texto: "La herramienta para gestionar los reportes.",
  },
];

export default function Nosotros() {
  return (
    <Pagina titulo="Nosotros">
      <section className="-mx-5 -mt-6 bg-green-800 px-5 pb-8 pt-4 text-white">
        <p className="font-semibold text-green-100">VERde</p>
        <h2 className="mt-1 text-3xl font-bold leading-tight text-balance">
          {nosotros.lema}
        </h2>
        <p className="mt-3 text-green-50">{nosotros.bajada}</p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-12 items-center rounded-full bg-white px-6 font-bold text-green-900"
        >
          Ver el mapa
        </Link>
      </section>

      <AvisoBorrador titulo="Borrador">
        La misión, la visión, los pilares y los valores son una propuesta. El
        grupo debe revisarlos y reemplazarlos.
      </AvisoBorrador>

      <section>
        <h2 className="text-lg font-bold">Misión</h2>
        <p className="mt-1 text-zinc-800">{nosotros.mision}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold">Visión</h2>
        <p className="mt-1 text-zinc-800">{nosotros.vision}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold">Pilares VER</h2>
        <ul className="mt-3 space-y-4">
          {nosotros.pilares.map((p) => (
            <li key={p.letra} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-green-800 text-2xl font-bold text-white"
              >
                {p.letra}
              </span>
              <div>
                <h3 className="font-bold">{p.nombre}</h3>
                <p className="text-zinc-700">{p.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">Valores</h2>
        <dl className="mt-2 divide-y divide-zinc-200">
          {nosotros.valores.map((v) => (
            <div key={v.nombre} className="py-3">
              <dt className="font-bold">{v.nombre}</dt>
              <dd className="text-zinc-700">{v.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-bold">Más sobre VERde</h2>
        <ul className="mt-3 space-y-3">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="flex items-center justify-between gap-3 rounded-2xl border-2 border-zinc-200 p-4 hover:bg-zinc-50"
              >
                <span>
                  <span className="block font-bold">{e.titulo}</span>
                  <span className="block text-sm text-zinc-700">{e.texto}</span>
                </span>
                <span aria-hidden="true" className="text-xl text-green-800">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Pagina>
  );
}
