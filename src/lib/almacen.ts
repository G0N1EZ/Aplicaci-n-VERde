"use client";

// Reportes creados por la persona, guardados en el localStorage de su navegador
// y sumados a los de data/reportes.json.

import { useSyncExternalStore } from "react";
import { CATEGORIAS, ESTADOS } from "@/lib/categorias";
import { reportes as reportesDeEjemplo } from "@/lib/datos";
import type { Reporte } from "@/types";

const CLAVE = "verde:reportes";
const oyentes = new Set<() => void>();

let ultimoTexto: string | null = null;
let ultimaLista: Reporte[] = reportesDeEjemplo;

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
    Array.isArray(r.historial)
  );
}

function leerTexto() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null; // el navegador bloquea el almacenamiento
  }
}

function interpretar(texto: string | null): Reporte[] {
  if (!texto) return [];
  try {
    const datos: unknown = JSON.parse(texto);
    return Array.isArray(datos) ? datos.filter(esReporte) : [];
  } catch {
    return [];
  }
}

// React exige recibir la misma lista mientras nada cambie.
function obtenerLista() {
  const texto = leerTexto();
  if (texto !== ultimoTexto) {
    ultimoTexto = texto;
    ultimaLista = [...reportesDeEjemplo, ...interpretar(texto)];
  }
  return ultimaLista;
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
