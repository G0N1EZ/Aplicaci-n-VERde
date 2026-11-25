"use client";

import { useEffect } from "react";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { CATEGORIAS } from "@/lib/categorias";
import type { Reporte } from "@/types";
import { CapaBase, crearPin, SANTIAGO } from "./mapaBase";

// Mueve el mapa lo justo para que la tarjeta no tape el pin elegido.
function MostrarSeleccionado({ reporte }: { reporte?: Reporte }) {
  const map = useMap();
  useEffect(() => {
    if (!reporte) return;
    map.panInside(reporte.ubicacion, {
      paddingTopLeft: [40, 110],
      paddingBottomRight: [40, 360],
    });
  }, [map, reporte]);
  return null;
}

type Props = {
  reportes: Reporte[];
  seleccionadoId: string | null;
  onSeleccionar: (id: string) => void;
};

export default function Mapa({
  reportes,
  seleccionadoId,
  onSeleccionar,
}: Props) {
  return (
    <MapContainer
      center={SANTIAGO}
      // En pantallas bajas se aleja un poco para que quepan todos los pines.
      zoom={window.innerHeight < 700 ? 10 : 11}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
    >
      <CapaBase />
      <MostrarSeleccionado
        reporte={reportes.find((r) => r.id === seleccionadoId)}
      />
      {reportes.map((r) => {
        const seleccionado = r.id === seleccionadoId;
        return (
          <Marker
            key={r.id}
            position={r.ubicacion}
            icon={crearPin(r.categoria, seleccionado)}
            zIndexOffset={seleccionado ? 1000 : 0}
            title={`${CATEGORIAS[r.categoria].nombre}: ${r.descripcion} (${r.comuna})`}
            eventHandlers={{
              click: () => onSeleccionar(r.id),
              keypress: (e) => {
                if (e.originalEvent.key === "Enter") onSeleccionar(r.id);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
