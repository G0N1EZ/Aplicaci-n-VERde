import { ESTADOS, ORDEN_ESTADOS } from "@/lib/categorias";
import { formatearFecha } from "@/lib/fechas";
import type { Reporte } from "@/types";

export default function LineaDeTiempo({ reporte }: { reporte: Reporte }) {
  const actual = ORDEN_ESTADOS.indexOf(reporte.estado);

  return (
    <ol className="mt-3">
      {ORDEN_ESTADOS.map((estado, i) => {
        const listo = i <= actual;
        const ultimo = i === ORDEN_ESTADOS.length - 1;
        const cambio = reporte.historial.find((h) => h.estado === estado);
        const omitido = listo && !cambio; // se pasó directo al siguiente
        return (
          <li
            key={estado}
            aria-current={i === actual ? "step" : undefined}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {!ultimo && (
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-[13px] top-7 w-0.5 ${i < actual ? "bg-green-700" : "bg-zinc-300"}`}
              />
            )}
            <span
              aria-hidden="true"
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                listo && !omitido
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-zinc-400 bg-white text-zinc-600"
              } ${i === actual ? "ring-4 ring-green-200" : ""}`}
            >
              {omitido ? "–" : listo ? "✓" : i + 1}
            </span>
            <div className={listo && !omitido ? "text-zinc-900" : "text-zinc-600"}>
              <p className={listo && !omitido ? "font-bold" : "font-medium"}>
                {ESTADOS[estado].nombre}
              </p>
              <p className="text-sm">
                {!listo
                  ? "Pendiente"
                  : cambio
                    ? `${formatearFecha(cambio.fecha)} · ${ESTADOS[estado].detalle}`
                    : "Paso omitido"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
