# VERde

Prototipo web **mobile-first** de una app comunitaria de reporte ambiental georreferenciado en Chile. Es el proyecto final grupal del ramo universitario "Nuevas economías y gestión sustentable". Tiene además un objetivo educativo y de orientación legal.

## Pantallas

1. **Mapa de reportes**: mapa con pines diferenciados por categoría.
2. **Crear reporte**: foto, categoría, ubicación, descripción y opción de anonimato.
3. **Detalle del reporte**: estado del caso, cápsula educativa y botón de orientación jurídica.
4. **Panel para municipio / junta de vecinos** (`/panel`): filtros, estadísticas y cambio de estado.
5. **Páginas institucionales**: Nosotros, Privacidad y seguridad, Aliados, Cápsulas (biblioteca) y Mi actividad, con barra de navegación abajo.

## Stack

- Next.js (App Router) con TypeScript
- Tailwind CSS
- Leaflet (con react-leaflet) para el mapa
- **Sin backend por ahora**: todo el contenido vive en `data/` (ver `data/LEEME.md`). Los tipos están en `src/types/index.ts` y los JSON se leen solo desde `src/lib/datos.ts`. Los reportes creados en la app se guardan en el `localStorage` (`src/lib/almacen.ts`); las pantallas obtienen la lista completa con `useReportes()`

## Reglas del proyecto

- Todo el texto visible de la app va en **español (de Chile)**.
- Diseñar primero para celular y después adaptar a pantallas grandes.
- No agregar base de datos, login ni servicios externos sin que el equipo lo pida.
- Los datos de ejemplo son ficticios: no usar nombres ni datos de personas reales. En reportes anónimos no se muestra ningún dato del autor.
- La orientación jurídica es informativa y no reemplaza asesoría legal. No inventar leyes, artículos ni plazos: si no hay una fuente verificada, dejarlo marcado como pendiente.
- Leaflet usa `window`, que no existe en el servidor: los componentes de mapa deben ser de cliente (`"use client"`) y cargarse con `next/dynamic` y `ssr: false` (esa opción solo se permite desde otro componente de cliente).
- En cada reporte, `estado` coincide con el último elemento de `historial`, y `fecha` con el primero.
- El formulario de orientación jurídica es simulado: no debe enviar ni guardar datos personales.
- Los cambios de estado del panel (`/panel`) se guardan aparte en el `localStorage` y se aplican sobre los reportes; los JSON no se modifican. "Respuesta promedio" = días desde Recibido hasta En revisión.
- El contenido institucional es un **borrador**: misión, visión, pilares VER, valores, protocolos éticos, aliados y biblioteca de cápsulas se reemplazan con lo que defina el grupo. `data/LEEME.md` dice qué falta. Mantener `<AvisoBorrador>` hasta tener el texto definitivo.
- `privacidad.json` debe describir lo que la app hace de verdad: actualizarlo si cambia cómo se guardan o envían datos.
- No mostrar organizaciones reales como aliadas sin confirmación del equipo.
- No activar `cacheComponents` en `next.config.ts`: rompe el mapa al volver desde otra pantalla (react-leaflet no recrea el mapa).
- No borrar `README.md`, `LICENSE` ni `.git`.

## Cómo trabajar con el equipo

- La persona que usa Claude Code **nunca ha hecho una app**: explicar brevemente cada paso, en español y sin jerga innecesaria (o definiéndola).
- Avanzar en pasos chicos que se puedan ver funcionando en el navegador.
- Hacer commit o push solo cuando lo pidan.

## Comandos

- `npm install`: descarga las dependencias (una vez, o cuando cambien)
- `npm run dev`: levanta la app en http://localhost:3000
- `npm run build`: compila la app y verifica los tipos
- `npm run lint`: revisa el código

## Documentación de Next.js

@AGENTS.md
