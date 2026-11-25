const LADO_MAXIMO = 900; // píxeles

// Achica la foto para que quepa en el localStorage (unos 5 MB en total).
// Al redibujarla se pierden los datos ocultos del archivo (GPS, modelo de celular).
export async function prepararFoto(archivo: File): Promise<string> {
  const imagen = await createImageBitmap(archivo, {
    imageOrientation: "from-image",
  });
  try {
    const escala = Math.min(
      1,
      LADO_MAXIMO / Math.max(imagen.width, imagen.height),
    );
    const lienzo = document.createElement("canvas");
    lienzo.width = Math.max(1, Math.round(imagen.width * escala));
    lienzo.height = Math.max(1, Math.round(imagen.height * escala));
    const ctx = lienzo.getContext("2d");
    if (!ctx) throw new Error("No se pudo procesar la imagen");
    ctx.fillStyle = "#fff"; // fondo para imágenes transparentes
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
    return lienzo.toDataURL("image/jpeg", 0.7);
  } finally {
    imagen.close();
  }
}
