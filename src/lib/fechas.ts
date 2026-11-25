/** Fecha local de hoy como AAAA-MM-DD (el formato sueco ya viene así). */
export function hoy() {
  // toISOString() usaría la hora UTC: en Chile, de noche, daría el día siguiente.
  return new Date().toLocaleDateString("sv-SE");
}

/** "2026-11-25" → "25 de noviembre" */
export function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    timeZone: "UTC", // evita que en Chile se muestre el día anterior
  });
}

/** "2026-11-25" → "noviembre" */
export function nombreDelMes(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    month: "long",
    timeZone: "UTC",
  });
}
