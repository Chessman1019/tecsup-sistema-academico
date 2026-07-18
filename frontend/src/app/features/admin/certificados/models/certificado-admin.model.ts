export interface CertificadoAdmin {
  idCertificado: string;
  nombreEstudiante: string;
  tipo: string;
  fechaSolicitud: string;
  fechaEmision: string | null;
  estado: string;
  urlDoc: string | null;
}