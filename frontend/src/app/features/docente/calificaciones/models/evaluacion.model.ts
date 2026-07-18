export interface Evaluacion {
  idEvaluacion: string;
  nombre: string;
  tipo: string;
  peso: number;
  fechaProgramada: string | null;
  idCurso: string;
  nombreCurso: string;
}

export interface EvaluacionRequest {
  idCurso: string;
  nombre: string;
  tipo: string;
  peso: number;
  fechaProgramada?: string;
}