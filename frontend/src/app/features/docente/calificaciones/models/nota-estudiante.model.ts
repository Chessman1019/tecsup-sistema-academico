export interface MatriculaCurso {
  idMatricula: string;
  codigoAlumno: string;
  nombreCompletoEstudiante: string;
  codigoCurso: string;
  nombreCurso: string;
  estado: string;
}

export interface NotaEstudiante {
  idMatricula: string;
  codigoAlumno: string;
  nombreEstudiante: string;
  nota: number | null;
  idCalificacionExistente: string | null;
}