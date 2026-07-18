import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CursoAdmin, CursoAdminRequest } from '../models/curso-admin.model';

@Injectable({
  providedIn: 'root'
})
export class CursoAdminService {

  private apiUrl = `${environment.apiUrl}/cursos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CursoAdmin[]> {
    return this.http.get<CursoAdmin[]>(this.apiUrl);
  }

  crear(request: CursoAdminRequest): Observable<CursoAdmin> {
    return this.http.post<CursoAdmin>(this.apiUrl, request);
  }

  actualizar(idCurso: string, request: CursoAdminRequest): Observable<CursoAdmin> {
    return this.http.put<CursoAdmin>(`${this.apiUrl}/${idCurso}`, request);
  }

  cambiarEstado(idCurso: string, estado: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idCurso}/estado`, { estado });
  }
}