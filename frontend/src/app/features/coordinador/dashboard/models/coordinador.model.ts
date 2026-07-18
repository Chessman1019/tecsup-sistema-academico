export interface DocenteListado {
  idDocente: string;
  codigoDocente: string;
  nombres: string;
  apellidos: string;
  correo: string;
  especialidad: string | null;
  categoria: string | null;
}

export interface Curso {
  idCurso: string;
  codigoCurso: string;
  nombre: string;
  creditos: number;
  horasSemanales: number;
  estado: boolean;
}