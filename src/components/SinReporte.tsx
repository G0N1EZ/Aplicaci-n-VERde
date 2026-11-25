import Link from "next/link";
import Encabezado from "./Encabezado";

// Se muestra mientras se lee el navegador o si el reporte no existe en él.
export default function SinReporte({ cargando }: { cargando: boolean }) {
  return (
    <>
      <Encabezado
        titulo="Detalle del reporte"
        volverA="/"
        textoVolver="Volver al mapa"
      />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center text-zinc-700">
        {cargando ? (
          <p>Cargando reporte…</p>
        ) : (
          <>
            <h2 className="text-xl font-bold text-zinc-900">
              No encontramos este reporte
            </h2>
            <p>
              En este prototipo, los reportes nuevos solo se ven en el navegador
              donde se crearon.
            </p>
            <Link
              href="/"
              className="flex min-h-12 items-center rounded-full bg-green-700 px-6 font-bold text-white"
            >
              Volver al mapa
            </Link>
          </>
        )}
      </main>
    </>
  );
}
