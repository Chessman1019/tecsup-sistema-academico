export interface CursoAdmin {
  idCurso: string;
  codigoCurso: string;
  nombre: string;
  creditos: number;
  horasSemanales: number;
  estado: boolean;
}

export interface CursoAdminRequest {
  codigoCurso: string;
  nombre: string;
  creditos: number;
  horasSemanales: number;
  estado?: boolean;
}