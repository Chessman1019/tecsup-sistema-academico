import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Curso } from '../models/curso.model';
import { Estudiante } from '../models/estudiante.model';
import { Horario } from '../models/horario.model';
import { Matricula, MatriculaRequest } from '../models/matricula.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerMiPerfil(): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/estudiantes/me`);
  }

  listarCursosActivos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos/activos`);
  }

  listarHorariosPorCurso(idCurso: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/curso/${idCurso}`);
  }

  listarMisMatriculas(idEstudiante: string): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.apiUrl}/matriculas/estudiante/${idEstudiante}`);
  }

  matricular(request: MatriculaRequest): Observable<Matricula> {
    return this.http.post<Matricula>(`${this.apiUrl}/matriculas`, request);
  }

  retirarMatricula(idMatricula: string): Observable<Matricula> {
    return this.http.patch<Matricula>(`${this.apiUrl}/matriculas/${idMatricula}/retirar`, {});
  }
}