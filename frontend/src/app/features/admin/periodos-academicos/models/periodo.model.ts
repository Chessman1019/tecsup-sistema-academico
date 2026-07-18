export interface Periodo {
  idPeriodo: string;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

export interface PeriodoRequest {
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
}