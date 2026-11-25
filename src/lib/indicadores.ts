import type { Reporte } from "@/types";

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function diasEntre(desde: string, hasta: string) {
  return (Date.parse(hasta) - Date.parse(desde)) / MS_POR_DIA;
}

/** Días desde que se recibió hasta que se empezó a revisar; null si aún no. */
function diasDeRespuesta(reporte: Reporte) {
  const respuesta = reporte.historial.find(
    // Si se saltó "En revisión", cuenta el día en que se resolvió.
    (h) => h.estado === "en_revision" || h.estado === "resuelto",
  );
  return respuesta ? diasEntre(reporte.fecha, respuesta.fecha) : null;
}

/** "mes" con formato AAAA-MM. */
export function calcularIndicadores(reportes: Reporte[], mes: string) {
  const respuestas = reportes
    .map(diasDeRespuesta)
    .filter((dias) => dias !== null);
  const resueltos = reportes.filter((r) => r.estado === "resuelto").length;

  return {
    total: reportes.length,
    delMes: reportes.filter((r) => r.fecha.startsWith(mes)).length,
    resueltos,
    abiertos: reportes.length - resueltos,
    respondidos: respuestas.length,
    promedioRespuesta:
      respuestas.length > 0
        ? respuestas.reduce((suma, dias) => suma + dias, 0) / respuestas.length
        : null,
  };
}
