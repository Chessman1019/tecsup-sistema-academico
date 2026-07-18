export interface Sede {
  idSede: string;
  nombre: string;
  direccion: string | null;
  ciudad: string;
  estado: boolean;
}

export interface SedeRequest {
  nombre: string;
  direccion?: string;
  ciudad: string;
  estado?: boolean;
}