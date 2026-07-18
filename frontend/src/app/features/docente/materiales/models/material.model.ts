export interface Material {
  idMaterial: string;
  titulo: string;
  descripcion: string | null;
  urlArchivo: string | null;
  tipo: string;
  fechaSubida: string;
  idCurso: string;
  nombreCurso: string;
  nombreDocente: string;
}

export interface MaterialRequest {
  idCurso: string;
  titulo: string;
  descripcion?: string;
  urlArchivo?: string;
  tipo: string;
}