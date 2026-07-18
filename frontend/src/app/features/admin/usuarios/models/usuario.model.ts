export interface Usuario {
  idUsuario: string;
  username: string;
  rol: string;
  estado: boolean;
  ultimoAcceso: string | null;
}

export interface UsuarioRequest {
  username: string;
  password?: string;
  nombreRol: string;
  estado?: boolean;
}