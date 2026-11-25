import type { Categoria, Estado } from "@/types";

export const CATEGORIAS: Record<
  Categoria,
  { nombre: string; color: string; icono: string }
> = {
  microbasural: { nombre: "Microbasural", color: "#b45309", icono: "🗑️" },
  agua: { nombre: "Agua", color: "#0284c7", icono: "💧" },
  aire: { nombre: "Aire", color: "#7c3aed", icono: "💨" },
  arboles: { nombre: "Árboles", color: "#16a34a", icono: "🌳" },
  ruido: { nombre: "Ruido", color: "#db2777", icono: "🔊" },
};

export const ESTADOS: Record<
  Estado,
  { nombre: string; detalle: string; clases: string }
> = {
  recibido: {
    nombre: "Recibido",
    detalle: "El reporte ya aparece en el mapa.",
    clases: "bg-zinc-200 text-zinc-800",
  },
  validado: {
    nombre: "Validado por la comunidad",
    detalle: "Otras personas confirmaron el problema.",
    clases: "bg-sky-100 text-sky-900",
  },
  derivado: {
    nombre: "Derivado a JJVV/Municipio",
    detalle: "Llegó a la junta de vecinos o al municipio.",
    clases: "bg-violet-100 text-violet-900",
  },
  en_revision: {
    nombre: "En revisión",
    detalle: "Se está evaluando qué hacer.",
    clases: "bg-amber-100 text-amber-900",
  },
  resuelto: {
    nombre: "Resuelto",
    detalle: "El caso se cerró.",
    clases: "bg-green-100 text-green-900",
  },
};

// Orden en que avanza un caso.
export const ORDEN_ESTADOS: Estado[] = [
  "recibido",
  "validado",
  "derivado",
  "en_revision",
  "resuelto",
];
