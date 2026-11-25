"use client";

import Link from "next/link";
import {
  esPropio,
  useApoyos,
  useEnNavegador,
  useReportes,
} from "@/lib/almacen";
import { CATEGORIAS, ESTADOS } from "@/lib/categorias";
import { formatearFecha } from "@/lib/fechas";
import type { Reporte } from "@/types";

function Lista({ reportes }: { reportes: Reporte[] }) {
  return (
    <ul className="mt-3 space-y-3">
      {reportes.map((r) => (
        <li key={r.id}>
          <Link
            href={`/reporte/${r.id}`}
            className="block rounded-2xl border-2 border-zinc-200 p-4 hover:bg-zinc-50"
          >
            <span className="flex items-center gap-2 font-bold wrap-anywhere">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs"
                style={{ borderColor: CATEGORIAS[r.categoria].color }}
              >
                {CATEGORIAS[r.categoria].icono}
              </span>
              {CATEGORIAS[r.categoria].nombre}, {r.comuna}
            </span>
            <span className="mt-1.5 line-clamp-2 wrap-anywhere text-sm text-zinc-700">
              {r.descripcion}
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
              <span
                className={`rounded-full px-2.5 py-1 font-semibold ${ESTADOS[r.estado].clases}`}
              >
                {ESTADOS[r.estado].nombre}
              </span>
              {formatearFecha(r.fecha)}
              {r.anonimo && " · Anónimo"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function MiActividad() {
  const reportes = useReportes();
  const apoyos = useApoyos();
  const enNavegador = useEnNavegador();

  if (!enNavegador) {
    return (
      <p className="py-20 text-center text-zinc-700">Cargando tu actividad…</p>
    );
  }

  // reverse: primero lo más reciente
  const propios = reportes.filter((r) => esPropio(r.id)).reverse();
  const apoyados = apoyos
    .flatMap((id) => reportes.find((r) => r.id === id) ?? [])
    .reverse();

  return (
    <>
      <section>
        <h2 className="text-lg font-bold">Mis reportes ({propios.length})</h2>
        {propios.length > 0 ? (
          <Lista reportes={propios} />
        ) : (
          <div className="mt-3 rounded-2xl bg-zinc-100 p-5 text-center">
            <p>Todavía no has creado reportes.</p>
            <Link
              href="/reportar"
              className="mt-3 inline-flex min-h-12 items-center rounded-full bg-green-700 px-6 font-bold text-white hover:bg-green-800"
            >
              + Reportar
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold">
          Reportes que apoyo ({apoyados.length})
        </h2>
        {apoyados.length > 0 ? (
          <Lista reportes={apoyados} />
        ) : (
          <p className="mt-3 rounded-2xl bg-zinc-100 p-5 text-center">
            Abre un reporte del mapa y toca «Apoyar este reporte».
          </p>
        )}
      </section>

      <p className="text-sm text-zinc-600">
        Tu actividad se guarda solo en este navegador. Quien lo use también
        podrá verla, incluidos tus reportes anónimos.
      </p>
    </>
  );
}
