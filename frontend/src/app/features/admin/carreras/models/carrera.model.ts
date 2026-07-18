export interface Carrera {
  idCarrera: string;
  codigo: string;
  nombre: string;
  duracionCiclos: number;
  estado: boolean;
  nombreSede: string | null;
}

export interface CarreraRequest {
  codigo: string;
  nombre: string;
  duracionCiclos: number;
  estado?: boolean;
  idSede?: string;
}