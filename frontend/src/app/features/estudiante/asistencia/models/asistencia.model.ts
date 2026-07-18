export interface RegistroAsistencia {
  idRegistro: string;
  nombreEstudiante: string;
  fecha: string;
  estado: string;
  observacion: string | null;
}

export interface PorcentajeAsistencia {
  idMatricula: string;
  totalSesiones: number;
  presentes: number;
  tardanzas: number;
  ausencias: number;
  porcentajeAsistencia: number;
  enRiesgo: boolean;
}

export interface CursoConAsistencia {
  idMatricula: string;
  codigoCurso: string;
  nombreCurso: string;
  registros: RegistroAsistencia[];
  porcentaje: PorcentajeAsistencia;
}