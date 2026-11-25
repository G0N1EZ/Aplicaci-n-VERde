import Link from "next/link";
import MarcoCelular from "@/components/MarcoCelular";

// Provisoria: aquí irá el formulario de la pantalla 2.
export default function Reportar() {
  return (
    <MarcoCelular>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Crear reporte</h1>
        <p className="text-zinc-600">Esta pantalla está en construcción.</p>
        <Link
          href="/"
          className="rounded-full bg-green-700 px-6 py-3 font-bold text-white"
        >
          Volver al mapa
        </Link>
      </main>
    </MarcoCelular>
  );
}
