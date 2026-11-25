import Encabezado from "./Encabezado";
import MarcoCelular from "./MarcoCelular";

type Props = {
  titulo: string;
  volverA?: string;
  textoVolver?: string;
  children: React.ReactNode;
};

// Estructura común de las páginas con encabezado, contenido y barra de abajo.
export default function Pagina({ children, ...encabezado }: Props) {
  return (
    <MarcoCelular conBarra>
      <Encabezado {...encabezado} />
      <main className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6 text-zinc-900">
        {children}
      </main>
    </MarcoCelular>
  );
}
