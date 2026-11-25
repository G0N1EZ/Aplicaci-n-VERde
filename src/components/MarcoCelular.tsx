import BarraNavegacion from "./BarraNavegacion";

type Props = {
  children: React.ReactNode;
  conBarra?: boolean; // los formularios no la llevan: ahí va el botón de enviar
};

// En celular ocupa toda la pantalla; en computador se ve como un teléfono centrado.
export default function MarcoCelular({ children, conBarra = false }: Props) {
  return (
    <div className="flex h-dvh items-center justify-center bg-zinc-200 sm:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-white sm:max-h-[860px] sm:max-w-[410px] sm:rounded-[2.5rem] sm:border-8 sm:border-zinc-900 sm:shadow-2xl">
        {children}
        {conBarra && <BarraNavegacion />}
      </div>
    </div>
  );
}
