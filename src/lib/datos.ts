import capsulasJson from "../../data/capsulas.json";
import reportesJson from "../../data/reportes.json";
import type { Capsula, Reporte } from "@/types";

// Único lugar que lee los JSON. Si más adelante hay backend, se cambia solo aquí.
export const reportes = reportesJson as Reporte[];
export const capsulas = capsulasJson as Capsula[];
