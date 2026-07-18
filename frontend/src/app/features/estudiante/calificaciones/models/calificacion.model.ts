export interface Calificacion {
  idCalificacion: string;
  nombreEstudiante: string;
  nombreEvaluacion: string;
  nota: number;
  fechaRegistro: string;
}

export interface CursoConNotas {
  idMatricula: string;
  codigoCurso: string;
  nombreCurso: string;
  calificaciones: Calificacion[];
  promedio: number;
  cargando: boolean;
}