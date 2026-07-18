export interface Programa {
  idPrograma: string;
  nombre: string;
  tipo: string;
  estado: boolean;
  nombreCarrera: string | null;
}

export interface ProgramaRequest {
  nombre: string;
  tipo: string;
  estado?: boolean;
  idCarrera?: string;
}