import Link from "next/link";

type Props = {
  titulo: string;
  volverA: string; // dirección a la que lleva la flecha
  textoVolver: string; // lo que lee un lector de pantalla
};

export default function Encabezado({ titulo, volverA, textoVolver }: Props) {
  return (
    <header className="z-10 flex items-center gap-1 bg-green-800 px-2 pb-2 pt-[calc(env(safe-area-inset-top)+0.5rem)] text-white">
      <Link
        href={volverA}
        aria-label={textoVolver}
        className="flex size-11 items-center justify-center rounded-full text-2xl"
      >
        ←
      </Link>
      <h1 className="text-xl font-bold">{titulo}</h1>
    </header>
  );
}
