"use client";

// Formulario SIMULADO: no envía ni guarda nada. Lo escrito vive solo en esta
// pantalla y se pierde al salir de ella.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReporte } from "@/lib/almacen";
import { CATEGORIAS } from "@/lib/categorias";
import Encabezado from "./Encabezado";
import SinReporte from "./SinReporte";

const MOTIVOS = [
  "Saber si esto se puede denunciar",
  "Saber a qué institución acudir",
  "Ayuda para reunir antecedentes",
  "Otra consulta",
];

const CAMPO = "mt-2 min-h-12 w-full rounded-2xl border-2 border-zinc-300 px-4";

type Campo = "nombre" | "contacto" | "motivo" | "consulta" | "acepta";
type Errores = Partial<Record<Campo, string>>;

export default function FormularioOrientacion({ id }: { id: string }) {
  const { reporte, cargando } = useReporte(id);
  const formulario = useRef<HTMLFormElement>(null);
  const tituloFinal = useRef<HTMLHeadingElement>(null);

  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [consulta, setConsulta] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (enviado) tituloFinal.current?.focus();
  }, [enviado]);

  if (!reporte) return <SinReporte cargando={cargando} />;

  const categoria = CATEGORIAS[reporte.categoria].nombre;
  const detalle = `/reporte/${id}`;
  const quitarError = (campo: Campo) =>
    setErrores((e) => ({ ...e, [campo]: undefined }));

  // Conecta cada campo con su mensaje de error para lectores de pantalla.
  const accesible = (campo: Campo) => ({
    "data-campo": campo,
    "aria-invalid": !!errores[campo],
    "aria-describedby": errores[campo] ? `error-${campo}` : undefined,
  });
  const mensaje = (campo: Campo) =>
    errores[campo] && (
      <p
        id={`error-${campo}`}
        className="mt-1.5 text-sm font-medium text-red-700"
      >
        {errores[campo]}
      </p>
    );

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Errores = {};
    if (!nombre.trim()) nuevos.nombre = "Escribe un nombre.";
    if (!contacto.trim()) nuevos.contacto = "Escribe un correo o teléfono.";
    if (!motivo) nuevos.motivo = "Elige qué necesitas.";
    if (!consulta.trim()) nuevos.consulta = "Escribe tu consulta.";
    if (!acepta) nuevos.acepta = "Marca esta casilla para continuar.";
    setErrores(nuevos);

    const primero = Object.keys(nuevos)[0];
    if (primero) {
      formulario.current
        ?.querySelector<HTMLElement>(`[data-campo="${primero}"]`)
        ?.focus();
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <>
        <Encabezado
          titulo="Orientación jurídica"
          volverA={detalle}
          textoVolver="Volver al reporte"
        />
        <main className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 text-zinc-900">
          <div>
            <h2
              ref={tituloFinal}
              tabIndex={-1}
              className="text-2xl font-bold outline-none"
            >
              Derivación simulada
            </h2>
            <p className="mt-2 rounded-2xl bg-amber-100 p-4 text-sm text-amber-950">
              <strong>No se envió nada.</strong> Tus datos no se guardaron ni
              llegaron a ninguna clínica jurídica.
            </p>
          </div>

          <section>
            <h3 className="font-bold">Esto recibiría la clínica</h3>
            <dl className="mt-2 space-y-3 rounded-2xl bg-zinc-100 p-4 text-sm wrap-anywhere">
              {[
                ["Reporte", `${categoria}, ${reporte.comuna}`],
                ["Descripción", reporte.descripcion],
                ["Nombre", nombre.trim()],
                ["Contacto", contacto.trim()],
                ["Necesita", motivo],
                ["Consulta", consulta.trim()],
              ].map(([clave, valor]) => (
                <div key={clave}>
                  <dt className="font-semibold text-zinc-600">{clave}</dt>
                  <dd className="whitespace-pre-line">{valor}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className="font-bold">Qué pasaría después</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-700">
              <li>La clínica revisaría si puede tomar el caso.</li>
              <li>Te contactaría para pedir más antecedentes.</li>
              <li>Te explicaría qué opciones tienes.</li>
            </ol>
          </section>

          <Link
            href={detalle}
            className="flex min-h-14 items-center justify-center rounded-full bg-green-700 px-6 font-bold text-white"
          >
            Volver al reporte
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Encabezado
        titulo="Orientación jurídica"
        volverA={detalle}
        textoVolver="Volver al reporte"
      />
      <form
        ref={formulario}
        onSubmit={enviar}
        noValidate
        autoComplete="off"
        className="flex min-h-0 flex-1 flex-col text-zinc-900"
      >
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <p className="rounded-2xl bg-amber-100 p-4 text-sm text-amber-950">
            <strong>Formulario simulado.</strong> No se envía ni se guarda nada.
            Usa datos inventados.
          </p>

          <section className="rounded-2xl bg-zinc-100 p-4 text-sm">
            <p className="font-semibold text-zinc-600">Reporte que se deriva</p>
            <p className="mt-1 font-bold">
              {categoria}, {reporte.comuna}
            </p>
            <p className="line-clamp-2 wrap-anywhere text-zinc-700">
              {reporte.descripcion}
            </p>
            <p className="mt-3 font-semibold text-zinc-600">Se deriva a</p>
            <p>Clínica jurídica universitaria (por definir)</p>
          </section>

          <div>
            <label htmlFor="nombre" className="font-bold">
              Nombre
            </label>
            <input
              id="nombre"
              value={nombre}
              maxLength={80}
              {...accesible("nombre")}
              onChange={(e) => {
                setNombre(e.target.value);
                quitarError("nombre");
              }}
              className={CAMPO}
            />
            {mensaje("nombre")}
          </div>

          <div>
            <label htmlFor="contacto" className="font-bold">
              Correo o teléfono
            </label>
            <input
              id="contacto"
              value={contacto}
              maxLength={80}
              {...accesible("contacto")}
              onChange={(e) => {
                setContacto(e.target.value);
                quitarError("contacto");
              }}
              className={CAMPO}
            />
            {reporte.anonimo && (
              <p className="mt-1.5 text-sm text-zinc-600">
                El reporte seguiría siendo anónimo en el mapa. La clínica
                necesitaría un contacto para responder.
              </p>
            )}
            {mensaje("contacto")}
          </div>

          <div>
            <label htmlFor="motivo" className="font-bold">
              ¿Qué necesitas?
            </label>
            <select
              id="motivo"
              value={motivo}
              {...accesible("motivo")}
              onChange={(e) => {
                setMotivo(e.target.value);
                quitarError("motivo");
              }}
              className={`${CAMPO} bg-white`}
            >
              <option value="">Elige una opción</option>
              {MOTIVOS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            {mensaje("motivo")}
          </div>

          <div>
            <label htmlFor="consulta" className="font-bold">
              Tu consulta
            </label>
            <textarea
              id="consulta"
              rows={4}
              value={consulta}
              maxLength={500}
              {...accesible("consulta")}
              onChange={(e) => {
                setConsulta(e.target.value);
                quitarError("consulta");
              }}
              className={`${CAMPO} py-3`}
            />
            {mensaje("consulta")}
          </div>

          <div>
            <label className="flex cursor-pointer gap-3 text-sm">
              <input
                type="checkbox"
                checked={acepta}
                {...accesible("acepta")}
                onChange={(e) => {
                  setAcepta(e.target.checked);
                  quitarError("acepta");
                }}
                className="size-6 shrink-0 accent-green-700"
              />
              <span>
                Acepto compartir este reporte y mi contacto con la clínica
                jurídica. Entiendo que la orientación es informativa y no
                reemplaza una asesoría legal.
              </span>
            </label>
            {mensaje("acepta")}
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3">
          <button
            type="submit"
            className="min-h-14 w-full rounded-full bg-green-700 px-6 font-bold text-white transition hover:bg-green-800 active:scale-[0.98]"
          >
            Enviar solicitud (simulada)
          </button>
        </div>
      </form>
    </>
  );
}
