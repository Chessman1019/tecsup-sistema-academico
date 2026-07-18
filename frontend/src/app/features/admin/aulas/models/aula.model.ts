export interface Aula {
  idAula: string;
  codigo: string;
  edificio: string;
  capacidad: number;
  tipo: string | null;
}

export interface AulaRequest {
  codigo: string;
  edificio: string;
  capacidad: number;
  tipo?: string;
}