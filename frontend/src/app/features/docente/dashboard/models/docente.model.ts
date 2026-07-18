export interface Docente {
  idDocente: string;
  codigoDocente: string;
  nombres: string;
  apellidos: string;
  correo: string;
  especialidad: string | null;
  categoria: string | null;
}