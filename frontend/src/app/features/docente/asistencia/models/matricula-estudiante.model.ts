export interface MatriculaEstudiante {
  idMatricula: string;
  codigoAlumno: string;
  nombreCompletoEstudiante: string;
  codigoCurso: string;
  nombreCurso: string;
  cicloAcademico: string;
  estado: string;
}

export interface RegistroAsistenciaItem {
  idMatricula: string;
  nombreEstudiante: string;
  codigoAlumno: string;
  estado: 'P' | 'A' | 'T' | null;
  idRegistroExistente: string | null;
}