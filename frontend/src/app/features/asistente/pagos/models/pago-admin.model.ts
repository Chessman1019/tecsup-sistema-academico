export interface PagoAdmin {
  idPago: string;
  concepto: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: string;
  metodoPago: string | null;
  codigoAlumno: string;
  nombreEstudiante: string;
}