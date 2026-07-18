export interface Pago {
  idPago: string;
  concepto: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: string;
  metodoPago: string | null;
}