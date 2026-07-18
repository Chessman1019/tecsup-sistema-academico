export interface Matricula {
  idMatricula: string;
  codigoAlumno: string;
  nombreCompletoEstudiante: string;
  codigoCurso: string;
  nombreCurso: string;
  cicloAcademico: string;
  fechaMatricula: string;
  estado: string;

  // Datos del horario asignado
  idHorario: string;
  nombreDocente: string;
  codigoAula: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface MatriculaRequest {
  idEstudiante: string;
  idCurso: string;
  idHorario: string;
  cicloAcademico: string;
}