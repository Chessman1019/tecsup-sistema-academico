import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdminService {

  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crear(request: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, request);
  }

  actualizar(idUsuario: string, request: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${idUsuario}`, request);
  }

  cambiarEstado(idUsuario: string, estado: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idUsuario}/estado`, { estado });
  }

  eliminar(idUsuario: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUsuario}`);
  }
}