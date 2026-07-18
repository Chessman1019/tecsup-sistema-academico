export interface Configuracion {
  idConfiguracion: string;
  clave: string;
  valor: string;
  descripcion: string;
  categoria: string;
}

export interface ConfiguracionRequest {
  valor: string;
}