"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// "incluye": otras direcciones que pertenecen a la misma pestaña.
// "trazo": el dibujo del ícono.
const PESTANAS = [
  {
    href: "/",
    nombre: "Mapa",
    incluye: ["/reporte/"],
    trazo:
      "M9 4 3.5 6v14L9 18m0-14 6 2m-6-2v14m6-12 5.5-2v14L15 20m0-14v14m0 0-6-2",
  },
  {
    href: "/capsulas",
    nombre: "Cápsulas",
    incluye: [],
    trazo: "M4 5h16v14H4zM10 9v6l5-3z",
  },
  {
    href: "/actividad",
    nombre: "Mi actividad",
    incluye: [],
    trazo: "M6 4h12v16H6zM9 9h6M9 13h6M9 17h3",
  },
  {
    href: "/nosotros",
    nombre: "Nosotros",
    incluye: ["/privacidad", "/aliados"],
    trazo:
      "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M16 5.2a3 3 0 0 1 0 5.6M17.5 14.5c2.2.8 3.5 2.8 3.5 5.5",
  },
];

export default function BarraNavegacion() {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="z-20 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4">
        {PESTANAS.map(({ href, nombre, incluye, trazo }) => {
          const activa =
            ruta === href || incluye.some((otra) => ruta.startsWith(otra));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activa ? "page" : undefined}
                className={`flex min-h-15 flex-col items-center justify-center gap-0.5 text-xs -outline-offset-2 ${
                  activa
                    ? "font-bold text-green-800"
                    : "font-medium text-zinc-600"
                }`}
              >
                <span
                  className={`rounded-full px-4 py-0.5 ${activa ? "bg-green-100" : ""}`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={activa ? 2.2 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={trazo} />
                  </svg>
                </span>
                {nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
