export interface Auditoria {
  idAuditoria: string;
  accion: string;
  entidad: string;
  detalle: string | null;
  username: string;
  fecha: string;
}