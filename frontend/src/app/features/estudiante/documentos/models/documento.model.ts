export interface Documento {
  idDocumento: string;
  nombre: string;
  tipo: string;
  urlArchivo: string | null;
  fechaSubida: string;
}