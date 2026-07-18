export interface HorarioAdmin {
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

export interface Aula {
  idAula: string;
  codigo: string;
  edificio: string;
  capacidad: number;
  tipo: string;
}

export interface HorarioRequest {
  idCurso: string;
  idDocente: string;
  idAula: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  ciclo: string;
}