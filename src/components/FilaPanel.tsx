"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIAS, ESTADOS, ORDEN_ESTADOS } from "@/lib/categorias";
import { formatearFecha } from "@/lib/fechas";
import type { Estado, Reporte } from "@/types";

type Props = {
  reporte: Reporte;
  apoyos: number;
  onCambiar: (reporte: Reporte, estado: Estado) => void;
};

export default function FilaPanel({ reporte, apoyos, onCambiar }: Props) {
  // null = sin cambios por guardar
  const [elegido, setElegido] = useState<Estado | null>(null);
  const { nombre, icono, color } = CATEGORIAS[reporte.categoria];
  const pendiente = elegido !== null && elegido !== reporte.estado;
  const idCampo = `estado-${reporte.id}`;

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm lg:grid lg:grid-cols-[1fr_26rem] lg:items-center lg:gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="flex items-center gap-2 font-bold">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full border-2 text-xs"
              style={{ borderColor: color }}
            >
              {icono}
            </span>
            {nombre}, {reporte.comuna}
          </h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADOS[reporte.estado].clases}`}
          >
            {ESTADOS[reporte.estado].nombre}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 wrap-anywhere text-sm text-zinc-700">
          {reporte.descripcion}
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          {formatearFecha(reporte.fecha)} · {apoyos}{" "}
          {apoyos === 1 ? "apoyo" : "apoyos"}
          {reporte.anonimo && " · Anónimo"}
        </p>
        <Link
          href={`/reporte/${reporte.id}?desde=panel`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline underline-offset-4"
        >
          Ver detalle
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!pendiente) return;
          onCambiar(reporte, elegido);
          setElegido(null);
        }}
      >
        <label htmlFor={idCampo} className="text-sm font-semibold">
          Cambiar estado
          <span className="sr-only">
            {" "}
            de {nombre}, {reporte.comuna}
          </span>
        </label>
        <div className="mt-1 flex gap-2">
          <select
            id={idCampo}
            value={elegido ?? reporte.estado}
            onChange={(e) => setElegido(e.target.value as Estado)}
            className="min-h-12 min-w-0 flex-1 rounded-xl border-2 border-zinc-300 bg-white px-3"
          >
            {ORDEN_ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADOS[estado].nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!pendiente}
            className="min-h-12 rounded-xl bg-green-700 px-4 font-bold text-white hover:bg-green-800 disabled:bg-zinc-200 disabled:text-zinc-600"
          >
            Guardar
          </button>
        </div>
      </form>
    </li>
  );
}
