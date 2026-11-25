"use client";

// Piezas compartidas por los mapas de la app. Usa Leaflet: cargar solo en el navegador.

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AttributionControl, TileLayer } from "react-leaflet";
import { CATEGORIAS } from "@/lib/categorias";
import type { Categoria } from "@/types";

export const SANTIAGO: [number, number] = [-33.4489, -70.6693];

export function CapaBase() {
  return (
    <>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <AttributionControl position="bottomleft" prefix={false} />
    </>
  );
}

export function crearPin(categoria: Categoria | null, grande = false) {
  const { color, icono } = categoria
    ? CATEGORIAS[categoria]
    : { color: "#3f3f46", icono: "📍" };
  const ancho = grande ? 46 : 36;
  const alto = Math.round((ancho * 46) / 36);
  return L.divIcon({
    className: "", // quita el cuadrado blanco que Leaflet pone por defecto
    iconSize: [ancho, alto],
    iconAnchor: [ancho / 2, alto], // la punta del pin marca el lugar exacto
    html: `<svg width="${ancho}" height="${alto}" viewBox="0 0 36 46" style="filter:drop-shadow(0 2px 2px rgb(0 0 0 / .35))">
      <path d="M18 45C18 45 35 28 35 18A17 17 0 1 0 1 18C1 28 18 45 18 45Z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="18" cy="18" r="11.5" fill="#fff"/>
      <text x="18" y="18.5" font-size="13" text-anchor="middle" dominant-baseline="central">${icono}</text>
    </svg>`,
  });
}
