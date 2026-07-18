export interface Certificado {
  idCertificado: string;
  nombreEstudiante: string;
  tipo: string;
  fechaSolicitud: string;
  fechaEmision: string | null;
  estado: string;
  urlDoc: string | null;
}

export interface CertificadoRequest {
  idEstudiante: string;
  tipo: string;
}