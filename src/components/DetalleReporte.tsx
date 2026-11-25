"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { alternarApoyo, useApoyos, useReporte } from "@/lib/almacen";
import { CATEGORIAS, ESTADOS } from "@/lib/categorias";
import { capsulas } from "@/lib/datos";
import { formatearFecha } from "@/lib/fechas";
import Encabezado from "./Encabezado";
import LineaDeTiempo from "./LineaDeTiempo";
import SinReporte from "./SinReporte";

type Props = {
  id: string;
  desdePanel: boolean; // la flecha vuelve al panel en vez del mapa
};

export default function DetalleReporte({ id, desdePanel }: Props) {
  const { reporte, cargando } = useReporte(id);
  const apoyado = useApoyos().includes(id);
  const [errorApoyo, setErrorApoyo] = useState(false);

  if (!reporte) return <SinReporte cargando={cargando} />;

  const { nombre, icono, color } = CATEGORIAS[reporte.categoria];
  const capsula = capsulas.find((c) => c.categoria === reporte.categoria);
  const apoyos = reporte.apoyos + (apoyado ? 1 : 0);

  return (
    <>
      <Encabezado
        titulo="Detalle del reporte"
        volverA={desdePanel ? "/panel" : `/?reporte=${id}`}
        textoVolver={desdePanel ? "Volver al panel" : "Volver al mapa"}
      />
      <main className="min-h-0 flex-1 overflow-y-auto text-zinc-900">
        {reporte.foto && (
          <div className="relative h-56 bg-zinc-100">
            <Image
              src={reporte.foto}
              alt="Foto del reporte"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-8 px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-5">
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full border-4 text-lg"
                style={{ borderColor: color }}
              >
                {icono}
              </span>
              {nombre}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              {reporte.comuna} · {formatearFecha(reporte.fecha)}
              {reporte.anonimo && " · Anónimo"}
            </p>
            <p
              className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${ESTADOS[reporte.estado].clases}`}
            >
              {ESTADOS[reporte.estado].nombre}
            </p>
            <p className="mt-3 whitespace-pre-line wrap-anywhere">
              {reporte.descripcion}
            </p>
          </section>

          <section>
            <button
              type="button"
              aria-pressed={apoyado}
              onClick={() => setErrorApoyo(!alternarApoyo(id))}
              className={`min-h-14 w-full rounded-full border-2 border-green-700 px-6 font-bold transition active:scale-[0.98] ${
                apoyado
                  ? "bg-green-100 text-green-900"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              {apoyado ? "✓ Apoyas este reporte" : "Apoyar este reporte"}
            </button>
            <p role="status" className="mt-2 text-center text-sm text-zinc-700">
              {errorApoyo
                ? "No se pudo guardar tu apoyo en este navegador."
                : apoyos === 0
                  ? "Sé la primera persona en apoyar."
                  : apoyos === 1
                    ? "1 persona apoya este reporte"
                    : `${apoyos} personas apoyan este reporte`}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">Estado del caso</h2>
            <LineaDeTiempo reporte={reporte} />
          </section>

          {capsula && (
            <section className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-800">
                Cápsula educativa · {capsula.duracion} min de lectura
              </p>
              <h2 className="mt-1 text-lg font-bold">{capsula.titulo}</h2>
              <p className="mt-2 leading-relaxed text-zinc-800">
                {capsula.contenido}
              </p>
            </section>
          )}

          <section className="rounded-2xl border-2 border-zinc-200 p-5">
            <h2 className="text-lg font-bold">¿Necesitas orientación?</h2>
            <p className="mt-1 text-sm text-zinc-700">
              Puedes pedir que una clínica jurídica te oriente sobre este caso.
              Es información general y no reemplaza una asesoría legal.
            </p>
            <Link
              href={`/reporte/${id}/orientacion`}
              className="mt-4 flex min-h-12 items-center justify-center rounded-full border-2 border-green-700 px-5 text-center font-bold text-green-800 hover:bg-green-50"
            >
              Solicitar orientación jurídica
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
