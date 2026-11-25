"use client";

import { useEffect } from "react";
import { MapContainer, Marker, useMap, useMapEvents } from "react-leaflet";
import type { Categoria, Ubicacion } from "@/types";
import { CapaBase, crearPin, SANTIAGO } from "./mapaBase";

function AlTocar({ onElegir }: { onElegir: (u: Ubicacion) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng.wrap();
      onElegir({ lat, lng });
    },
  });
  return null;
}

function Centrar({ punto }: { punto: Ubicacion | null }) {
  const map = useMap();
  useEffect(() => {
    if (punto) map.setView(punto, 16);
  }, [map, punto]);
  return null;
}

type Props = {
  categoria: Categoria | null;
  ubicacion: Ubicacion | null;
  centrarEn: Ubicacion | null; // al cambiar, el mapa se mueve a ese punto
  onElegir: (u: Ubicacion) => void;
};

export default function MapaUbicacion({
  categoria,
  ubicacion,
  centrarEn,
  onElegir,
}: Props) {
  return (
    <MapContainer
      center={SANTIAGO}
      zoom={11}
      attributionControl={false}
      scrollWheelZoom={false} // la rueda del mouse baja por el formulario
      className="h-full w-full"
    >
      <CapaBase />
      <AlTocar onElegir={onElegir} />
      <Centrar punto={centrarEn} />
      {ubicacion && (
        <Marker
          position={ubicacion}
          icon={crearPin(categoria)}
          interactive={false}
        />
      )}
    </MapContainer>
  );
}
