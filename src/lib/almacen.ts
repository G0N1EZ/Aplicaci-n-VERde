"use client";

// Reportes creados por la persona, guardados en el localStorage de su navegador
// y sumados a los de data/reportes.json. También guarda qué reportes
// apoya y los cambios de estado hechos en el panel.

import { useSyncExternalStore } from "react";
import { CATEGORIAS, ESTADOS, ORDEN_ESTADOS } from "@/lib/categorias";
import { reportes as reportesDeEjemplo } from "@/lib/datos";
import { hoy } from "@/lib/fechas";
import type { CambioEstado, Estado, Reporte } from "@/types";

const CLAVE = "verde:reportes";
const CLAVE_APOYOS = "verde:apoyos";
const CLAVE_HISTORIALES = "verde:historiales"; // { idReporte: historial }
const PREFIJO_PROPIO = "local-"; // así empiezan los ids creados en la app
const oyentes = new Set<() => void>();

let ultimoTexto: string | null = null;
let ultimoTextoHistoriales: string | null = null;
let ultimaLista: Reporte[] = reportesDeEjemplo;

const SIN_APOYOS: string[] = [];
let ultimoTextoApoyos: string | null = null;
let ultimosApoyos = SIN_APOYOS;

function esHistorial(dato: unknown): dato is CambioEstado[] {
  return (
    Array.isArray(dato) &&
    dato.length > 0 &&
    dato.every(
      (h) =>
        Object.hasOwn(ESTADOS, h?.estado ?? "") && typeof h.fecha === "string",
    )
  );
}

// Lo guardado puede estar dañado o ser de una versión antigua de la app:
// lo que no tenga la forma esperada se ignora para que el mapa no falle.
function esReporte(dato: unknown): dato is Reporte {
  const r = dato as Reporte | null;
  return (
    typeof r === "object" &&
    r !== null &&
    typeof r.id === "string" &&
    Object.hasOwn(CATEGORIAS, r.categoria) &&
    Object.hasOwn(ESTADOS, r.estado) &&
    typeof r.descripcion === "string" &&
    typeof r.comuna === "string" &&
    typeof r.fecha === "string" &&
    typeof r.anonimo === "boolean" &&
    (r.foto === null || typeof r.foto === "string") &&
    Number.isFinite(r.ubicacion?.lat) &&
    Number.isFinite(r.ubicacion?.lng) &&
    esHistorial(r.historial)
  );
}

function leerTexto(clave: string) {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null; // el navegador bloquea el almacenamiento
  }
}

function interpretar(texto: string | null): Reporte[] {
  if (!texto) return [];
  try {
    const datos: unknown = JSON.parse(texto);
    if (!Array.isArray(datos)) return [];
    // Los reportes guardados antes de que existieran los apoyos no traen el campo.
    return datos
      .filter(esReporte)
      .map((r) => ({ ...r, apoyos: Number.isFinite(r.apoyos) ? r.apoyos : 0 }));
  } catch {
    return [];
  }
}

function interpretarApoyos(texto: string | null): string[] {
  if (!texto) return SIN_APOYOS;
  try {
    const datos: unknown = JSON.parse(texto);
    return Array.isArray(datos)
      ? datos.filter((id) => typeof id === "string")
      : SIN_APOYOS;
  } catch {
    return SIN_APOYOS;
  }
}

function interpretarHistoriales(
  texto: string | null,
): Map<string, CambioEstado[]> {
  if (!texto) return new Map();
  try {
    const datos: unknown = JSON.parse(texto);
    if (typeof datos !== "object" || datos === null) return new Map();
    return new Map(
      Object.entries(datos).filter((par): par is [string, CambioEstado[]] =>
        esHistorial(par[1]),
      ),
    );
  } catch {
    return new Map();
  }
}

// React exige recibir la misma lista mientras nada cambie.
function obtenerLista() {
  const texto = leerTexto(CLAVE);
  const textoHistoriales = leerTexto(CLAVE_HISTORIALES);
  if (texto !== ultimoTexto || textoHistoriales !== ultimoTextoHistoriales) {
    ultimoTexto = texto;
    ultimoTextoHistoriales = textoHistoriales;
    const historiales = interpretarHistoriales(textoHistoriales);
    ultimaLista = [...reportesDeEjemplo, ...interpretar(texto)].map((r) => {
      const historial = historiales.get(r.id);
      return historial
        ? { ...r, historial, estado: historial[historial.length - 1].estado }
        : r;
    });
  }
  return ultimaLista;
}

function obtenerApoyos() {
  const texto = leerTexto(CLAVE_APOYOS);
  if (texto !== ultimoTextoApoyos) {
    ultimoTextoApoyos = texto;
    ultimosApoyos = interpretarApoyos(texto);
  }
  return ultimosApoyos;
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  window.addEventListener("storage", avisar); // cambios desde otra pestaña
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Reportes de ejemplo + los guardados en este navegador. */
export function useReportes() {
  return useSyncExternalStore(
    suscribir,
    obtenerLista,
    () => reportesDeEjemplo, // en el servidor no hay localStorage
  );
}

export function crearId() {
  return `${PREFIJO_PROPIO}${Date.now()}`;
}

/** true si el reporte se creó en este navegador. */
export function esPropio(id: string) {
  return id.startsWith(PREFIJO_PROPIO);
}

/** false en el servidor y al cargar; true cuando ya se puede leer el navegador. */
export function useEnNavegador() {
  return useSyncExternalStore(
    suscribir,
    () => true,
    () => false,
  );
}

/** Un reporte por su id. "cargando" es true hasta poder leer el navegador. */
export function useReporte(id: string) {
  const reporte = useReportes().find((r) => r.id === id);
  const enNavegador = useEnNavegador();
  return { reporte, cargando: !reporte && !enNavegador };
}

/** Ids de los reportes que apoya quien usa este navegador. */
export function useApoyos() {
  return useSyncExternalStore(suscribir, obtenerApoyos, () => SIN_APOYOS);
}

/** Apoya o deja de apoyar. Devuelve false si no se pudo guardar. */
export function alternarApoyo(id: string) {
  try {
    const actuales = interpretarApoyos(localStorage.getItem(CLAVE_APOYOS));
    const nuevos = actuales.includes(id)
      ? actuales.filter((otro) => otro !== id)
      : [...actuales, id];
    localStorage.setItem(CLAVE_APOYOS, JSON.stringify(nuevos));
  } catch {
    return false;
  }
  oyentes.forEach((avisar) => avisar());
  return true;
}

/**
 * Cambia el estado de un reporte. Al avanzar, agrega el paso con la fecha de hoy.
 * Al retroceder, borra los pasos posteriores (sirve para corregir errores).
 * Devuelve false si no se pudo guardar.
 */
export function cambiarEstado(id: string, estado: Estado) {
  const reporte = obtenerLista().find((r) => r.id === id);
  if (!reporte) return false;

  const destino = ORDEN_ESTADOS.indexOf(estado);
  const anteriores = reporte.historial.filter(
    (h) => ORDEN_ESTADOS.indexOf(h.estado) < destino,
  );
  const yaRegistrado = reporte.historial.find((h) => h.estado === estado);
  const historial = [...anteriores, yaRegistrado ?? { estado, fecha: hoy() }];

  try {
    const historiales = interpretarHistoriales(
      localStorage.getItem(CLAVE_HISTORIALES),
    );
    historiales.set(id, historial);
    localStorage.setItem(
      CLAVE_HISTORIALES,
      JSON.stringify(Object.fromEntries(historiales)),
    );
  } catch {
    return false;
  }
  oyentes.forEach((avisar) => avisar());
  return true;
}

/** Devuelve false si no se pudo guardar (por ejemplo, memoria llena). */
export function guardarReporte(reporte: Reporte) {
  try {
    const guardados = interpretar(localStorage.getItem(CLAVE));
    localStorage.setItem(CLAVE, JSON.stringify([...guardados, reporte]));
  } catch {
    return false;
  }
  oyentes.forEach((avisar) => avisar());
  return true;
}
