import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents queda desactivado: oculta las pantallas en vez de desmontarlas
  // y deja el mapa de Leaflet roto al volver.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
