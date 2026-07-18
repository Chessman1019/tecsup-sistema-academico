export interface DocumentoAdmin {
  idDocumento: string;
  nombre: string;
  tipo: string;
  urlArchivo: string | null;
  fechaSubida: string;
  codigoAlumno: string;
  nombreEstudiante: string;
}