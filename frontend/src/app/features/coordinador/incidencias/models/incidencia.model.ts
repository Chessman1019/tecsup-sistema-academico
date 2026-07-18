export interface Incidencia {
  idIncidencia: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: string;
  estado: string;
  fechaCreacion: string;
  fechaResolucion: string | null;
  nombreDocente: string | null;
  nombreCurso: string | null;
}

export interface IncidenciaRequest {
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad?: string;
  idDocente?: string;
  idCurso?: string;
}