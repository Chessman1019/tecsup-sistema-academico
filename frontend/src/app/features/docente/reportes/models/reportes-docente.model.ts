export interface ResumenEstudiante {
  idMatricula: string;
  codigoAlumno: string;
  nombreEstudiante: string;
  promedio: number;
  porcentajeAsistencia: number;
  enRiesgoAcademico: boolean;
  enRiesgoAsistencia: boolean;
}

export interface ResumenCurso {
  idCurso: string;
  idHorario: string;
  nombreCurso: string;
  estudiantes: ResumenEstudiante[];
  promedioGeneral: number;
  asistenciaPromedio: number;
}