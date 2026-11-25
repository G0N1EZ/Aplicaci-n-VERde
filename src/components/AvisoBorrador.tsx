// Marca el contenido que el equipo todavía debe reemplazar.
// Al tener el texto definitivo, se borra <AvisoBorrador> de esa pantalla.
export default function AvisoBorrador({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="rounded-2xl border-2 border-dashed border-amber-600 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-bold">{titulo}</p>
      <p className="mt-1">{children}</p>
    </aside>
  );
}
