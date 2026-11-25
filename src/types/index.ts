// Aquí se define la "forma" de los datos. Si un componente usa un campo
// que no existe, TypeScript avisa antes de ejecutar la app.

export type Categoria = "microbasural" | "agua" | "aire" | "arboles" | "ruido";

export type Estado =
  | "recibido"
  | "validado"
  | "derivado"
  | "en_revision"
  | "resuelto";

export type Ubicacion = {
  lat: number;
  lng: number;
};

export type CambioEstado = {
  estado: Estado;
  fecha: string; // AAAA-MM-DD
};

export type Reporte = {
  id: string;
  categoria: Categoria;
  descripcion: string;
  ubicacion: Ubicacion;
  comuna: string;
  foto: string | null; // ruta de la imagen, o null si no tiene
  anonimo: boolean;
  estado: Estado; // el actual: debe coincidir con el último del historial
  fecha: string; // AAAA-MM-DD, día en que se creó
  historial: CambioEstado[]; // del más antiguo al más reciente
  apoyos: number; // sin contar el apoyo de quien usa este navegador
};

export type Capsula = {
  id: string;
  categoria: Categoria;
  titulo: string;
  contenido: string;
  duracion: number; // minutos de lectura
};

// --- Páginas institucionales

// Cápsula de la biblioteca (las que grabará el grupo).
export type CapsulaBiblioteca = {
  id: string;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
};

export type EstadoAliado = "ficticio" | "en_conversacion" | "confirmado";

export type GrupoAliados = {
  grupo: string;
  rol: string;
  aliados: { nombre: string; estado: EstadoAliado }[];
};

export type Privacidad = {
  comoFunciona: { titulo: string; texto: string }[];
  protocolos: { titulo: string; texto: string | null }[]; // null = por redactar
};
