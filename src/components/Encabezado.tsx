import Link from "next/link";

type Props = {
  titulo: string;
  volverA?: string; // dirección de la flecha; sin ella, no hay flecha
  textoVolver?: string; // lo que lee un lector de pantalla
};

export default function Encabezado({
  titulo,
  volverA,
  textoVolver = "Volver",
}: Props) {
  return (
    <header
      className={`z-10 flex items-center gap-1 bg-green-800 pb-2 pt-[calc(env(safe-area-inset-top)+0.5rem)] text-white ${volverA ? "px-2" : "px-5"}`}
    >
      {volverA && (
        <Link
          href={volverA}
          aria-label={textoVolver}
          className="flex size-11 items-center justify-center rounded-full text-2xl"
        >
          ←
        </Link>
      )}
      <h1 className="flex min-h-11 items-center text-xl font-bold">{titulo}</h1>
    </header>
  );
}
