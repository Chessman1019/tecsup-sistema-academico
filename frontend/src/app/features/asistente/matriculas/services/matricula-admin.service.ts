import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MatriculaAdmin, MatriculaAdminRequest, Curso, Horario } from '../models/matricula-admin.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaAdminService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarTodasLasMatriculas(): Observable<MatriculaAdmin[]> {
    return this.http.get<MatriculaAdmin[]>(`${this.apiUrl}/matriculas`);
  }

  listarCursosActivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos/activos`);
  }

  listarHorariosPorCurso(idCurso: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/curso/${idCurso}`);
  }

  matricular(request: MatriculaAdminRequest): Observable<MatriculaAdmin> {
    return this.http.post<MatriculaAdmin>(`${this.apiUrl}/matriculas`, request);
  }

  retirarMatricula(idMatricula: string): Observable<MatriculaAdmin> {
    return this.http.patch<MatriculaAdmin>(`${this.apiUrl}/matriculas/${idMatricula}/retirar`, {});
  }
}