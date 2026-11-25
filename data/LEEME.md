# Qué cambiar y dónde

Los textos de la app están en esta carpeta. Al editarlos hay que mantener las comillas, comas y llaves: si falta una, la app no compila.

| Pantalla | Archivo | Qué falta |
|---|---|---|
| Cápsulas | `biblioteca.json` | **Todo es falso.** Reemplazar por las cápsulas que grabe el grupo. Hoy solo acepta texto: falta agregar el reproductor de video |
| Nosotros | `nosotros.json` | Revisar misión, visión, pilares VER y valores. Son una propuesta, no un texto acordado |
| Privacidad y seguridad | `privacidad.json` | En `protocolos`, reemplazar cada `null` por el texto del protocolo ético, entre comillas. Revisar `comoFunciona` si cambia la app |
| Aliados | `aliados.json` | Reemplazar los ficticios. `estado` puede ser `ficticio`, `en_conversacion` o `confirmado` |
| Detalle del reporte | `capsulas.json` | Textos educativos sin fuentes citadas: agregarlas |
| Mapa y panel | `reportes.json` | Reportes y apoyos ficticios. Las fechas son de octubre y noviembre de 2026 |

Los avisos amarillos de "borrador" o "contenido de ejemplo" están escritos en cada pantalla (`<AvisoBorrador>`). Se quitan cuando el texto definitivo esté listo.

No poner nombres o logos de organizaciones reales sin su autorización.

Otros textos por definir: la clínica jurídica ("por definir") en `src/components/FormularioOrientacion.tsx`.
