"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { guardarReporte } from "@/lib/almacen";
import { CATEGORIAS } from "@/lib/categorias";
import { COMUNAS_RM } from "@/lib/comunas";
import { hoy } from "@/lib/fechas";
import { prepararFoto } from "@/lib/foto";
import type { Categoria, Reporte, Ubicacion } from "@/types";
import Encabezado from "./Encabezado";

const MapaUbicacion = dynamic(() => import("./MapaUbicacion"), {
  ssr: false,
  loading: () => (
    <p className="flex h-full items-center justify-center text-sm text-zinc-600">
      Cargando mapa…
    </p>
  ),
});

const MAX_DESCRIPCION = 500;

type Errores = Partial<
  Record<"categoria" | "ubicacion" | "comuna" | "descripcion", string>
>;

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-700">
      {texto}
    </p>
  );
}

export default function FormularioReporte() {
  const router = useRouter();
  const formulario = useRef<HTMLFormElement>(null);
  const campoFoto = useRef<HTMLInputElement>(null);
  const turnoFoto = useRef(0);

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [estadoFoto, setEstadoFoto] = useState<"lista" | "cargando" | "error">(
    "lista",
  );
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [centrarEn, setCentrarEn] = useState<Ubicacion | null>(null);
  const [avisoUbicacion, setAvisoUbicacion] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [comuna, setComuna] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGuardar, setErrorGuardar] = useState("");

  async function elegirFoto(archivo: File | undefined) {
    if (!archivo) return;
    const turno = ++turnoFoto.current;
    setEstadoFoto("cargando");
    try {
      const lista = await prepararFoto(archivo);
      if (turno !== turnoFoto.current) return; // se eligió o quitó otra entretanto
      setFoto(lista);
      setEstadoFoto("lista");
    } catch {
      if (turno !== turnoFoto.current) return;
      setFoto(null);
      setEstadoFoto("error");
    }
  }

  function quitarFoto() {
    turnoFoto.current++;
    setFoto(null);
    setEstadoFoto("lista");
    campoFoto.current?.focus();
  }

  function marcarUbicacion(u: Ubicacion) {
    setUbicacion(u);
    setAvisoUbicacion("Ubicación marcada. Toca otro punto para cambiarla.");
    setErrores((e) => ({ ...e, ubicacion: undefined }));
  }

  function usarMiUbicacion() {
    if (!window.isSecureContext || !navigator.geolocation) {
      setAvisoUbicacion(
        "Este navegador no permite usar tu ubicación aquí (se necesita una página https). Toca el mapa para marcarla.",
      );
      return;
    }
    setBuscando(true);
    setAvisoUbicacion("Buscando tu ubicación…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const punto = { lat: coords.latitude, lng: coords.longitude };
        setBuscando(false);
        setCentrarEn(punto);
        marcarUbicacion(punto);
        setAvisoUbicacion(
          `Ubicación encontrada (precisión: unos ${Math.round(coords.accuracy)} m). Toca el mapa si quieres ajustarla.`,
        );
      },
      (error) => {
        setBuscando(false);
        setAvisoUbicacion(
          error.code === error.PERMISSION_DENIED
            ? "No diste permiso para usar tu ubicación. Toca el mapa para marcarla."
            : "No pudimos encontrar tu ubicación. Toca el mapa para marcarla.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErrorGuardar("");

    const nuevos: Errores = {};
    if (!categoria) nuevos.categoria = "Elige una categoría.";
    if (!ubicacion) nuevos.ubicacion = "Marca dónde ocurre en el mapa.";
    if (!comuna.trim()) nuevos.comuna = "Escribe la comuna.";
    if (!descripcion.trim()) nuevos.descripcion = "Cuéntanos qué está pasando.";
    setErrores(nuevos);

    if (!categoria || !ubicacion || Object.keys(nuevos).length > 0) {
      const primero = Object.keys(nuevos)[0];
      formulario.current
        ?.querySelector<HTMLElement>(`[data-campo="${primero}"]`)
        ?.focus();
      return;
    }

    const fecha = hoy();
    const reporte: Reporte = {
      id: `local-${Date.now()}`,
      categoria,
      descripcion: descripcion.trim(),
      ubicacion,
      comuna: comuna.trim(),
      foto,
      anonimo,
      estado: "recibido",
      fecha,
      historial: [{ estado: "recibido", fecha }],
      apoyos: 0,
    };

    if (!guardarReporte(reporte)) {
      setErrorGuardar(
        foto
          ? "No se pudo guardar: el navegador no tiene espacio o bloquea el almacenamiento. Prueba quitando la foto."
          : "No se pudo guardar: el navegador no tiene espacio o bloquea el almacenamiento.",
      );
      return;
    }
    // replace: así "atrás" no vuelve a un formulario ya enviado
    router.replace(`/?reporte=${reporte.id}`);
  }

  return (
    <>
      <Encabezado
        titulo="Crear reporte"
        volverA="/"
        textoVolver="Volver al mapa"
      />

      <form
        ref={formulario}
        onSubmit={enviar}
        noValidate
        className="flex min-h-0 flex-1 flex-col text-zinc-900"
      >
        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5">
          <fieldset
            aria-describedby={errores.categoria ? "error-categoria" : undefined}
          >
            <legend className="font-bold">¿Qué quieres reportar?</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORIAS) as Categoria[]).map((id, i) => {
                const { nombre, icono, color } = CATEGORIAS[id];
                const elegida = categoria === id;
                return (
                  <label
                    key={id}
                    className="relative flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-zinc-300 p-1 text-center text-[13px] font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-green-800"
                    style={
                      elegida
                        ? { borderColor: color, backgroundColor: `${color}1a` }
                        : undefined
                    }
                  >
                    <input
                      type="radio"
                      name="categoria"
                      value={id}
                      checked={elegida}
                      data-campo={i === 0 ? "categoria" : undefined}
                      onChange={() => {
                        setCategoria(id);
                        setErrores((e) => ({ ...e, categoria: undefined }));
                      }}
                      className="sr-only"
                    />
                    <span aria-hidden="true" className="text-2xl">
                      {icono}
                    </span>
                    {nombre}
                  </label>
                );
              })}
            </div>
            <MensajeError id="error-categoria" texto={errores.categoria} />
          </fieldset>

          <div>
            <h2 className="font-bold">
              Foto <span className="font-normal text-zinc-600">(opcional)</span>
            </h2>
            {foto && (
              <div className="relative mt-2 h-48 overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={foto}
                  alt="Vista previa de la foto"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <label className="relative flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-zinc-400 px-3 font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-green-800">
                <input
                  ref={campoFoto}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    elegirFoto(e.target.files?.[0]);
                    e.target.value = ""; // permite volver a elegir la misma foto
                  }}
                />
                {estadoFoto === "cargando"
                  ? "Preparando foto…"
                  : foto
                    ? "Cambiar foto"
                    : "📷 Tomar o subir foto"}
              </label>
              {foto && (
                <button
                  type="button"
                  onClick={quitarFoto}
                  className="min-h-12 rounded-2xl border-2 border-zinc-300 px-4 font-semibold"
                >
                  Quitar
                </button>
              )}
            </div>
            <div role="status">
              {estadoFoto === "error" && (
                <p className="mt-1.5 text-sm font-medium text-red-700">
                  No pudimos abrir esa imagen. Prueba con una foto JPG o PNG.
                </p>
              )}
            </div>
            <p className="mt-1.5 text-sm text-zinc-600">
              Evita que se vean rostros o patentes.
            </p>
          </div>

          <div>
            <h2 className="font-bold">¿Dónde ocurre?</h2>
            <p className="text-sm text-zinc-600">
              Toca el mapa para marcar el lugar.
            </p>
            <button
              type="button"
              data-campo="ubicacion"
              onClick={usarMiUbicacion}
              disabled={buscando}
              className="mt-2 min-h-12 w-full rounded-2xl border-2 border-green-700 px-3 font-semibold text-green-800 disabled:opacity-60"
            >
              {buscando ? "Buscando…" : "Usar mi ubicación"}
            </button>
            <div className="isolate mt-2 h-60 overflow-hidden rounded-2xl border border-zinc-300">
              <MapaUbicacion
                categoria={categoria}
                ubicacion={ubicacion}
                centrarEn={centrarEn}
                onElegir={marcarUbicacion}
              />
            </div>
            <p role="status" className="mt-1.5 text-sm text-zinc-700">
              {avisoUbicacion}
            </p>
            <MensajeError id="error-ubicacion" texto={errores.ubicacion} />

            <label htmlFor="comuna" className="mt-4 block font-bold">
              Comuna
            </label>
            <input
              id="comuna"
              data-campo="comuna"
              list="comunas"
              value={comuna}
              maxLength={60}
              autoComplete="off"
              placeholder="Ej.: Ñuñoa"
              aria-invalid={!!errores.comuna}
              aria-describedby={errores.comuna ? "error-comuna" : undefined}
              onChange={(e) => {
                setComuna(e.target.value);
                setErrores((x) => ({ ...x, comuna: undefined }));
              }}
              className="mt-2 min-h-12 w-full rounded-2xl border-2 border-zinc-300 px-4"
            />
            <datalist id="comunas">
              {COMUNAS_RM.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <MensajeError id="error-comuna" texto={errores.comuna} />
          </div>

          <div>
            <label htmlFor="descripcion" className="block font-bold">
              Descripción
            </label>
            <textarea
              id="descripcion"
              data-campo="descripcion"
              rows={4}
              value={descripcion}
              maxLength={MAX_DESCRIPCION}
              placeholder="¿Qué ves? ¿Desde cuándo ocurre?"
              aria-invalid={!!errores.descripcion}
              aria-describedby={
                errores.descripcion ? "error-descripcion" : undefined
              }
              onChange={(e) => {
                setDescripcion(e.target.value);
                setErrores((x) => ({ ...x, descripcion: undefined }));
              }}
              className="mt-2 w-full rounded-2xl border-2 border-zinc-300 px-4 py-3"
            />
            <p className="text-right text-xs text-zinc-600">
              {descripcion.length}/{MAX_DESCRIPCION}
            </p>
            <MensajeError id="error-descripcion" texto={errores.descripcion} />
          </div>

          <div className="rounded-2xl bg-zinc-100 p-4">
            <button
              type="button"
              role="switch"
              aria-checked={anonimo}
              aria-describedby="texto-anonimato"
              onClick={() => setAnonimo((a) => !a)}
              className="flex min-h-11 w-full items-center justify-between gap-4 text-left font-bold"
            >
              Reportar de forma anónima
              <span
                aria-hidden="true"
                className={`flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors ${anonimo ? "bg-green-700" : "bg-zinc-500"}`}
              >
                <span
                  className={`size-6 rounded-full bg-white shadow transition-transform ${anonimo ? "translate-x-6" : ""}`}
                />
              </span>
            </button>
            <div
              id="texto-anonimato"
              className="mt-2 space-y-2 text-sm text-zinc-700"
            >
              {anonimo ? (
                <p>
                  <strong>Se oculta quién reporta:</strong> no se muestran tu
                  nombre, correo ni teléfono, y el reporte dirá «Anónimo».
                </p>
              ) : (
                <p>
                  <strong>El reporte no dirá «Anónimo».</strong> Actívalo para
                  ocultar tu nombre, correo y teléfono.
                </p>
              )}
              <p>
                <strong>Siempre se ve:</strong> categoría, foto, lugar marcado,
                comuna, descripción y fecha. No escribas datos personales en la
                descripción.
              </p>
              <p>
                <strong>Siempre se borra:</strong> la información oculta de la
                foto, como el GPS o el modelo del celular.
              </p>
              <p>
                Este prototipo no tiene cuentas: no te pide nombre, correo ni
                teléfono, y guarda el reporte solo en este navegador.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3">
          <div role="alert">
            {errorGuardar && (
              <p className="mb-2 text-sm font-medium text-red-700">
                {errorGuardar}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={estadoFoto === "cargando"}
            className="min-h-14 w-full rounded-full bg-green-700 px-6 text-base font-bold text-white transition hover:bg-green-800 active:scale-[0.98] disabled:opacity-60"
          >
            Enviar reporte
          </button>
        </div>
      </form>
    </>
  );
}
