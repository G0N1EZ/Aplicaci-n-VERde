"use client";

import Link from "next/link";
import { useState } from "react";
import {
  cambiarEstado,
  useApoyos,
  useEnNavegador,
  useReportes,
} from "@/lib/almacen";
import { CATEGORIAS, ESTADOS, ORDEN_ESTADOS } from "@/lib/categorias";
import { hoy, nombreDelMes } from "@/lib/fechas";
import { calcularIndicadores } from "@/lib/indicadores";
import type { Categoria, Estado, Reporte } from "@/types";
import FilaPanel from "./FilaPanel";

// "Ñuñoa", "ñuñoa " y "Nunoa" cuentan como la misma comuna.
function claveComuna(comuna: string) {
  return comuna
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function Indicador({
  titulo,
  valor,
  unidad,
  nota,
}: {
  titulo: string;
  valor: string;
  unidad?: string;
  nota: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm">
      <dt className="text-sm font-medium text-zinc-700">{titulo}</dt>
      <dd className="mt-1 text-4xl font-semibold text-zinc-900 lg:text-5xl">
        {valor}
        {unidad && <span className="text-lg"> {unidad}</span>}
      </dd>
      <dd className="mt-1 text-xs text-zinc-600">{nota}</dd>
    </div>
  );
}

function Filtro({
  id,
  titulo,
  todos,
  valor,
  opciones,
  onCambiar,
  className = "",
}: {
  id: string;
  titulo: string;
  todos: string;
  valor: string;
  opciones: [valor: string, texto: string][];
  onCambiar: (valor: string) => void;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold">
        {titulo}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-1 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-3"
      >
        <option value="">{todos}</option>
        {opciones.map(([v, texto]) => (
          <option key={v} value={v}>
            {texto}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function PanelMunicipal() {
  const reportes = useReportes();
  const apoyados = useApoyos();
  const enNavegador = useEnNavegador();
  const [comuna, setComuna] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [estado, setEstado] = useState<Estado | "">("");
  const [aviso, setAviso] = useState("");

  const comunas = new Map<string, string>();
  for (const r of reportes) {
    const clave = claveComuna(r.comuna);
    if (!comunas.has(clave)) comunas.set(clave, r.comuna);
  }

  const visibles = reportes
    .filter(
      (r) =>
        (!comuna || claveComuna(r.comuna) === comuna) &&
        (!categoria || r.categoria === categoria) &&
        (!estado || r.estado === estado),
    )
    .reverse() // a igual fecha, primero el creado más recientemente
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const hayFiltros = !!(comuna || categoria || estado);

  function limpiar() {
    setComuna("");
    setCategoria("");
    setEstado("");
  }

  function guardarEstado(reporte: Reporte, nuevo: Estado) {
    const { nombre } = CATEGORIAS[reporte.categoria];
    setAviso(
      cambiarEstado(reporte.id, nuevo)
        ? `${nombre}, ${reporte.comuna}: ahora está en «${ESTADOS[nuevo].nombre}».`
        : "No se pudo guardar el cambio en este navegador.",
    );
  }

  const fechaHoy = hoy();
  const i = calcularIndicadores(visibles, fechaHoy.slice(0, 7));

  return (
    <div className="min-h-dvh bg-zinc-100 text-zinc-900">
      <header className="bg-green-800 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <div>
            <p className="text-sm font-semibold text-green-100">VERde</p>
            <h1 className="text-xl font-bold lg:text-2xl">
              Panel municipal y JJVV
            </h1>
          </div>
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-full border-2 border-white px-4 font-semibold"
          >
            Ver mapa
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-5">
        {/* Se espera al navegador: los datos y la fecha de hoy dependen de él. */}
        {!enNavegador ? (
          <p className="py-20 text-center text-zinc-700">Cargando panel…</p>
        ) : (
          <>
            <section aria-label="Filtros">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <Filtro
                  id="filtro-comuna"
                  titulo="Comuna"
                  todos="Todas"
                  valor={comuna}
                  opciones={[...comunas].sort((a, b) =>
                    a[1].localeCompare(b[1], "es"),
                  )}
                  onCambiar={setComuna}
                  className="col-span-2 lg:col-span-1"
                />
                <Filtro
                  id="filtro-categoria"
                  titulo="Categoría"
                  todos="Todas"
                  valor={categoria}
                  opciones={Object.entries(CATEGORIAS).map(([id, c]) => [
                    id,
                    c.nombre,
                  ])}
                  onCambiar={(v) => setCategoria(v as Categoria | "")}
                />
                <Filtro
                  id="filtro-estado"
                  titulo="Estado"
                  todos="Todos"
                  valor={estado}
                  opciones={ORDEN_ESTADOS.map((e) => [e, ESTADOS[e].nombre])}
                  onCambiar={(v) => setEstado(v as Estado | "")}
                />
              </div>
              {hayFiltros && (
                <button
                  type="button"
                  onClick={limpiar}
                  className="mt-1 min-h-11 text-sm font-semibold text-green-800 underline underline-offset-4"
                >
                  Limpiar filtros
                </button>
              )}
            </section>

            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Indicador
                titulo={`Reportes de ${nombreDelMes(fechaHoy)}`}
                valor={String(i.delMes)}
                nota="Creados este mes"
              />
              <Indicador
                titulo="Resueltos"
                valor={String(i.resueltos)}
                nota={
                  i.total > 0
                    ? `De ${i.total} en total (${Math.round((i.resueltos / i.total) * 100)}%)`
                    : "Sin reportes"
                }
              />
              <Indicador
                titulo="Casos abiertos"
                valor={String(i.abiertos)}
                nota="Todavía sin resolver"
              />
              <Indicador
                titulo="Respuesta promedio"
                valor={
                  i.promedioRespuesta === null
                    ? "—"
                    : i.promedioRespuesta.toLocaleString("es-CL", {
                        maximumFractionDigits: 1,
                      })
                }
                unidad={i.promedioRespuesta === null ? undefined : "días"}
                nota={
                  i.respondidos === 0
                    ? "Aún no hay casos en revisión"
                    : `Hasta «En revisión» (${i.respondidos} ${i.respondidos === 1 ? "caso" : "casos"})`
                }
              />
            </dl>

            <section>
              <h2 className="text-lg font-bold">
                {visibles.length === 1
                  ? "1 reporte"
                  : `${visibles.length} reportes`}
              </h2>
              {visibles.length === 0 ? (
                <div className="mt-3 rounded-2xl bg-white p-8 text-center">
                  <p>No hay reportes con estos filtros.</p>
                </div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {visibles.map((r) => (
                    <FilaPanel
                      key={r.id}
                      reporte={r}
                      apoyos={r.apoyos + (apoyados.includes(r.id) ? 1 : 0)}
                      onCambiar={guardarEstado}
                    />
                  ))}
                </ul>
              )}
            </section>

            <p className="text-sm text-zinc-600">
              Prototipo con datos ficticios y sin inicio de sesión. Los cambios
              se guardan solo en este navegador.
            </p>
          </>
        )}
      </main>

      {/* Aviso fijo: se ve aunque la fila cambiada salga de la lista por un filtro. */}
      <div
        role="status"
        className="pointer-events-none fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] mx-auto max-w-md"
      >
        {aviso && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-zinc-900 py-2 pl-4 pr-1 text-sm text-white shadow-xl">
            <p className="flex-1 wrap-anywhere">{aviso}</p>
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => setAviso("")}
              className="flex size-11 shrink-0 items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
