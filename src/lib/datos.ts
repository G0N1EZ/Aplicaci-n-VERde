import aliadosJson from "../../data/aliados.json";
import bibliotecaJson from "../../data/biblioteca.json";
import capsulasJson from "../../data/capsulas.json";
import nosotrosJson from "../../data/nosotros.json";
import privacidadJson from "../../data/privacidad.json";
import reportesJson from "../../data/reportes.json";
import type {
  Capsula,
  CapsulaBiblioteca,
  GrupoAliados,
  Privacidad,
  Reporte,
} from "@/types";

// Único lugar que lee los JSON. Si más adelante hay backend, se cambia solo aquí.
export const reportes = reportesJson as Reporte[];
export const capsulas = capsulasJson as Capsula[];
export const biblioteca = bibliotecaJson as CapsulaBiblioteca[];
export const aliados = aliadosJson as GrupoAliados[];
export const privacidad = privacidadJson as Privacidad;
export const nosotros = nosotrosJson;
