import datos from "@/data/reportes.json";

export type Categoria = "microbasural" | "agua" | "aire" | "arboles" | "ruido";
export type Estado = "recibido" | "en_revision" | "resuelto";

export type Reporte = {
  id: string;
  titulo: string;
  categoria: Categoria;
  comuna: string;
  lat: number;
  lng: number;
  descripcion: string;
  fecha: string; // AAAA-MM-DD
  estado: Estado;
  anonimo: boolean;
  autor: string | null;
};

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

export const ESTADOS: Record<Estado, { nombre: string; clases: string }> = {
  recibido: { nombre: "Recibido", clases: "bg-zinc-200 text-zinc-800" },
  en_revision: { nombre: "En revisión", clases: "bg-amber-100 text-amber-900" },
  resuelto: { nombre: "Resuelto", clases: "bg-green-100 text-green-900" },
};

export const reportes = datos as Reporte[];
