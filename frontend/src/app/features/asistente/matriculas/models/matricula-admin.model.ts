export interface MatriculaAdmin {
  idMatricula: string;
  codigoAlumno: string;
  nombreCompletoEstudiante: string;
  codigoCurso: string;
  nombreCurso: string;
  cicloAcademico: string;
  fechaMatricula: string;
  estado: string;
}

export interface Curso {
  idCurso: string;
  codigoCurso: string;
  nombre: string;
  creditos: number;
  horasSemanales: number;
  estado: boolean;
}

export interface Horario {
  idHorario: string;
  idCurso: string;
  nombreCurso: string;
  nombreDocente: string;
  codigoAula: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  ciclo: string;
}

export interface MatriculaAdminRequest {
  idEstudiante: string;
  idCurso: string;
  idHorario: string;
  cicloAcademico: string;
}