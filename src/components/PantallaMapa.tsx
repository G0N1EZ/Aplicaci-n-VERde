"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useReportes } from "@/lib/almacen";
import { CATEGORIAS, ESTADOS } from "@/lib/categorias";

// Leaflet necesita el navegador, por eso el mapa no se genera en el servidor.
const Mapa = dynamic(() => import("./Mapa"), {
  ssr: false,
  loading: () => (
    <p className="flex h-full items-center justify-center text-zinc-600">
      Cargando mapa…
    </p>
  ),
});

export default function PantallaMapa() {
  const reportes = useReportes();
  // Al terminar de crear un reporte se llega con ?reporte=ID y se muestra abierto.
  const recienCreado = useSearchParams().get("reporte");
  const [seleccionadoId, setSeleccionadoId] = useState(recienCreado);
  const reporte = reportes.find((r) => r.id === seleccionadoId);

  return (
    <>
      <header className="z-10 bg-green-800 px-5 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] text-white">
        <h1 className="text-2xl font-bold leading-tight">VERde</h1>
        <p className="text-sm text-green-100">
          {reportes.length} reportes de la comunidad
        </p>
      </header>

      <main className="relative min-h-0 flex-1">
        {/* "isolate" evita que las capas de Leaflet tapen los botones */}
        <div className="isolate h-full">
          <Mapa
            reportes={reportes}
            seleccionadoId={seleccionadoId}
            onSeleccionar={setSeleccionadoId}
          />
        </div>

        <ul
          aria-label="Categorías"
          className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-between rounded-full bg-white/95 px-4 py-2 text-[11px] font-medium text-zinc-800 shadow-md"
        >
          {Object.values(CATEGORIAS).map(({ nombre, color }) => (
            <li key={nombre} className="flex items-center gap-1">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {nombre}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+1.75rem)] z-10 flex flex-col items-end gap-3">
          <Link
            href="/reportar"
            className="pointer-events-auto rounded-full bg-green-700 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-green-800 active:scale-95"
          >
            + Reportar
          </Link>

          {reporte && (
            <section
              aria-label="Reporte seleccionado"
              aria-live="polite"
              className="pointer-events-auto relative w-full rounded-2xl bg-white p-4 pr-12 text-zinc-900 shadow-xl"
            >
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setSeleccionadoId(null)}
                className="absolute right-1 top-1 flex size-11 items-center justify-center text-2xl text-zinc-600"
              >
                ×
              </button>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: CATEGORIAS[reporte.categoria].color }}
                />
                {CATEGORIAS[reporte.categoria].nombre}
              </h2>
              <div className="mt-1 flex gap-3">
                {reporte.foto && (
                  <Image
                    src={reporte.foto}
                    alt="Foto del reporte"
                    width={72}
                    height={72}
                    unoptimized
                    className="size-18 shrink-0 rounded-xl object-cover"
                  />
                )}
                <p className="line-clamp-3 min-w-0 self-start wrap-anywhere text-sm text-zinc-700">
                  {reporte.descripcion}
                </p>
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span
                  className={`rounded-full px-2.5 py-1 font-semibold ${ESTADOS[reporte.estado].clases}`}
                >
                  {ESTADOS[reporte.estado].nombre}
                </span>
                {reporte.comuna} ·{" "}
                {new Date(reporte.fecha).toLocaleDateString("es-CL", {
                  day: "numeric",
                  month: "long",
                  timeZone: "UTC",
                })}
                {reporte.anonimo && " · Anónimo"}
              </p>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
